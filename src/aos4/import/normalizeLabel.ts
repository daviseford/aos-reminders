const LEADING_BULLET_PATTERN = /^\s*[•*+-]\s*/
const LEADING_COUNT_PATTERN = /^\s*\d+\s*[x×]\s+/i
const TRAILING_MODEL_COUNT_PATTERN = /\s*\(\s*\d+\s+models?\s*\)\s*$/i
const TRAILING_POINTS_PATTERN = /\s*(?:[-–—]\s*)?\(?\d+\s*(?:pts?|points)\)?\s*$/i
const PUNCTUATION_PATTERN = /[^\p{Letter}\p{Number}]+/gu

export const normalizeImportLabel = (value: string): string =>
  value
    .normalize('NFKC')
    .replace(LEADING_BULLET_PATTERN, '')
    .replace(LEADING_COUNT_PATTERN, '')
    .replace(TRAILING_MODEL_COUNT_PATTERN, '')
    .replace(TRAILING_POINTS_PATTERN, '')
    .toLocaleLowerCase('en')
    .replace(PUNCTUATION_PATTERN, ' ')
    .trim()
    .replace(/\s+/g, ' ')
