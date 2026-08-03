/**
 * Shared Unicode-hardened display-name folding (issue #1875).
 *
 * Sources spell the same rule name with different Unicode punctuation: the runtime carries
 * `HEAT-SEEKING AUTO‑ENDRIN` with a U+2011 non-breaking hyphen while the official Battle
 * Profiles document prints `Heat-seeking Auto-endrin`, and curly-quote/straight-quote pairs differ
 * the same way (issue #1851). Names are display text, never durable identity, so every comparison
 * of names across sources must fold these variants instead of trusting raw code points.
 *
 * This module is the one place that folding lives. `canonicalOfficialProfileName`
 * (`src/aos4/generate/officialBattleProfiles.ts`), the reconciliation linker
 * (`src/aos4/reconcile/linkRecords.ts`), and the official-profile sweep
 * (`src/aos4/review/officialProfileSweep.ts`) all derive from it — do not add another ad hoc
 * name normalizer beside these.
 *
 * Both output forms keep only `[a-z0-9]`, so folding dash/quote variants first can never change
 * the result of the historical implementations these functions replace (a folded `-` or `'` is
 * removed or spaced exactly as the unfolded variant was). The fold exists so the intermediate
 * form is explicit and so future comparisons that preserve punctuation inherit the hardening.
 */

/**
 * The conservative combining-mark range (U+0300-U+036F) the reconciliation linker has always
 * stripped. Widening it (for example to `\p{M}`) could change reconciliation matching, which is
 * corpus territory — keep the historical range unless a reviewed corpus change requires more.
 */
const COMBINING_MARKS = /[\u0300-\u036f]/g

/** Hyphen (U+2010), non-breaking hyphen (U+2011), figure/en/em dash, horizontal bar, minus. */
const DASH_VARIANTS = /[\u2010-\u2015\u2212]/g

/** Left/right single quotation marks, low-9/reversed-9 variants, prime. */
const SINGLE_QUOTE_VARIANTS = /[\u2018\u2019\u201a\u201b\u2032]/g

/** Left/right double quotation marks, low-9/reversed-9 variants, double prime. */
const DOUBLE_QUOTE_VARIANTS = /[\u201c\u201d\u201e\u201f\u2033]/g

/**
 * Folds Unicode spelling variants of a display name: compatibility-decomposes, strips combining
 * marks, folds dash and quote variants onto their ASCII forms, and casefolds.
 */
export const foldUnicodeName = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .replace(DASH_VARIANTS, '-')
    .replace(SINGLE_QUOTE_VARIANTS, "'")
    .replace(DOUBLE_QUOTE_VARIANTS, '"')
    .toLowerCase()

/**
 * The strict identity key of a display name: folded, with everything outside `[a-z0-9]` removed.
 * Two names with equal keys are the same name for cross-source matching purposes.
 */
export const canonicalNameKey = (value: string): string => foldUnicodeName(value).replace(/[^a-z0-9]+/g, '')

/**
 * The space-preserving comparison form used by the reconciliation linker: folded, with runs
 * outside `[a-z0-9]` collapsed to single spaces so word boundaries survive.
 */
export const normalizedNameText = (value: string): string =>
  foldUnicodeName(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
