import type { Aos4Catalog, SourceArtifact, SourceRecord } from '../../domain'
import type { Aos4RuntimeProjection } from '../../generate'
import { AOS4_RUNTIME_PROJECTION } from './catalog'

/** The half of the runtime projection `./catalog` deliberately leaves behind. */
export type Aos4RuntimeSources = Pick<Aos4RuntimeProjection, 'sourceArtifacts' | 'sourceRecords'>

/** The source artifacts and records in domain shape, once the sources chunk has arrived. */
export type Aos4SourceData = Pick<Aos4Catalog, 'sourceArtifacts' | 'sourceRecords'>

/**
 * The runtime shape in domain shape. Exported so a caller that already holds the artifact — a test
 * reattaching provenance, say — gets exactly what the loader would have produced, rather than a
 * second copy of this mapping that can drift from it.
 */
export const materializeAos4SourceData = (runtime: Aos4RuntimeSources): Aos4SourceData => ({
  sourceArtifacts: runtime.sourceArtifacts.map(
    (artifact): SourceArtifact => ({
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
      retrievedAt: AOS4_RUNTIME_PROJECTION.generatedAt,
      sourceUrl: artifact.url,
      checksum: artifact.id.slice('artifact:sha256:'.length),
      mediaType: 'application/octet-stream',
    })
  ),
  sourceRecords: runtime.sourceRecords.map(
    (record): SourceRecord => ({
      id: record.id,
      artifactId: record.artifactId,
      locator: record.locator,
      recordChecksum: 'runtime-projection',
      rulesContextIds: record.rulesContextIndexes.map(
        index => AOS4_RUNTIME_PROJECTION.rulesContexts[index].id
      ),
    })
  ),
})

let pending: Promise<Aos4SourceData> | undefined

/**
 * The sources half of the corpus, fetched on demand and kept.
 *
 * The dynamic import is what keeps `runtime.sources.json` out of the chunk `./catalog` lands in, so
 * a rendered army never pays for citations nobody opened. Concurrent and repeated callers share one
 * in-flight promise, so a screen full of reminder menus still fetches the chunk once.
 *
 * A failure is *not* kept: the memo is cleared so the next caller retries, rather than leaving the
 * menu permanently unavailable because one fetch happened while the network was down.
 */
export const loadAos4SourceData = (): Promise<Aos4SourceData> => {
  pending ??= import('./runtime.sources.json')
    .then(module => materializeAos4SourceData(module.default as unknown as Aos4RuntimeSources))
    .catch((error: unknown) => {
      pending = undefined
      throw error
    })
  return pending
}
