import type { RadarEvent, RadarReport, RadarSource } from './model'

const SOURCE_LABELS = {
  'games-workshop': 'Games Workshop (official)',
  wahapedia: 'Wahapedia (secondary)',
  bsdata: 'BSData (community signal)',
} as const satisfies Record<RadarSource, string>

const CHANGE_LABELS: Record<RadarEvent['changeKind'], string> = {
  'new-publication': 'New publication',
  'removed-publication': 'Removed publication',
  'replaced-publication': 'Replaced publication',
  'new-faction': 'New faction',
  'removed-faction': 'Removed faction',
  'new-rules-page': 'New rules page',
  'removed-rules-page': 'Removed rules page',
  'export-changed': 'Export changed',
  'navigation-changed': 'Navigation changed',
  'community-catalog-changed': 'Community catalog changed',
  'source-unavailable': 'Source unavailable',
  'source-contract-changed': 'Source contract changed',
  'comparison-diverged': 'Comparison diverged',
  'comparison-truncated': 'Comparison truncated',
  'rate-limited': 'Source rate limited',
  'candidate-failed': 'Candidate preparation failed',
  'notification-failed': 'Notification failed',
}

export const inertMarkdown = (value: string, maxLength = 300): string =>
  Array.from(value)
    .map(character => {
      const code = character.charCodeAt(0)
      return code < 32 || code === 127 ? ' ' : character
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
    .replaceAll('@', '@\u200b')
    .replace(/([\\`*_[\]{}()#+\-.!|>])/g, '\\$1')
    .replaceAll('<!--', '&lt;!--')

const evidenceLines = (event: RadarEvent): string[] =>
  Object.entries(event.evidence)
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([key, value]) => {
      if (value === null || value === false || value === '') return []
      const rendered = Array.isArray(value)
        ? value.map(item => inertMarkdown(String(item))).join(', ')
        : inertMarkdown(String(value))
      return [`  - ${inertMarkdown(key)}: ${rendered}`]
    })

const renderEvent = (event: RadarEvent): string[] => [
  `- **${CHANGE_LABELS[event.changeKind]}** — ${inertMarkdown(event.locator, 500)}`,
  `  - Authority: ${event.authority}`,
  ...(event.baselineFingerprint ? [`  - Baseline: \`${event.baselineFingerprint}\``] : []),
  ...(event.observedFingerprint ? [`  - Observed: \`${event.observedFingerprint}\``] : []),
  ...evidenceLines(event),
]

export const renderRulesRadarIssueBody = (report: RadarReport): string => {
  const lines = [
    '# AoS Rules Radar',
    '',
    report.events.length
      ? 'Material source changes or operational failures need maintainer review.'
      : 'No material source changes or operational failures were observed.',
    '',
    `Aggregate fingerprint: \`${report.aggregateFingerprint}\``,
    '',
  ]
  report.lanes.forEach(lane => {
    lines.push(`## ${SOURCE_LABELS[lane.source]}`, '')
    if (!lane.events.length) {
      lines.push('No active events.', '')
      return
    }
    const material = lane.events.filter(event => event.class === 'material')
    const operational = lane.events.filter(event => event.class === 'operational')
    if (material.length) {
      lines.push('### Rules-source changes', '')
      material.forEach(event => lines.push(...renderEvent(event)))
      lines.push('')
    }
    if (operational.length) {
      lines.push('### Operational failures', '')
      operational.forEach(event => lines.push(...renderEvent(event)))
      lines.push('')
    }
  })
  return `${lines.join('\n').trim()}\n`
}
