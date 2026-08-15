import type { AbilityTiming, Aos4Catalog, CanonicalId, ContentEntity, ContentRelationship } from '../domain'
import { stableCompactJson } from '../generate/serialization'
import {
  AOS4_CHANGELOG_SCHEMA_VERSION,
  type ChangeAttribution,
  type ChangeFieldDelta,
  type ChangeRecord,
  type ChangeRecordOwnership,
  type ChangeSelectionPredicate,
  type ChangelogAcceptance,
  type ChangelogArtifact,
  type ChangelogFactSelector,
  type ChangelogJsonValue,
  type ChangelogPublication,
  type ChangelogPublicationInput,
} from './types'

const GRANTING_RELATIONSHIPS = new Set<ContentRelationship['kind']>(['offers', 'includes', 'requires'])
const AUTO_GRANT_RELATIONSHIPS = new Set<ContentRelationship['kind']>(['includes', 'requires'])

interface CatalogView {
  entitiesById: Map<CanonicalId, ContentEntity>
  grantsByTarget: Map<CanonicalId, ContentRelationship[]>
  factionIds: CanonicalId<'faction'>[]
}

const compareIds = (left: string, right: string): number => left.localeCompare(right)

const createView = (catalog: Aos4Catalog): CatalogView => {
  const grantsByTarget = new Map<CanonicalId, ContentRelationship[]>()
  catalog.relationships.forEach(relationship => {
    if (!GRANTING_RELATIONSHIPS.has(relationship.kind)) return
    const granted = grantsByTarget.get(relationship.to) ?? []
    granted.push(relationship)
    grantsByTarget.set(relationship.to, granted)
  })
  return {
    entitiesById: new Map(catalog.entities.map(entity => [entity.id as CanonicalId, entity])),
    grantsByTarget,
    factionIds: catalog.entities
      .filter(entity => entity.kind === 'faction')
      .map(entity => entity.id as CanonicalId<'faction'>)
      .sort(compareIds),
  }
}

/** Factions whose selection auto-grants the entity through unbroken includes/requires chains. */
const autoGrantingFactionIds = (view: CatalogView, entityId: CanonicalId): CanonicalId<'faction'>[] => {
  const roots = new Set<CanonicalId<'faction'>>()
  const visited = new Set<CanonicalId>([entityId])
  const queue: CanonicalId[] = [entityId]
  for (let index = 0; index < queue.length; index += 1) {
    const grants = view.grantsByTarget.get(queue[index]) ?? []
    grants.forEach(relationship => {
      if (!AUTO_GRANT_RELATIONSHIPS.has(relationship.kind)) return
      const source = view.entitiesById.get(relationship.from)
      if (!source || visited.has(source.id)) return
      visited.add(source.id)
      if (source.kind === 'faction') {
        roots.add(source.id)
        return
      }
      queue.push(source.id)
    })
  }
  return Array.from(roots).sort(compareIds)
}

const directGranters = (view: CatalogView, entityId: CanonicalId): ContentEntity[] =>
  (view.grantsByTarget.get(entityId) ?? [])
    .map(relationship => view.entitiesById.get(relationship.from))
    .filter((entity): entity is ContentEntity => Boolean(entity))
    .sort((left, right) => compareIds(left.id, right.id))

const selectionPredicate = (view: CatalogView, entity: ContentEntity): ChangeSelectionPredicate => {
  if (entity.kind === 'battle-profile') return { kind: 'warscroll', warscrollId: entity.warscrollId }
  if (entity.kind === 'warscroll') return { kind: 'warscroll', warscrollId: entity.id }
  if (entity.kind === 'faction') return { kind: 'faction', factionId: entity.id }

  const autoFactionIds = autoGrantingFactionIds(view, entity.id)
  const universal =
    view.factionIds.length > 1 && view.factionIds.every(factionId => autoFactionIds.includes(factionId))
  if (universal) return 'universal'
  if (entity.kind === 'content-group') {
    return { kind: 'content-group', contentGroupId: entity.id, autoGrantedByFactionIds: autoFactionIds }
  }
  if (autoFactionIds.length) return { kind: 'faction', factionId: autoFactionIds[0] }

  const granters = directGranters(view, entity.id)
  const warscroll = granters.find(granter => granter.kind === 'warscroll')
  if (warscroll) return { kind: 'warscroll', warscrollId: warscroll.id as CanonicalId<'warscroll'> }
  const group = granters.find(granter => granter.kind === 'content-group')
  if (group) {
    return {
      kind: 'content-group',
      contentGroupId: group.id as CanonicalId<'content-group'>,
      autoGrantedByFactionIds: autoGrantingFactionIds(view, group.id),
    }
  }
  const faction = granters.find(granter => granter.kind === 'faction')
  if (faction) return { kind: 'faction', factionId: faction.id as CanonicalId<'faction'> }
  return 'universal'
}

const ownershipOf = (view: CatalogView, entity: ContentEntity): ChangeRecordOwnership => {
  const factionIds = new Set<CanonicalId<'faction'>>()
  const contentGroupIds = new Set<CanonicalId<'content-group'>>()
  let warscrollId: CanonicalId<'warscroll'> | undefined

  if (entity.kind === 'faction') factionIds.add(entity.id)
  if (entity.kind === 'warscroll') {
    warscrollId = entity.id
    entity.factionIds.forEach(id => factionIds.add(id))
  }
  if (entity.kind === 'battle-profile') {
    warscrollId = entity.warscrollId
    const warscroll = view.entitiesById.get(entity.warscrollId)
    if (warscroll?.kind === 'warscroll') warscroll.factionIds.forEach(id => factionIds.add(id))
  }
  if (entity.kind === 'content-group') contentGroupIds.add(entity.id)

  directGranters(view, entity.id).forEach(granter => {
    if (granter.kind === 'warscroll' && !warscrollId) warscrollId = granter.id
    if (granter.kind === 'content-group') contentGroupIds.add(granter.id)
  })

  const visited = new Set<CanonicalId>([entity.id])
  const queue: CanonicalId[] = [entity.id]
  for (let index = 0; index < queue.length; index += 1) {
    const grants = view.grantsByTarget.get(queue[index]) ?? []
    grants.forEach(relationship => {
      const source = view.entitiesById.get(relationship.from)
      if (!source || visited.has(source.id)) return
      visited.add(source.id)
      if (source.kind === 'faction') {
        factionIds.add(source.id)
        return
      }
      if (source.kind === 'warscroll') source.factionIds.forEach(id => factionIds.add(id))
      queue.push(source.id)
    })
  }

  return {
    factionIds: Array.from(factionIds).sort(compareIds),
    ...(warscrollId ? { warscrollId } : {}),
    contentGroupIds: Array.from(contentGroupIds).sort(compareIds),
  }
}

/** Drops keys whose values are undefined so canonical values serialize identically every run. */
const toJsonValue = (value: unknown): ChangelogJsonValue => JSON.parse(JSON.stringify(value))

const canonicalTiming = (timing: AbilityTiming): ChangelogJsonValue => {
  const fact: Record<string, ChangelogJsonValue> = {
    kind: timing.kind,
    window: toJsonValue(timing.window),
  }
  if (timing.perspective) fact.perspective = timing.perspective
  if (timing.priority) fact.priority = timing.priority
  if (timing.usage) fact.usage = toJsonValue(timing.usage)
  return fact
}

/**
 * The canonical fact fields compared between snapshots, keyed by dotted field path. Incidental
 * serialization (raw timing wording, revisions, provenance indexes) never appears here, so
 * wording-noise regeneration produces no records.
 */
const canonicalFacts = (
  view: CatalogView,
  entity: ContentEntity
): Map<string, ChangelogJsonValue | undefined> => {
  const facts = new Map<string, ChangelogJsonValue | undefined>()
  facts.set('name', entity.name)
  if (entity.kind === 'ability') {
    facts.set('text.declare', entity.text.declare)
    facts.set('text.reactionTrigger', entity.text.reactionTrigger)
    facts.set('text.effect', entity.text.effect)
    facts.set('timings', entity.timings.map(canonicalTiming))
    facts.set('cost', entity.cost ? toJsonValue(entity.cost) : undefined)
  }
  if (entity.kind === 'warscroll') {
    facts.set('characteristics.move', entity.characteristics.move)
    facts.set('characteristics.save', entity.characteristics.save)
    facts.set('characteristics.control', entity.characteristics.control)
    facts.set('characteristics.health', entity.characteristics.health)
    facts.set('characteristics.ward', entity.characteristics.ward)
  }
  if (entity.kind === 'battle-profile') {
    facts.set('unitSize', entity.unitSize)
    facts.set('points', entity.points)
    facts.set('pointsStatus', entity.pointsStatus)
  }
  facts.set(
    'availability',
    (view.grantsByTarget.get(entity.id) ?? [])
      .map(relationship => `${relationship.kind}:${relationship.from}`)
      .sort(compareIds)
  )
  return facts
}

const sameFact = (left: ChangelogJsonValue | undefined, right: ChangelogJsonValue | undefined): boolean =>
  (left === undefined) === (right === undefined) &&
  stableCompactJson(left ?? null) === stableCompactJson(right ?? null)

const definedFacts = (
  facts: Map<string, ChangelogJsonValue | undefined>
): Record<string, ChangelogJsonValue> =>
  Object.fromEntries(
    Array.from(facts).filter((entry): entry is [string, ChangelogJsonValue] => entry[1] !== undefined)
  )

type DistributiveOmit<T, TKey extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<TKey, keyof T>>
  : never

/** A change record before cohort disposition assigns (or withholds) its attribution. */
type PendingRecord = DistributiveOmit<ChangeRecord, 'attribution'>

const matchesSelector = (selector: ChangelogFactSelector | undefined, record: PendingRecord): boolean => {
  if (!selector) return true
  if (selector.entityIds?.includes(record.entityId)) return true
  if (
    selector.factionIds?.some(
      factionId => factionId === record.entityId || record.ownership.factionIds.includes(factionId)
    )
  ) {
    return true
  }
  if (
    selector.warscrollIds?.some(
      warscrollId => warscrollId === record.entityId || record.ownership.warscrollId === warscrollId
    )
  ) {
    return true
  }
  return false
}

const publicationAttribution = (publication: ChangelogPublicationInput): ChangeAttribution => ({
  kind: 'publication',
  publicationId: publication.publicationId,
  name: publication.name,
  source: publication.source,
  ...(publication.effectiveDate ? { effectiveDate: publication.effectiveDate } : {}),
})

const attributeRecord = (
  record: PendingRecord,
  acceptance: ChangelogAcceptance,
  publicationsById: Map<CanonicalId<'publication'>, ChangelogPublicationInput>
): ChangeAttribution | undefined => {
  const cohorts = acceptance.cohorts.filter(cohort => matchesSelector(cohort.selector, record))
  if (cohorts.length !== 1) {
    throw new Error(
      `Change record for ${record.entityId} matched ${cohorts.length} acceptance cohorts; every change must belong to exactly one cohort`
    )
  }
  const cohort = cohorts[0]
  if (cohort.disposition === 'churn') return undefined
  if (cohort.disposition === 'correction') return { kind: 'correction' }

  const publications = (
    cohort.publicationIds ?? acceptance.publications.map(publication => publication.publicationId)
  ).map(publicationId => {
    const publication = publicationsById.get(publicationId)
    if (!publication) {
      throw new Error(`Cohort "${cohort.name}" references the unknown publication ${publicationId}`)
    }
    return publication
  })
  if (!publications.length) {
    throw new Error(`Rules-driven cohort "${cohort.name}" carries no publications to attribute`)
  }
  if (publications.length === 1) return publicationAttribution(publications[0])

  const matches = publications.filter(publication => matchesSelector(publication.selector, record))
  if (matches.length !== 1) {
    throw new Error(
      `Rules-driven change for ${record.entityId} matched ${matches.length} publication selectors in cohort "${cohort.name}"; expected exactly one`
    )
  }
  return publicationAttribution(matches[0])
}

/**
 * Pure, deterministic diff of two inflated catalogs into publication-attributed change records.
 *
 * Every comparison is keyed on canonical IDs; renames are modified records carrying the old and
 * new name. Selection predicates derive from the prior catalog's relationship graph (the current
 * catalog's for added content, which the prior graph cannot describe).
 */
export const diffAos4Catalogs = (
  prior: Aos4Catalog,
  current: Aos4Catalog,
  acceptance: ChangelogAcceptance
): ChangelogArtifact => {
  const priorView = createView(prior)
  const currentView = createView(current)
  const publicationsById = new Map(
    acceptance.publications.map(publication => [publication.publicationId, publication])
  )

  const entityIds = Array.from(
    new Set<CanonicalId>(
      Array.from(priorView.entitiesById.keys()).concat(Array.from(currentView.entitiesById.keys()))
    )
  ).sort(compareIds)

  const pending: PendingRecord[] = []
  entityIds.forEach(entityId => {
    const priorEntity = priorView.entitiesById.get(entityId)
    const currentEntity = currentView.entitiesById.get(entityId)
    if (priorEntity && !currentEntity) {
      pending.push({
        changeKind: 'removed',
        entityId,
        entityKind: priorEntity.kind,
        name: priorEntity.name,
        predicate: selectionPredicate(priorView, priorEntity),
        ownership: ownershipOf(priorView, priorEntity),
        removedFacts: definedFacts(canonicalFacts(priorView, priorEntity)),
      })
      return
    }
    if (!priorEntity && currentEntity) {
      pending.push({
        changeKind: 'added',
        entityId,
        entityKind: currentEntity.kind,
        name: currentEntity.name,
        predicate: selectionPredicate(currentView, currentEntity),
        ownership: ownershipOf(currentView, currentEntity),
        addedFacts: definedFacts(canonicalFacts(currentView, currentEntity)),
      })
      return
    }
    if (!priorEntity || !currentEntity) return

    const priorFacts = canonicalFacts(priorView, priorEntity)
    const currentFacts = canonicalFacts(currentView, currentEntity)
    const fields: ChangeFieldDelta[] = []
    const fieldNames = new Set(Array.from(priorFacts.keys()).concat(Array.from(currentFacts.keys())))
    fieldNames.forEach(field => {
      const previous = priorFacts.get(field)
      const next = currentFacts.get(field)
      if (sameFact(previous, next)) return
      fields.push({
        field,
        ...(previous !== undefined ? { previous } : {}),
        ...(next !== undefined ? { next } : {}),
      })
    })
    if (!fields.length) return
    pending.push({
      changeKind: 'modified',
      entityId,
      entityKind: currentEntity.kind,
      name: currentEntity.name,
      predicate: selectionPredicate(priorView, priorEntity),
      ownership: ownershipOf(currentView, currentEntity),
      fields,
    })
  })

  const records: ChangeRecord[] = []
  pending.forEach(record => {
    const attribution = attributeRecord(record, acceptance, publicationsById)
    if (!attribution) return
    records.push({ ...record, attribution } as ChangeRecord)
  })
  records.sort((left, right) => {
    const leftPublication =
      left.attribution.kind === 'publication' ? left.attribution.publicationId : 'correction'
    const rightPublication =
      right.attribution.kind === 'publication' ? right.attribution.publicationId : 'correction'
    return (
      compareIds(leftPublication, rightPublication) ||
      compareIds(left.entityKind, right.entityKind) ||
      compareIds(left.entityId, right.entityId)
    )
  })

  const publications: ChangelogPublication[] = [...acceptance.publications]
    .sort((left, right) => compareIds(left.publicationId, right.publicationId))
    .map(publication => ({
      publicationId: publication.publicationId,
      name: publication.name,
      source: publication.source,
      ...(publication.effectiveDate ? { effectiveDate: publication.effectiveDate } : {}),
    }))

  return {
    schemaVersion: AOS4_CHANGELOG_SCHEMA_VERSION,
    priorGeneratedAt: prior.generatedAt,
    currentGeneratedAt: current.generatedAt,
    publications,
    records,
  }
}
