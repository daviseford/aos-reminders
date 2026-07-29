import { compareBsDataObservation, createRadarLane } from '../compare'
import type { RulesRadarConfig } from '../config'
import type {
  BsDataComparisonStatus,
  BsDataObservation,
  RadarChangeKind,
  RadarEvent,
  RadarLane,
} from '../model'
import { createRequestLimiter } from './requestLimiter'

const GIT_SHA_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i
const GITHUB_API_ORIGIN = 'https://api.github.com'

export interface BsDataFetchRequest {
  url: string
  headers: Record<string, string>
  maxBytes: number
}

export interface BsDataFetchResult {
  status: number
  finalUrl: string
  headers: Record<string, string>
  bytes: Uint8Array
}

export type BsDataFetch = (request: BsDataFetchRequest) => Promise<BsDataFetchResult>

export interface BsDataRadarObserverDependencies {
  now: () => string
  fetch: BsDataFetch
}

export interface BsDataRadarObserverInput {
  config: RulesRadarConfig
  workflowUrl?: string
}

export interface BsDataRadarObserverResult {
  observation?: BsDataObservation
  lane: RadarLane
  requestCount: number
}

const apiHeaders = {
  accept: 'application/vnd.github+json',
  'user-agent': 'aos-reminders-rules-radar',
  'x-github-api-version': '2022-11-28',
} as const

const decodeJson = (result: BsDataFetchResult, label: string): unknown => {
  const finalUrl = new URL(result.finalUrl)
  if (
    finalUrl.protocol !== 'https:' ||
    finalUrl.hostname.toLowerCase() !== 'api.github.com' ||
    finalUrl.username ||
    finalUrl.password
  ) {
    throw new Error(`${label} followed an untrusted redirect to ${result.finalUrl}`)
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(result.bytes)) as unknown
  } catch (error) {
    throw new Error(`${label} returned malformed JSON`, { cause: error })
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const operationalLane = (
  observedAt: string,
  changeKind: RadarChangeKind,
  repository: string,
  details: string,
  baselineSha: string,
  headSha: string | null,
  workflowUrl?: string
): RadarLane => {
  const event: RadarEvent = {
    class: 'operational',
    source: 'bsdata',
    publisher: 'bsdata',
    authority: 'community',
    changeKind,
    locator: repository,
    baselineFingerprint: baselineSha,
    observedFingerprint: headSha,
    observedAt,
    workflowUrl,
    evidence: { details: details.slice(0, 1000) },
  }
  return createRadarLane('bsdata', observedAt, [event], workflowUrl)
}

const httpFailureKind = (status: number): RadarChangeKind =>
  status === 403 || status === 429 ? 'rate-limited' : 'source-unavailable'

const compareStatus = (payload: Record<string, unknown>): BsDataComparisonStatus => {
  if (
    !Array.isArray(payload.commits) ||
    !Array.isArray(payload.files) ||
    !Number.isSafeInteger(payload.total_commits) ||
    !Number.isSafeInteger(payload.ahead_by) ||
    !Number.isSafeInteger(payload.behind_by)
  ) {
    return 'malformed'
  }
  if (payload.status !== 'ahead') {
    return payload.status === 'identical' ? 'identical' : 'diverged'
  }
  if (
    Number(payload.total_commits) > payload.commits.length ||
    payload.commits.length > 100 ||
    payload.files.length >= 300
  ) {
    return 'truncated'
  }
  return 'ahead'
}

const changedPaths = (payload: Record<string, unknown>): string[] => {
  if (!Array.isArray(payload.files)) return []
  const paths = payload.files.map((file, index) => {
    if (!isRecord(file) || typeof file.filename !== 'string' || !file.filename.trim()) {
      throw new Error(`BSData compare file ${index + 1} is malformed`)
    }
    return file.filename.trim()
  })
  if (new Set(paths).size !== paths.length) throw new Error('BSData compare repeats a changed path')
  return paths.sort()
}

export const observeBsDataRadar = async (
  input: BsDataRadarObserverInput,
  dependencies: BsDataRadarObserverDependencies
): Promise<BsDataRadarObserverResult> => {
  const observedAt = dependencies.now()
  const { repository, branch, baselineSha } = input.config.bsData
  const limiter = createRequestLimiter({ budget: input.config.requestBudgets.bsdata })
  let headSha: string | null = null

  try {
    const headUrl = `${GITHUB_API_ORIGIN}/repos/${repository}/commits/${encodeURIComponent(branch)}`
    const headResponse = await limiter.run(() =>
      dependencies.fetch({ url: headUrl, headers: { ...apiHeaders }, maxBytes: 1024 * 1024 })
    )
    if (headResponse.status < 200 || headResponse.status >= 300) {
      return {
        lane: operationalLane(
          observedAt,
          httpFailureKind(headResponse.status),
          repository,
          `BSData branch lookup returned HTTP ${headResponse.status}`,
          baselineSha,
          null,
          input.workflowUrl
        ),
        requestCount: limiter.count,
      }
    }
    const headPayload = decodeJson(headResponse, 'BSData branch lookup')
    if (
      !isRecord(headPayload) ||
      typeof headPayload.sha !== 'string' ||
      !GIT_SHA_PATTERN.test(headPayload.sha)
    ) {
      throw new Error('BSData branch lookup returned an invalid head checksum')
    }
    headSha = headPayload.sha.toLowerCase()

    if (headSha === baselineSha) {
      const observation: BsDataObservation = {
        schemaVersion: 1,
        source: 'bsdata',
        observedAt,
        workflowUrl: input.workflowUrl,
        repository,
        baselineSha,
        headSha,
        comparisonStatus: 'identical',
        changedPaths: [],
      }
      return {
        observation,
        lane: compareBsDataObservation(observation),
        requestCount: limiter.count,
      }
    }

    const compareApiUrl = `${GITHUB_API_ORIGIN}/repos/${repository}/compare/${baselineSha}...${headSha}?per_page=100&page=1`
    const compareResponse = await limiter.run(() =>
      dependencies.fetch({
        url: compareApiUrl,
        headers: { ...apiHeaders },
        maxBytes: 4 * 1024 * 1024,
      })
    )
    if (compareResponse.status < 200 || compareResponse.status >= 300) {
      return {
        lane: operationalLane(
          observedAt,
          httpFailureKind(compareResponse.status),
          repository,
          `BSData comparison returned HTTP ${compareResponse.status}`,
          baselineSha,
          headSha,
          input.workflowUrl
        ),
        requestCount: limiter.count,
      }
    }
    const comparePayload = decodeJson(compareResponse, 'BSData comparison')
    if (!isRecord(comparePayload)) throw new Error('BSData comparison returned a non-object payload')
    const status = compareStatus(comparePayload)
    const paths = status === 'ahead' ? changedPaths(comparePayload) : []
    const observation: BsDataObservation = {
      schemaVersion: 1,
      source: 'bsdata',
      observedAt,
      workflowUrl: input.workflowUrl,
      repository,
      baselineSha,
      headSha,
      comparisonStatus: status,
      compareUrl: `https://github.com/${repository}/compare/${baselineSha}...${headSha}`,
      changedPaths: paths,
    }
    return {
      observation,
      lane: compareBsDataObservation(observation),
      requestCount: limiter.count,
    }
  } catch (error) {
    return {
      lane: operationalLane(
        observedAt,
        'source-contract-changed',
        repository,
        error instanceof Error ? error.message : String(error),
        baselineSha,
        headSha,
        input.workflowUrl
      ),
      requestCount: limiter.count,
    }
  }
}
