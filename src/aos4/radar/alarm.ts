import { createRadarMaterialFingerprint } from './compare'
import type { RadarReport } from './model'
import { SOURCE_LABELS, renderRadarMaterialEventLines } from './report'

export const RULES_RADAR_ALARM_SUBJECT_PREFIX = '🚨 AoS Rules Radar'

export interface RulesRadarAlarmDecision {
  send: boolean
  reason: string
  materialEventCount: number
  materialFingerprint: string
  aggregateFingerprint: string
}

export interface RulesRadarAlarmLinks {
  issueUrl?: string
}

/**
 * The material alarm means exactly one thing: there is new material rules-source state to
 * review. It keys on the material fingerprint rather than the aggregate fingerprint so
 * operational-event churn (a transient rate-limit appearing and clearing) never re-alarms
 * while an unchanged material event stays open.
 */
export const decideRulesRadarAlarm = (
  previous: RadarReport | null,
  report: RadarReport
): RulesRadarAlarmDecision => {
  const base = {
    materialEventCount: report.materialEventCount,
    materialFingerprint: createRadarMaterialFingerprint(report),
    aggregateFingerprint: report.aggregateFingerprint,
  }
  if (report.materialEventCount === 0) {
    return { send: false, reason: 'no material events', ...base }
  }
  const previousFingerprint = previous === null ? null : createRadarMaterialFingerprint(previous)
  if (previousFingerprint === base.materialFingerprint) {
    return { send: false, reason: 'material state unchanged', ...base }
  }
  return {
    send: true,
    reason: previous === null ? 'no previous managed state' : 'material state changed',
    ...base,
  }
}

export const renderRulesRadarAlarmSubject = (report: RadarReport): string => {
  const laneNames = report.lanes
    .filter(lane => lane.events.some(event => event.class === 'material'))
    .map(lane => SOURCE_LABELS[lane.source])
  return `${RULES_RADAR_ALARM_SUBJECT_PREFIX}: ${report.materialEventCount} material change(s) — ${laneNames.join(', ')}`
}

export const renderRulesRadarAlarmBody = (report: RadarReport, links: RulesRadarAlarmLinks = {}): string => {
  const lines = [
    '# AoS Rules Radar material alarm',
    '',
    `The Rules Radar observed ${report.materialEventCount} material rules-source change(s) with new state to review. Shipped rules text may be wrong until these are reconciled against official sources.`,
    '',
    links.issueUrl ? `- Managed issue: ${links.issueUrl}` : '- Managed issue: see the AoS Rules Radar issue',
    `- Material fingerprint: \`${createRadarMaterialFingerprint(report)}\``,
    `- Aggregate fingerprint: \`${report.aggregateFingerprint}\``,
    '',
  ]
  report.lanes.forEach(lane => {
    const eventLines = renderRadarMaterialEventLines(lane)
    if (!eventLines.length) return
    lines.push(`## ${SOURCE_LABELS[lane.source]}`, '')
    if (lane.workflowUrl) {
      lines.push(`[Workflow run and curated artifacts](${lane.workflowUrl})`, '')
    }
    lines.push(...eventLines, '')
  })
  lines.push(
    '---',
    '',
    'This alarm is evidence, not acceptance: reconcile through the normal candidate → review → accept → generate → certify path. It is sent once per material state; a re-run observing the same state does not re-alarm.'
  )
  return `${lines.join('\n').trim()}\n`
}
