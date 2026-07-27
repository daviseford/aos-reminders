import type { ArtifactId, SourceRecordId } from '../../domain'
import type { ArtifactManifestEntry } from '../manifest'
import type { WahapediaExportFileName } from './exportCatalog'

export interface WahapediaExportInput {
  bytes: Uint8Array
  artifact: ArtifactManifestEntry
}

export type WahapediaExportInputs = Partial<Record<WahapediaExportFileName, WahapediaExportInput>>

export interface WahapediaRecordMeta {
  file: WahapediaExportFileName
  row: number
  artifactId: ArtifactId
  sourceRecordId: SourceRecordId
}

export interface WahapediaFactionRecord {
  id: string
  name: string
  link: string
  meta: WahapediaRecordMeta
}

export interface WahapediaSourceRecord {
  id: string
  name: string
  type: string
  edition: string
  version: string
  errataDate: string
  errataLink: string
  meta: WahapediaRecordMeta
}

export interface WahapediaWarscrollRecord {
  id: string
  name: string
  factionId: string
  sourceId: string
  legendHtml: string
  regimentOptions: string
  notesHtml: string
  descriptionHtml: string
  role: string
  virtual: boolean | null
  noReinforced: boolean | null
  link: string
  move: string
  save: string
  control: string
  health: string
  ward: string
  unitSize: string
  cost: string
  meta: WahapediaRecordMeta
}

export interface WahapediaAbilityFields {
  line: string
  name: string
  descriptionHtml: string
  legendHtml: string
  abilityType: string
  isReaction: boolean | null
  conditionHtml: string
  keywordsHtml: string
  abilityPhase: string
  pointsType: string
  points: string
}

export interface WahapediaWarscrollAbilityRecord extends WahapediaAbilityFields {
  warscrollId: string
  meta: WahapediaRecordMeta
}

export interface WahapediaFactionAbilityRecord extends WahapediaAbilityFields {
  factionId: string
  typeId: string
  typeName: string
  subtypeId: string
  subtypeName: string
  meta: WahapediaRecordMeta
}

export interface WahapediaWarscrollWeaponRecord {
  warscrollId: string
  line: string
  name: string
  range: string
  attacks: string
  hit: string
  wound: string
  rend: string
  damage: string
  weaponType: string
  abilitiesHtml: string
  hasBattleDamage: boolean | null
  meta: WahapediaRecordMeta
}

export interface WahapediaWarscrollKeywordRecord {
  warscrollId: string
  keyword: string
  isFactionKeyword: boolean | null
  parameter: string
  meta: WahapediaRecordMeta
}

export interface WahapediaWarscrollBaseRecord {
  warscrollId: string
  line: string
  model: string
  base: string
  meta: WahapediaRecordMeta
}

export interface WahapediaWarscrollOrganisationRecord {
  warscrollId: string
  line: string
  unit: string
  size: string
  meta: WahapediaRecordMeta
}

export interface WahapediaRegimentOfRenownFactionRecord {
  warscrollId: string
  factionId: string
  meta: WahapediaRecordMeta
}

export interface WahapediaFactionAbilityTypeRecord {
  factionId: string
  id: string
  name: string
  descriptionHtml: string
  meta: WahapediaRecordMeta
}

export interface WahapediaFactionAbilitySubtypeRecord {
  factionId: string
  id: string
  name: string
  typeId: string
  descriptionHtml: string
  legendHtml: string
  meta: WahapediaRecordMeta
}

export interface WahapediaLastUpdateRecord {
  raw: string
  instant: string | null
  meta: WahapediaRecordMeta
}

export interface WahapediaDataset {
  artifacts: Partial<Record<WahapediaExportFileName, ArtifactManifestEntry>>
  factions: WahapediaFactionRecord[]
  sources: WahapediaSourceRecord[]
  warscrolls: WahapediaWarscrollRecord[]
  warscrollAbilities: WahapediaWarscrollAbilityRecord[]
  warscrollWeapons: WahapediaWarscrollWeaponRecord[]
  warscrollKeywords: WahapediaWarscrollKeywordRecord[]
  warscrollBases: WahapediaWarscrollBaseRecord[]
  warscrollOrganisation: WahapediaWarscrollOrganisationRecord[]
  regimentOfRenownFactions: WahapediaRegimentOfRenownFactionRecord[]
  factionAbilityTypes: WahapediaFactionAbilityTypeRecord[]
  factionAbilitySubtypes: WahapediaFactionAbilitySubtypeRecord[]
  factionAbilities: WahapediaFactionAbilityRecord[]
  lastUpdate?: WahapediaLastUpdateRecord
}

export type WahapediaDiagnosticCode =
  | 'missing-export-file'
  | 'invalid-utf8'
  | 'header-drift'
  | 'row-column-count'
  | 'unterminated-quoted-field'
  | 'unexpected-character-after-quote'
  | 'missing-required-field'
  | 'invalid-boolean'
  | 'invalid-last-update'
  | 'invalid-source-date'
  | 'duplicate-record-key'
  | 'duplicate-identical-record'
  | 'empty-association-record'
  | 'missing-faction'
  | 'missing-source'
  | 'missing-warscroll'
  | 'missing-ability-type'
  | 'missing-ability-subtype'
  | 'denormalized-name-mismatch'
  | 'unknown-vocabulary'
  | 'polluted-marker'
  | 'source-newer-than-export-marker'

export interface WahapediaDiagnostic {
  code: WahapediaDiagnosticCode
  severity: 'warning' | 'error'
  file: WahapediaExportFileName
  message: string
  row?: number
  field?: string
  value?: string
}

export interface WahapediaDecodeResult {
  dataset: WahapediaDataset
  diagnostics: WahapediaDiagnostic[]
}
