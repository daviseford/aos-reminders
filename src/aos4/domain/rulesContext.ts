import type { CanonicalId, RulesContextId } from './identity'

export type RulesMode = 'standard' | 'spearhead' | 'other'
export type RulesContextStatus = 'current' | 'seasonal' | 'legends' | 'historical'

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

