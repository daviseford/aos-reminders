import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  RULES_RADAR_ISSUE_MARKER,
  createRadarLane,
  createRadarReport,
  parseRulesRadarNotifyArguments,
  renderRulesRadarIssueBody,
  runRulesRadarNotification,
  type RadarEvent,
  type RulesRadarGitHubClient,
  type RulesRadarGitHubComment,
  type RulesRadarGitHubIssue,
} from '../../aos4/radar'

const temporaryDirectories: string[] = []
const observedAt = '2026-07-29T20:00:00.000Z'

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true }))
  )
})

describe('AoS 4 Rules Radar notification command', () => {
  it('defaults to a mutation-free dry run', () => {
    expect(parseRulesRadarNotifyArguments(['--report', 'report.json'])).toEqual({
      reportPath: 'report.json',
      outputPath: 'managed-issue-body.md',
      alarmOutputDirectory: '.',
      configPath: path.join('data', 'aos4', 'radar', 'config.json'),
      notifyGitHub: false,
    })
    expect(
      parseRulesRadarNotifyArguments(['--report', 'report.json', '--alarm-output', 'alarms'])
        .alarmOutputDirectory
    ).toBe('alarms')
    expect(() => parseRulesRadarNotifyArguments([])).toThrow(/--report/)
  })

  it('writes the exact deterministic report body inside the managed envelope', async () => {
    const directory = await temporaryDirectory()
    const report = createRadarReport([createRadarLane('games-workshop', observedAt, [])])
    const client = new MutationRejectingClient()
    const outputPath = path.join(directory, 'managed.md')

    const result = await runRulesRadarNotification(
      {
        report,
        outputPath,
        notifyGitHub: false,
        issueOptions: { assignee: 'daviseford', labels: ['maintenance'] },
      },
      { client }
    )

    const body = await readFile(outputPath, 'utf8')
    expect(result.action).toBe('dry-run')
    expect(body).toContain(RULES_RADAR_ISSUE_MARKER)
    expect(body).toContain(renderRulesRadarIssueBody(report))
    expect(client.calls).toBe(0)
    // No material events: the decision artifact exists, but the mailable subject/body must not.
    const decision = JSON.parse(await readFile(path.join(directory, 'alarm.json'), 'utf8'))
    expect(decision).toMatchObject({ send: false, materialEventCount: 0 })
    await expect(readFile(path.join(directory, 'alarm-subject.txt'), 'utf8')).rejects.toThrow()
    await expect(readFile(path.join(directory, 'alarm-body.md'), 'utf8')).rejects.toThrow()
  })

  it('requires an injected GitHub client before enabling mutations', async () => {
    const directory = await temporaryDirectory()
    const report = createRadarReport([createRadarLane('wahapedia', observedAt, [])])

    await expect(
      runRulesRadarNotification({
        report,
        outputPath: path.join(directory, 'managed.md'),
        notifyGitHub: true,
        issueOptions: { assignee: 'daviseford', labels: ['maintenance'] },
      })
    ).rejects.toThrow(/client/)
  })

  it('records a report-only alarm decision that never sends', async () => {
    const directory = await temporaryDirectory()
    const report = createRadarReport([createRadarLane('games-workshop', observedAt, [materialEvent()])])

    const result = await runRulesRadarNotification({
      report,
      outputPath: path.join(directory, 'managed.md'),
      notifyGitHub: false,
      issueOptions: { assignee: 'daviseford', labels: ['maintenance'] },
    })

    expect(result.action).toBe('dry-run')
    expect(result.alarm.send).toBe(false)
    expect(result.alarm.reason).toBe('report-only dry run')
    const decision = JSON.parse(await readFile(path.join(directory, 'alarm.json'), 'utf8'))
    expect(decision).toMatchObject({ send: false, reason: 'report-only dry run', materialEventCount: 1 })
    expect(decision).not.toHaveProperty('subject')
    // The exact subject and body are still uploaded as evidence for smoke runs.
    await expect(readFile(path.join(directory, 'alarm-subject.txt'), 'utf8')).resolves.toContain(
      '🚨 AoS Rules Radar: 1 material change(s) — Games Workshop (official)'
    )
    await expect(readFile(path.join(directory, 'alarm-body.md'), 'utf8')).resolves.toContain(
      '# AoS Rules Radar material alarm'
    )
  })

  it('alarms on new material state exactly once and links the managed issue', async () => {
    const client = new FakeClient()
    const report = createRadarReport([createRadarLane('games-workshop', observedAt, [materialEvent()])])
    const input = (directory: string) => ({
      report,
      outputPath: path.join(directory, 'managed.md'),
      notifyGitHub: true,
      issueOptions: { assignee: 'daviseford', labels: ['maintenance'] },
      repository: 'daviseford/aos-reminders',
    })

    const firstDirectory = await temporaryDirectory()
    const first = await runRulesRadarNotification(input(firstDirectory), { client })

    expect(first.action).toBe('created')
    expect(first.alarm.send).toBe(true)
    expect(first.alarm.reason).toBe('no previous managed state')
    const firstDecision = JSON.parse(await readFile(path.join(firstDirectory, 'alarm.json'), 'utf8'))
    expect(firstDecision).toMatchObject({ send: true, materialEventCount: 1 })
    expect(firstDecision.subject).toContain('🚨 AoS Rules Radar')
    await expect(readFile(path.join(firstDirectory, 'alarm-body.md'), 'utf8')).resolves.toContain(
      '- Managed issue: https://github.com/daviseford/aos-reminders/issues/1'
    )

    const secondDirectory = await temporaryDirectory()
    const second = await runRulesRadarNotification(input(secondDirectory), { client })

    expect(second.action).toBe('noop')
    expect(second.alarm.send).toBe(false)
    expect(second.alarm.reason).toBe('material state unchanged')
    const secondDecision = JSON.parse(await readFile(path.join(secondDirectory, 'alarm.json'), 'utf8'))
    expect(secondDecision).toMatchObject({ send: false, reason: 'material state unchanged' })
    expect(secondDecision).not.toHaveProperty('subject')
  })
})

class MutationRejectingClient implements RulesRadarGitHubClient {
  calls = 0

  async listIssues(): Promise<RulesRadarGitHubIssue[]> {
    this.calls += 1
    throw new Error('GitHub must not be called during a dry run')
  }

  async listComments(): Promise<RulesRadarGitHubComment[]> {
    throw new Error('unexpected')
  }

  async createIssue(): Promise<RulesRadarGitHubIssue> {
    throw new Error('unexpected')
  }

  async updateIssue(): Promise<RulesRadarGitHubIssue> {
    throw new Error('unexpected')
  }

  async createComment(): Promise<RulesRadarGitHubComment> {
    throw new Error('unexpected')
  }
}

const temporaryDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'aos4-radar-notify-'))
  temporaryDirectories.push(directory)
  return directory
}

const materialEvent = (): RadarEvent => ({
  class: 'material',
  source: 'games-workshop',
  publisher: 'games-workshop',
  authority: 'official',
  changeKind: 'new-publication',
  locator: 'https://assets.warhammer-community.com/new-rules.pdf',
  baselineFingerprint: null,
  observedFingerprint: 'a'.repeat(64),
  observedAt,
  evidence: { title: 'Fixture source' },
})

class FakeClient implements RulesRadarGitHubClient {
  issues: RulesRadarGitHubIssue[] = []
  private comments = new Map<number, RulesRadarGitHubComment[]>()

  async listIssues(): Promise<RulesRadarGitHubIssue[]> {
    return this.issues.map(issue => ({ ...issue }))
  }

  async listComments(issueNumber: number): Promise<RulesRadarGitHubComment[]> {
    return [...(this.comments.get(issueNumber) ?? [])]
  }

  async createIssue(input: Omit<RulesRadarGitHubIssue, 'number' | 'state'>): Promise<RulesRadarGitHubIssue> {
    const issue = { ...input, number: this.issues.length + 1, state: 'open' as const }
    this.issues.push(issue)
    return { ...issue }
  }

  async updateIssue(
    issueNumber: number,
    input: Partial<Pick<RulesRadarGitHubIssue, 'title' | 'body' | 'state' | 'labels' | 'assignees'>>
  ): Promise<RulesRadarGitHubIssue> {
    const index = this.issues.findIndex(issue => issue.number === issueNumber)
    this.issues[index] = { ...this.issues[index], ...input }
    return { ...this.issues[index] }
  }

  async createComment(issueNumber: number, body: string): Promise<RulesRadarGitHubComment> {
    const comment = { id: this.comments.size + 1, body }
    this.comments.set(issueNumber, [...(this.comments.get(issueNumber) ?? []), comment])
    return comment
  }
}
