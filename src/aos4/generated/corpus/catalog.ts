import type { Aos4Catalog, CanonicalId } from '../../domain'
import { inflateRuntimeProjection } from '../../runtimeProjection/inflate'
import defaultsJson from './defaults.json'
import runtimeJson from './runtime.json'

const { projection, catalog } = inflateRuntimeProjection(runtimeJson)
const defaults = defaultsJson as unknown as {
  schemaVersion: 1
  rulesContextId: Aos4Catalog['rulesContexts'][number]['id']
  defaultFactionId: CanonicalId<'faction'>
}

export const AOS4_RUNTIME_PROJECTION = projection
export const AOS4_GENERATION_AUDIT = {
  schemaVersion: 1,
  generatedAt: projection.generatedAt,
  attribution: projection.attribution,
  reviewScope: 'Complete accepted AoS 4 corpus snapshot dated 2026-08-01.',
  acknowledgedDiagnostics: [],
  sourcePolicy: {
    officialPublisher: 'games-workshop',
    secondaryPublisher: 'wahapedia',
    rawSourceBodiesCommitted: false,
    structuredRuleFactsCommitted: true,
  },
} as const
export const AOS4_CATALOG: Aos4Catalog = catalog
export const AOS4_DEFAULT_RULES_CONTEXT_ID = defaults.rulesContextId
export const AOS4_DEFAULT_FACTION_ID = defaults.defaultFactionId
export const AOS4_DEFAULT_SELECTION_IDS = [defaults.defaultFactionId]
