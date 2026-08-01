import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

/**
 * The July 2026 Ogor Mawtribes battletome adds ten new units (Redd the Maw, Tyrant on Glutthorn,
 * Morga the Mighty, Grell Firefist, Gutseers, Cleavers, Gluttons, Hunters with Sabrefangs,
 * Maulbeast Cavalry, Maulbeast Raiders). As of the accepted 2026-08-01 snapshot no accepted
 * source publishes their warscroll rules: Wahapedia still lists only the pre-supplement
 * warscrolls, and the official free "Battletome Supplement: Ogor Mawtribes" PDF contains only the
 * legacy-unit warscrolls (Slaughtermaster, Maneaters, Firebelly, ...). The official Battle
 * Profiles supplement provides points and unit sizes only, so the ten units are retained as
 * explicit profile-only official facts — generation preserves their exact facts and checksums but
 * does not invent rules or reminders. Lorai, Child of the Abyss (Stormcast Eternals) is in the
 * same state via the core Battle Profiles PDF.
 *
 * This test pins that boundary and guards the previously shipped Ogor warscrolls against
 * regressions. When Wahapedia or an official PDF publishes the missing warscrolls, the standard
 * candidate intake replaces the profile-only facts and this test must be updated.
 */

interface ReconciliationReport {
  unmatchedOfficialUnitFacts: Array<{
    faction: string
    name: string
    unitSize: number
    points: number
    sourceRecordId: string
    reason: string
  }>
}

const OGOR_SUPPLEMENT_UNITS: Array<{ name: string; unitSize: number; points: number }> = [
  { name: 'Cleavers', unitSize: 3, points: 220 },
  { name: 'Gluttons', unitSize: 5, points: 200 },
  { name: 'Grell Firefist', unitSize: 1, points: 150 },
  { name: 'Gutseers', unitSize: 3, points: 200 },
  { name: 'Hunters with Sabrefangs', unitSize: 5, points: 160 },
  { name: 'Maulbeast Cavalry', unitSize: 2, points: 280 },
  { name: 'Maulbeast Raiders', unitSize: 2, points: 230 },
  { name: 'Morga the Mighty, Overtyrant', unitSize: 1, points: 430 },
  { name: 'Redd the Maw, High Slaughtermaster', unitSize: 1, points: 400 },
  { name: 'Tyrant on Glutthorn', unitSize: 1, points: 400 },
]

const reconciliation = JSON.parse(
  readFileSync(
    path.join(process.cwd(), 'data', 'aos4', 'reports', 'corpus-2026-08-01-reconciliation.json'),
    'utf8'
  )
) as ReconciliationReport

const ogor = AOS4_CATALOG.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Ogor Mawtribes'
)!

const ogorWarscrolls = AOS4_CATALOG.entities.filter(
  (entity): entity is Warscroll => entity.kind === 'warscroll' && entity.factionIds.includes(ogor.id)
)

describe('Ogor Mawtribes supplement units stay explicit profile-only facts (accepted 2026-08-01)', () => {
  it('tracks all ten supplement units and Lorai as profile-only official facts with exact points', () => {
    const profileOnlyByName = new Map(
      reconciliation.unmatchedOfficialUnitFacts.map(fact => [`${fact.faction}|${fact.name}`, fact])
    )
    OGOR_SUPPLEMENT_UNITS.forEach(unit => {
      const fact = profileOnlyByName.get(`Ogor Mawtribes|${unit.name}`)
      expect(fact).toBeDefined()
      expect(fact).toMatchObject({
        unitSize: unit.unitSize,
        points: unit.points,
      })
      expect(fact!.sourceRecordId).toMatch(/^source-record:games-workshop:/)
      expect(fact!.reason.trim()).not.toBe('')
    })
    const lorai = profileOnlyByName.get('Stormcast Eternals|Lorai, Child of the Abyss')
    expect(lorai).toBeDefined()
    expect(lorai).toMatchObject({ unitSize: 1 })
    // 10 Ogor units + Lorai + The Emberwatch (Legends) is the complete profile-only population.
    expect(reconciliation.unmatchedOfficialUnitFacts).toHaveLength(12)
  })

  it('does not invent warscrolls, abilities, or reminders for the supplement units', () => {
    const supplementNames = new Set(OGOR_SUPPLEMENT_UNITS.map(unit => unit.name))
    expect(
      AOS4_CATALOG.entities.filter(
        entity =>
          (entity.kind === 'warscroll' || entity.kind === 'ability') && supplementNames.has(entity.name)
      )
    ).toEqual([])
    expect(
      AOS4_CATALOG.entities.filter(
        entity => entity.kind === 'warscroll' && entity.name === 'Lorai, Child of the Abyss'
      )
    ).toEqual([])
  })

  it('keeps every previously shipped Ogor warscroll selectable with at least one reminder', () => {
    const byContext = (predicate: (context: (typeof AOS4_CATALOG.rulesContexts)[number]) => boolean) => {
      const context = AOS4_CATALOG.rulesContexts.find(predicate)!
      return ogorWarscrolls.filter(warscroll => warscroll.rulesContextIds.includes(context.id)).length
    }
    // The pre-supplement Ogor catalog: 47 current warscrolls (45 standard-context plus the two
    // seasonal Scourge of Aqshy variants), 9 Spearhead, 2 Legends, and 2 historical.
    expect(byContext(context => context.status === 'seasonal')).toBe(47)
    expect(byContext(context => context.mode === 'standard' && context.status === 'current')).toBe(45)
    expect(byContext(context => context.mode === 'spearhead')).toBe(9)
    expect(byContext(context => context.status === 'legends')).toBe(2)
    expect(byContext(context => context.status === 'historical')).toBe(2)

    const standard = AOS4_CATALOG.rulesContexts.find(
      context => context.mode === 'standard' && context.status === 'current'
    )!
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ogor.id],
      rulesContextId: standard.id,
      allowsLegends: true,
      allowsHistorical: true,
    })
    expect(selection.diagnostics).toEqual([])
    const available = new Set(selection.availableIds)
    const availableWarscrolls = ogorWarscrolls.filter(warscroll => available.has(warscroll.id))
    expect(availableWarscrolls).toHaveLength(49)
    availableWarscrolls.forEach(warscroll => {
      const withUnit = resolveSelection(AOS4_CATALOG, {
        explicitIds: [ogor.id, warscroll.id],
        rulesContextId: standard.id,
        allowsLegends: true,
        allowsHistorical: true,
      })
      const reminders = projectReminders(AOS4_CATALOG, withUnit).filter(reminder =>
        reminder.contributingEntityIds.includes(warscroll.id)
      )
      expect(reminders.length).toBeGreaterThan(0)
    })
  })
})
