import type {
  Aos4Catalog,
  BattleProfile,
  CanonicalId,
  ContentEntity,
  ContentGroup,
  RulesContext,
  Warscroll,
} from '../domain'
import { resolveSelection } from '../select'
import type { Aos4ArmyDocument } from '../state'

export interface Aos4BuilderOption {
  id: CanonicalId
  name: string
  kind: ContentEntity['kind']
  groupType?: string
  selected: boolean
  available: boolean
  overlay?: 'legends' | 'historical'
  /**
   * Season-exclusive content: applicable in the seasonal rules context but not the current
   * standard one. The General's Handbook 2026-27 hands a faction a seasonal enhancement table
   * under the battletome table's own name — an additional pick, not a replacement ("Using the
   * Scourge of Aqshy Rules", #1979) — so both tables are offered and this marker is what lets
   * the builder tell two same-named options apart.
   */
  seasonal?: boolean
}

export interface Aos4BuilderWarscroll {
  id: CanonicalId<'warscroll'>
  name: string
  characteristics: Warscroll['characteristics']
  profile?: {
    unitSize: number
    points?: number
    baseSizes: string[]
  }
}

/**
 * The rules categories whose individual abilities surface as selected chips in the builder cards.
 *
 * Two paths feed them: an Army of Renown grants its enhancements outright, and an imported roster
 * names the single enhancement a hero carries ("Quicksilver Draught") rather than the offering
 * group a hand-built army selects ("Artefacts of the Tempest"). Both leave an `ability` in the
 * selection, and the ability's card is the offering group's category. A monster's monstrous trait
 * ("Armour Cruncher") imports the same way, so it gets the same chip (#2038).
 */
const ABILITY_CHIP_CATEGORIES = new Set([
  'artefact-of-power',
  'heroic-trait',
  'monstrous-traits',
  'prayer-lore',
  'spell-lore',
])
/**
 * The enhancement categories a hand-built army picks one member at a time (#2083). AoS 4 asks for
 * a hero's artefact or heroic trait, never a table, so the builder offers each member of an
 * available table; the table itself shows only while an existing army still holds it. Lores stay
 * whole-lore picks, and monstrous traits keep their import-only chips.
 */
const PICKABLE_MEMBER_CATEGORIES = new Set(['artefact-of-power', 'heroic-trait'])
const CHIP_MINOR_WORDS = new Set(['a', 'an', 'and', 'of', 'the', 'to'])
const chipCase = (value: string): string =>
  value
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index > 0 && CHIP_MINOR_WORDS.has(word)
        ? word
        : word.replace(
            /(^|-)([a-z])/g,
            (_, boundary: string, letter: string) => `${boundary}${letter.toUpperCase()}`
          )
    )
    .join(' ')

/**
 * The builder's grouped-option headers. The season header is derived from the season's context
 * (`General’s Handbook 2026-27 (Scourge of Aqshy)` for the sitting handbook) rather than written
 * into the UI, so a past-season army (#2042) files its own battlepack under its own season. In a
 * past-season army the historical overlay is no longer "last season" — that season is the army's
 * own — so it holds only what was retired later, and says so.
 */
export interface Aos4BuilderGroupLabels {
  season: string
  historical: string
}

const builderGroupLabels = (
  seasonContext: RulesContext | undefined,
  isPastSeason: boolean
): Aos4BuilderGroupLabels => ({
  season: seasonContext?.season
    ? `General’s Handbook ${seasonContext.season}${seasonContext.battlepack ? ` (${seasonContext.battlepack})` : ''}`
    : 'Seasonal rules',
  historical:
    isPastSeason && seasonContext?.season
      ? `Retired since ${seasonContext.season}`
      : 'Scourge of Ghyran (2025-26)',
})

export const createAos4BuilderViewModel = (catalog: Aos4Catalog, document: Aos4ArmyDocument) => {
  // Every army offers its full catalog: current-standard content plus the Legends and historical
  // (Scourge of Ghyran) overlays. Options carry an `overlay` marker so the UI can group them
  // rather than asking the player to opt in first.
  const selection = resolveSelection(catalog, {
    explicitIds: document.explicitSelectionIds,
    rulesContextId: document.rulesContextId,
    allowsLegends: true,
    allowsHistorical: true,
  })
  const strictAvailable = new Set(
    resolveSelection(catalog, {
      explicitIds: document.explicitSelectionIds,
      rulesContextId: document.rulesContextId,
    }).availableIds
  )
  const legendsAvailable = new Set(
    resolveSelection(catalog, {
      explicitIds: document.explicitSelectionIds,
      rulesContextId: document.rulesContextId,
      allowsLegends: true,
    }).availableIds
  )
  const overlayFor = (id: CanonicalId): 'legends' | 'historical' | undefined => {
    if (strictAvailable.has(id)) return undefined
    return legendsAvailable.has(id) ? 'legends' : 'historical'
  }
  const selected = new Set(selection.selectedIds)
  const available = new Set(selection.availableIds)
  const entityById = new Map(catalog.entities.map(entity => [entity.id, entity]))
  const currentStandardContextId = catalog.rulesContexts.find(
    context => context.mode === 'standard' && context.status === 'current'
  )?.id
  // The season whose exclusive content gets its own header: the document's own season when it
  // sits in one (the sitting handbook or a past season, #2042), otherwise the sitting handbook, so
  // a battletome-only army still files that handbook's picks under it.
  const documentContext = catalog.rulesContexts.find(context => context.id === document.rulesContextId)
  const seasonContext =
    documentContext?.status === 'seasonal' || documentContext?.status === 'past-season'
      ? documentContext
      : catalog.rulesContexts.find(context => context.status === 'seasonal')
  const seasonalContextId = seasonContext?.id
  const isSeasonExclusive = (entity: ContentEntity): boolean =>
    Boolean(
      seasonalContextId &&
      currentStandardContextId &&
      entity.rulesContextIds.includes(seasonalContextId) &&
      !entity.rulesContextIds.includes(currentStandardContextId)
    )

  /**
   * The offering group behind each individually selectable enhancement.
   *
   * The catalog models the individual enhancement as an `ability` inside the content-group that
   * offers it, and only the group is ever offered — so an imported roster's artefact or heroic
   * trait lands in the document as an ability with no card of its own, and the builder's dropdown
   * showed nothing selected while the reminder was plainly there (#1827). The offering group
   * supplies what the ability cannot say for itself: the category card it belongs on, and the
   * overlay provenance (an ability is never in `availableIds`, so deriving its overlay directly
   * would misfile current content as historical). Where more than one group includes the same
   * ability, the one available without an overlay wins.
   */
  const chipGroupByAbilityId = new Map<CanonicalId, ContentGroup>()
  catalog.relationships.forEach(relationship => {
    if (relationship.kind !== 'includes') return
    const parent = entityById.get(relationship.from)
    const child = entityById.get(relationship.to)
    if (child?.kind !== 'ability' || parent?.kind !== 'content-group') return
    if (!ABILITY_CHIP_CATEGORIES.has(parent.groupType)) return
    const existing = chipGroupByAbilityId.get(child.id)
    if (!existing || (overlayFor(existing.id) && !overlayFor(parent.id))) {
      chipGroupByAbilityId.set(child.id, parent)
    }
  })

  // Offering tables a player may now pick members from; AoR-granted tables are never offered.
  const pickableTableIds = new Set(
    selection.availableIds.filter(id => {
      const entity = entityById.get(id)
      return entity?.kind === 'content-group' && PICKABLE_MEMBER_CATEGORIES.has(entity.groupType)
    })
  )
  const pickableMemberIds = Array.from(chipGroupByAbilityId)
    .filter(([, group]) => pickableTableIds.has(group.id))
    .map(([abilityId]) => abilityId)
  const explicitIds = new Set(document.explicitSelectionIds)

  const options: Aos4BuilderOption[] = Array.from(
    new Set([...document.explicitSelectionIds, ...selection.availableIds, ...pickableMemberIds])
  ).flatMap(id => {
    const entity = entityById.get(id)
    if (!entity) return []
    if (
      entity.kind === 'content-group' &&
      PICKABLE_MEMBER_CATEGORIES.has(entity.groupType) &&
      !explicitIds.has(id)
    ) {
      return []
    }
    const chipGroup = entity.kind === 'ability' ? chipGroupByAbilityId.get(id) : undefined
    const seasonal = isSeasonExclusive(chipGroup ?? entity)
    // A season-exclusive selection held while the seasonal rules are off (issue #1994) is
    // unavailable in every resolution pass, which `overlayFor` would misread as historical
    // provenance. Its marker is `seasonal`, so the builder keeps it under the season's own
    // header — disabled, not misfiled under a past season.
    const overlay = seasonal ? undefined : overlayFor(chipGroup?.id ?? id)
    return [
      {
        id,
        name: chipGroup ? chipCase(entity.name) : entity.name,
        kind: entity.kind,
        ...(entity.kind === 'content-group'
          ? { groupType: entity.groupType }
          : entity.kind === 'warscroll' && entity.keywords.includes('MANIFESTATION')
            ? // Manifestations are a category of unit, not roster units (CONCEPTS.md); grouping
              // them apart keeps the Units card a list of the units a player actually fields.
              { groupType: 'manifestation' }
            : chipGroup
              ? { groupType: chipGroup.groupType }
              : {}),
        // A member a selected table pulls in is not the player's pick: showing it selected would
        // make a chip that removing cannot clear, because the table re-includes it.
        selected: selected.has(id) && (entity.kind !== 'ability' || explicitIds.has(id)),
        available: available.has(id) || Boolean(chipGroup && pickableTableIds.has(chipGroup.id)),
        ...(overlay ? { overlay } : {}),
        ...(seasonal ? { seasonal: true } : {}),
      },
    ]
  })

  /**
   * An Army of Renown grants its enhancements and lores rather than offering them, so they never
   * reach `availableIds` — yet the player should still see what their army got. Each granted
   * ability surfaces as a selected chip in its own rules category (Prime Gutserver under Heroic
   * Traits, Mawmeat and Retcher under Spell Lores). Battle traits stay reminder-only, like every
   * army's battle traits.
   */
  const armyOfRenownRootIds = new Set(
    document.explicitSelectionIds.filter(id => {
      const entity = entityById.get(id)
      return entity?.kind === 'content-group' && entity.groupType === 'army-of-renown'
    })
  )
  if (armyOfRenownRootIds.size) {
    const seenChipIds = new Set<CanonicalId>(options.map(option => option.id))
    selection.causes.forEach(cause => {
      if (!armyOfRenownRootIds.has(cause.rootId) || seenChipIds.has(cause.entityId)) return
      const entity = entityById.get(cause.entityId)
      if (entity?.kind !== 'ability') return
      const parent = entityById.get(cause.entityPath[cause.entityPath.length - 2])
      if (parent?.kind !== 'content-group' || !ABILITY_CHIP_CATEGORIES.has(parent.groupType)) return
      seenChipIds.add(cause.entityId)
      options.push({
        id: cause.entityId,
        name: chipCase(entity.name),
        kind: entity.kind,
        groupType: parent.groupType,
        selected: true,
        available: true,
      })
    })
  }

  options.sort(
    (left, right) =>
      (left.groupType ?? left.kind).localeCompare(right.groupType ?? right.kind) ||
      left.name.localeCompare(right.name)
  )

  const profileByWarscroll = new Map(
    catalog.entities
      .filter(
        (entity): entity is BattleProfile => entity.kind === 'battle-profile' && selected.has(entity.id)
      )
      .map(profile => [profile.warscrollId, profile])
  )
  const warscrolls: Aos4BuilderWarscroll[] = catalog.entities
    .filter((entity): entity is Warscroll => entity.kind === 'warscroll' && selected.has(entity.id))
    .map(entity => {
      const profile = profileByWarscroll.get(entity.id)
      return {
        id: entity.id,
        name: entity.name,
        characteristics: entity.characteristics,
        ...(profile
          ? {
              profile: {
                unitSize: profile.unitSize,
                points: profile.points,
                baseSizes: [...profile.baseSizes],
              },
            }
          : {}),
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))

  return {
    armyId: document.id,
    armyName: document.name,
    rulesContextId: document.rulesContextId,
    labels: builderGroupLabels(seasonContext, documentContext?.status === 'past-season'),
    options,
    warscrolls,
    selection,
  }
}

/**
 * Keeps a card's table and member picks from stacking (#2083): the latest pick wins. A newly
 * picked member replaces its whole table, and a newly picked table replaces its members, so the
 * reminders never hold the whole table beside the one artefact the player meant. Ids that were
 * already selected stay as they are — an existing army's table survives until a member is picked.
 */
export const reconcileAos4EnhancementPicks = (
  catalog: Aos4Catalog,
  previousExplicitIds: readonly CanonicalId[],
  selectedIds: readonly CanonicalId[]
): CanonicalId[] => {
  const previous = new Set(previousExplicitIds)
  const added = new Set(selectedIds.filter(id => !previous.has(id)))
  if (!added.size) return [...selectedIds]
  const tableIds = new Set<CanonicalId>(
    catalog.entities.flatMap(entity =>
      entity.kind === 'content-group' && PICKABLE_MEMBER_CATEGORIES.has(entity.groupType) ? [entity.id] : []
    )
  )
  const replaced = new Set<CanonicalId>()
  catalog.relationships.forEach(relationship => {
    if (relationship.kind !== 'includes' || !tableIds.has(relationship.from)) return
    if (added.has(relationship.to) && !added.has(relationship.from)) replaced.add(relationship.from)
    if (added.has(relationship.from) && !added.has(relationship.to)) replaced.add(relationship.to)
  })
  return selectedIds.filter(id => !replaced.has(id))
}
