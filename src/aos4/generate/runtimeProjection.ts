import type {
  Aos4Catalog,
  ContentEntity,
  SourceArtifact,
  SourceLocator,
  SourcePublisher,
  SourceRecordId,
} from '../domain'
import { stableJson } from './serialization'

export const AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION = 1 as const

export interface RuntimeSourceLink {
  sourceRecordId: SourceRecordId
  publisher: SourcePublisher
  title: string
  url: string
  locator: SourceLocator
}

export interface Aos4RuntimeProjection {
  schemaVersion: typeof AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION
  catalogSchemaVersion: Aos4Catalog['schemaVersion']
  generatedAt: string
  attribution: string
  rulesContexts: Aos4Catalog['rulesContexts']
  entities: ContentEntity[]
  relationships: Aos4Catalog['relationships']
  sourceLinks: RuntimeSourceLink[]
}

const runtimeEntity = (entity: ContentEntity): ContentEntity => ({
  ...entity,
  rulesContextIds: [...entity.rulesContextIds].sort((left, right) => left.localeCompare(right)),
  sourceRefs: entity.sourceRefs
    .map(reference => ({
      sourceRecordId: reference.sourceRecordId,
      ...(reference.field ? { field: reference.field } : {}),
    }))
    .sort(
      (left, right) =>
        left.sourceRecordId.localeCompare(right.sourceRecordId) ||
        (left.field ?? '').localeCompare(right.field ?? '')
    ),
})

export const createRuntimeProjection = (catalog: Aos4Catalog, attribution: string): Aos4RuntimeProjection => {
  const artifactById = new Map(catalog.sourceArtifacts.map(artifact => [artifact.id, artifact]))
  const referencedRecords = new Set(
    catalog.entities.flatMap(entity => entity.sourceRefs.map(reference => reference.sourceRecordId))
  )
  const sourceLinks = catalog.sourceRecords
    .filter(record => referencedRecords.has(record.id))
    .flatMap(record => {
      const artifact: SourceArtifact | undefined = artifactById.get(record.artifactId)
      if (!artifact) return []
      return [
        {
          sourceRecordId: record.id,
          publisher: artifact.publisher,
          title: artifact.title,
          url: artifact.sourceUrl,
          locator: record.locator,
        },
      ]
    })
    .sort((left, right) => left.sourceRecordId.localeCompare(right.sourceRecordId))

  return {
    schemaVersion: AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION,
    catalogSchemaVersion: catalog.schemaVersion,
    generatedAt: catalog.generatedAt,
    attribution,
    rulesContexts: [...catalog.rulesContexts].sort((left, right) => left.id.localeCompare(right.id)),
    entities: catalog.entities.map(runtimeEntity).sort((left, right) => left.id.localeCompare(right.id)),
    relationships: [...catalog.relationships].sort((left, right) => left.id.localeCompare(right.id)),
    sourceLinks,
  }
}

export const serializeRuntimeProjection = (projection: Aos4RuntimeProjection): string =>
  stableJson(projection)
