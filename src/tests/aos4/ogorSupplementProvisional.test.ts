import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { BattleProfile, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import type { Aos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * The July 2026 Ogor Mawtribes battletome added ten units and rewrote the legacy warscrolls.
 * Their existence, points, unit sizes, bases, and roster notes are established by accepted
 * official Battle Profiles documents; from 2026-08-01b to 2026-08-28 their rules text shipped
 * provisionally from commit-pinned BSData transcriptions (issues #1812/#1850/#1880).
 *
 * On 2026-08-28 Wahapedia published the battletome-current pages, and the 2026-08-28b revision
 * completed the provisional-to-verified swap the watch entries promised: the re-pinned Ogor
 * faction and warscroll-collection pages now supply every rule, the three BSData catalogues and
 * their community source entries are retired, and official facts still win every overlapping
 * field. Identity continuity held where it matters: the supplement units keep their canonical
 * ids, and Gluttons keeps the identity it adopted from the renamed "Ogor Gluttons" datasheet.
 *
 * Lorai, Child of the Abyss demonstrated the same swap at unit scale in `2026-08-01d`
 * (Wahapedia published her datasheet; a reviewed cross-faction adoption replaced the BSData
 * transcription). This file pins the faction-scale outcome.
 */

interface ReconciliationReport {
  unmatchedOfficialUnitFacts: Array<{ faction: string; name: string }>
}

const OGOR_SUPPLEMENT_UNITS: Array<{ name: string; unitSize: number; points: number; reminders: number }> = [
  { name: 'Cleavers', unitSize: 3, points: 220, reminders: 1 },
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
    path.join(process.cwd(), 'data', 'aos4', 'reports', 'corpus-2026-08-28b-reconciliation.json'),
    'utf8'
  )
) as ReconciliationReport

const standard = AOS4_FULL_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const artifactById = new Map(AOS4_FULL_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const recordById = new Map(AOS4_FULL_CATALOG.sourceRecords.map(record => [record.id, record]))

const factionByName = (name: string): Faction =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!

const warscrollFor = (faction: Faction, name: string): Warscroll | undefined =>
  AOS4_FULL_CATALOG.entities.find(
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

const hasWahapediaSource = (warscroll: Warscroll): boolean =>
  warscroll.sourceRefs.some(reference =>
    String(reference.sourceRecordId).startsWith('source-record:wahapedia:')
  )

describe('Ogor battletome units ship from the verified Wahapedia pages (2026-08-28b swap)', () => {
  const ogor = factionByName('Ogor Mawtribes')

  it.each(OGOR_SUPPLEMENT_UNITS)(
    'resolves $name with official points and at least one reminder',
    ({ name, unitSize, points, reminders }) => {
      const warscroll = warscrollFor(ogor, name)
      expect(warscroll).toBeDefined()
      const profile = AOS4_FULL_CATALOG.entities.find(
        (entity): entity is BattleProfile =>
          entity.kind === 'battle-profile' && entity.warscrollId === warscroll!.id
      )
      // Official Battle Profiles supplement values win every conflict.
      expect(profile).toMatchObject({ unitSize, points })

      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [ogor.id, warscroll!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
      expect(selection.availableIds).toContain(warscroll!.id)

      const builder = createAos4BuilderViewModel(AOS4_FULL_CATALOG, documentFor(ogor, warscroll!))
      expect(builder.options.some(option => option.id === warscroll!.id && !option.overlay)).toBe(true)
      expect(builder.warscrolls.some(card => card.id === warscroll!.id)).toBe(true)

      const unitReminders = projectReminders(AOS4_FULL_CATALOG, selection).filter(reminder =>
        reminder.contributingEntityIds.includes(warscroll!.id)
      )
      expect(unitReminders.length).toBe(reminders)
      expect(unitReminders.length).toBeGreaterThan(0)

      // The provisional-to-verified swap completed: the rules come from the Wahapedia
      // secondary source and no community attribution remains.
      expect(hasProvisionalCommunityAttribution(warscroll!)).toBe(false)
      expect(hasWahapediaSource(warscroll!)).toBe(true)
    }
  )

  it('resolves Lorai, Child of the Abyss from Wahapedia via the reviewed cross-faction adoption', () => {
    const stormcast = factionByName('Stormcast Eternals')
    const lorai = warscrollFor(stormcast, 'Lorai, Child of the Abyss')
    expect(lorai).toBeDefined()
    const profile = AOS4_FULL_CATALOG.entities.find(
      (entity): entity is BattleProfile =>
        entity.kind === 'battle-profile' && entity.warscrollId === lorai!.id
    )
    expect(profile).toMatchObject({ unitSize: 1, points: 0 })
    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [stormcast.id, lorai!.id],
      rulesContextId: standard.id,
    })
    expect(selection.availableIds).toContain(lorai!.id)
    const reminders = projectReminders(AOS4_FULL_CATALOG, selection).filter(reminder =>
      reminder.contributingEntityIds.includes(lorai!.id)
    )
    expect(reminders.map(reminder => reminder.name).sort()).toEqual(['AQUATIC ILLUSIONS', 'NEBULOUS SEA-FOG'])
    // The provisional swap completed: her rules now come from the Wahapedia secondary source.
    expect(hasProvisionalCommunityAttribution(lorai!)).toBe(false)
    expect(
      lorai!.sourceRefs.some(reference =>
        String(reference.sourceRecordId).startsWith('source-record:wahapedia:')
      )
    ).toBe(true)
  })

  it('keeps The Emberwatch as the only remaining profile-only official fact', () => {
    expect(reconciliation.unmatchedOfficialUnitFacts).toEqual([
      expect.objectContaining({ faction: 'Warhammer Legends', name: 'The Emberwatch' }),
    ])
  })

  it('serves a single Gluttons warscroll under the renamed datasheet identity (#1880)', () => {
    const gluttons = warscrollFor(ogor, 'Gluttons')
    expect(gluttons).toBeDefined()
    // Identity continuity: the battletome renamed "Ogor Gluttons" to "Gluttons", and the
    // community replacement adopts the replaced datasheet's canonical identity.
    expect(gluttons!.id).toBe('warscroll:1475b0a4-496b-52c8-8e16-c43d36ab04ce')
    // The index-era duplicate is gone from the current contexts; only Spearhead keeps its own.
    const stale = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is Warscroll => entity.kind === 'warscroll' && entity.name === 'Ogor Gluttons'
    )
    const spearhead = AOS4_FULL_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!
    expect(stale).toHaveLength(1)
    expect(stale[0].rulesContextIds).toEqual([spearhead.id])
    // One battle profile at the official 200 points; the stale 220-point profile is gone.
    const profiles = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is BattleProfile =>
        entity.kind === 'battle-profile' && entity.warscrollId === gluttons!.id
    )
    expect(profiles).toHaveLength(1)
    expect(profiles[0]).toMatchObject({ unitSize: 5, points: 200 })
    expect(hasProvisionalCommunityAttribution(gluttons!)).toBe(false)
    expect(hasWahapediaSource(gluttons!)).toBe(true)
  })

  it('serves the rewritten Mawpit and Great Mawpot terrain from the battletome (#1880)', () => {
    const mawpit = warscrollFor(ogor, 'Mawpit')
    expect(mawpit).toBeDefined()
    expect(mawpit!.id).toBe('warscroll:ab235210-cb06-59b2-908d-a718aa06c7bc')
    expect(mawpit!.characteristics).toMatchObject({ health: '12', save: '4+' })
    const mawpitSelection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [ogor.id, mawpit!.id],
      rulesContextId: standard.id,
    })
    expect(mawpitSelection.diagnostics).toEqual([])
    const mawpitReminders = projectReminders(AOS4_FULL_CATALOG, mawpitSelection).filter(reminder =>
      reminder.contributingEntityIds.includes(mawpit!.id)
    )
    // The battletome abilities; the index-era signature Throat of Ghur is gone.
    expect(mawpitReminders.map(reminder => reminder.name).sort()).toEqual(
      ['FEED THE MAW', 'HUNGRY SINKHOLE', 'STEP AWAY FROM THE MAW'].sort()
    )
    const mawpitProfile = AOS4_FULL_CATALOG.entities.find(
      (entity): entity is BattleProfile =>
        entity.kind === 'battle-profile' && entity.warscrollId === mawpit!.id
    )
    expect(mawpitProfile).toMatchObject({ unitSize: 1, points: 0 })
    expect(hasProvisionalCommunityAttribution(mawpit!)).toBe(false)
    expect(hasWahapediaSource(mawpit!)).toBe(true)

    const greatMawpot = warscrollFor(ogor, 'Great Mawpot')
    expect(greatMawpot).toBeDefined()
    expect(greatMawpot!.id).toBe('warscroll:aaa16379-693e-5112-8b28-a64ba2d9762f')
    // The official roster-option fact establishes the terrain at 20 points; the index sheet
    // served 0.
    const mawpotProfile = AOS4_FULL_CATALOG.entities.find(
      (entity): entity is BattleProfile =>
        entity.kind === 'battle-profile' && entity.warscrollId === greatMawpot!.id
    )
    expect(mawpotProfile).toMatchObject({ unitSize: 1, points: 20 })
    expect(hasProvisionalCommunityAttribution(greatMawpot!)).toBe(false)
    expect(hasWahapediaSource(greatMawpot!)).toBe(true)
  })

  it('keeps the Scourge of Aqshy variants on Wahapedia text that already matches the battletome (#1850)', () => {
    /**
     * The July 2026 battletome did not rewrite the seasonal battlepack variants: verified
     * 2026-08-03 against the commit-pinned BSData Ogor library (publication-pinned to the
     * battletome) — characteristics, keywords, weapons, and ability texts are identical, so
     * these two keep their preferred-secondary Wahapedia source with no provisional facts.
     */
    const seasonal = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
    const cases = [
      {
        name: 'Scourge of Aqshy Frostlord on Thundertusk',
        points: 280,
        abilities: ['BATTLE DAMAGED', 'COLD FURY', 'SNOW PLOUGH'],
      },
      {
        name: 'Scourge of Aqshy Huskard on Thundertusk',
        points: 260,
        abilities: ['BATTLE DAMAGED', 'COOL TEMPERS', 'EVERWINTER’S IRE'],
      },
    ]
    for (const { name, points, abilities } of cases) {
      const warscroll = warscrollFor(ogor, name)
      expect(warscroll).toBeDefined()
      const profile = AOS4_FULL_CATALOG.entities.find(
        (entity): entity is BattleProfile =>
          entity.kind === 'battle-profile' && entity.warscrollId === warscroll!.id
      )
      expect(profile).toMatchObject({ unitSize: 1, points })
      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [ogor.id, warscroll!.id],
        rulesContextId: seasonal.id,
      })
      expect(selection.diagnostics).toEqual([])
      const reminders = projectReminders(AOS4_FULL_CATALOG, selection).filter(reminder =>
        reminder.contributingEntityIds.includes(warscroll!.id)
      )
      expect(reminders.map(reminder => reminder.name).sort()).toEqual([...abilities].sort())
      expect(hasProvisionalCommunityAttribution(warscroll!)).toBe(false)
    }
  })

  it('keeps every pre-supplement Ogor warscroll selectable with at least one reminder', () => {
    const ogorWarscrolls = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is Warscroll => entity.kind === 'warscroll' && entity.factionIds.includes(ogor.id)
    )
    const byContext = (predicate: (context: (typeof AOS4_FULL_CATALOG.rulesContexts)[number]) => boolean) => {
      const context = AOS4_FULL_CATALOG.rulesContexts.find(predicate)!
      return ogorWarscrolls.filter(warscroll => warscroll.rulesContextIds.includes(context.id)).length
    }
    // 44 pre-supplement standard warscrolls + 9 supplement units + the renamed Gluttons
    // replacement; the two seasonal Scourge of Aqshy variants complete the 56 current
    // warscrolls. The index-era "Ogor Gluttons" datasheet left the current contexts (#1880),
    // and the counts survived the 2026-08-28b swap to the Wahapedia battletome pages intact.
    expect(byContext(context => context.mode === 'standard' && context.status === 'current')).toBe(54)
    expect(byContext(context => context.status === 'seasonal')).toBe(56)
    expect(byContext(context => context.mode === 'spearhead')).toBe(9)
    expect(byContext(context => context.status === 'legends')).toBe(2)
    expect(byContext(context => context.status === 'historical')).toBe(2)

    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [ogor.id],
      rulesContextId: standard.id,
      allowsLegends: true,
      allowsHistorical: true,
    })
    expect(selection.diagnostics).toEqual([])
    const available = new Set(selection.availableIds)
    const availableWarscrolls = ogorWarscrolls.filter(warscroll => available.has(warscroll.id))
    expect(availableWarscrolls).toHaveLength(58)
    availableWarscrolls.forEach(warscroll => {
      const withUnit = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [ogor.id, warscroll.id],
        rulesContextId: standard.id,
        allowsLegends: true,
        allowsHistorical: true,
      })
      const reminders = projectReminders(AOS4_FULL_CATALOG, withUnit).filter(reminder =>
        reminder.contributingEntityIds.includes(warscroll.id)
      )
      expect(reminders.length).toBeGreaterThan(0)
    })
  })
})
