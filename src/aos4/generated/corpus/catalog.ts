import type { Aos4Catalog, CanonicalId, ContentEntity, ContentRelationship } from '../../domain'
import type { Aos4RuntimeProjection } from '../../generate'
import defaultsJson from './defaults.json'
import runtimeCoreJson from './runtime.core.json'

/**
 * The half of the runtime projection the app renders from. The source artifacts and records live in
 * `./runtime.sources.json` and load through `./sources`, because nothing on the first-paint or
 * reminder-render path reads them and parsing 20,078 citations to draw a card was the largest cost
 * Home paid before it could show anything.
 */
export type Aos4RuntimeCore = Omit<Aos4RuntimeProjection, 'sourceArtifacts' | 'sourceRecords'>

const projection = runtimeCoreJson as unknown as Aos4RuntimeCore
const defaults = defaultsJson as unknown as {
  schemaVersion: 1
  rulesContextId: Aos4Catalog['rulesContexts'][number]['id']
  defaultFactionId: CanonicalId<'faction'>
}

const sourceRecordIndexesByEntityId = new Map<CanonicalId, readonly number[]>()

const entities: ContentEntity[] = projection.entities.map(entity => {
  const { rulesContextIndexes, sourceRecordIndexes, ...content } = entity
  sourceRecordIndexesByEntityId.set(entity.id as CanonicalId, sourceRecordIndexes)
  return {
    ...content,
    revision: 'runtime-projection',
    rulesContextIds: rulesContextIndexes.map(index => projection.rulesContexts[index].id),
    // Provenance travels beside the catalog in AOS4_SOURCE_RECORD_INDEXES rather than as ID strings
    // here: materializing them is what forced every source record into this chunk.
    sourceRefs: [],
  } as ContentEntity
})

/**
 * Every entity's source records, as indexes into the sources artifact's `sourceRecords`.
 *
 * Keyed by entity ID and covering all of them, not just the abilities a reminder cites: weapons,
 * warscrolls, content groups, battle profiles, publications, and factions all carry provenance, and
 * the guarantee that each one keeps it is a product commitment (see PRODUCT.md). Resolve an index
 * against `loadAos4SourceData()` from `./sources`.
 */
export const AOS4_SOURCE_RECORD_INDEXES: ReadonlyMap<CanonicalId, readonly number[]> =
  sourceRecordIndexesByEntityId

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
  // Empty by design: see AOS4_SOURCE_RECORD_INDEXES and `./sources`.
  sourceArtifacts: [],
  sourceRecords: [],
  entities,
  relationships,
}
export const AOS4_DEFAULT_RULES_CONTEXT_ID = defaults.rulesContextId
export const AOS4_DEFAULT_FACTION_ID = defaults.defaultFactionId
export const AOS4_DEFAULT_SELECTION_IDS = [defaults.defaultFactionId]
