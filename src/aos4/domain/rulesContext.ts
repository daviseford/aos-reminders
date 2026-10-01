import type { CanonicalId, RulesContextId } from './identity'

export type RulesMode = 'standard' | 'spearhead' | 'other'
/**
 * `past-season` is a lapsed General's Handbook kept selectable in its own right (#2042): its
 * season's battlepack content paired with today's standard warscrolls, battletomes, and points.
 * It is distinct from `seasonal` (the sitting handbook, of which there is exactly one) and from
 * `historical` (the aggregate boundary for everything retired, which it overlaps but never
 * replaces).
 */
export type RulesContextStatus = 'current' | 'seasonal' | 'past-season' | 'legends' | 'historical'

export interface RulesContext {
  id: RulesContextId
  name: string
  mode: RulesMode
  status: RulesContextStatus
  publicationIds: CanonicalId<'publication'>[]
  battlepack?: string
  season?: string
  validFrom?: string
  validTo?: string
  rawMode?: string
}
