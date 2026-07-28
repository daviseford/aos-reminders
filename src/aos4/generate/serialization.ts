import type { Aos4Catalog } from '../domain'

const stableValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableValue)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stableValue(child)])
  )
}

export const orderedAuditCatalog = (catalog: Aos4Catalog): Aos4Catalog => ({
  ...catalog,
  rulesContexts: [...catalog.rulesContexts].sort((left, right) => left.id.localeCompare(right.id)),
  sourceArtifacts: [...catalog.sourceArtifacts].sort((left, right) => left.id.localeCompare(right.id)),
  sourceRecords: [...catalog.sourceRecords].sort((left, right) => left.id.localeCompare(right.id)),
  entities: [...catalog.entities].sort((left, right) => left.id.localeCompare(right.id)),
  relationships: [...catalog.relationships].sort((left, right) => left.id.localeCompare(right.id)),
})

export const stableJson = (value: unknown): string => `${JSON.stringify(stableValue(value), null, 2)}\n`

export const stableCompactJson = (value: unknown): string => `${JSON.stringify(stableValue(value))}\n`

export const serializeAuditCatalog = (catalog: Aos4Catalog): string =>
  stableJson(orderedAuditCatalog(catalog))
