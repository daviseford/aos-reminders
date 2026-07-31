import type { Aos4Catalog, CanonicalId, ContentEntity, ContentRelationship } from '../domain'

export interface CatalogIndex {
  entitiesById: Map<CanonicalId, ContentEntity>
  outgoingByEntityId: Map<CanonicalId, ContentRelationship[]>
}

export const createCatalogIndex = (catalog: Aos4Catalog): CatalogIndex => {
  const entitiesById = new Map<CanonicalId, ContentEntity>()
  const outgoingByEntityId = new Map<CanonicalId, ContentRelationship[]>()

  catalog.entities.forEach(entity => {
    if (!entitiesById.has(entity.id)) entitiesById.set(entity.id, entity)
  })

  catalog.relationships.forEach(relationship => {
    const existing = outgoingByEntityId.get(relationship.from) ?? []
    existing.push(relationship)
    outgoingByEntityId.set(relationship.from, existing)
  })

  outgoingByEntityId.forEach(outgoing => {
    outgoing.sort((left, right) => left.id.localeCompare(right.id))
  })

  return {
    entitiesById,
    outgoingByEntityId,
  }
}
