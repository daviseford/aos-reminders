import type { ChangelogJsonValue } from './types'

/** Renders a canonical changelog fact value for display, shared by every delta renderer. */
export const formatChangelogValue = (value: ChangelogJsonValue | undefined): string => {
  if (value === undefined || value === null) return '(none)'
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

/** Scalar-valued canonical fields that mean something to a player on their own. */
const DISPLAYABLE_FACT_FIELDS = new Set([
  'points',
  'unitSize',
  'move',
  'save',
  'control',
  'health',
  'ward',
  'cost',
  'keywords',
])

/**
 * Filters an added/removed record's canonical facts down to the player-meaningful ones, shared by
 * every fact renderer: rule text (`text.*`), points, unit size, warscroll characteristics, cost,
 * and keywords. Everything else is internal bookkeeping — canonical IDs in `availability`,
 * serialized `timings` objects, the `name` fact the record heading already carries — and only
 * scalar values render, so no raw JSON ever reaches the page.
 */
export const displayableChangeFacts = (
  facts: Record<string, ChangelogJsonValue>
): [field: string, value: ChangelogJsonValue][] =>
  Object.entries(facts).filter(
    ([field, value]) =>
      (field.startsWith('text.') || DISPLAYABLE_FACT_FIELDS.has(field)) &&
      (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
  )
