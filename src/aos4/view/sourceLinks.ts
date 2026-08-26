import type { Aos4Catalog, SourceArtifact, SourceLocator } from '../domain'

/** A source citation on a reminder card, shaped for the card's dropdown menu. */
export interface Aos4ReminderSourceLink {
  id: string
  label: string
  href?: string
  official: boolean
}

/**
 * A Wahapedia faction page: either the faction root (`.../factions/kruleboyz/`) or its warscroll
 * collection (`.../factions/kruleboyz/warscrolls.html`). Only these artifact URLs carry datasheet
 * sections whose anchors this module can deep-link.
 */
const WAHAPEDIA_FACTION_PAGE = /^https:\/\/wahapedia\.ru\/aos4\/factions\/[^/]+\/(?:warscrolls\.html)?$/

/**
 * The anchored datasheet a section locator names. Datasheet sections look like
 * `datasheet:Killaboss-with-Stab-grot/ability:1`; the leading segment is the page's own
 * `<a name>` anchor for that datasheet. A nested section
 * (`datasheet:Swampskulka-Gang:Beast-skewer-Killbow/...`) names an un-anchored child inside an
 * anchored parent, so the parent anchor is the closest linkable location.
 */
const datasheetAnchor = (locator: SourceLocator): string | undefined =>
  locator.kind === 'section' ? /^datasheet:([^/:]+)/.exec(locator.section)?.[1] : undefined

/**
 * Where a source record lives, as a browser destination (issue #1860). The artifact URL alone is
 * the page a record was read from, and for warscroll abilities that page is the faction-wide
 * `warscrolls.html` index — every unit's "view source" link landed at the top of the same index.
 * The record's section locator carries the unit's datasheet anchor, so:
 *
 * - on a `warscrolls.html` collection the anchor is also the slug of the unit's standalone page
 *   (`.../factions/kruleboyz/Killaboss-with-Stab-grot`) — link that page;
 * - on a faction root the anchored datasheets (regiment and Spearhead groups) have no standalone
 *   page, so link the root with the anchor as a fragment;
 * - anything else (rules pages, CSV exports, PDFs, non-datasheet sections) keeps the artifact URL.
 */
export const sourceRecordUrl = (
  artifact: Pick<SourceArtifact, 'publisher' | 'sourceUrl'>,
  locator: SourceLocator
): string => {
  const anchor =
    artifact.publisher === 'wahapedia' && WAHAPEDIA_FACTION_PAGE.test(artifact.sourceUrl)
      ? datasheetAnchor(locator)
      : undefined
  if (!anchor) return artifact.sourceUrl
  return artifact.sourceUrl.endsWith('/warscrolls.html')
    ? new URL(anchor, artifact.sourceUrl).toString()
    : `${artifact.sourceUrl}#${anchor}`
}

const sourceLabel = (artifact: SourceArtifact): string => {
  if (artifact.publisher === 'games-workshop') return artifact.title || 'Games Workshop'
  if (artifact.publisher === 'wahapedia') return artifact.title || 'Wahapedia'
  return artifact.title || 'Source'
}

/**
 * Resolves a reminder's source records to the links its card offers. One link per distinct
 * destination: a reminder citing several records of the same artifact still shows a single entry,
 * but records of one artifact that resolve to different unit pages stay distinct.
 *
 * Takes the loaded sources rather than the catalog, and reads records by projection index. An index
 * that names nothing — a truncated or mismatched sources artifact — drops that citation instead of
 * throwing, because a missing link is a far better outcome than a reminder card that cannot render.
 */
export const createAos4ReminderSourceLinkResolver = (
  sources: Pick<Aos4Catalog, 'sourceArtifacts' | 'sourceRecords'>
): ((reminder: { sourceRecordIndexes: readonly number[] }) => Aos4ReminderSourceLink[]) => {
  const artifactById = new Map(sources.sourceArtifacts.map(artifact => [artifact.id, artifact]))
  return reminder =>
    Array.from(
      new Map(
        reminder.sourceRecordIndexes.flatMap(index => {
          const record = sources.sourceRecords[index]
          const artifact = record ? artifactById.get(record.artifactId) : undefined
          if (!record || !artifact) return []
          const url = sourceRecordUrl(artifact, record.locator)
          const link: Aos4ReminderSourceLink = {
            id: `${artifact.id}#${url}`,
            label: sourceLabel(artifact),
            ...(url.startsWith('http') ? { href: url } : {}),
            official: artifact.publisher === 'games-workshop',
          }
          return [[link.id, link] as const]
        })
      ).values()
    )
}
