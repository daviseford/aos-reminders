import { describe, expect, it } from 'vitest'
import {
  RADAR_AUTHORITY_BY_SOURCE,
  RULES_RADAR_ALARM_SUBJECT_PREFIX,
  createRadarLane,
  createRadarMaterialFingerprint,
  createRadarReport,
  decideRulesRadarAlarm,
  renderRulesRadarAlarmBody,
  renderRulesRadarAlarmSubject,
  type RadarAuthority,
  type RadarChangeKind,
  type RadarEvent,
  type RadarLane,
  type RadarReport,
  type RadarSource,
} from '../../aos4/radar'

const observedAt = '2026-08-18T12:00:00.000Z'
const laterObservedAt = '2026-08-19T05:17:00.000Z'
const checksum = (character: string): string => character.repeat(64)

const event = (
  source: RadarSource,
  authority: RadarAuthority,
  changeKind: RadarChangeKind,
  locator: string,
  observed = observedAt
): RadarEvent => ({
  class: 'material',
  source,
  publisher: source,
  authority,
  changeKind,
  locator,
  baselineFingerprint: null,
  observedFingerprint: checksum('a'),
  observedAt: observed,
  evidence: { title: 'Fixture source' },
})

const operationalEvent = (source: RadarSource, locator: string): RadarEvent => ({
  ...event(source, RADAR_AUTHORITY_BY_SOURCE[source], 'rate-limited', locator),
  class: 'operational',
  evidence: { comparisonStatus: 'rate-limited' },
})

const reportWith = (lanes: RadarLane[]): RadarReport => createRadarReport(lanes)

describe('AoS 4 Rules Radar material alarm', () => {
  it('sends on the first synchronization that carries material events', () => {
    const report = reportWith([
      createRadarLane('games-workshop', observedAt, [
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new-rules.pdf'
        ),
      ]),
    ])

    const decision = decideRulesRadarAlarm(null, report)

    expect(decision.send).toBe(true)
    expect(decision.reason).toBe('no previous managed state')
    expect(decision.materialEventCount).toBe(1)
    expect(decision.materialFingerprint).toMatch(/^[0-9a-f]{64}$/)
    expect(decision.aggregateFingerprint).toBe(report.aggregateFingerprint)
  })

  it('does not send when there are no material events', () => {
    const report = reportWith([createRadarLane('bsdata', observedAt, [])])

    expect(decideRulesRadarAlarm(null, report).send).toBe(false)
    expect(decideRulesRadarAlarm(null, report).reason).toBe('no material events')
  })

  it('does not re-alarm when a re-run observes the same material state', () => {
    const previous = reportWith([
      createRadarLane('games-workshop', observedAt, [
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new-rules.pdf'
        ),
      ]),
    ])
    // A later observation of the same change shifts observedAt but not the material identity.
    const reobserved = reportWith([
      createRadarLane('games-workshop', laterObservedAt, [
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new-rules.pdf',
          laterObservedAt
        ),
      ]),
    ])
    expect(reobserved.aggregateFingerprint).toBe(previous.aggregateFingerprint)

    const decision = decideRulesRadarAlarm(previous, reobserved)

    expect(decision.send).toBe(false)
    expect(decision.reason).toBe('material state unchanged')
    expect(decision.materialFingerprint).toBe(createRadarMaterialFingerprint(previous))
  })

  it('stays silent when only operational events churn beneath an unchanged material event', () => {
    const material = event(
      'bsdata',
      'community',
      'community-catalog-changed',
      'https://github.com/BSData/age-of-sigmar-4th'
    )
    const previous = reportWith([createRadarLane('bsdata', observedAt, [material])])
    const churned = reportWith([
      createRadarLane('bsdata', laterObservedAt, [
        { ...material, observedAt: laterObservedAt },
        operationalEvent('bsdata', 'https://github.com/BSData/age-of-sigmar-4th'),
      ]),
    ])
    expect(churned.aggregateFingerprint).not.toBe(previous.aggregateFingerprint)

    const decision = decideRulesRadarAlarm(previous, churned)

    expect(decision.send).toBe(false)
    expect(decision.reason).toBe('material state unchanged')
  })

  it('does not re-alarm when material state only shrinks (an event resolves)', () => {
    const surviving = event(
      'wahapedia',
      'secondary',
      'export-changed',
      'https://wahapedia.ru/aos4/Last_update.csv'
    )
    const previous = reportWith([
      createRadarLane('wahapedia', observedAt, [
        surviving,
        event('wahapedia', 'secondary', 'new-faction', 'https://wahapedia.ru/aos4/factions/new-faction'),
      ]),
    ])
    const shrunk = reportWith([
      createRadarLane('wahapedia', laterObservedAt, [{ ...surviving, observedAt: laterObservedAt }]),
    ])
    expect(createRadarMaterialFingerprint(shrunk)).not.toBe(createRadarMaterialFingerprint(previous))

    const decision = decideRulesRadarAlarm(previous, shrunk)

    expect(decision.send).toBe(false)
    expect(decision.reason).toBe('material state shrank without new events')
    expect(decision.materialEventCount).toBe(1)
  })

  it('re-alarms when one material event is replaced by another at the same count', () => {
    const previous = reportWith([
      createRadarLane('wahapedia', observedAt, [
        event('wahapedia', 'secondary', 'export-changed', 'https://wahapedia.ru/aos4/Last_update.csv'),
      ]),
    ])
    const replaced = reportWith([
      createRadarLane('wahapedia', laterObservedAt, [
        event('wahapedia', 'secondary', 'new-faction', 'https://wahapedia.ru/aos4/factions/new-faction'),
      ]),
    ])
    expect(replaced.materialEventCount).toBe(previous.materialEventCount)

    const decision = decideRulesRadarAlarm(previous, replaced)

    expect(decision.send).toBe(true)
    expect(decision.reason).toBe('material state changed')
  })

  it('re-alarms when the material state itself changes', () => {
    const previous = reportWith([
      createRadarLane('wahapedia', observedAt, [
        event('wahapedia', 'secondary', 'export-changed', 'https://wahapedia.ru/aos4/Last_update.csv'),
      ]),
    ])
    const changed = reportWith([
      createRadarLane('wahapedia', laterObservedAt, [
        event('wahapedia', 'secondary', 'export-changed', 'https://wahapedia.ru/aos4/Last_update.csv'),
        event('wahapedia', 'secondary', 'new-faction', 'https://wahapedia.ru/aos4/factions/new-faction'),
      ]),
    ])

    const decision = decideRulesRadarAlarm(previous, changed)

    expect(decision.send).toBe(true)
    expect(decision.reason).toBe('material state changed')
    expect(decision.materialFingerprint).not.toBe(createRadarMaterialFingerprint(previous))
  })

  it('renders a loud greppable subject naming the material lanes only', () => {
    const report = reportWith([
      createRadarLane('games-workshop', observedAt, [
        event(
          'games-workshop',
          'official',
          'new-publication',
          'https://assets.warhammer-community.com/new-rules.pdf'
        ),
      ]),
      createRadarLane('wahapedia', observedAt, [
        event('wahapedia', 'secondary', 'new-faction', 'https://wahapedia.ru/aos4/factions/new-faction'),
      ]),
      createRadarLane('bsdata', observedAt, []),
    ])

    const subject = renderRulesRadarAlarmSubject(report)

    expect(subject).toBe(
      `${RULES_RADAR_ALARM_SUBJECT_PREFIX}: 2 material change(s) — Games Workshop (official), Wahapedia (secondary)`
    )
    expect(subject.startsWith('🚨')).toBe(true)
    expect(subject).not.toContain('BSData')
  })

  it('renders per-lane material evidence with links and no operational events', () => {
    const workflowUrl = 'https://github.com/daviseford/aos-reminders/actions/runs/123'
    const issueUrl = 'https://github.com/daviseford/aos-reminders/issues/1757'
    const material = event(
      'bsdata',
      'community',
      'community-catalog-changed',
      'https://github.com/BSData/age-of-sigmar-4th'
    )
    material.baselineFingerprint = 'b'.repeat(40)
    material.observedFingerprint = 'c'.repeat(40)
    material.evidence = {
      changedPaths: ['Age of Sigmar 4th Edition.gst', 'Order - Stormcast Eternals.cat'],
      compareUrl: 'https://github.com/BSData/age-of-sigmar-4th/compare/bbb...ccc',
    }
    const report = reportWith([
      createRadarLane(
        'bsdata',
        observedAt,
        [material, operationalEvent('bsdata', 'https://api.github.com/rate')],
        workflowUrl
      ),
    ])

    const body = renderRulesRadarAlarmBody(report, { issueUrl })

    expect(body).toContain('# AoS Rules Radar material alarm')
    expect(body).toContain(`- Managed issue: ${issueUrl}`)
    expect(body).toContain(`- Material fingerprint: \`${createRadarMaterialFingerprint(report)}\``)
    expect(body).toContain(`- Aggregate fingerprint: \`${report.aggregateFingerprint}\``)
    expect(body).toContain('## BSData (community signal)')
    expect(body).toContain(`[Workflow run and curated artifacts](${workflowUrl})`)
    expect(body).toContain('**Community catalog changed**')
    expect(body).toContain('- Authority: community')
    // The alarm is what gets pasted into a session, so it must name the runbook itself.
    expect(body).toContain('Runbook: docs/data/aos4-rules-radar-alarm.md')
    expect(body).toContain(`Baseline: \`${'b'.repeat(40)}\``)
    expect(body).toContain(`Observed: \`${'c'.repeat(40)}\``)
    expect(body).toContain('Age of Sigmar 4th Edition\\.gst')
    expect(body).toContain('Order \\- Stormcast Eternals\\.cat')
    expect(body).toContain('candidate → review → accept → generate → certify')
    expect(body).not.toContain('rate-limited')
    expect(body).not.toContain('rate limit')
  })

  it('renders inert evidence text in the alarm body', () => {
    const hostile = event(
      'wahapedia',
      'secondary',
      'new-rules-page',
      'https://wahapedia.ru/aos4/the-rules/<script>@maintainer/'
    )
    hostile.evidence = { title: '<img>@everyone' }
    const report = reportWith([createRadarLane('wahapedia', observedAt, [hostile])])

    const body = renderRulesRadarAlarmBody(report)

    expect(body).toContain('@​maintainer')
    expect(body).toContain('@​everyone')
    expect(body).toContain('- Managed issue: see the AoS Rules Radar issue')
  })
})
