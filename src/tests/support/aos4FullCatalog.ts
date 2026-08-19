import type { Aos4Catalog, ContentEntity } from '../../aos4/domain'
import {
  AOS4_CATALOG,
  AOS4_SOURCE_RECORD_INDEXES,
  materializeAos4SourceData,
  type Aos4RuntimeSources,
} from '../../aos4/generated'
import sourcesJson from '../../aos4/generated/corpus/runtime.sources.json'

/**
 * The shipped runtime catalog with its provenance re-attached.
 *
 * `AOS4_CATALOG` deliberately carries no source records and empty `sourceRefs`: the render path
 * never needs them, and parsing 20,078 citations to draw a reminder card was the largest cost Home
 * paid before it could show anything (see `src/aos4/generated/corpus/catalog.ts`). The citations
 * still ship, in `runtime.sources.json`, reached through the entity-keyed side table.
 *
 * Complete provenance for every entity is a product commitment (PRODUCT.md), so the cases that
 * check it validate *this* catalog — the whole corpus as a browser assembles it once a source menu
 * is opened. Re-pointing them here keeps them covering all 11,453 entities; asserting against the
 * core-only shape would quietly turn every provenance check into a check of nothing.
 */
export const AOS4_SOURCE_DATA = materializeAos4SourceData(sourcesJson as unknown as Aos4RuntimeSources)

export const AOS4_FULL_CATALOG: Aos4Catalog = {
  ...AOS4_CATALOG,
  sourceArtifacts: AOS4_SOURCE_DATA.sourceArtifacts,
  sourceRecords: AOS4_SOURCE_DATA.sourceRecords,
  entities: AOS4_CATALOG.entities.map(
    entity =>
      ({
        ...entity,
        sourceRefs: (AOS4_SOURCE_RECORD_INDEXES.get(entity.id) ?? []).map(index => ({
          sourceRecordId: AOS4_SOURCE_DATA.sourceRecords[index].id,
        })),
      }) as ContentEntity
  ),
}
