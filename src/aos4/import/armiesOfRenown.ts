import type { Aos4Catalog, CanonicalId, ContentEntity, ContentGroup } from '../domain'

/**
 * Resolution support for Armies of Renown, which the catalog models by nesting rather than naming.
 *
 * Wahapedia renders an Army of Renown as a section of its parent faction: an `h2` carrying the
 * army's name, then an `h3` per rules section beneath it. Generation reproduces that shape exactly
 * — the container is a `content-group` named after the army, and each section is a child
 * `content-group` named after the section, carrying the army's slug as its `groupType`:
 *
 * ```
 * content-group "Da King’s Gitz"        groupType: da-kings-gitz
 *   includes content-group "Spell Lore" groupType: da-kings-gitz
 *   includes content-group "Battle Traits"
 * ```
 *
 * Rosters name the same content flat, because a player picking a lore has to be told *whose* lore
 * it is: the official app writes `Da King's Gitz Spell Lore`, and puts the army itself in the
 * header's battle-formation slot (`Gloomspite Gitz | Da King's Gitz`). Neither form matches a
 * catalog name on its own, so without this module every Army of Renown list silently loses its
 * army rules — around 108 armies, and every list built on one.
 *
 * Nothing here invents data. The container and its sections are already in the catalog with their
 * real names; this only reads the relationship graph to recover the qualified name the catalog
 * never stores, and to make the container reachable from the faction that offers its sections.
 */

/**
 * Section headings the generator normalizes every faction's rules onto.
 *
 * A group carrying one of these as its `groupType` is a rules *category* — the faction-level
 * "Battle Formations" container and the individual formations beneath it both sit here — so it is
 * never an army. `groupType` on an Army of Renown's sections is the army's slug instead, which is
 * what makes the two distinguishable at all.
 */
const CATEGORY_GROUP_TYPES = new Set([
  'artefact-of-power',
  'battle-formation',
  'battle-trait',
  'heroic-trait',
  'manifestation-lore',
  'prayer-lore',
  'spell-lore',
])

/**
 * The section names an Army of Renown is built from.
 *
 * Needed because "self-named group with child groups" also describes a handful of enhancement
 * tables — `Accursed Devices` over `Accursed Device`, `Marks of Vulcatrix` over `Mark of
 * Vulcatrix`, `Monstrous Traits` over its beast lists. Those nest a *variant* under its own
 * plural; an army nests the standard rules sections. Requiring at least one recognised section
 * separates the two cleanly: it admits all 108 armies in the accepted corpus and none of the four
 * enhancement tables.
 */
const ARMY_SECTION_NAMES = new Set([
  'artefacts of power',
  'battle traits',
  'enhancements',
  'heroic traits',
  'manifestation lore',
  'prayer lore',
  'regiment abilities',
  'spell lore',
])

/**
 * The generator's `groupType` slug, minus its category aliases.
 *
 * Kept in step with `groupType` in `src/aos4/generate/corpus.ts` deliberately rather than shared:
 * `src/aos4/generate/` is Node-side build tooling and must not be pulled into the browser bundle.
 * The aliases are omitted because they are exactly what {@link CATEGORY_GROUP_TYPES} filters out
 * first, so applying them here would only re-admit the categories.
 */
const groupTypeSlug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') || 'other'

const isContentGroup = (entity: ContentEntity): entity is ContentGroup => entity.kind === 'content-group'

export interface ArmyOfRenownSection {
  /**
   * The qualified name a roster uses for this section.
   *
   * `Da King’s Gitz Spell Lore` for the group the catalog simply calls `Spell Lore`.
   */
  qualifiedName: string
  /**
   * The rules category this section belongs to, read from its own heading.
   *
   * A section carries its *army's* slug as `groupType`, so the only thing left saying what kind of
   * content it holds is the heading itself — and the generator derives category slugs from exactly
   * those headings, which is what makes `Spell Lore` here line up with the `spell-lore` hint a
   * roster's lore row produces.
   */
  categoryGroupType: string
}

export interface ArmyOfRenownIndex {
  /** Every Army of Renown container, by canonical ID. */
  containerIds: ReadonlySet<CanonicalId>
  /** Every Army of Renown section, by canonical ID. */
  sectionsById: ReadonlyMap<CanonicalId, ArmyOfRenownSection>
  /** The sections each container holds, so a container can inherit their reachability. */
  sectionIdsByContainerId: ReadonlyMap<CanonicalId, CanonicalId[]>
}

const EMPTY_INDEX: ArmyOfRenownIndex = {
  containerIds: new Set(),
  sectionsById: new Map(),
  sectionIdsByContainerId: new Map(),
}

/**
 * The generator's category aliases, which map a section heading onto its rules category.
 *
 * Mirrors the alias table in `groupType` (`src/aos4/generate/corpus.ts`) for the same reason
 * {@link groupTypeSlug} does: build tooling must stay out of the browser bundle.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  'artefacts-of-power': 'artefact-of-power',
  'battle-formations': 'battle-formation',
  'battle-traits': 'battle-trait',
  'heroic-traits': 'heroic-trait',
}

const categoryGroupType = (name: string): string => {
  const slug = groupTypeSlug(name)
  return CATEGORY_ALIASES[slug] ?? slug
}

/**
 * Read the Armies of Renown out of a catalog's relationship graph.
 *
 * Structural rather than name-driven on purpose: there is no `armyOfRenown` flag in the catalog to
 * read, and a hand-kept list of army names would go stale the day a new battletome lands, silently
 * and with no test to catch it. The shape, by contrast, is a direct consequence of how the source
 * pages are laid out, so a new army arrives already recognised.
 */
export const buildArmyOfRenownIndex = (catalog: Aos4Catalog): ArmyOfRenownIndex => {
  const groupsById = new Map<CanonicalId, ContentGroup>(
    catalog.entities.filter(isContentGroup).map(entity => [entity.id as CanonicalId, entity])
  )
  if (!groupsById.size) return EMPTY_INDEX

  const childIdsById = new Map<CanonicalId, CanonicalId[]>()
  catalog.relationships.forEach(relationship => {
    if (relationship.kind !== 'includes') return
    if (!groupsById.has(relationship.from) || !groupsById.has(relationship.to)) return
    childIdsById.set(relationship.from, [...(childIdsById.get(relationship.from) ?? []), relationship.to])
  })

  const containerIds = new Set<CanonicalId>()
  const sectionsById = new Map<CanonicalId, ArmyOfRenownSection>()
  const sectionIdsByContainerId = new Map<CanonicalId, CanonicalId[]>()
  const claimedSectionIds = new Set<CanonicalId>()

  groupsById.forEach((container, containerId) => {
    // The reviewed classification marks the official Armies of Renown explicitly; every other
    // army-shaped section (Regiments of Renown and similar) still matches structurally.
    const isClassified = container.groupType === 'army-of-renown'
    if (!isClassified) {
      if (CATEGORY_GROUP_TYPES.has(container.groupType)) return
      if (groupTypeSlug(container.name) !== container.groupType) return
    }

    const sectionIds = childIdsById.get(containerId) ?? []
    const sections = sectionIds.flatMap(id => {
      const section = groupsById.get(id)
      return section ? [section] : []
    })
    if (!sections.some(section => ARMY_SECTION_NAMES.has(section.name.trim().toLowerCase()))) return

    containerIds.add(containerId)
    sectionIdsByContainerId.set(containerId, sectionIds)
    sections.forEach(section => {
      /**
       * A section under two armies keeps neither qualified name.
       *
       * Not reachable in the accepted corpus — every section belongs to exactly one army — but
       * guessing which army a shared section belonged to would be the kind of silent
       * mis-resolution the importer refuses everywhere else.
       */
      if (claimedSectionIds.has(section.id)) {
        sectionsById.delete(section.id)
        return
      }
      claimedSectionIds.add(section.id)
      sectionsById.set(section.id, {
        qualifiedName: `${container.name} ${section.name}`,
        categoryGroupType: categoryGroupType(section.name),
      })
    })
  })

  return { containerIds, sectionsById, sectionIdsByContainerId }
}
