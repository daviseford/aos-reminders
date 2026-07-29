import { normalizeImportLabel } from './normalizeLabel'

/**
 * A reviewed correction from the name a provider emits to the name the catalog actually uses.
 *
 * This is deliberately a hand-maintained table and not fuzzy matching. A wrong resolution is worse
 * than an honest diagnostic: it produces confidently incorrect reminders that a player has no
 * reason to distrust. Edit distance would silently pair "Lord-Celestant" with "Lord-Celestant on
 * Dracoth"; an explicit entry can be argued with in review.
 */
export interface ImportLabelAlias {
  /** The label as it appears in rosters, spelled the way players and providers spell it. */
  from: string
  /** The name the catalog carries today — including its mistakes. */
  to: string
  /** Why the two differ. Every entry has to justify itself. */
  reason: string
}

/**
 * Known divergences between roster labels and catalog names.
 *
 * Two kinds of entry belong here:
 *
 * - **Catalog defects.** Where our own generated data misspells a name, rosters spell it correctly
 *   and would otherwise never match. These are temporary: fix the upstream source and the entry
 *   becomes stale, which `importLabelAliases.test.ts` will fail on so it gets removed.
 * - **Provider divergence.** Where a provider genuinely names something differently from the
 *   official rules.
 *
 * What does *not* belong here is a name the catalog is simply missing. An alias cannot invent an
 * entity, and pointing one at a near-miss would be exactly the silent mis-resolution this table
 * exists to avoid — such names must keep failing closed until the data is filled in.
 */
export const IMPORT_LABEL_ALIASES: ImportLabelAlias[] = [
  {
    from: 'Blood Blessings of Khorne',
    to: 'Blood Blesssings of Khorne',
    reason:
      'Catalog defect: the generated prayer lore carries a three-s misspelling ("Blesssings"). ' +
      'Rosters spell it correctly, so the correct spelling matches nothing. Remove once the ' +
      'upstream source is corrected.',
  },
]

const aliasIndex = new Map(IMPORT_LABEL_ALIASES.map(alias => [normalizeImportLabel(alias.from), alias.to]))

/**
 * The catalog-side name for a roster label, when a reviewed alias covers it.
 *
 * Matching is done on the normalized form so an entry survives the punctuation and casing
 * differences providers introduce, rather than needing one row per spelling of an apostrophe.
 */
export const aliasedImportLabel = (label: string): string | undefined =>
  aliasIndex.get(normalizeImportLabel(label))
