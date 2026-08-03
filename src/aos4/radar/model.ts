export const RADAR_SOURCES = ['games-workshop', 'wahapedia', 'bsdata'] as const

export type RadarSource = (typeof RADAR_SOURCES)[number]
export type RadarPublisher = RadarSource
export type RadarAuthority = 'official' | 'secondary' | 'community'
export type RadarEventClass = 'material' | 'operational'

export const RADAR_MATERIAL_CHANGE_KINDS = [
  'new-publication',
  'removed-publication',
  'replaced-publication',
  'new-faction',
  'removed-faction',
  'new-rules-page',
  'removed-rules-page',
  'export-changed',
  'navigation-changed',
  'community-catalog-changed',
] as const

export const RADAR_OPERATIONAL_CHANGE_KINDS = [
  'source-unavailable',
  'source-contract-changed',
  'comparison-diverged',
  'comparison-truncated',
  'rate-limited',
  'candidate-failed',
  'notification-failed',
] as const

export type RadarMaterialChangeKind = (typeof RADAR_MATERIAL_CHANGE_KINDS)[number]
export type RadarOperationalChangeKind = (typeof RADAR_OPERATIONAL_CHANGE_KINDS)[number]

export type RadarChangeKind = RadarMaterialChangeKind | RadarOperationalChangeKind

export type RadarEvidenceValue = string | string[] | number | boolean | null

export interface RadarEvent {
  class: RadarEventClass
  source: RadarSource
  publisher: RadarPublisher
  authority: RadarAuthority
  changeKind: RadarChangeKind
  locator: string
  baselineFingerprint: string | null
  observedFingerprint: string | null
  observedAt: string
  workflowUrl?: string
  evidence: Record<string, RadarEvidenceValue>
}

export interface RadarLane {
  schemaVersion: 1
  source: RadarSource
  authority: RadarAuthority
  observedAt: string
  workflowUrl?: string
  events: RadarEvent[]
  fingerprint: string
}

export interface RadarReport {
  schemaVersion: 1
  observedAt: string
  lanes: RadarLane[]
  events: RadarEvent[]
  materialEventCount: number
  operationalEventCount: number
  aggregateFingerprint: string
}

export interface GamesWorkshopObservationEntry {
  locator: string
  title: string
  fingerprint?: string
}

export interface GamesWorkshopObservation {
  schemaVersion: 1
  source: 'games-workshop'
  observedAt: string
  workflowUrl?: string
  entries: GamesWorkshopObservationEntry[]
}

export type WahapediaObservationEntryKind = 'faction' | 'rules-page' | 'export'

export interface WahapediaRadarObservationEntry {
  kind: WahapediaObservationEntryKind
  locator: string
  title: string
  fingerprint: string
}

export interface WahapediaRadarObservation {
  schemaVersion: 1
  source: 'wahapedia'
  scope: 'sentinel' | 'full'
  observedAt: string
  workflowUrl?: string
  entries: WahapediaRadarObservationEntry[]
}

export type BsDataComparisonStatus =
  'identical' | 'ahead' | 'diverged' | 'truncated' | 'rate-limited' | 'malformed'

export interface BsDataObservation {
  schemaVersion: 1
  source: 'bsdata'
  observedAt: string
  workflowUrl?: string
  repository: string
  baselineSha: string
  headSha: string
  comparisonStatus: BsDataComparisonStatus
  compareUrl?: string
  changedPaths: string[]
}

export interface SourceObservationClassifications {
  schemaVersion: 1
  explicitlyNonMaterial: Array<{
    url: string
    disposition: string
  }>
}

export const RADAR_AUTHORITY_BY_SOURCE = {
  'games-workshop': 'official',
  wahapedia: 'secondary',
  bsdata: 'community',
} as const satisfies Record<RadarSource, RadarAuthority>

export const RADAR_SOURCE_ORDER = new Map<RadarSource, number>(
  RADAR_SOURCES.map((source, index) => [source, index])
)
