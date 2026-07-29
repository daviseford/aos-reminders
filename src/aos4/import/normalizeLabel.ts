const LEADING_BULLET_PATTERN = /^\s*[•*+-]\s*/
const LEADING_COUNT_PATTERN = /^\s*\d+\s*[x×]\s+/i
const TRAILING_MODEL_COUNT_PATTERN = /\s*\(\s*\d+\s+models?\s*\)\s*$/i
const TRAILING_POINTS_PATTERN = /\s*(?:[-–—]\s*)?\(?\d+\s*(?:pts?|points)\)?\s*$/i
const PUNCTUATION_PATTERN = /[^\p{Letter}\p{Number}]+/gu

const baseNormalize = (value: string): string =>
  value
    .normalize('NFKC')
    .replace(LEADING_BULLET_PATTERN, '')
    .replace(LEADING_COUNT_PATTERN, '')
    .replace(TRAILING_POINTS_PATTERN, '')
    .toLocaleLowerCase('en')
    .replace(PUNCTUATION_PATTERN, ' ')
    .trim()
    .replace(/\s+/g, ' ')

/**
 * Normalize a label for comparison, keeping any trailing model count.
 *
 * The catalog ships genuine size variants — "Crypt Flayers" *and* "Crypt Flayers (2 models)",
 * "Stormdrake Guard" *and* "Stormdrake Guard (1 model)" — so the count is part of the identity,
 * not noise. Compare with this first; only fall back to {@link normalizeImportLabel} when the
 * exact form finds nothing.
 */
export const normalizeImportLabelExact = (value: string): string => baseNormalize(value.normalize('NFKC'))

/**
 * Normalize a label for comparison, discarding a trailing model count.
 *
 * Providers append counts the catalog does not use ("Annihilators (3 models)"), so this is the
 * lenient fallback. It deliberately collapses the size variants above onto one another, which is
 * why it must not be used on its own — doing so makes every such pair ambiguous.
 */
export const normalizeImportLabel = (value: string): string =>
  baseNormalize(value.normalize('NFKC').replace(TRAILING_MODEL_COUNT_PATTERN, ''))
