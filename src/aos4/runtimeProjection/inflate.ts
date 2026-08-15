import {
  AOS4_CATALOG_SCHEMA_VERSION,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
  type ContentRelationship,
  type SourceArtifact,
  type SourceRecord,
} from '../domain'
import {
  AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION,
  type Aos4RuntimeProjection,
} from '../generate/runtimeProjection'

/**
 * A runtime projection inflated back into the catalog shape the application consumes.
 *
 * Both the checked-in browser adapter (`src/aos4/generated/corpus/catalog.ts`) and Node-side
 * generation tooling inflate projections through this module, so a projection whose schema drifted
 * fails closed in one place instead of being silently cast.
 */
export interface InflatedAos4Runtime {
  projection: Aos4RuntimeProjection
  catalog: Aos4Catalog
}

const fail = (message: string): never => {
  throw new Error(`AoS 4 runtime projection is not usable: ${message}`)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const requireArray = (value: unknown, field: string): unknown[] => {
  if (!Array.isArray(value)) fail(`${field} must be an array`)
  return value as unknown[]
}

const requireIndexes = (value: unknown, field: string, limit: number): void => {
  requireArray(value, field).forEach(index => {
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= limit) {
      fail(`${field} refers to the out-of-range index ${String(index)}`)
    }
  })
}

const validateProjection = (input: unknown): Aos4RuntimeProjection => {
  if (!isRecord(input)) fail('the projection must be an object')
  const candidate = input as Record<string, unknown>
  if (candidate.schemaVersion !== AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION) {
    fail(
      `unsupported projection schema version ${String(candidate.schemaVersion)} (expected ${AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION})`
    )
  }
  if (candidate.catalogSchemaVersion !== AOS4_CATALOG_SCHEMA_VERSION) {
    fail(
      `unsupported catalog schema version ${String(candidate.catalogSchemaVersion)} (expected ${AOS4_CATALOG_SCHEMA_VERSION})`
    )
  }
  if (typeof candidate.generatedAt !== 'string' || !candidate.generatedAt) {
    fail('generatedAt must be a non-empty string')
  }
  if (typeof candidate.attribution !== 'string' || !candidate.attribution) {
    fail('attribution must be a non-empty string')
  }

  const rulesContexts = requireArray(candidate.rulesContexts, 'rulesContexts')
  const sourceRecords = requireArray(candidate.sourceRecords, 'sourceRecords')
  const entities = requireArray(candidate.entities, 'entities')
  const relationships = requireArray(candidate.relationships, 'relationships')
  requireArray(candidate.sourceArtifacts, 'sourceArtifacts')

  sourceRecords.forEach((record, index) => {
    if (!isRecord(record) || typeof record.id !== 'string' || typeof record.artifactId !== 'string') {
      return fail(`sourceRecords[${index}] must carry string id and artifactId fields`)
    }
    requireIndexes(
      record.rulesContextIndexes,
      `sourceRecords[${index}].rulesContextIndexes`,
      rulesContexts.length
    )
  })

  entities.forEach((entity, index) => {
    if (
      !isRecord(entity) ||
      typeof entity.id !== 'string' ||
      typeof entity.kind !== 'string' ||
      typeof entity.name !== 'string'
    ) {
      return fail(`entities[${index}] must carry string id, kind, and name fields`)
    }
    requireIndexes(entity.rulesContextIndexes, `entities[${index}].rulesContextIndexes`, rulesContexts.length)
    requireIndexes(entity.sourceRecordIndexes, `entities[${index}].sourceRecordIndexes`, sourceRecords.length)
  })

  relationships.forEach((relationship, index) => {
    if (!isRecord(relationship) || typeof relationship.kind !== 'string') {
      return fail(`relationships[${index}] must carry a string kind`)
    }
    requireIndexes(
      [relationship.fromEntityIndex, relationship.toEntityIndex],
      `relationships[${index}] entity indexes`,
      entities.length
    )
    requireIndexes(
      relationship.rulesContextIndexes,
      `relationships[${index}].rulesContextIndexes`,
      rulesContexts.length
    )
  })

  return input as Aos4RuntimeProjection
}

export const inflateRuntimeProjection = (input: unknown): InflatedAos4Runtime => {
  const projection = validateProjection(input)

  const sourceArtifacts: SourceArtifact[] = projection.sourceArtifacts.map(artifact => ({
    id: artifact.id,
    publisher: artifact.publisher,
    authority: {
      kind:
        artifact.publisher === 'games-workshop'
          ? 'official'
          : artifact.publisher === 'wahapedia'
            ? 'secondary'
            : 'community',
    },
    title: artifact.title,
    edition: '4',
    language: 'en',
    retrievedAt: projection.generatedAt,
    sourceUrl: artifact.url,
    checksum: artifact.id.slice('artifact:sha256:'.length),
    mediaType: 'application/octet-stream',
  }))

  const sourceRecords: SourceRecord[] = projection.sourceRecords.map(record => ({
    id: record.id,
    artifactId: record.artifactId,
    locator: record.locator,
    recordChecksum: 'runtime-projection',
    rulesContextIds: record.rulesContextIndexes.map(index => projection.rulesContexts[index].id),
  }))

  const entities: ContentEntity[] = projection.entities.map(entity => {
    const { rulesContextIndexes, sourceRecordIndexes, ...content } = entity
    return {
      ...content,
      revision: 'runtime-projection',
      rulesContextIds: rulesContextIndexes.map(index => projection.rulesContexts[index].id),
      sourceRefs: sourceRecordIndexes.map(index => ({
        sourceRecordId: projection.sourceRecords[index].id,
      })),
    } as ContentEntity
  })

  const relationships: ContentRelationship[] = projection.relationships.map((relationship, index) => ({
    id: `relationship:runtime-${index}`,
    kind: relationship.kind,
    from: entities[relationship.fromEntityIndex].id as CanonicalId,
    to: entities[relationship.toEntityIndex].id as CanonicalId,
    rulesContextIds: relationship.rulesContextIndexes.map(
      contextIndex => projection.rulesContexts[contextIndex].id
    ),
  }))

  return {
    projection,
    catalog: {
      schemaVersion: projection.catalogSchemaVersion,
      generatedAt: projection.generatedAt,
      rulesContexts: projection.rulesContexts,
      sourceArtifacts,
      sourceRecords,
      entities,
      relationships,
    },
  }
}
