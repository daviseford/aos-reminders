import { createHash } from 'node:crypto'

/**
 * The provisional-verification watch.
 *
 * The accepted corpus carries community-fallback facts that must be replaced or verified as soon
 * as a preferred source publishes the content (the `verificationCondition` on every
 * `communityWarscrollSources` review entry). This watch checks the concrete pages where that
 * content would appear — Wahapedia faction pages for the provisional rules, and the moving BSData
 * files for transcriptions the fallback tier is still missing — for explicit reviewed sentinel
 * strings, and reports which have appeared.
 *
 * Like the Rules Radar, the watch is evidence, not acceptance: a hit means "start the standard
 * candidate intake", never an automatic data change.
 *
 * Policy note (owner decision 2026-08-18, issue #1757): BSData was raised from fallback to a peer
 * secondary alongside Wahapedia, so community-sourced facts are accepted as fact and carry no
 * pending-verification obligation. The watch therefore reports disagreement and coverage rather
 * than a replacement queue; the `provisional` vocabulary here is legacy until the tier is
 * flattened in the review schema.
 */

export interface ProvisionalWatchSentinel {
  /** Human-readable name shown in the notification, e.g. `Hunger-filled Tribe (battle formation)`. */
  label: string
  /** Case-insensitive substring whose appearance on the page satisfies the sentinel. */
  needle: string
}

export interface ProvisionalWatchEntry {
  id: string
  /** GitHub issue that tracks the pending swap and receives the notification comment. */
  issueNumber: number
  /** Why this page is being watched, shown in the notification. */
  reason: string
  url: string
  sentinels: ProvisionalWatchSentinel[]
}

export interface ProvisionalWatchConfig {
  schemaVersion: 1
  watches: ProvisionalWatchEntry[]
}

export interface ProvisionalWatchFetchResult {
  status: number
  body: string
}

export type ProvisionalWatchFetch = (url: string) => Promise<ProvisionalWatchFetchResult>

export interface ProvisionalWatchFinding {
  id: string
  issueNumber: number
  reason: string
  url: string
  availability: 'accessible' | 'inaccessible'
  found: string[]
  missing: string[]
}

export interface ProvisionalWatchNotification {
  issueNumber: number
  /** Stable fingerprint of the found sentinel set, used to deduplicate issue comments. */
  fingerprint: string
  /** Hidden marker embedded in the comment body for idempotent notification. */
  marker: string
  body: string
}

export interface ProvisionalWatchReport {
  schemaVersion: 1
  observedAt: string
  findings: ProvisionalWatchFinding[]
  notifications: ProvisionalWatchNotification[]
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim())

export const validateProvisionalWatchConfig = (value: unknown): ProvisionalWatchConfig => {
  const config = value as ProvisionalWatchConfig
  if (config?.schemaVersion !== 1 || !Array.isArray(config?.watches)) {
    throw new Error('Provisional watch config must declare schemaVersion 1 and a watches list')
  }
  const ids = new Set<string>()
  config.watches.forEach((watch, index) => {
    if (
      !isNonEmptyString(watch?.id) ||
      !Number.isInteger(watch?.issueNumber) ||
      watch.issueNumber <= 0 ||
      !isNonEmptyString(watch?.reason) ||
      !isNonEmptyString(watch?.url) ||
      !Array.isArray(watch?.sentinels) ||
      !watch.sentinels.length ||
      watch.sentinels.some(
        sentinel => !isNonEmptyString(sentinel?.label) || !isNonEmptyString(sentinel?.needle)
      )
    ) {
      throw new Error(`Provisional watch entry ${index + 1} is malformed`)
    }
    if (ids.has(watch.id)) throw new Error(`Provisional watch entry ${watch.id} is duplicated`)
    ids.add(watch.id)
    const url = new URL(watch.url)
    if (url.protocol !== 'https:') {
      throw new Error(`Provisional watch entry ${watch.id} must use an https URL`)
    }
  })
  return config
}

const notificationBody = (findings: ProvisionalWatchFinding[], marker: string): string => {
  const lines: string[] = [
    '## Provisional-verification watch',
    '',
    'A watched source now carries content that the accepted corpus ships from a secondary source',
    '(or that the corpus is still missing). This is evidence, not acceptance: run the standard',
    'candidate intake per `docs/data/aos4-maintenance.md` to reconcile the accepted facts with',
    'the watched source. Accepted secondary facts stay accepted; nothing here obliges a',
    'replacement.',
    '',
  ]
  findings.forEach(finding => {
    lines.push(`### ${finding.id}`)
    lines.push('')
    lines.push(finding.reason)
    lines.push('')
    lines.push(`Source: ${finding.url}`)
    lines.push('')
    finding.found.forEach(label => lines.push(`- [x] ${label}`))
    finding.missing.forEach(label => lines.push(`- [ ] ${label} (not yet present)`))
    lines.push('')
  })
  lines.push(marker)
  return lines.join('\n')
}

export const evaluateProvisionalWatch = async (
  config: ProvisionalWatchConfig,
  dependencies: { fetch: ProvisionalWatchFetch; now: () => string }
): Promise<ProvisionalWatchReport> => {
  const findings: ProvisionalWatchFinding[] = []
  for (const watch of config.watches) {
    let availability: ProvisionalWatchFinding['availability'] = 'accessible'
    let body = ''
    try {
      const response = await dependencies.fetch(watch.url)
      if (response.status === 200) {
        body = response.body
      } else {
        availability = 'inaccessible'
      }
    } catch {
      availability = 'inaccessible'
    }
    const haystack = body.toLowerCase()
    const found = watch.sentinels
      .filter(sentinel => haystack.includes(sentinel.needle.toLowerCase()))
      .map(sentinel => sentinel.label)
    const missing = watch.sentinels
      .filter(sentinel => !haystack.includes(sentinel.needle.toLowerCase()))
      .map(sentinel => sentinel.label)
    findings.push({
      id: watch.id,
      issueNumber: watch.issueNumber,
      reason: watch.reason,
      url: watch.url,
      availability,
      found,
      missing,
    })
  }

  const notifications: ProvisionalWatchNotification[] = []
  const byIssue = new Map<number, ProvisionalWatchFinding[]>()
  findings
    .filter(finding => finding.found.length > 0)
    .forEach(finding => {
      byIssue.set(finding.issueNumber, [...(byIssue.get(finding.issueNumber) ?? []), finding])
    })
  Array.from(byIssue.entries())
    .sort(([left], [right]) => left - right)
    .forEach(([issueNumber, issueFindings]) => {
      const fingerprint = createHash('sha256')
        .update(
          issueFindings
            .flatMap(finding => finding.found.map(label => `${finding.id}:${label}`))
            .sort((left, right) => left.localeCompare(right))
            .join('|'),
          'utf8'
        )
        .digest('hex')
        .slice(0, 16)
      const marker = `<!-- aos4-provisional-watch:${issueNumber}:${fingerprint} -->`
      notifications.push({
        issueNumber,
        fingerprint,
        marker,
        body: notificationBody(issueFindings, marker),
      })
    })

  return {
    schemaVersion: 1,
    observedAt: dependencies.now(),
    findings,
    notifications,
  }
}
