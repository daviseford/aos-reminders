import type { RulesContext } from '../domain'
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
  /**
   * Consult the alias only while resolving in a context of this status. For a name that is
   * correct verbatim in the sitting season but reaches a past season (#2042) only through a
   * misspelled catalog entry: the sitting season keeps its own verbatim match.
   */
  rulesContextStatus?: RulesContext['status']
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
  {
    from: 'Dawner’s Triumph',
    to: 'Dawners Triumph',
    reason:
      'Catalog defect: the generated warscroll and battle profile drop the apostrophe ' +
      '("Dawners Triumph"). Rosters spell it possessively, and normalization splits "Dawner’s" ' +
      'into two words, so the correct spelling matches nothing. Remove once the source is fixed.',
  },
  {
    from: 'Kurnoth Hunters with Kurnoth Greatbows',
    to: 'Kurnoth Hunters with Greatbows',
    reason:
      'Provider divergence: New Recruit repeats the "Kurnoth" prefix on the weapon, which the ' +
      'warscroll name does not. The weapon really is a Kurnoth Greatbow; only the warscroll ' +
      'title omits it.',
  },
  {
    from: 'Ogor Gluttons',
    to: 'Gluttons',
    reason:
      'Provider divergence: the July 2026 Battletome: Ogor Mawtribes renamed the unit "Gluttons", ' +
      'but rosters written against the index-era warscroll (and exports from tools that have not ' +
      'updated) still say "Ogor Gluttons". Same unit, same canonical warscroll identity (issue #1880).',
  },
  {
    from: 'Kurnoth Hunters with Kurnoth Greatswords',
    to: 'Kurnoth Hunters with Greatswords',
    reason:
      'Provider divergence: New Recruit repeats the "Kurnoth" prefix on the weapon, which the ' +
      'warscroll name does not. The weapon really is a Kurnoth Greatsword; only the warscroll ' +
      'title omits it.',
  },
  {
    from: 'Kurnoth Hunters with Kurnoth Scythes',
    to: 'Kurnoth Hunters with Greatscythes',
    reason:
      'Provider divergence: New Recruit both repeats the "Kurnoth" prefix and shortens ' +
      '"Greatscythes" to "Scythes". The weapon is a Kurnoth Greatscythe, so neither spelling is ' +
      'wrong about the model — they just disagree about the warscroll title.',
  },
  {
    from: 'Kurnoth Hunters with Kurnoth Greatswords (Scourge of Aqshy)',
    to: 'Scourge of Aqshy Kurnoth Hunters with Greatswords',
    reason:
      'Provider divergence: New Recruit marks the seasonal variant with a trailing parenthetical ' +
      'while the catalog carries the expansion as a name prefix, on top of the same repeated ' +
      '"Kurnoth" the other three variants show.',
  },
  {
    from: 'Infernal Enrapturess, Herald of Slaanesh (Scourge of Aqshy)',
    to: 'Scourge of Aqshy Infernal Enrapturess',
    reason:
      'Provider divergence: New Recruit marks the seasonal variant with a trailing parenthetical ' +
      'on the full official title, while the catalog’s seasonal warscroll drops the ' +
      '"Herald of Slaanesh" honorific that the battletome warscroll carries. Rewriting the ' +
      'qualifier into the usual battlepack prefix therefore matches nothing without this entry.',
  },
  {
    from: 'Scourge of Aqshy: Infernal Enrapturess, Herald of Slaanesh',
    to: 'Scourge of Aqshy Infernal Enrapturess',
    reason:
      'Provider divergence: the official app writes the seasonal variant as a battlepack-prefixed ' +
      'line with the full official title, while the catalog’s seasonal warscroll drops the ' +
      '"Herald of Slaanesh" honorific. Same divergence as the New Recruit spelling above, in the ' +
      'order the official app prints it.',
  },
  {
    from: 'Knives of the Crone',
    to: 'The Knives of the Crone',
    reason:
      'Provider divergence: the official app drops this warband’s leading article, though it ' +
      'keeps it on every other one in the same list ("The Shadeborn"). Not generalized to a ' +
      'leading-article rule, because "The Roving Maw" and "Ironsunz" would then collide with ' +
      'anything spelled either way.',
  },
  {
    from: 'Benedictions of Sickness',
    to: 'Bendictions of Sickness',
    rulesContextStatus: 'past-season',
    reason:
      'Catalog defect, General’s Handbook 2025-26 only (#2042): Wahapedia prints the Scourge of ' +
      'Ghyran Maggotkin prayer lore as "Bendictions of Sickness", while the official Scourge of ' +
      'Ghyran - Maggotkin of Nurgle pack prints BENEDICTIONS OF SICKNESS. Scoped to the past ' +
      'season because the 2026-27 Scourge of Aqshy lore of the correct name is a different lore ' +
      'and must keep its verbatim match. Remove once the upstream spelling is corrected.',
  },
]

const aliasIndex = new Map(
  IMPORT_LABEL_ALIASES.map(alias => [normalizeImportLabel(alias.from), alias] as const)
)

/**
 * The catalog-side name for a roster label, when a reviewed alias covers it.
 *
 * Matching is done on the normalized form so an entry survives the punctuation and casing
 * differences providers introduce, rather than needing one row per spelling of an apostrophe.
 */
export const aliasedImportLabel = (
  label: string,
  context?: Pick<RulesContext, 'status'>
): string | undefined => {
  const alias = aliasIndex.get(normalizeImportLabel(label))
  if (!alias) return undefined
  if (alias.rulesContextStatus && alias.rulesContextStatus !== context?.status) return undefined
  return alias.to
}
