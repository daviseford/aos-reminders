import { describe, expect, it } from 'vitest'
import {
  RULES_RADAR_ISSUE_MARKER,
  createGitHubIssueClient,
  createRadarLane,
  createRadarReport,
  renderManagedRulesRadarIssueBody,
  synchronizeRulesRadarIssue,
  type GitHubApiRequest,
  type GitHubApiTransport,
  type RadarAuthority,
  type RadarChangeKind,
  type RadarEvent,
  type RadarLane,
  type RadarSource,
  type RulesRadarGitHubClient,
  type RulesRadarGitHubComment,
  type RulesRadarGitHubIssue,
} from '../../aos4/radar'

const observedAt = '2026-07-29T20:00:00.000Z'
const checksum = (character: string): string => character.repeat(64)
const options = {
  assignee: 'daviseford',
  labels: ['rule updates', 'maintenance'],
}

describe('AoS 4 Rules Radar GitHub issue lifecycle', () => {
  it('stays silent when no events and no issue exist', async () => {
    const client = new FakeClient()
    const result = await synchronizeRulesRadarIssue(
      createRadarReport([emptyLane('games-workshop')]),
      client,
      options
    )

    expect(result.action).toBe('noop')
    expect(client.mutations).toEqual([])
  })

  it('creates one assigned, labeled issue with durable locator and checksum evidence', async () => {
    const client = new FakeClient()
    const locator = 'https://assets.warhammer-community.com/new-rules.pdf'
    const workflowUrl = 'https://github.com/daviseford/aos-reminders/actions/runs/123'
    const sourceEvent = event('games-workshop', 'official', 'new-publication', locator)
    sourceEvent.workflowUrl = workflowUrl
    const report = createRadarReport([
      createRadarLane('games-workshop', observedAt, [sourceEvent], workflowUrl),
    ])
    const result = await synchronizeRulesRadarIssue(report, client, options)

    expect(result.action).toBe('created')
    expect(client.issues).toHaveLength(1)
    expect(client.issues[0]).toMatchObject({
      state: 'open',
      assignees: ['daviseford'],
      labels: ['maintenance', 'rule updates'],
    })
    expect(client.issues[0].body).toContain('https://assets\\.warhammer\\-community\\.com/new\\-rules\\.pdf')
    expect(client.issues[0].body).toContain(checksum('a'))
    expect(client.issues[0].body).toContain(RULES_RADAR_ISSUE_MARKER)
    expect(client.issues[0].body).toContain(`[Workflow run and curated artifacts](${workflowUrl})`)
  })

  it('makes no mutation for an unchanged open fingerprint', async () => {
    const report = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new.pdf'
        )
      ),
    ])
    const client = new FakeClient([managedIssue(report)])
    const result = await synchronizeRulesRadarIssue(report, client, options)

    expect(result.action).toBe('noop')
    expect(client.mutations).toEqual([])
  })

  it('updates changed state and emits one idempotent delta comment', async () => {
    const first = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/first.pdf'
        )
      ),
    ])
    const second = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/second.pdf'
        )
      ),
    ])
    const client = new FakeClient([managedIssue(first)])

    expect((await synchronizeRulesRadarIssue(second, client, options)).action).toBe('updated')
    expect(client.mutations.filter(value => value.kind === 'comment')).toHaveLength(1)
    expect((await synchronizeRulesRadarIssue(second, client, options)).action).toBe('noop')
    expect(client.mutations.filter(value => value.kind === 'comment')).toHaveLength(1)
  })

  it('replaces only observed lanes and keeps unresolved community lanes open', async () => {
    const existing = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new.pdf'
        )
      ),
      laneWithEvent(
        'wahapedia',
        event('wahapedia', 'secondary', 'new-rules-page', 'https://wahapedia.ru/aos4/the-rules/new/')
      ),
    ])
    const client = new FakeClient([managedIssue(existing)])

    const result = await synchronizeRulesRadarIssue(
      createRadarReport([emptyLane('games-workshop')]),
      client,
      options
    )

    expect(result.action).toBe('updated')
    expect(client.issues[0].state).toBe('open')
    expect(client.issues[0].body).toContain('wahapedia\\.ru')
    expect(client.issues[0].body).not.toContain('warhammer\\-community\\.com/new\\.pdf')
  })

  it('reopens a closed issue and closes the final cleared lane exactly once', async () => {
    const active = createRadarReport([
      laneWithEvent(
        'wahapedia',
        event('wahapedia', 'secondary', 'export-changed', 'https://wahapedia.ru/aos4/Last_update.csv')
      ),
    ])
    const closed = managedIssue(createRadarReport([emptyLane('wahapedia')]), 'closed')
    const client = new FakeClient([closed])

    expect((await synchronizeRulesRadarIssue(active, client, options)).action).toBe('reopened')
    expect(client.issues[0].state).toBe('open')

    const cleared = createRadarReport([emptyLane('wahapedia')])
    expect((await synchronizeRulesRadarIssue(cleared, client, options)).action).toBe('closed')
    expect(client.issues[0].state).toBe('closed')
    const commentCount = client.mutations.filter(value => value.kind === 'comment').length
    expect((await synchronizeRulesRadarIssue(cleared, client, options)).action).toBe('noop')
    expect(client.mutations.filter(value => value.kind === 'comment')).toHaveLength(commentCount)
  })

  it('rejects ambiguous or malformed machine state without mutation', async () => {
    const report = createRadarReport([emptyLane('games-workshop')])
    const duplicate = new FakeClient([managedIssue(report), managedIssue(report)])
    await expect(synchronizeRulesRadarIssue(report, duplicate, options)).rejects.toThrow(/multiple/i)
    expect(duplicate.mutations).toEqual([])

    for (const body of [
      RULES_RADAR_ISSUE_MARKER,
      `${RULES_RADAR_ISSUE_MARKER}\n<!-- aos4-rules-radar:state:v1 bad -->`,
      `${RULES_RADAR_ISSUE_MARKER}\n${'x'.repeat(150_000)}`,
    ]) {
      const malformed = new FakeClient([{ ...managedIssue(report), body }])
      await expect(synchronizeRulesRadarIssue(report, malformed, options)).rejects.toThrow()
      expect(malformed.mutations).toEqual([])
    }
  })

  it('renders source text inert and keeps operational failures separate', () => {
    const hostile = event(
      'games-workshop',
      'official',
      'source-contract-changed',
      'https://assets.warhammer-community.com/<script>@maintainer [rules].pdf'
    )
    hostile.class = 'operational'
    hostile.evidence = { details: '<!-- aos4-rules-radar:state:v1 --> @everyone' }
    const body = renderManagedRulesRadarIssueBody(
      createRadarReport([laneWithEvent('games-workshop', hostile)])
    )

    expect(body).toContain('### Operational failures')
    expect(body).toContain('@\u200bmaintainer')
    expect(body).toContain('@\u200beveryone')
    expect(body.match(/<!-- aos4-rules-radar:state:v2/g)).toHaveLength(1)
  })

  it('round-trips a large deterministic machine state below GitHub limits', async () => {
    const events = Array.from({ length: 156 }, (_, index) =>
      event(
        'games-workshop',
        'official',
        'new-publication',
        `https://assets.warhammer-community.com/new-rules-${index}.pdf`
      )
    )
    const report = createRadarReport([createRadarLane('games-workshop', observedAt, events)])
    const body = renderManagedRulesRadarIssueBody(report)
    const client = new FakeClient([managedIssue(report)])

    expect(body.length).toBeLessThan(60_000)
    expect((await synchronizeRulesRadarIssue(report, client, options)).action).toBe('noop')
  })

  /**
   * #1820: a new official publication is an intake obligation with a gate consequence, not an
   * observation. The managed issue body must say so on official publication events - and only
   * on those, so secondary/community change entries stay plain observations.
   */
  it('states the intake obligation and gate consequence for new official publications', () => {
    const officialReport = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new-battletome.pdf'
        )
      ),
    ])
    const officialBody = renderManagedRulesRadarIssueBody(officialReport)
    expect(officialBody).toContain('Intake obligation')
    expect(officialBody).toContain('drives reviewed rules intake immediately')
    expect(officialBody).toContain('Profile-only is a gated state, not a resting state')
    expect(officialBody).toContain('Gate consequence')
    expect(officialBody).toContain('yarn data:aos4:verify:beta')
    expect(officialBody).toContain('data/aos4/reviews/profile-only-deviations.json')

    const replacedReport = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'replaced-publication',
          'https://assets.warhammer-community.com/replaced-battletome.pdf'
        )
      ),
    ])
    expect(renderManagedRulesRadarIssueBody(replacedReport)).toContain('Intake obligation')

    const secondaryReport = createRadarReport([
      laneWithEvent(
        'wahapedia',
        event('wahapedia', 'secondary', 'new-faction', 'https://wahapedia.ru/aos4/factions/new-faction/')
      ),
    ])
    expect(renderManagedRulesRadarIssueBody(secondaryReport)).not.toContain('Intake obligation')

    const operationalReport = createRadarReport([
      laneWithEvent(
        'games-workshop',
        event(
          'games-workshop',
          'official',
          'source-unavailable',
          'https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/'
        )
      ),
    ])
    expect(renderManagedRulesRadarIssueBody(operationalReport)).not.toContain('Intake obligation')
  })
})

describe('AoS 4 Rules Radar GitHub REST adapter', () => {
  it('sends the token only to api.github.com and rejects redirects', async () => {
    const requests: GitHubApiRequest[] = []
    const transport: GitHubApiTransport = async request => {
      requests.push(request)
      return {
        status: 302,
        headers: { location: 'https://example.com/steal' },
        body: '',
      }
    }
    const client = createGitHubIssueClient({
      repository: 'daviseford/aos-reminders',
      token: 'secret-token',
      transport,
    })

    await expect(client.listIssues()).rejects.toThrow(/redirect/i)
    expect(requests).toHaveLength(1)
    expect(new URL(requests[0].url).hostname).toBe('api.github.com')
    expect(requests[0].headers.authorization).toBe('Bearer secret-token')
  })

  it.each([403, 404, 422, 500])('fails clearly for HTTP %s without leaking the token', async status => {
    const client = createGitHubIssueClient({
      repository: 'daviseford/aos-reminders',
      token: 'secret-token',
      transport: async () => ({
        status,
        headers: {},
        body: JSON.stringify({ message: `failure secret-token ${status}` }),
      }),
    })
    await expect(client.listIssues()).rejects.toThrow(new RegExp(`HTTP ${status}`))
    await expect(client.listIssues()).rejects.not.toThrow(/secret-token/)
  })

  it('fails on timeouts and malformed API responses', async () => {
    const timeout = createGitHubIssueClient({
      repository: 'daviseford/aos-reminders',
      token: 'secret-token',
      transport: async () => {
        throw new Error('timeout')
      },
    })
    await expect(timeout.listIssues()).rejects.toThrow(/timeout/)

    const malformed = createGitHubIssueClient({
      repository: 'daviseford/aos-reminders',
      token: 'secret-token',
      transport: async () => ({ status: 200, headers: {}, body: '{}' }),
    })
    await expect(malformed.listIssues()).rejects.toThrow(/array/i)
  })

  it('accepts nullable bodies on unrelated GitHub issues', async () => {
    const client = createGitHubIssueClient({
      repository: 'daviseford/aos-reminders',
      token: 'secret-token',
      transport: async () => ({
        status: 200,
        headers: {},
        body: JSON.stringify([
          {
            number: 123,
            title: 'Bodyless issue',
            body: null,
            state: 'open',
            labels: [],
            assignees: [],
          },
        ]),
      }),
    })

    await expect(client.listIssues()).resolves.toEqual([expect.objectContaining({ number: 123, body: '' })])
  })

  it('follows bounded pagination when the repository has more than 100 issues', async () => {
    const requests: GitHubApiRequest[] = []
    const issue = {
      number: 1752,
      title: 'AoS Rules Radar',
      body: RULES_RADAR_ISSUE_MARKER,
      state: 'open',
      labels: [],
      assignees: [],
    }
    const transport: GitHubApiTransport = async request => {
      requests.push(request)
      const page = new URL(request.url).searchParams.get('page')
      const headers: Record<string, string> =
        page === '2'
          ? {}
          : {
              link: '<https://api.github.com/repositories/123/issues?state=all&per_page=100&page=2>; rel="next"',
            }
      return { status: 200, headers, body: page === '2' ? JSON.stringify([issue]) : '[]' }
    }
    const client = createGitHubIssueClient({
      repository: 'daviseford/aos-reminders',
      token: 'secret-token',
      transport,
    })

    await expect(client.listIssues()).resolves.toEqual([expect.objectContaining({ number: issue.number })])
    expect(requests.map(request => new URL(request.url).searchParams.get('page'))).toEqual(['1', '2'])
  })
})

class FakeClient implements RulesRadarGitHubClient {
  issues: RulesRadarGitHubIssue[]
  comments = new Map<number, RulesRadarGitHubComment[]>()
  mutations: Array<{ kind: 'create' | 'update' | 'comment'; number: number }> = []

  constructor(issues: RulesRadarGitHubIssue[] = []) {
    this.issues = issues.map(issue => ({ ...issue }))
  }

  async listIssues(): Promise<RulesRadarGitHubIssue[]> {
    return this.issues.map(issue => ({ ...issue }))
  }

  async listComments(issueNumber: number): Promise<RulesRadarGitHubComment[]> {
    return [...(this.comments.get(issueNumber) ?? [])]
  }

  async createIssue(input: Omit<RulesRadarGitHubIssue, 'number' | 'state'>): Promise<RulesRadarGitHubIssue> {
    const issue = { ...input, number: this.issues.length + 1, state: 'open' as const }
    this.issues.push(issue)
    this.mutations.push({ kind: 'create', number: issue.number })
    return { ...issue }
  }

  async updateIssue(
    issueNumber: number,
    input: Partial<Pick<RulesRadarGitHubIssue, 'title' | 'body' | 'state' | 'labels' | 'assignees'>>
  ): Promise<RulesRadarGitHubIssue> {
    const index = this.issues.findIndex(issue => issue.number === issueNumber)
    this.issues[index] = { ...this.issues[index], ...input }
    this.mutations.push({ kind: 'update', number: issueNumber })
    return { ...this.issues[index] }
  }

  async createComment(issueNumber: number, body: string): Promise<RulesRadarGitHubComment> {
    const comment = { id: this.mutations.length + 1, body }
    this.comments.set(issueNumber, [...(this.comments.get(issueNumber) ?? []), comment])
    this.mutations.push({ kind: 'comment', number: issueNumber })
    return comment
  }
}

const managedIssue = (
  report: ReturnType<typeof createRadarReport>,
  state: RulesRadarGitHubIssue['state'] = 'open'
): RulesRadarGitHubIssue => ({
  number: 1,
  title: 'AoS Rules Radar',
  body: renderManagedRulesRadarIssueBody(report),
  state,
  labels: ['maintenance', 'rule updates'],
  assignees: ['daviseford'],
})

const emptyLane = (source: RadarSource): RadarLane => createRadarLane(source, observedAt, [])

const laneWithEvent = (source: RadarSource, value: RadarEvent): RadarLane =>
  createRadarLane(source, observedAt, [value])

const event = (
  source: RadarSource,
  authority: RadarAuthority,
  changeKind: RadarChangeKind,
  locator: string
): RadarEvent => ({
  class: changeKind.includes('source-') ? 'operational' : 'material',
  source,
  publisher: source,
  authority,
  changeKind,
  locator,
  baselineFingerprint: null,
  observedFingerprint: checksum('a'),
  observedAt,
  evidence: { title: 'Fixture source' },
})
