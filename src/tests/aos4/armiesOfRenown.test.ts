import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * Armies of Renown are a top-level choice that replaces the faction's regular rules (issue #1834;
 * official rule: "use the faction rules on these pages instead of the [faction] rules"). The
 * reviewed classification types each army root `army-of-renown`, hangs its subgroups behind the
 * root, and emits `excludes` edges that suppress the faction's regular rules-choice groups while
 * a root is selected — fixing the stacking bug in #1833 where both battle-trait sets fired
 * reminders at once. Issue #1844 extended the classification beyond the 12 seasonal armies to
 * every battletome and White Dwarf (Legends) Army of Renown the source pages classify, on
 * official naming evidence where a free accepted document carries it and on the reviewed
 * secondary-provisional tier where none does.
 */

const OFFICIAL_ARMIES_OF_RENOWN: Array<{ faction: string; name: string }> = [
  { faction: 'Daughters of Khaine', name: 'The Croneseer’s Pariahs' },
  { faction: 'Fyreslayers', name: 'Lofnir Drothkeepers' },
  { faction: 'Kharadron Overlords', name: 'Grundstok Expeditionary Force' },
  { faction: 'Sylvaneth', name: 'The Evergreen Hunt' },
  { faction: 'Stormcast Eternals', name: 'Draconith Skywing' },
  { faction: 'Slaves to Darkness', name: 'The Swords of Chaos' },
  { faction: 'Slaves to Darkness', name: 'Tribes of the Snow Peaks' },
  { faction: 'Soulblight Gravelords', name: 'Scions of Nulahmia' },
  { faction: 'Gloomspite Gitz', name: 'Trugg’s Troggherd' },
  { faction: 'Ogor Mawtribes', name: 'The Roving Maw' },
  { faction: 'Ironjawz', name: 'Krazogg’s Grunta Stampede' },
  { faction: 'Sons of Behemat', name: 'King Brodd’s Stomp' },
]

// The battletome and White Dwarf Armies of Renown classified for issue #1844. `legends` marks the
// White Dwarf transcriptions, which decode in the Legends context.
const BATTLETOME_ARMIES_OF_RENOWN: Array<{ faction: string; name: string; legends?: true }> = [
  { faction: 'Blades of Khorne', name: 'Gorechosen Champions' },
  { faction: 'Blades of Khorne', name: 'The Baleful Lords' },
  { faction: 'Cities of Sigmar', name: 'Allies of the Free Cities' },
  { faction: 'Cities of Sigmar', name: 'The Duardin Ascendant', legends: true },
  { faction: 'Cities of Sigmar', name: 'The Iron March' },
  { faction: 'Daughters of Khaine', name: 'Champions of the Arena' },
  { faction: 'Daughters of Khaine', name: 'Zainthar Kai' },
  { faction: 'Disciples of Tzeentch', name: 'Change-Cult Uprising' },
  { faction: 'Disciples of Tzeentch', name: 'Pyrofane Cult', legends: true },
  { faction: 'Disciples of Tzeentch', name: 'The Oracles of Fate' },
  { faction: 'Flesh-eater Courts', name: 'The Equinox Feast' },
  { faction: 'Flesh-eater Courts', name: 'The Knights of New Summercourt' },
  { faction: 'Fyreslayers', name: 'The Duardin Ascendant', legends: true },
  { faction: 'Gloomspite Gitz', name: 'Da King’s Gitz' },
  { faction: 'Gloomspite Gitz', name: 'Droggz’s Gitmob' },
  { faction: 'Hedonites of Slaanesh', name: 'Court of the Godlings' },
  { faction: 'Hedonites of Slaanesh', name: 'The Decadent Host' },
  { faction: 'Helsmiths of Hashut', name: 'Taar’s Grand Forgehost' },
  { faction: 'Helsmiths of Hashut', name: 'Ziggurat Stampede' },
  { faction: 'Idoneth Deepkin', name: 'The First Phalanx of Ionrach' },
  { faction: 'Idoneth Deepkin', name: 'Wardens of the Chorrileum' },
  { faction: 'Ironjawz', name: 'Big Waaagh!' },
  { faction: 'Ironjawz', name: 'Ironsunz', legends: true },
  { faction: 'Ironjawz', name: 'Zoggrok’s Ironmongerz' },
  { faction: 'Kharadron Overlords', name: 'Pioneer Outpost' },
  { faction: 'Kharadron Overlords', name: 'The Duardin Ascendant', legends: true },
  { faction: 'Kharadron Overlords', name: 'The Magnate’s Crew' },
  { faction: 'Kruleboyz', name: 'Big Waaagh!' },
  { faction: 'Kruleboyz', name: 'Murkvast Menagerie' },
  { faction: 'Lumineth Realm-lords', name: 'Aelementiri Conclave' },
  { faction: 'Lumineth Realm-lords', name: 'Vanari Paragons' },
  { faction: 'Maggotkin of Nurgle', name: 'Cycle of Corruption' },
  { faction: 'Maggotkin of Nurgle', name: 'The Gardeners of Nurgle' },
  { faction: 'Nighthaunt', name: 'The Clattering Procession' },
  { faction: 'Nighthaunt', name: 'The Eternal Nightmare' },
  { faction: 'Ossiarch Bonereapers', name: 'Petrifex Elite', legends: true },
  { faction: 'Ossiarch Bonereapers', name: 'The Lance of Ossia' },
  { faction: 'Ossiarch Bonereapers', name: 'The Null Myriad' },
  { faction: 'Skaven', name: 'Thanquol’s Mutated Menagerie' },
  { faction: 'Skaven', name: 'The Great-Grand Gnawhorde' },
  { faction: 'Slaves to Darkness', name: 'Legion of the First Prince' },
  { faction: 'Soulblight Gravelords', name: 'Barrow Legion' },
  { faction: 'Soulblight Gravelords', name: 'Knights of the Crimson Keep' },
  { faction: 'Stormcast Eternals', name: 'Astral Templars', legends: true },
  { faction: 'Stormcast Eternals', name: 'Heroes of the First-Forged' },
  { faction: 'Stormcast Eternals', name: 'Ruination Brotherhood' },
  { faction: 'Sylvaneth', name: 'Lords of the Clan' },
  { faction: 'Sylvaneth', name: 'Soulpod Guardians' },
]

const ALL_ARMIES_OF_RENOWN: Array<{ faction: string; name: string; legends?: true }> = [
  ...OFFICIAL_ARMIES_OF_RENOWN,
  ...BATTLETOME_ARMIES_OF_RENOWN,
]

const REPLACED_GROUP_TYPES = new Set([
  'battle-trait',
  'battle-formation',
  'heroic-trait',
  'artefact-of-power',
  'spell-lore',
  'prayer-lore',
  'monstrous-traits',
  'big-names',
])

const standard = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const factionByName = (name: string): Faction =>
  AOS4_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!
const groupById = new Map(
  AOS4_CATALOG.entities.flatMap(entity =>
    entity.kind === 'content-group' ? [[entity.id, entity as ContentGroup] as const] : []
  )
)
const armyOfRenownRoots = AOS4_CATALOG.entities.filter(
  (entity): entity is ContentGroup =>
    entity.kind === 'content-group' && entity.groupType === 'army-of-renown'
)
describe('Armies of Renown as a top-level replacing choice', () => {
  it('classifies every source-classified Army of Renown with reviewed evidence', () => {
    expect(armyOfRenownRoots.map(root => root.name).sort()).toEqual(
      ALL_ARMIES_OF_RENOWN.map(entry => entry.name).sort()
    )
    const review = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-08-02.json'), 'utf8')
    ) as {
      armiesOfRenown: Array<{
        officialSourceRecordIds: string[]
        reason: string
        evidenceTier?: string
      }>
    }
    expect(review.armiesOfRenown).toHaveLength(ALL_ARMIES_OF_RENOWN.length)
    review.armiesOfRenown.forEach(entry => {
      expect(entry.reason).toMatch(/Arm(y|ies) of Renown/)
      if (entry.evidenceTier === undefined) {
        // The official tier must cite official naming evidence.
        expect(entry.officialSourceRecordIds.length).toBeGreaterThan(0)
      } else {
        // The only other tier is the reviewed secondary-provisional classification, which must
        // state the policy basis; official records remain optional corroboration.
        expect(entry.evidenceTier).toBe('secondary-provisional')
        expect(entry.reason).toMatch(/three-tier source policy/)
      }
    })
    expect(review.armiesOfRenown.filter(entry => entry.evidenceTier === undefined)).toHaveLength(24)
  })

  it('offers each faction exactly its own Armies of Renown', () => {
    const factionNameById = new Map(
      AOS4_CATALOG.entities.flatMap(entity => (entity.kind === 'faction' ? [[entity.id, entity.name]] : []))
    )
    const offeredByFaction = new Map<string, string[]>()
    AOS4_CATALOG.relationships
      .filter(relationship => relationship.kind === 'offers')
      .forEach(relationship => {
        const faction = factionNameById.get(relationship.from as never)
        const root = armyOfRenownRoots.find(candidate => candidate.id === relationship.to)
        if (!faction || !root) return
        offeredByFaction.set(faction, [...(offeredByFaction.get(faction) ?? []), root.name])
      })
    const expectedByFaction = new Map<string, string[]>()
    ALL_ARMIES_OF_RENOWN.forEach(({ faction, name }) => {
      expectedByFaction.set(faction, [...(expectedByFaction.get(faction) ?? []), name])
    })
    expectedByFaction.forEach((names, faction) => {
      expect(offeredByFaction.get(faction)?.sort() ?? []).toEqual(names.sort())
    })
    // No faction offers an Army of Renown beyond its expected set.
    offeredByFaction.forEach((names, faction) => {
      expect(expectedByFaction.get(faction)?.sort() ?? []).toEqual(names.sort())
    })
  })

  it('replaces the regular Ogor rules while The Roving Maw is selected (#1833)', () => {
    const ogor = factionByName('Ogor Mawtribes')
    const roving = armyOfRenownRoots.find(root => root.name === 'The Roving Maw')!

    const regular = resolveSelection(AOS4_CATALOG, { explicitIds: [ogor.id], rulesContextId: standard.id })
    const regularReminders = projectReminders(AOS4_CATALOG, regular).map(reminder => reminder.name)
    expect(regularReminders).toContain('Bull Charge')
    expect(regular.availableIds).toContain(roving.id)
    expect(regular.diagnostics).toEqual([])

    const renown = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ogor.id, roving.id],
      rulesContextId: standard.id,
    })
    expect(renown.diagnostics).toEqual([])
    const renownReminders = projectReminders(AOS4_CATALOG, renown).map(reminder => reminder.name)
    // The army's own battle traits apply automatically…
    expect(renownReminders).toContain('DRIVEN BY STARVATION')
    // …and never stack with the regular set it replaces.
    expect(renownReminders).not.toContain('Bull Charge')
    expect(renownReminders).not.toContain("Eat 'Em Alive")
    expect(renownReminders.filter(name => name === 'TRAMPLING CHARGE')).toHaveLength(1)

    // Deselecting restores the regular army exactly.
    const restored = resolveSelection(AOS4_CATALOG, { explicitIds: [ogor.id], rulesContextId: standard.id })
    expect(restored.selectedIds).toEqual(regular.selectedIds)
    expect(restored.availableIds).toEqual(regular.availableIds)
  })

  it.each(ALL_ARMIES_OF_RENOWN)(
    'suppresses every regular rules-choice group of $faction while $name is active',
    ({ faction, name, legends }) => {
      const factionEntity = factionByName(faction)
      // Resolve the root through the faction's own offer: names repeat across factions
      // (Big Waaagh!, The Duardin Ascendant), so a name lookup alone is ambiguous.
      const offeredRootIds = new Set(
        AOS4_CATALOG.relationships
          .filter(relationship => relationship.kind === 'offers' && relationship.from === factionEntity.id)
          .map(relationship => relationship.to)
      )
      const root = armyOfRenownRoots.find(
        candidate => candidate.name === name && offeredRootIds.has(candidate.id)
      )!
      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: [factionEntity.id, root.id],
        rulesContextId: standard.id,
        ...(legends ? { allowsLegends: true } : {}),
      })
      expect(selection.diagnostics).toEqual([])
      // Nothing with a replaced group type is offered, and the only selected groups carrying one
      // are the army's own granted sections (they keep their real rules category and the army's
      // qualified name).
      const offendingAvailable = selection.availableIds.flatMap(id => {
        const group = groupById.get(id as never)
        if (!group || !REPLACED_GROUP_TYPES.has(group.groupType)) return []
        return [`${group.groupType}:${group.name}`]
      })
      expect(offendingAvailable).toEqual([])
      const grantedByRoot = new Set(
        AOS4_CATALOG.relationships
          .filter(relationship => relationship.kind === 'includes' && relationship.from === root.id)
          .map(relationship => relationship.to)
      )
      const selectedReplacedTypes = selection.selectedIds.flatMap(id => {
        const group = groupById.get(id as never)
        if (!group || !REPLACED_GROUP_TYPES.has(group.groupType)) return []
        return [id]
      })
      selectedReplacedTypes.forEach(id => expect(grantedByRoot.has(id)).toBe(true))
      // Universal manifestation lores remain.
      const availableGroups = selection.availableIds.flatMap(id => {
        const group = groupById.get(id as never)
        return group ? [group.groupType] : []
      })
      expect(availableGroups).toContain('manifestation-lore')
    }
  )

  it('grants The Roving Maw content as selected chips in the standard category cards', () => {
    const ogor = factionByName('Ogor Mawtribes')
    const roving = armyOfRenownRoots.find(root => root.name === 'The Roving Maw')!
    const builder = createAos4BuilderViewModel(AOS4_CATALOG, {
      id: 'test',
      name: 'test',
      rulesContextId: standard.id,
      explicitSelectionIds: [ogor.id, roving.id],
      reminderPreferences: {},
    } as never)
    const chips = (category: string) =>
      builder.options
        .filter(option => option.groupType === category && option.selected)
        .map(option => option.name)
        .sort()
    expect(chips('heroic-trait')).toEqual(['Prime Gutserver'])
    expect(chips('artefact-of-power')).toEqual(['Flasks of Congealed Maw-Juices'])
    expect(chips('spell-lore')).toEqual(['Mawmeat', 'Retcher'])
    // Battle traits populate the reminders only, never a category card.
    expect(builder.options.filter(option => option.groupType === 'battle-trait')).toEqual([])
    const reminders = projectReminders(
      AOS4_CATALOG,
      resolveSelection(AOS4_CATALOG, { explicitIds: [ogor.id, roving.id], rulesContextId: standard.id })
    ).map(reminder => reminder.name)
    ;['DRIVEN BY STARVATION', 'TASTY MORSELS', 'THE REALM HUNGERS', 'MAWPITS OF GHUR'].forEach(trait =>
      expect(reminders).toContain(trait)
    )
    ;['PRIME GUTSERVER', 'FLASKS OF CONGEALED MAW-JUICES', 'MAWMEAT', 'RETCHER'].forEach(granted =>
      expect(reminders).toContain(granted)
    )
  })

  it('keeps a faction without an Army of Renown untouched', () => {
    const seraphon = factionByName('Seraphon')
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [seraphon.id],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
    const offered = selection.availableIds.flatMap(id => {
      const group = groupById.get(id as never)
      return group?.groupType === 'army-of-renown' ? [group.name] : []
    })
    expect(offered).toEqual([])
    expect(
      projectReminders(AOS4_CATALOG, selection).map(reminder => reminder.name).length
    ).toBeGreaterThan(0)
  })

  it('diagnoses an explicit selection of replaced content instead of silently dropping it', () => {
    const ogor = factionByName('Ogor Mawtribes')
    const roving = armyOfRenownRoots.find(root => root.name === 'The Roving Maw')!
    const regularFormation = AOS4_CATALOG.entities.find(
      (entity): entity is ContentGroup =>
        entity.kind === 'content-group' &&
        entity.groupType === 'battle-formation' &&
        entity.name === 'Hunger-filled Tribe'
    )!
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ogor.id, roving.id, regularFormation.id],
      rulesContextId: standard.id,
    })
    // The explicit pick stays selected, and the illegal combination surfaces for review.
    expect(selection.selectedIds).toContain(regularFormation.id)
    expect(selection.diagnostics.some(diagnostic => diagnostic.code === 'excluded-selection')).toBe(true)
  })
})
