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
 * reviewed classification types the 12 official army roots `army-of-renown`, hangs their
 * subgroups behind the root, and emits `excludes` edges that suppress the faction's regular
 * rules-choice groups while a root is selected — fixing the stacking bug in #1833 where both
 * battle-trait sets fired reminders at once.
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
  it('classifies exactly the 12 official Armies of Renown with official evidence', () => {
    expect(armyOfRenownRoots.map(root => root.name).sort()).toEqual(
      OFFICIAL_ARMIES_OF_RENOWN.map(entry => entry.name).sort()
    )
    armyOfRenownRoots.forEach(root => {
      expect(
        root.sourceRefs.some(reference =>
          String(reference.sourceRecordId).startsWith('source-record:games-workshop:')
        )
      ).toBe(true)
    })
    const review = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-08-01e.json'), 'utf8')
    ) as { armiesOfRenown: Array<{ officialSourceRecordIds: string[]; reason: string }> }
    expect(review.armiesOfRenown).toHaveLength(12)
    review.armiesOfRenown.forEach(entry => {
      expect(entry.reason).toMatch(/Armies of Renown/)
      expect(entry.officialSourceRecordIds.length).toBeGreaterThan(0)
    })
  })

  it.each(OFFICIAL_ARMIES_OF_RENOWN)('offers $name only through the $faction faction', ({ faction, name }) => {
    const root = armyOfRenownRoots.find(candidate => candidate.name === name)!
    const offeringFactions = AOS4_CATALOG.relationships
      .filter(relationship => relationship.kind === 'offers' && relationship.to === root.id)
      .flatMap(relationship => {
        const entity = AOS4_CATALOG.entities.find(candidate => candidate.id === relationship.from)
        return entity?.kind === 'faction' ? [entity.name] : []
      })
    expect(offeringFactions).toEqual([faction])
  })

  it('replaces the regular Ogor rules while The Roving Maw is selected (#1833)', () => {
    const ogor = factionByName('Ogor Mawtribes')
    const roving = armyOfRenownRoots.find(root => root.name === 'The Roving Maw')!

    const regular = resolveSelection(AOS4_CATALOG, { explicitIds: [ogor.id], rulesContextId: standard.id })
    const regularReminders = projectReminders(AOS4_CATALOG, regular).map(reminder => reminder.name)
    expect(regularReminders).toContain('RAVENOUS BRUTES')
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
    expect(renownReminders).not.toContain('RAVENOUS BRUTES')
    expect(renownReminders).not.toContain('FEAST ON FLESH')
    expect(renownReminders.filter(name => name === 'TRAMPLING CHARGE')).toHaveLength(1)

    // Deselecting restores the regular army exactly.
    const restored = resolveSelection(AOS4_CATALOG, { explicitIds: [ogor.id], rulesContextId: standard.id })
    expect(restored.selectedIds).toEqual(regular.selectedIds)
    expect(restored.availableIds).toEqual(regular.availableIds)
  })

  it.each(OFFICIAL_ARMIES_OF_RENOWN)(
    'suppresses every regular rules-choice group of $faction while $name is active',
    ({ faction, name }) => {
      const factionEntity = factionByName(faction)
      const root = armyOfRenownRoots.find(candidate => candidate.name === name)!
      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: [factionEntity.id, root.id],
        rulesContextId: standard.id,
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
    const skaven = factionByName('Skaven')
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [skaven.id],
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
