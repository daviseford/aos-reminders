import type { Ability, CanonicalId, ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { createAos4PrintDocument } from '../../aos4/print/document'
import { projectReminders } from '../../aos4/reminders'
import { deriveAos4OverlayFlags } from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  findAos4SeasonalRulesContexts,
  serializeAos4ArmyDocument,
  setAos4SeasonalRules,
  type Aos4ArmyDocument,
} from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderViewModel,
  reconcileAos4EnhancementPicks,
} from '../../aos4/view'
import { decodeAos4TextRoster } from '../../importers'
import { describe, expect, it } from 'vitest'

/**
 * Issue #2083: a hand-built army could pick only a whole artefact or heroic-trait table, so one
 * artefact for one hero put the whole table on the reminders and in the PDF. The Artefacts of
 * Power and Heroic Traits cards now offer each member of every available table; a table shows
 * only while an existing army still holds it, and picking a member replaces it.
 */

const { seasonal, current } = findAos4SeasonalRulesContexts(AOS4_CATALOG)
if (!seasonal || !current) throw new Error('The catalog is missing a standard-mode context')

const entityById = new Map(AOS4_CATALOG.entities.map(entity => [entity.id, entity]))
const named = <T>(kind: string, name: string, rulesContextIds?: string[]): T => {
  const entity = AOS4_CATALOG.entities.find(
    candidate =>
      candidate.kind === kind &&
      candidate.name === name &&
      (!rulesContextIds ||
        (candidate.rulesContextIds.length === rulesContextIds.length &&
          rulesContextIds.every(id => candidate.rulesContextIds.includes(id as never))))
  )
  if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
  return entity as T
}
const membersOf = (group: ContentGroup): CanonicalId[] =>
  AOS4_CATALOG.relationships
    .filter(relationship => relationship.kind === 'includes' && relationship.from === group.id)
    .map(relationship => relationship.to)

const stormcast = named<Faction>('faction', 'Stormcast Eternals')
const tempest = AOS4_CATALOG.entities.find(
  entity =>
    entity.kind === 'content-group' &&
    entity.name === 'Artefacts of the Tempest' &&
    entity.rulesContextIds.includes(current.id)
) as ContentGroup
const seasonalTempest = AOS4_CATALOG.entities.find(
  entity =>
    entity.kind === 'content-group' &&
    entity.name === 'Artefacts of the Tempest' &&
    !entity.rulesContextIds.includes(current.id)
) as ContentGroup
const aspects = named<ContentGroup>('content-group', 'Aspects of Azyr')
const relics = named<ContentGroup>('content-group', 'Relics of Sigmaron')
const loreOfTheStorm = named<ContentGroup>('content-group', 'Lore of the Storm')
const blade = named<Ability>('ability', 'BLADE OF THE SIX SMITHS')
const mirrorshield = named<Ability>('ability', 'MIRRORSHIELD')
const staunchDefender = named<Ability>('ability', 'STAUNCH DEFENDER')
const neave = named<Warscroll>('warscroll', 'Neave Blacktalon')

const army = (
  explicitSelectionIds: CanonicalId[],
  overrides: Partial<Aos4ArmyDocument> = {}
): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:2083',
    name: 'Enhancement picks',
    rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    explicitSelectionIds: [stormcast.id, ...explicitSelectionIds],
    reminderPreferences: {},
    ...overrides,
  })

const card = (document: Aos4ArmyDocument, category: string) =>
  createAos4BuilderViewModel(AOS4_CATALOG, document).options.filter(option => option.groupType === category)
const optionNames = (document: Aos4ArmyDocument, category: string) =>
  card(document, category)
    .map(option => option.name)
    .sort()
const reminderNames = (document: Aos4ArmyDocument) =>
  projectReminders(
    AOS4_CATALOG,
    resolveSelection(AOS4_CATALOG, {
      explicitIds: document.explicitSelectionIds,
      rulesContextId: document.rulesContextId,
    })
  ).map(reminder => reminder.name)
const printTitles = (document: Aos4ArmyDocument) =>
  createAos4PrintDocument(createAos4ReminderViewModel(AOS4_CATALOG, document), {
    armyName: document.name,
    factionName: stormcast.name,
  }).sections.flatMap(section => section.rules.map(rule => rule.title))
const enhancementNames = [...membersOf(tempest), ...membersOf(seasonalTempest), ...membersOf(aspects)].map(
  id => entityById.get(id)!.name
)

describe('individual artefact and heroic-trait picks (#2083)', () => {
  it('offers each member of every available table, filed under the table header, and no tables', () => {
    const artefacts = card(army([]), 'artefact-of-power')
    expect(artefacts.every(option => option.kind === 'ability' && option.available && !option.selected)).toBe(
      true
    )
    const byName = (name: string) => artefacts.find(option => option.name === name)
    ;['Mirrorshield', 'Null Pendant', 'Quicksilver Draught'].forEach(name =>
      expect(byName(name)).toMatchObject({ kind: 'ability', available: true, selected: false })
    )
    ;['Mirrorshield', 'Null Pendant', 'Quicksilver Draught'].forEach(name => {
      expect(byName(name)!.overlay).toBeUndefined()
      expect(byName(name)!.seasonal).toBeUndefined()
    })
    ;['Blade of the Six Smiths', 'Fractured Astral Jewel', 'Pennant of Azyrite Majesty'].forEach(name =>
      expect(byName(name)).toMatchObject({ seasonal: true, available: true, selected: false })
    )
    // Relics of Sigmaron is historical content: its members carry the table's overlay header.
    ;['Banner of Sigmar', 'Beacon of Azyr', 'Sigil of Morrda'].forEach(name =>
      expect(byName(name)).toMatchObject({ overlay: 'historical', available: true })
    )
    expect(optionNames(army([]), 'heroic-trait')).toEqual(
      expect.arrayContaining(['Envoy of the Heavens', 'Shock and Awe', 'Staunch Defender'])
    )
    expect(card(army([]), 'heroic-trait').some(option => option.kind === 'content-group')).toBe(false)
  })

  it('puts only the picked artefact and trait on the reminders and in the print document', () => {
    const document = army([blade.id, staunchDefender.id])
    const reminders = reminderNames(document)
    expect(enhancementNames.filter(name => reminders.includes(name)).sort()).toEqual([
      'BLADE OF THE SIX SMITHS',
      'STAUNCH DEFENDER',
    ])
    const titles = printTitles(document)
    expect(enhancementNames.filter(name => titles.some(title => title.includes(name))).sort()).toEqual([
      'BLADE OF THE SIX SMITHS',
      'STAUNCH DEFENDER',
    ])
    expect(card(document, 'artefact-of-power').filter(option => option.selected)).toEqual([
      expect.objectContaining({ id: blade.id, available: true, seasonal: true }),
    ])
  })

  it('keeps a saved whole-table army loading, selected and resolving every member, unchanged', () => {
    const document = army([tempest.id])
    const serialized = serializeAos4ArmyDocument(document)
    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.diagnostics).toEqual([])
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serialized)
    expect(deriveAos4OverlayFlags(AOS4_CATALOG, restored.document!)).toBe(restored.document)

    const artefacts = card(restored.document!, 'artefact-of-power')
    expect(artefacts.find(option => option.id === tempest.id)).toMatchObject({
      kind: 'content-group',
      selected: true,
    })
    // The members the table pulls in are offered but not selected, so no chip is unremovable.
    membersOf(tempest).forEach(id =>
      expect(artefacts.find(option => option.id === id)).toMatchObject({ selected: false, available: true })
    )
    expect(reminderNames(restored.document!)).toEqual(
      expect.arrayContaining(['MIRRORSHIELD', 'NULL PENDANT', 'QUICKSILVER DRAUGHT'])
    )
  })

  it('reminds once per ability when a table and its member are both explicit', () => {
    const document = army([tempest.id, mirrorshield.id])
    expect(reminderNames(document).filter(name => name === 'MIRRORSHIELD')).toHaveLength(1)
    const reminder = createAos4ReminderViewModel(AOS4_CATALOG, document).find(
      candidate => candidate.name === 'MIRRORSHIELD'
    )!
    expect(reminder.tags.map(tag => tag.label)).toContain('Artefacts of the Tempest')
  })

  describe('latest pick wins', () => {
    const unit = neave.id
    it('replaces a held table with a newly picked member', () => {
      expect(
        reconcileAos4EnhancementPicks(AOS4_CATALOG, [stormcast.id, tempest.id], [tempest.id, mirrorshield.id])
      ).toEqual([mirrorshield.id])
    })
    it('replaces held members with a newly picked table', () => {
      expect(
        reconcileAos4EnhancementPicks(AOS4_CATALOG, [mirrorshield.id], [mirrorshield.id, tempest.id])
      ).toEqual([tempest.id])
    })
    it('leaves ids that were not newly picked, units and lores alone', () => {
      expect(
        reconcileAos4EnhancementPicks(
          AOS4_CATALOG,
          [tempest.id, mirrorshield.id],
          [tempest.id, mirrorshield.id]
        )
      ).toEqual([tempest.id, mirrorshield.id])
      expect(reconcileAos4EnhancementPicks(AOS4_CATALOG, [], [unit, loreOfTheStorm.id])).toEqual([
        unit,
        loreOfTheStorm.id,
      ])
      // A member of another table does not displace this one.
      expect(reconcileAos4EnhancementPicks(AOS4_CATALOG, [tempest.id], [tempest.id, blade.id])).toEqual([
        tempest.id,
        blade.id,
      ])
    })
    it('keeps unknown document fields and the bearer map when the card is edited', () => {
      const before = army([unit, tempest.id], {
        unknownFields: { futureField: { kept: true } },
      } as Partial<Aos4ArmyDocument>)
      const after = createAos4ArmyDocument({
        ...before,
        explicitSelectionIds: [
          ...before.explicitSelectionIds.filter(id => id !== tempest.id),
          ...reconcileAos4EnhancementPicks(AOS4_CATALOG, before.explicitSelectionIds, [
            tempest.id,
            mirrorshield.id,
          ]),
        ],
        enhancementBearers: { [mirrorshield.id]: unit } as Aos4ArmyDocument['enhancementBearers'],
      })
      expect([...after.explicitSelectionIds].sort()).toEqual([stormcast.id, unit, mirrorshield.id].sort())
      expect(serializeAos4ArmyDocument(after)).toContain('futureField')
      expect(after.enhancementBearers).toEqual({ [mirrorshield.id]: unit })
    })
  })

  it('keeps an imported pick enabled and re-pickable after its chip is removed', () => {
    const parsed = decodeAos4TextRoster(
      [
        'Test List 1000/2000 pts',
        'Stormcast Eternals',
        'Vanguard Wing',
        "General's Handbook 2026-27",
        "General's Regiment",
        'Neave Blacktalon (280)',
        '• General',
        '• Staunch Defender',
        '• Blade of the Six Smiths',
        'Created with Sigdex: https://sigdex.io/',
        'App Version: 1.8.2',
        'Data Version: v112',
      ].join('\n')
    ).parsedRoster!
    const imported = resolveParsedRoster(AOS4_CATALOG, parsed, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'army:2083-import',
    }).proposedDocument!
    expect(card(imported, 'artefact-of-power').find(option => option.id === blade.id)).toMatchObject({
      selected: true,
      available: true,
    })
    const trait = card(imported, 'heroic-trait').find(option => option.id === staunchDefender.id)
    expect(trait).toMatchObject({ selected: true, available: true })
    expect(trait!.overlay).toBeUndefined()
    const removed = createAos4ArmyDocument({
      ...imported,
      explicitSelectionIds: imported.explicitSelectionIds.filter(id => id !== blade.id),
    })
    expect(card(removed, 'artefact-of-power').find(option => option.id === blade.id)).toMatchObject({
      selected: false,
      available: true,
    })
  })

  it('carries a hand-picked enhancement bearer the way an import does', () => {
    const document = army([neave.id, blade.id], {
      enhancementBearers: { [blade.id]: neave.id } as Aos4ArmyDocument['enhancementBearers'],
    })
    expect(document.enhancementBearers).toEqual({ [blade.id]: neave.id })
    const reminder = createAos4ReminderViewModel(AOS4_CATALOG, document).find(
      candidate => candidate.name === 'BLADE OF THE SIX SMITHS'
    )!
    expect(reminder.tags).toContainEqual(
      expect.objectContaining({
        label: 'Neave Blacktalon',
        description: expect.stringContaining('Carried by'),
      })
    )
  })

  it('keeps a seasonal member visible but disabled while the seasonal rules are off', () => {
    const off = setAos4SeasonalRules(AOS4_CATALOG, army([blade.id]), false)
    const option = card(off, 'artefact-of-power').find(candidate => candidate.id === blade.id)
    expect(option).toMatchObject({ selected: false, available: false, seasonal: true })
    expect(option!.overlay).toBeUndefined()
    expect(
      createAos4BuilderViewModel(AOS4_CATALOG, off).selection.diagnostics.some(
        diagnostic => diagnostic.code === 'inapplicable-explicit-selection' && diagnostic.subject === blade.id
      )
    ).toBe(true)
    // The other seasonal members leave the menu with their table.
    expect(
      card(off, 'artefact-of-power').some(candidate => candidate.name === 'Fractured Astral Jewel')
    ).toBe(false)
  })

  it('derives the historical overlay flag for a historical member pick', () => {
    const relicId = membersOf(relics)[0]
    const document = deriveAos4OverlayFlags(AOS4_CATALOG, army([relicId], { rulesContextId: current.id }))
    expect(document.allowsHistorical).toBe(true)
  })

  it('offers no regular-table members under an Army of Renown and keeps its granted chips', () => {
    const ogor = named<Faction>('faction', 'Ogor Mawtribes')
    const roving = named<ContentGroup>('content-group', 'The Roving Maw')
    const options = createAos4BuilderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({
        id: 'army:2083-aor',
        name: 'AoR',
        rulesContextId: current.id,
        explicitSelectionIds: [ogor.id, roving.id],
        reminderPreferences: {},
      })
    ).options
    const enhancements = options.filter(
      option => option.groupType === 'artefact-of-power' || option.groupType === 'heroic-trait'
    )
    expect(enhancements.map(option => option.name).sort()).toEqual([
      'Flasks of Congealed Maw-Juices',
      'Prime Gutserver',
    ])
    expect(enhancements.every(option => option.selected)).toBe(true)
  })

  it('leaves the lore and monstrous-trait cards as whole-group picks', () => {
    const options = createAos4BuilderViewModel(AOS4_CATALOG, army([])).options
    ;['spell-lore', 'prayer-lore', 'manifestation-lore', 'monstrous-traits'].forEach(category =>
      expect(options.filter(option => option.groupType === category && option.kind === 'ability')).toEqual([])
    )
    expect(options.find(option => option.id === loreOfTheStorm.id)).toMatchObject({
      kind: 'content-group',
      available: true,
    })
  })

  it('relies on every pickable table member sharing its table rules contexts', () => {
    AOS4_CATALOG.relationships.forEach(relationship => {
      if (relationship.kind !== 'includes') return
      const table = entityById.get(relationship.from)
      const member = entityById.get(relationship.to)
      if (
        table?.kind !== 'content-group' ||
        member?.kind !== 'ability' ||
        !['artefact-of-power', 'heroic-trait'].includes(table.groupType)
      ) {
        return
      }
      expect([...member.rulesContextIds].sort()).toEqual([...table.rulesContextIds].sort())
    })
  })
})
