import { stableCompactJson } from '../generate/serialization'
import { createRadarReport, mergeRadarLanes } from './compare'
import type { RadarLane, RadarReport } from './model'
import { renderRulesRadarIssueBody } from './report'

export const RULES_RADAR_ISSUE_MARKER = '<!-- aos4-rules-radar:issue:v1 -->'
const STATE_PREFIX = '<!-- aos4-rules-radar:state:v1 '
const STATE_SUFFIX = ' -->'
const DELTA_PREFIX = '<!-- aos4-rules-radar:delta:v1:'
const ISSUE_TITLE = 'AoS Rules Radar'
const MAX_MANAGED_BODY_LENGTH = 120_000

export interface RulesRadarGitHubIssue {
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  labels: string[]
  assignees: string[]
}

export interface RulesRadarGitHubComment {
  id: number
  body: string
}

export interface RulesRadarGitHubClient {
  listIssues(): Promise<RulesRadarGitHubIssue[]>
  listComments(issueNumber: number): Promise<RulesRadarGitHubComment[]>
  createIssue(input: Omit<RulesRadarGitHubIssue, 'number' | 'state'>): Promise<RulesRadarGitHubIssue>
  updateIssue(
    issueNumber: number,
    input: Partial<Pick<RulesRadarGitHubIssue, 'title' | 'body' | 'state' | 'labels' | 'assignees'>>
  ): Promise<RulesRadarGitHubIssue>
  createComment(issueNumber: number, body: string): Promise<RulesRadarGitHubComment>
}

export interface RulesRadarIssueOptions {
  assignee: string
  labels: string[]
}

export interface RulesRadarIssueSynchronization {
  action: 'noop' | 'created' | 'updated' | 'reopened' | 'closed'
  issue?: RulesRadarGitHubIssue
  report: RadarReport
}

const count = (value: string, search: string): number => value.split(search).length - 1

const stateMarker = (report: RadarReport): string => {
  const encoded = Buffer.from(stableCompactJson({ schemaVersion: 1, lanes: report.lanes }), 'utf8').toString(
    'base64url'
  )
  return `${STATE_PREFIX}${encoded}${STATE_SUFFIX}`
}

export const renderManagedRulesRadarIssueBody = (report: RadarReport): string =>
  `${RULES_RADAR_ISSUE_MARKER}\n\n${renderRulesRadarIssueBody(report)}\n${stateMarker(report)}\n`

const parseManagedReport = (body: string): RadarReport => {
  if (body.length > MAX_MANAGED_BODY_LENGTH) throw new Error('Rules Radar issue body is oversized')
  if (count(body, RULES_RADAR_ISSUE_MARKER) !== 1) {
    throw new Error('Rules Radar issue marker is missing or duplicated')
  }
  if (count(body, STATE_PREFIX) !== 1) {
    throw new Error('Rules Radar machine state is missing or duplicated')
  }
  const start = body.indexOf(STATE_PREFIX) + STATE_PREFIX.length
  const end = body.indexOf(STATE_SUFFIX, start)
  if (end < start || body.indexOf(STATE_SUFFIX, end + STATE_SUFFIX.length) >= 0) {
    throw new Error('Rules Radar machine state boundary is malformed')
  }
  const encoded = body.slice(start, end)
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('Rules Radar machine state is malformed')

  let value: unknown
  try {
    value = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as unknown
  } catch (error) {
    throw new Error('Rules Radar machine state is not valid encoded JSON', { cause: error })
  }
  if (
    !value ||
    typeof value !== 'object' ||
    (value as { schemaVersion?: unknown }).schemaVersion !== 1 ||
    !Array.isArray((value as { lanes?: unknown }).lanes)
  ) {
    throw new Error('Rules Radar machine state has an incompatible schema')
  }
  const lanes = (value as { lanes: RadarLane[] }).lanes
  const report = createRadarReport(lanes)
  report.lanes.forEach(lane => {
    const encodedLane = lanes.find(value => value.source === lane.source)
    if (!encodedLane || encodedLane.fingerprint !== lane.fingerprint) {
      throw new Error(`Rules Radar machine state has an invalid ${lane.source} fingerprint`)
    }
  })
  return report
}

const deltaMarker = (fingerprint: string): string => `${DELTA_PREFIX}${fingerprint} -->`

const ensureDeltaComment = async (
  client: RulesRadarGitHubClient,
  issueNumber: number,
  report: RadarReport
): Promise<void> => {
  const marker = deltaMarker(report.aggregateFingerprint)
  const comments = await client.listComments(issueNumber)
  if (comments.some(comment => comment.body.includes(marker))) return
  const summary = report.events.length
    ? `Rules Radar changed: ${report.materialEventCount} material and ${report.operationalEventCount} operational event(s).`
    : 'Rules Radar cleared the final active source lane.'
  await client.createComment(issueNumber, `${summary}\n\n${marker}`)
}

export const synchronizeRulesRadarIssue = async (
  observedReport: RadarReport,
  client: RulesRadarGitHubClient,
  options: RulesRadarIssueOptions
): Promise<RulesRadarIssueSynchronization> => {
  if (!options.assignee.trim()) throw new Error('Rules Radar GitHub assignee is required')
  if (!options.labels.length || options.labels.some(label => !label.trim())) {
    throw new Error('Rules Radar GitHub labels are required')
  }
  const labels = Array.from(new Set(options.labels.map(label => label.trim()))).sort()
  const matching = (await client.listIssues()).filter(issue => issue.body.includes(RULES_RADAR_ISSUE_MARKER))
  if (matching.length > 1) throw new Error('Multiple marker-bearing Rules Radar issues exist')

  const existing = matching[0]
  if (!existing) {
    if (!observedReport.events.length) {
      return { action: 'noop', report: observedReport }
    }
    const issue = await client.createIssue({
      title: ISSUE_TITLE,
      body: renderManagedRulesRadarIssueBody(observedReport),
      labels,
      assignees: [options.assignee.trim()],
    })
    return { action: 'created', issue, report: observedReport }
  }

  const previousReport = parseManagedReport(existing.body)
  const mergedReport = createRadarReport(mergeRadarLanes(previousReport.lanes, observedReport.lanes))
  const unchanged = mergedReport.aggregateFingerprint === previousReport.aggregateFingerprint
  const shouldBeOpen = mergedReport.events.length > 0
  if (
    unchanged &&
    ((shouldBeOpen && existing.state === 'open') || (!shouldBeOpen && existing.state === 'closed'))
  ) {
    return { action: 'noop', issue: existing, report: mergedReport }
  }

  await ensureDeltaComment(client, existing.number, mergedReport)
  const issue = await client.updateIssue(existing.number, {
    title: ISSUE_TITLE,
    body: renderManagedRulesRadarIssueBody(mergedReport),
    state: shouldBeOpen ? 'open' : 'closed',
    labels,
    assignees: [options.assignee.trim()],
  })
  return {
    action: shouldBeOpen ? (existing.state === 'closed' ? 'reopened' : 'updated') : 'closed',
    issue,
    report: mergedReport,
  }
}

export interface GitHubApiRequest {
  url: string
  method: 'GET' | 'POST' | 'PATCH'
  headers: Record<string, string>
  body?: string
}

export interface GitHubApiResponse {
  status: number
  headers: Record<string, string>
  body: string
}

export type GitHubApiTransport = (request: GitHubApiRequest) => Promise<GitHubApiResponse>

export interface CreateGitHubIssueClientOptions {
  repository: string
  token: string
  transport?: GitHubApiTransport
}

const defaultTransport: GitHubApiTransport = async request => {
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual',
    signal: AbortSignal.timeout(30_000),
  })
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const stringArray = (value: unknown, objectField: string): string[] => {
  if (!Array.isArray(value)) return []
  return value.map(item => {
    if (typeof item === 'string') return item
    const field = isRecord(item) ? item[objectField] : undefined
    if (typeof field === 'string') return field
    throw new Error(`GitHub response contains a malformed ${objectField}`)
  })
}

const parseIssue = (value: unknown): RulesRadarGitHubIssue => {
  if (
    !isRecord(value) ||
    !Number.isSafeInteger(value.number) ||
    typeof value.title !== 'string' ||
    typeof value.body !== 'string' ||
    !['open', 'closed'].includes(String(value.state))
  ) {
    throw new Error('GitHub returned a malformed issue')
  }
  return {
    number: Number(value.number),
    title: value.title,
    body: value.body,
    state: value.state as 'open' | 'closed',
    labels: stringArray(value.labels, 'name'),
    assignees: stringArray(value.assignees, 'login'),
  }
}

const parseComment = (value: unknown): RulesRadarGitHubComment => {
  if (!isRecord(value) || !Number.isSafeInteger(value.id) || typeof value.body !== 'string') {
    throw new Error('GitHub returned a malformed issue comment')
  }
  return { id: Number(value.id), body: value.body }
}

const redact = (value: string, token: string): string =>
  token ? value.replaceAll(token, '[REDACTED]') : value

export const createGitHubIssueClient = ({
  repository,
  token,
  transport = defaultTransport,
}: CreateGitHubIssueClientOptions): RulesRadarGitHubClient => {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error('GitHub repository must be an owner/repository pair')
  }
  if (!token) throw new Error('GitHub token is required')
  const basePath = `/repos/${repository}`

  const request = async (
    method: GitHubApiRequest['method'],
    pathname: string,
    body?: unknown
  ): Promise<{ value: unknown; headers: Record<string, string> }> => {
    const url = new URL(pathname, 'https://api.github.com')
    if (url.hostname !== 'api.github.com' || url.protocol !== 'https:') {
      throw new Error('GitHub API request escaped api.github.com')
    }
    let response: GitHubApiResponse
    try {
      response = await transport({
        url: url.toString(),
        method,
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          'user-agent': 'aos-reminders-rules-radar',
          'x-github-api-version': '2022-11-28',
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      })
    } catch (error) {
      throw new Error(redact(error instanceof Error ? error.message : String(error), token))
    }
    if (response.status >= 300 && response.status < 400) {
      throw new Error(`GitHub API redirect rejected (HTTP ${response.status})`)
    }
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        redact(`GitHub API returned HTTP ${response.status}: ${response.body.slice(0, 500)}`, token)
      )
    }
    if (!response.body) return { value: null, headers: response.headers }
    try {
      return { value: JSON.parse(response.body) as unknown, headers: response.headers }
    } catch (error) {
      throw new Error('GitHub API returned malformed JSON', { cause: error })
    }
  }

  const assertSinglePage = (headers: Record<string, string>): void => {
    const link = Object.entries(headers).find(([name]) => name.toLowerCase() === 'link')?.[1]
    if (link?.includes('rel="next"')) throw new Error('GitHub API pagination exceeded the bounded page')
  }

  return {
    async listIssues() {
      const response = await request('GET', `${basePath}/issues?state=all&per_page=100`)
      assertSinglePage(response.headers)
      if (!Array.isArray(response.value)) throw new Error('GitHub issues response must be an array')
      return response.value.filter(value => !isRecord(value) || !('pull_request' in value)).map(parseIssue)
    },
    async listComments(issueNumber) {
      const response = await request('GET', `${basePath}/issues/${issueNumber}/comments?per_page=100`)
      assertSinglePage(response.headers)
      if (!Array.isArray(response.value)) {
        throw new Error('GitHub issue comments response must be an array')
      }
      return response.value.map(parseComment)
    },
    async createIssue(input) {
      const response = await request('POST', `${basePath}/issues`, {
        title: input.title,
        body: input.body,
        labels: input.labels,
        assignees: input.assignees,
      })
      return parseIssue(response.value)
    },
    async updateIssue(issueNumber, input) {
      const response = await request('PATCH', `${basePath}/issues/${issueNumber}`, input)
      return parseIssue(response.value)
    },
    async createComment(issueNumber, body) {
      const response = await request('POST', `${basePath}/issues/${issueNumber}/comments`, {
        body,
      })
      return parseComment(response.value)
    },
  }
}
