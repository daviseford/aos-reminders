import type {
  Aos4Catalog,
  CanonicalId,
  ContentEntity,
  ContentRelationship,
  SourceArtifact,
  SourceRecord,
} from '../../domain'
import type { Aos4RuntimeProjection } from '../../generate'
import defaultsJson from './defaults.json'
import runtimeJson from './runtime.json'

const projection = runtimeJson as unknown as Aos4RuntimeProjection
const defaults = defaultsJson as unknown as {
  schemaVersion: 1
  rulesContextId: Aos4Catalog['rulesContexts'][number]['id']
  defaultFactionId: CanonicalId<'faction'>
}

const sourceArtifacts: SourceArtifact[] = projection.sourceArtifacts.map(artifact => ({
  id: artifact.id,
  publisher: artifact.publisher,
  authority: {
    kind: artifact.publisher === 'games-workshop' ? 'official' : 'secondary',
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

export const AOS4_RUNTIME_PROJECTION = projection
export const AOS4_GENERATION_AUDIT = {
  schemaVersion: 1,
  generatedAt: projection.generatedAt,
  attribution: projection.attribution,
  reviewScope: 'Complete accepted AoS 4 corpus snapshot dated 2026-08-01.',
  acknowledgedDiagnostics: [],
  sourcePolicy: {
    officialPublisher: 'games-workshop',
    secondaryPublisher: 'wahapedia',
    rawSourceBodiesCommitted: false,
    structuredRuleFactsCommitted: true,
  },
} as const
export const AOS4_CATALOG: Aos4Catalog = {
  schemaVersion: projection.catalogSchemaVersion,
  generatedAt: projection.generatedAt,
  rulesContexts: projection.rulesContexts,
  sourceArtifacts,
  sourceRecords,
  entities,
  relationships,
}
export const AOS4_DEFAULT_RULES_CONTEXT_ID = defaults.rulesContextId
export const AOS4_DEFAULT_FACTION_ID = defaults.defaultFactionId
export const AOS4_DEFAULT_SELECTION_IDS = [defaults.defaultFactionId]
