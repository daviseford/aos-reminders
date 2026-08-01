import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { BattleProfile, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import type { Aos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * The July 2026 Ogor Mawtribes battletome adds ten new units, and Lorai, Child of the Abyss joined
 * the Stormcast Eternals through The Blacktalons. Their existence, points, unit sizes, bases, and
 * roster notes are established by accepted official Battle Profiles documents, but neither
 * Wahapedia nor any accepted official document publishes their warscroll rules yet.
 *
 * Under the standing fallback-tier source policy (official Games Workshop publications are
 * authoritative, Wahapedia is the preferred secondary, BSData is an acceptable fallback only while
 * an official publication establishes the content and Wahapedia does not yet carry the rules),
 * the accepted `corpus-2026-08-01c` review admits the commit-pinned BSData `ogors`-branch
 * transcriptions of exactly these eleven units as provisional community facts. Official facts win
 * every overlapping field, and the provisional status stays visible through source attribution.
 *
 * When Wahapedia (or an owner-supplied official source) publishes the warscrolls, the standard
 * candidate intake replaces these provisional facts and this test's expectations must move with
 * that acceptance.
 */

interface ReconciliationReport {
  unmatchedOfficialUnitFacts: Array<{ faction: string; name: string }>
}

const OGOR_SUPPLEMENT_UNITS: Array<{ name: string; unitSize: number; points: number; reminders: number }> = [
  { name: 'Cleavers', unitSize: 3, points: 220, reminders: 1 },
  { name: 'Gluttons', unitSize: 5, points: 200, reminders: 1 },
  { name: 'Grell Firefist', unitSize: 1, points: 150, reminders: 3 },
  { name: 'Gutseers', unitSize: 3, points: 200, reminders: 2 },
  { name: 'Hunters with Sabrefangs', unitSize: 5, points: 160, reminders: 2 },
  { name: 'Maulbeast Cavalry', unitSize: 2, points: 280, reminders: 2 },
  { name: 'Maulbeast Raiders', unitSize: 2, points: 230, reminders: 1 },
  { name: 'Morga the Mighty, Overtyrant', unitSize: 1, points: 430, reminders: 5 },
  { name: 'Redd the Maw, High Slaughtermaster', unitSize: 1, points: 400, reminders: 4 },
  { name: 'Tyrant on Glutthorn', unitSize: 1, points: 400, reminders: 3 },
]

const reconciliation = JSON.parse(
  readFileSync(
    path.join(process.cwd(), 'data', 'aos4', 'reports', 'corpus-2026-08-01c-reconciliation.json'),
    'utf8'
  )
) as ReconciliationReport

const standard = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const artifactById = new Map(AOS4_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const recordById = new Map(AOS4_CATALOG.sourceRecords.map(record => [record.id, record]))

const factionByName = (name: string): Faction =>
  AOS4_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!

const warscrollFor = (faction: Faction, name: string): Warscroll | undefined =>
  AOS4_CATALOG.entities.find(
    (entity): entity is Warscroll =>
      entity.kind === 'warscroll' && entity.name === name && entity.factionIds.includes(faction.id)
  )

const documentFor = (faction: Faction, warscroll: Warscroll): Aos4ArmyDocument =>
  ({
    id: 'test',
    name: 'test',
    rulesContextId: standard.id,
    explicitSelectionIds: [faction.id, warscroll.id],
    reminderPreferences: {},
  }) as never

const hasProvisionalCommunityAttribution = (warscroll: Warscroll): boolean =>
  warscroll.sourceRefs.some(reference => {
    const record = recordById.get(reference.sourceRecordId)
    const artifact = record && artifactById.get(record.artifactId)
    return (
      artifact?.authority.kind === 'community' &&
      artifact.publisher === 'other' &&
      /provisional/i.test(artifact.title)
    )
  })

describe('Ogor supplement units ship provisionally from BSData under the fallback-tier policy', () => {
  const ogor = factionByName('Ogor Mawtribes')

  it.each(OGOR_SUPPLEMENT_UNITS)(
    'resolves $name with official points and at least one reminder',
    ({ name, unitSize, points, reminders }) => {
      const warscroll = warscrollFor(ogor, name)
      expect(warscroll).toBeDefined()
      const profile = AOS4_CATALOG.entities.find(
        (entity): entity is BattleProfile =>
          entity.kind === 'battle-profile' && entity.warscrollId === warscroll!.id
      )
      // Official Battle Profiles supplement values win every conflict.
      expect(profile).toMatchObject({ unitSize, points })

      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: [ogor.id, warscroll!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
      expect(selection.availableIds).toContain(warscroll!.id)

      const builder = createAos4BuilderViewModel(AOS4_CATALOG, documentFor(ogor, warscroll!))
      expect(builder.options.some(option => option.id === warscroll!.id && !option.overlay)).toBe(true)
      expect(builder.warscrolls.some(card => card.id === warscroll!.id)).toBe(true)

      const unitReminders = projectReminders(AOS4_CATALOG, selection).filter(reminder =>
        reminder.contributingEntityIds.includes(warscroll!.id)
      )
      expect(unitReminders.length).toBe(reminders)
      expect(unitReminders.length).toBeGreaterThan(0)

      // The provisional community source stays visible through the reminder source links.
      expect(hasProvisionalCommunityAttribution(warscroll!)).toBe(true)
    }
  )

  it('resolves Lorai, Child of the Abyss for the Stormcast Eternals with her official profile', () => {
    const stormcast = factionByName('Stormcast Eternals')
    const lorai = warscrollFor(stormcast, 'Lorai, Child of the Abyss')
    expect(lorai).toBeDefined()
    const profile = AOS4_CATALOG.entities.find(
      (entity): entity is BattleProfile =>
        entity.kind === 'battle-profile' && entity.warscrollId === lorai!.id
    )
    expect(profile).toMatchObject({ unitSize: 1, points: 0 })
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [stormcast.id, lorai!.id],
      rulesContextId: standard.id,
    })
    expect(selection.availableIds).toContain(lorai!.id)
    const reminders = projectReminders(AOS4_CATALOG, selection).filter(reminder =>
      reminder.contributingEntityIds.includes(lorai!.id)
    )
    expect(reminders.map(reminder => reminder.name).sort()).toEqual(['Aquatic Illusions', 'Nebulous Sea-fog'])
    expect(hasProvisionalCommunityAttribution(lorai!)).toBe(true)
  })

  it('keeps The Emberwatch as the only remaining profile-only official fact', () => {
    expect(reconciliation.unmatchedOfficialUnitFacts).toEqual([
      expect.objectContaining({ faction: 'Warhammer Legends', name: 'The Emberwatch' }),
    ])
  })

  it('keeps every pre-supplement Ogor warscroll selectable with at least one reminder', () => {
    const ogorWarscrolls = AOS4_CATALOG.entities.filter(
      (entity): entity is Warscroll => entity.kind === 'warscroll' && entity.factionIds.includes(ogor.id)
    )
    const byContext = (predicate: (context: (typeof AOS4_CATALOG.rulesContexts)[number]) => boolean) => {
      const context = AOS4_CATALOG.rulesContexts.find(predicate)!
      return ogorWarscrolls.filter(warscroll => warscroll.rulesContextIds.includes(context.id)).length
    }
    // 45 pre-supplement standard warscrolls + 10 provisional supplement units; the two seasonal
    // Scourge of Aqshy variants complete the 57 current warscrolls.
    expect(byContext(context => context.mode === 'standard' && context.status === 'current')).toBe(55)
    expect(byContext(context => context.status === 'seasonal')).toBe(57)
    expect(byContext(context => context.mode === 'spearhead')).toBe(9)
    expect(byContext(context => context.status === 'legends')).toBe(2)
    expect(byContext(context => context.status === 'historical')).toBe(2)

    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ogor.id],
      rulesContextId: standard.id,
      allowsLegends: true,
      allowsHistorical: true,
    })
    expect(selection.diagnostics).toEqual([])
    const available = new Set(selection.availableIds)
    const availableWarscrolls = ogorWarscrolls.filter(warscroll => available.has(warscroll.id))
    expect(availableWarscrolls).toHaveLength(59)
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
