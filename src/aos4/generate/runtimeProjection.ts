import type {
  Aos4Catalog,
  CanonicalId,
  ContentEntity,
  ContentRelationship,
  ArtifactId,
  SourceLocator,
  SourcePublisher,
  SourceRecordId,
  RulesContextId,
} from '../domain'
import { stableCompactJson } from './serialization'

export const AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION = 1 as const

export interface RuntimeSourceArtifact {
  id: ArtifactId
  publisher: SourcePublisher
  title: string
  url: string
}

export interface RuntimeSourceRecord {
  id: SourceRecordId
  artifactId: ArtifactId
  locator: SourceLocator
  rulesContextIndexes: number[]
}

type DistributiveOmit<T, TKey extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<TKey, keyof T>>
  : never

export type RuntimeContentEntity = DistributiveOmit<
  ContentEntity,
  'revision' | 'rulesContextIds' | 'sourceRefs'
> & {
  rulesContextIndexes: number[]
  sourceRecordIndexes: number[]
}

export interface RuntimeContentRelationship {
  kind: ContentRelationship['kind']
  fromEntityIndex: number
  toEntityIndex: number
  rulesContextIndexes: number[]
}

export interface Aos4RuntimeProjection {
  schemaVersion: typeof AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION
  catalogSchemaVersion: Aos4Catalog['schemaVersion']
  generatedAt: string
  attribution: string
  rulesContexts: Aos4Catalog['rulesContexts']
  entities: RuntimeContentEntity[]
  relationships: RuntimeContentRelationship[]
  sourceArtifacts: RuntimeSourceArtifact[]
  sourceRecords: RuntimeSourceRecord[]
}

const runtimeEntity = (
  entity: ContentEntity,
  sourceRecordIndexById: Map<SourceRecordId, number>,
  rulesContextIndexById: Map<RulesContextId, number>
): RuntimeContentEntity => {
  const runtime = Object.fromEntries(
    Object.entries(entity).filter(([key]) => !['revision', 'rulesContextIds', 'sourceRefs'].includes(key))
  )
  const sourceRecordIndexes = Array.from(
    new Set(
      entity.sourceRefs.flatMap(reference => {
        const index = sourceRecordIndexById.get(reference.sourceRecordId)
        return index === undefined ? [] : [index]
      })
    )
  ).sort((left, right) => left - right)
  return {
    ...runtime,
    rulesContextIndexes: entity.rulesContextIds.map(id => {
      const index = rulesContextIndexById.get(id)
      if (index === undefined) throw new Error(`Runtime entity ${entity.id} has an unknown context`)
      return index
    }),
    sourceRecordIndexes,
  } as RuntimeContentEntity
}

export const createRuntimeProjection = (catalog: Aos4Catalog, attribution: string): Aos4RuntimeProjection => {
  const rulesContexts = [...catalog.rulesContexts].sort((left, right) => left.id.localeCompare(right.id))
  const rulesContextIndexById = new Map(rulesContexts.map((context, index) => [context.id, index]))
  const referencedRecords = new Set(
    catalog.entities.flatMap(entity => entity.sourceRefs.map(reference => reference.sourceRecordId))
  )
  const sourceRecords = catalog.sourceRecords
    .filter(record => referencedRecords.has(record.id))
    .map(record => ({
      id: record.id,
      artifactId: record.artifactId,
      locator: record.locator,
      rulesContextIndexes: record.rulesContextIds.map(id => {
        const index = rulesContextIndexById.get(id)
        if (index === undefined) throw new Error(`Runtime source record ${record.id} has an unknown context`)
        return index
      }),
    }))
    .sort((left, right) => left.id.localeCompare(right.id))
  const sourceRecordIndexById = new Map(sourceRecords.map((record, index) => [record.id, index]))
  const referencedArtifactIds = new Set(sourceRecords.map(record => record.artifactId))
  const sourceArtifacts = catalog.sourceArtifacts
    .filter(artifact => referencedArtifactIds.has(artifact.id))
    .map(artifact => ({
      id: artifact.id,
      publisher: artifact.publisher,
      title: artifact.title,
      url: artifact.sourceUrl,
    }))
    .sort((left, right) => left.id.localeCompare(right.id))
  const entities = [...catalog.entities].sort((left, right) => left.id.localeCompare(right.id))
  const entityIndexById = new Map<CanonicalId, number>(entities.map((entity, index) => [entity.id, index]))
  const relationships = [...catalog.relationships]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(relationship => {
      const fromEntityIndex = entityIndexById.get(relationship.from)
      const toEntityIndex = entityIndexById.get(relationship.to)
      if (fromEntityIndex === undefined || toEntityIndex === undefined) {
        throw new Error(`Runtime relationship ${relationship.id} has a missing endpoint`)
      }
      return {
        kind: relationship.kind,
        fromEntityIndex,
        toEntityIndex,
        rulesContextIndexes: (relationship.rulesContextIds ?? rulesContexts.map(context => context.id)).map(
          id => {
            const index = rulesContextIndexById.get(id)
            if (index === undefined) {
              throw new Error(`Runtime relationship ${relationship.id} has an unknown context`)
            }
            return index
          }
        ),
      }
    })

  return {
    schemaVersion: AOS4_RUNTIME_PROJECTION_SCHEMA_VERSION,
    catalogSchemaVersion: catalog.schemaVersion,
    generatedAt: catalog.generatedAt,
    attribution,
    rulesContexts,
    entities: entities.map(entity => runtimeEntity(entity, sourceRecordIndexById, rulesContextIndexById)),
    relationships,
    sourceArtifacts,
    sourceRecords,
  }
}

export const serializeRuntimeProjection = (projection: Aos4RuntimeProjection): string =>
  stableCompactJson(projection)
