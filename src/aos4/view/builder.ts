import type {
  Aos4Catalog,
  BattleProfile,
  CanonicalId,
  ContentEntity,
  ContentGroup,
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
 * selection, and the ability's card is the offering group's category.
 */
const ABILITY_CHIP_CATEGORIES = new Set(['artefact-of-power', 'heroic-trait', 'prayer-lore', 'spell-lore'])
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
  const seasonalContextId = catalog.rulesContexts.find(context => context.status === 'seasonal')?.id
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

  const options: Aos4BuilderOption[] = Array.from(
    new Set([...document.explicitSelectionIds, ...selection.availableIds])
  ).flatMap(id => {
    const entity = entityById.get(id)
    if (!entity) return []
    const chipGroup = entity.kind === 'ability' ? chipGroupByAbilityId.get(id) : undefined
    const overlay = overlayFor(chipGroup?.id ?? id)
    const seasonal = isSeasonExclusive(chipGroup ?? entity)
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
        selected: selected.has(id),
        available: available.has(id),
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
    options,
    warscrolls,
    selection,
  }
}
