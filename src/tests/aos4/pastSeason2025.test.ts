import type { CanonicalId, ContentEntity, ContentGroup, Faction, RulesContext } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import {
  findDeclaredRulesContext,
  importableRulesContexts,
  resolveParsedRoster,
  type ParsedRoster,
} from '../../aos4/import'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  findAos4PastSeasonContexts,
  findAos4SeasonalRulesContexts,
  getAos4SeasonalRulesState,
  moveAos4ToStandardRulesContext,
  serializeAos4ArmyDocument,
  setAos4SeasonalRules,
} from '../../aos4/state'
import { createAos4BuilderViewModel, pastSeasonCaveat } from '../../aos4/view'
import { describe, expect, it } from 'vitest'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * General's Handbook 2025-26 (`Scourge of Ghyran`) as a selectable past season (issue #2042).
 *
 * The season is carried as its own standard context: that season's battlepack content (the
 * Scourge of Ghyran variants, battle formations, enhancement tables, and handbook rules) paired
 * with today's warscrolls, battletomes, and points, because no accepted source records those as
 * they stood during the season. Its content is *added* to the past season and never moved out of
 * the aggregate historical context, so documents saved before this change resolve exactly as they
 * did.
 */

const byStatus = (status: RulesContext['status']) => {
  const context = AOS4_FULL_CATALOG.rulesContexts.find(candidate => candidate.status === status)
  if (!context) throw new Error(`No ${status} context`)
  return context
}
const pastSeason = byStatus('past-season')
const historical = byStatus('historical')
const seasonal = byStatus('seasonal')
const legends = byStatus('legends')
const current = AOS4_FULL_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const spearhead = AOS4_FULL_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!

const entityById = new Map<string, ContentEntity>(
  AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity])
)
const sourceUrlOf = (entity: ContentEntity): string[] =>
  entity.sourceRefs.map(reference => decodeURIComponent(reference.sourceRecordId))
const faction = (name: string): Faction => {
  const found = AOS4_CATALOG.entities.find(entity => entity.kind === 'faction' && entity.name === name)
  if (!found) throw new Error(`No faction ${name}`)
  return found as Faction
}
const group = (name: string, contextId: RulesContext['id']): ContentGroup => {
  const found = AOS4_CATALOG.entities.find(
    entity =>
      entity.kind === 'content-group' && entity.name === name && entity.rulesContextIds.includes(contextId)
  )
  if (!found) throw new Error(`No content group ${name} in ${contextId}`)
  return found as ContentGroup
}
const warscroll = (name: string) => {
  const found = AOS4_CATALOG.entities.find(entity => entity.kind === 'warscroll' && entity.name === name)
  if (!found) throw new Error(`No warscroll ${name}`)
  return found
}

describe('the General’s Handbook 2025-26 past-season context', () => {
  it('is a standard, never-default past season named for its battlepack', () => {
    expect(pastSeason).toMatchObject({
      mode: 'standard',
      season: '2025-26',
      battlepack: 'Scourge of Ghyran',
      validTo: '2026-07-05',
    })
    expect(pastSeason.validFrom).toBeUndefined()
    expect(AOS4_DEFAULT_RULES_CONTEXT_ID).toBe(seasonal.id)
    expect(pastSeasonCaveat(pastSeason)).toMatch(
      /current warscrolls, points, unit sizes, and battletome rules/
    )
    expect(pastSeasonCaveat(seasonal)).toBeUndefined()
  })

  it('carries every standard entity, so the rest of an army is today’s', () => {
    const missing = AOS4_FULL_CATALOG.entities.filter(
      entity =>
        entity.kind !== 'faction' &&
        entity.rulesContextIds.includes(current.id) &&
        !entity.rulesContextIds.includes(pastSeason.id)
    )
    expect(missing.map(entity => entity.name)).toEqual([])
  })

  it('holds nothing from the 2026-27 season beyond standard content', () => {
    const leaked = AOS4_FULL_CATALOG.entities.filter(
      entity =>
        entity.rulesContextIds.includes(pastSeason.id) &&
        !entity.rulesContextIds.includes(current.id) &&
        !entity.rulesContextIds.includes(historical.id)
    )
    expect(leaked.map(entity => entity.name)).toEqual([])
    expect(
      AOS4_FULL_CATALOG.entities
        .filter(entity => entity.rulesContextIds.includes(pastSeason.id))
        .filter(entity => /Scourge of Aqshy|2026-27/i.test(entity.name))
        .map(entity => entity.name)
    ).toEqual([])
  })

  it('holds nothing from the General’s Handbook 2024-25', () => {
    const handbook2024 = AOS4_FULL_CATALOG.entities.filter(entity =>
      sourceUrlOf(entity).some(url => url.includes('general-s-handbook-2024-25'))
    )
    expect(handbook2024.length).toBeGreaterThan(30)
    handbook2024.forEach(entity => expect(entity.rulesContextIds).toEqual([historical.id]))
  })

  it('adds, never moves: every past-season-only entity keeps the historical context', () => {
    const seasonOnly = AOS4_FULL_CATALOG.entities.filter(
      entity => entity.rulesContextIds.includes(pastSeason.id) && !entity.rulesContextIds.includes(current.id)
    )
    expect(seasonOnly.length).toBeGreaterThan(550)
    seasonOnly.forEach(entity =>
      expect(entity.rulesContextIds).toEqual([historical.id, pastSeason.id].sort())
    )
    // Every Scourge of Ghyran unit variant is the season's own.
    AOS4_FULL_CATALOG.entities
      .filter(entity => entity.kind === 'warscroll' && entity.name.startsWith('Scourge of Ghyran '))
      .forEach(entity => expect(entity.rulesContextIds).toEqual([historical.id, pastSeason.id].sort()))
  })

  it('leaves Stumblefoot Gargant historical only: no in-season official evidence is accepted', () => {
    const stumblefoot = AOS4_FULL_CATALOG.entities.filter(entity => /Stumblefoot/.test(entity.name))
    expect(stumblefoot.length).toBeGreaterThan(0)
    stumblefoot.forEach(entity => expect(entity.rulesContextIds).not.toContain(pastSeason.id))
  })

  it('scopes the official Scourge of Ghyran packs to the season, and the Red Gobbo Battleplan not', () => {
    const publications = AOS4_FULL_CATALOG.entities.filter(
      entity => entity.kind === 'publication' && entity.publisher === 'games-workshop'
    )
    const packs = publications.filter(entity =>
      /^(Scourge of Ghyran - |Using the Scourge of Ghyran Rules$)/.test(entity.name)
    )
    expect(packs).toHaveLength(26)
    packs.forEach(pack => expect(pack.rulesContextIds).toEqual([historical.id, pastSeason.id].sort()))
    expect(publications.find(entity => entity.name === 'Red Gobbo Battleplan')?.rulesContextIds).toEqual([
      historical.id,
    ])
  })

  it('offers Daughters of Khaine their official Scourge of Ghyran formations and lore', () => {
    // No Daughters of Khaine Scourge of Ghyran warscroll exists, so the faction never joined the
    // historical context and these were unreachable even through the overlay. The past season
    // reaches them through its standard warscrolls.
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [faction('Daughters of Khaine').id],
      rulesContextId: pastSeason.id,
    })
    ;['Arena Veterans', 'Coven Zealots', 'Bloodshadow Rites'].forEach(name =>
      expect(selection.availableIds).toContain(group(name, pastSeason.id).id)
    )
  })
})

/*
 * Wahapedia prints the core rules' commands, champions, spells, prayers, and terrain sections in the
 * sitting season's edition, so they belong to 2026-27 alone. Each past season's handbook page
 * reprints them as they stood that season; generation reaches those copies from the core rules for
 * the past season only (#2042). Without it, a 2025-26 army lost RALLY, COUNTER-CHARGE, and the rest.
 */
describe('the core rules in a past-season army', () => {
  const CORE_COMMANDS = [
    'RALLY',
    'MAGICAL INTERVENTION',
    'REDEPLOY',
    'AT THE DOUBLE',
    'FORWARD TO VICTORY',
    'COUNTER-CHARGE',
    'POWER THROUGH',
    'ALL-OUT ATTACK',
    'ALL-OUT DEFENCE',
    'COVERING FIRE',
    'UNBIND',
    'BANISH MANIFESTATION',
    'SACRED RITES',
  ]
  const PAST_SEASON_PAGE = 'https://wahapedia.ru/aos4/the-rules/general-s-handbook-2025-26/'
  const CORE_RULES_PAGE = 'https://wahapedia.ru/aos4/the-rules/the-core-rules/'
  const ogorId = faction('Ogor Mawtribes').id
  const greedyEaters = group('Greedy Eaters', pastSeason.id).id
  const variant = warscroll('Scourge of Ghyran Ironblaster').id

  /** Each core command's ability ids and their source pages, from the projected reminders. */
  const coreCommands = (
    explicitIds: CanonicalId[],
    rulesContextId: RulesContext['id'],
    allowsHistorical = false
  ) => {
    const reminders = projectReminders(
      AOS4_FULL_CATALOG,
      resolveSelection(AOS4_FULL_CATALOG, { explicitIds, rulesContextId, allowsHistorical })
    )
    return new Map(
      CORE_COMMANDS.map(name => {
        const abilityIds = Array.from(
          new Set(
            reminders.filter(reminder => reminder.name === name).flatMap(reminder => reminder.abilityIds)
          )
        )
        const pages = Array.from(
          new Set(
            abilityIds.flatMap(id =>
              sourceUrlOf(entityById.get(id)!).map(url => url.replace(/^.*?html:/, '').replace(/#.*$/, ''))
            )
          )
        )
        return [name, { abilityIds, pages }]
      })
    )
  }
  // The September 2026 Rules Updates page 22 adds a chanting value to the 2025-26 Sacred Rites, so
  // that reminder also cites the erratum (#2060).
  const SACRED_RITES_ERRATUM =
    'source-record:games-workshop:03f602f23a103504ca24b5bf5ac3c4f7fc83be769696d55252928ae5009de315:page:22'
  const expectFromPage = (commands: ReturnType<typeof coreCommands>, page: string) =>
    commands.forEach(({ abilityIds, pages }, name) => {
      expect({ name, count: abilityIds.length }).toEqual({ name, count: 1 })
      const expected =
        name === 'SACRED RITES' && page === PAST_SEASON_PAGE ? [SACRED_RITES_ERRATUM, page] : [page]
      expect({ name, pages }).toEqual({ name, pages: expected })
    })

  it('reminds a 2025-26 army of every core command, once each, from that season’s handbook', () => {
    expectFromPage(coreCommands([ogorId, greedyEaters, variant], pastSeason.id), PAST_SEASON_PAGE)
    // The overlay an imported 2025-26 roster carries adds nothing twice.
    expectFromPage(coreCommands([ogorId, greedyEaters, variant], pastSeason.id, true), PAST_SEASON_PAGE)
    expectFromPage(coreCommands([faction('Lumineth Realm-lords').id], pastSeason.id), PAST_SEASON_PAGE)
  })

  it('carries them into a declared 2025-26 import', () => {
    const preview = resolveParsedRoster(
      AOS4_CATALOG,
      {
        source: 'official-app-text',
        proposedName: 'Past Season Import',
        declaredFaction: 'Ogor Mawtribes',
        declaredContext: "General's Handbook 2025-26",
        selections: [
          { kindHint: 'battle-formation', label: 'Greedy Eaters', line: 2 },
          { kindHint: 'warscroll', label: 'Scourge of Ghyran Ironblaster', line: 3 },
        ],
      } as ParsedRoster,
      {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => 'army:core-rules-import',
      }
    )
    const document = preview.proposedDocument!
    expect(document.rulesContextId).toBe(pastSeason.id)
    expectFromPage(
      coreCommands(document.explicitSelectionIds, document.rulesContextId, document.allowsHistorical),
      PAST_SEASON_PAGE
    )
  })

  it('leaves the sitting season, the default, and saved overlay armies on the core rules page alone', () => {
    expect(AOS4_DEFAULT_RULES_CONTEXT_ID).toBe(seasonal.id)
    expectFromPage(coreCommands([ogorId], seasonal.id), CORE_RULES_PAGE)
    // An army saved with the historical overlay before #2042 must not gain a second RALLY.
    expectFromPage(coreCommands([ogorId, greedyEaters, variant], seasonal.id, true), CORE_RULES_PAGE)
  })

  it('scopes every edge into the season’s copy of the core rules to that season alone', () => {
    const handbookGroups = new Set(
      AOS4_FULL_CATALOG.entities
        .filter(
          entity =>
            entity.kind === 'content-group' &&
            entity.groupType === 'general-rules' &&
            sourceUrlOf(entity).some(url => url.includes(PAST_SEASON_PAGE))
        )
        .map(entity => entity.id)
    )
    const edges = AOS4_FULL_CATALOG.relationships.filter(
      relationship => handbookGroups.has(relationship.to) && !handbookGroups.has(relationship.from)
    )
    expect(edges).toHaveLength(15)
    edges.forEach(relationship => {
      expect(relationship.kind).toBe('includes')
      expect(relationship.rulesContextIds).toEqual([pastSeason.id])
    })
  })
})

describe('moving an army between standard seasons', () => {
  const ogor = (rulesContextId: RulesContext['id'], extra: CanonicalId[] = []) =>
    createAos4ArmyDocument({
      id: 'army:past-season-test',
      name: 'Past Season Test',
      rulesContextId,
      explicitSelectionIds: [faction('Ogor Mawtribes').id, ...extra],
    })

  it('finds the past season by status and leaves the seasonal switch unavailable there', () => {
    expect(findAos4PastSeasonContexts(AOS4_CATALOG).map(context => context.id)).toEqual([pastSeason.id])
    const document = ogor(pastSeason.id)
    expect(getAos4SeasonalRulesState(AOS4_CATALOG, document)).toBe('unavailable')
    expect(setAos4SeasonalRules(AOS4_CATALOG, document, true)).toBe(document)
    expect(setAos4SeasonalRules(AOS4_CATALOG, document, false)).toBe(document)
  })

  it('moves non-destructively and reversibly, keeping picks the target lacks', () => {
    const greedyEaters = group('Greedy Eaters', pastSeason.id).id
    const variant = warscroll('Scourge of Ghyran Ironblaster').id
    const start = ogor(pastSeason.id, [greedyEaters, variant])
    const moved = moveAos4ToStandardRulesContext(AOS4_CATALOG, start, seasonal.id)
    expect(moved.rulesContextId).toBe(seasonal.id)
    expect(moved.explicitSelectionIds).toEqual(start.explicitSelectionIds)
    const inSeason = resolveSelection(AOS4_CATALOG, {
      explicitIds: moved.explicitSelectionIds,
      rulesContextId: moved.rulesContextId,
    })
    expect(inSeason.diagnostics.map(diagnostic => diagnostic.code)).toContain(
      'inapplicable-explicit-selection'
    )
    const back = moveAos4ToStandardRulesContext(AOS4_CATALOG, moved, pastSeason.id)
    expect(back).toEqual(start)
    const native = resolveSelection(AOS4_CATALOG, {
      explicitIds: back.explicitSelectionIds,
      rulesContextId: back.rulesContextId,
    })
    expect(native.diagnostics).toEqual([])
    expect(native.selectedIds).toEqual(expect.arrayContaining([greedyEaters, variant]))
  })

  it('never moves a document in or out of Spearhead or Legends', () => {
    const inSpearhead = ogor(spearhead.id)
    expect(moveAos4ToStandardRulesContext(AOS4_CATALOG, inSpearhead, pastSeason.id)).toBe(inSpearhead)
    const inPast = ogor(pastSeason.id)
    expect(moveAos4ToStandardRulesContext(AOS4_CATALOG, inPast, legends.id)).toBe(inPast)
    expect(moveAos4ToStandardRulesContext(AOS4_CATALOG, inPast, pastSeason.id)).toBe(inPast)
  })
})

describe('the builder in a past-season army', () => {
  it('files the season’s own tables under its header and later retirements under theirs', () => {
    const document = createAos4ArmyDocument({
      id: 'army:past-season-builder',
      name: 'Past Season Builder',
      rulesContextId: pastSeason.id,
      explicitSelectionIds: [faction('Sons of Behemat').id],
    })
    const builder = createAos4BuilderViewModel(AOS4_CATALOG, document)
    expect(builder.labels).toEqual({
      season: 'General’s Handbook 2025-26 (Scourge of Ghyran)',
      historical: 'Retired since 2025-26',
    })
    const bigPersonalities = builder.options.filter(option => option.name === 'Big Personalities')
    // The battletome table and the Scourge of Ghyran one share a name; the marker tells them apart.
    expect(bigPersonalities.map(option => Boolean(option.seasonal)).sort()).toEqual([false, true])
    bigPersonalities.forEach(option => expect(option.overlay).toBeUndefined())
    expect(builder.options.find(option => option.name === 'Big Toes')).toMatchObject({ seasonal: true })
  })

  it('keeps the sitting season’s labels byte-identical', () => {
    const document = createAos4ArmyDocument({
      id: 'army:sitting-season-builder',
      name: 'Sitting Season Builder',
      rulesContextId: seasonal.id,
      explicitSelectionIds: [faction('Sons of Behemat').id],
    })
    expect(createAos4BuilderViewModel(AOS4_CATALOG, document).labels).toEqual({
      season: 'General’s Handbook 2026-27 (Scourge of Aqshy)',
      historical: 'Scourge of Ghyran (2025-26)',
    })
    const currentDocument = { ...document, rulesContextId: current.id }
    expect(createAos4BuilderViewModel(AOS4_CATALOG, currentDocument).labels.season).toBe(
      'General’s Handbook 2026-27 (Scourge of Aqshy)'
    )
  })
})

describe('importing into the past season', () => {
  const roster = (
    declaredContext: string | undefined,
    labels: Array<[ParsedRoster['selections'][number]['kindHint'], string]>,
    factionName = 'Ogor Mawtribes'
  ): ParsedRoster =>
    ({
      source: 'official-app-text',
      proposedName: 'Past Season Import',
      declaredFaction: factionName,
      ...(declaredContext ? { declaredContext } : {}),
      selections: labels.map(([kindHint, label], index) => ({ kindHint, label, line: index + 2 })),
    }) as ParsedRoster
  const resolve = (parsed: ParsedRoster) =>
    resolveParsedRoster(AOS4_CATALOG, parsed, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'army:past-season-import',
    })

  it.each(["General's Handbook 2025-26", 'GHB 2025-26', 'Scourge of Ghyran'])('matches "%s"', declared => {
    expect(findDeclaredRulesContext(AOS4_CATALOG, declared)?.id).toBe(pastSeason.id)
  })

  it('lists the past season after the importable rulesets, which keep their name order', () => {
    const importable = importableRulesContexts(AOS4_CATALOG)
    const everyday = importable.filter(context => context.status !== 'past-season')
    expect(everyday.map(context => context.name)).toEqual(
      AOS4_CATALOG.rulesContexts
        .filter(context => ['current', 'seasonal', 'legends'].includes(context.status))
        .map(context => context.name)
        .sort((left, right) => left.localeCompare(right))
    )
    expect(importable.map(context => context.id)).toEqual([
      ...everyday.map(context => context.id),
      pastSeason.id,
    ])
  })

  it('lands a declared 2025-26 roster in the season, with its picks native and no fallback warning', () => {
    const preview = resolve(
      roster("General's Handbook 2025-26", [
        ['battle-formation', 'Greedy Eaters'],
        ['warscroll', 'Scourge of Ghyran Ironblaster'],
      ])
    )
    expect(preview.proposedDocument?.rulesContextId).toBe(pastSeason.id)
    expect(preview.proposedDocument?.allowsHistorical).toBe(true)
    expect(preview.diagnostics).toEqual([])
    expect(preview.matches.map(match => match.label)).toEqual(
      expect.arrayContaining(['Greedy Eaters', 'Scourge of Ghyran Ironblaster'])
    )
  })

  /*
   * Owner decision on #2042: the battletome's Facets of Brilliance and the season's Aspects of
   * Enlightenment both print a different "Flawless Commander", both legal in 2025-26, and a roster
   * does not say which table it used. The import keeps the pick out and names both tables so the
   * player chooses, rather than guessing a rule.
   */
  it('leaves an enhancement both 2025-26 tables print to the player, naming the tables', () => {
    const preview = resolve(
      roster("General's Handbook 2025-26", [['enhancement', 'Flawless Commander']], 'Lumineth Realm-lords')
    )
    expect(preview.proposedDocument?.rulesContextId).toBe(pastSeason.id)
    expect(preview.matches.map(match => match.label)).not.toContain('Flawless Commander')
    expect(preview.diagnostics).toEqual([
      expect.objectContaining({
        code: 'ambiguous-selection',
        severity: 'warning',
        message: expect.stringContaining(
          'It appears in the Aspects of Enlightenment and Facets of Brilliance tables, which have different rules; pick the table your list used.'
        ),
      }),
    ])
    // The sitting season carries only the battletome trait, so it stays unambiguous there.
    const sitting = resolve(
      roster("General's Handbook 2026-27", [['enhancement', 'Flawless Commander']], 'Lumineth Realm-lords')
    )
    expect(sitting.diagnostics).toEqual([])
    expect(sitting.matches.map(match => match.label)).toContain('Flawless Commander')
  })

  it('still falls back to the sitting season, with the overlay, for 2024-25', () => {
    const preview = resolve(roster("General's Handbook 2024-25", [['warscroll', 'Ironblaster']]))
    expect(preview.proposedDocument?.rulesContextId).toBe(AOS4_DEFAULT_RULES_CONTEXT_ID)
    expect(preview.proposedDocument?.allowsHistorical).toBe(true)
    expect(preview.diagnostics.map(diagnostic => diagnostic.code)).toEqual(['unsupported-context'])
  })

  it('leaves 2026-27 and undeclared rosters where they were', () => {
    expect(resolve(roster("General's Handbook 2026-27", [])).proposedDocument?.rulesContextId).toBe(
      seasonal.id
    )
    expect(resolve(roster(undefined, [])).proposedDocument?.rulesContextId).toBe(
      AOS4_DEFAULT_RULES_CONTEXT_ID
    )
  })

  it('never routes a Legends-only army into the past season, declared or not', () => {
    // Bonesplitterz exists only in Legends; the one alternative context must stay Legends now that
    // a second standard season is importable.
    expect(resolve(roster(undefined, [], 'Bonesplitterz')).proposedDocument?.rulesContextId).toBe(legends.id)
    expect(
      resolve(roster("General's Handbook 2025-26", [], 'Bonesplitterz')).proposedDocument?.rulesContextId
    ).toBe(legends.id)
  })
})

describe('armies saved before the past season existed', () => {
  /*
   * The shape the import produced for a 2025-26 roster before #2042: the sitting season plus the
   * historical overlay, holding Scourge of Ghyran picks. Serialized form pinned so a schema change
   * cannot slip past this check.
   */
  const ogorId = faction('Ogor Mawtribes').id
  const greedyEaters = group('Greedy Eaters', historical.id).id
  const variant = warscroll('Scourge of Ghyran Ironblaster').id
  const saved = JSON.stringify({
    ...JSON.parse(
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          id: 'army:saved-before-2042',
          name: 'Saved Before 2042',
          rulesContextId: seasonal.id,
          allowsHistorical: true,
          explicitSelectionIds: [ogorId, greedyEaters, variant],
        })
      )
    ),
  })

  it('load unchanged and resolve their Scourge of Ghyran picks through the overlay', () => {
    const { document, diagnostics } = deserializeAos4ArmyDocument(saved, AOS4_CATALOG)
    expect(diagnostics.filter(diagnostic => diagnostic.severity === 'error')).toEqual([])
    expect(document?.rulesContextId).toBe(seasonal.id)
    expect(document?.allowsHistorical).toBe(true)
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: document!.explicitSelectionIds,
      rulesContextId: document!.rulesContextId,
      allowsHistorical: true,
    })
    expect(selection.diagnostics).toEqual([])
    expect(selection.selectedIds).toEqual(expect.arrayContaining([greedyEaters, variant]))
    expect(entityById.get(greedyEaters)?.rulesContextIds).toContain(historical.id)
  })

  it('round-trips a new past-season army', () => {
    const document = createAos4ArmyDocument({
      id: 'army:past-season-round-trip',
      name: 'Past Season Round Trip',
      rulesContextId: pastSeason.id,
      explicitSelectionIds: [ogorId, greedyEaters, variant],
    })
    const loaded = deserializeAos4ArmyDocument(serializeAos4ArmyDocument(document), AOS4_CATALOG)
    expect(loaded.document).toEqual(document)
    const { seasonal: sitting } = findAos4SeasonalRulesContexts(AOS4_CATALOG)
    expect(sitting?.id).toBe(seasonal.id)
  })
})
