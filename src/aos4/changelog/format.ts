import type { ChangelogJsonValue } from './types'

/** Renders a canonical changelog fact value for display, shared by every delta renderer. */
export const formatChangelogValue = (value: ChangelogJsonValue | undefined): string => {
  if (value === undefined || value === null) return '(none)'
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}
