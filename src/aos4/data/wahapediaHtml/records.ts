import type { ArtifactId, SourceRecordId } from '../../domain'
import type { ArtifactManifestEntry } from '../manifest'

export type WahapediaHtmlContext = 'standard' | 'seasonal' | 'spearhead' | 'legends' | 'historical'

export interface WahapediaHtmlInput {
  bytes: Uint8Array
  artifact: ArtifactManifestEntry
}

export interface WahapediaHtmlRecordMeta {
  artifactId: ArtifactId
  sourceRecordId: SourceRecordId
  recordChecksum: string
  section: string
}

export interface WahapediaHtmlWeaponRecord {
  line: number
  name: string
  range: string
  attacks: string
  hit: string
  wound: string
  rend: string
  damage: string
  weaponType: 'MELEE' | 'RANGED'
  abilitiesHtml: string
  meta: WahapediaHtmlRecordMeta
}

export interface WahapediaHtmlAbilityRecord {
  line: number
  name: string
  descriptionHtml: string
  conditionHtml: string
  keywordsHtml: string
  abilityType: string
  abilityPhase: string
  isReaction: boolean
  pointsType: string
  points: string
  meta: WahapediaHtmlRecordMeta
}

export interface WahapediaHtmlWarscrollRecord {
  recordKind: 'warscroll' | 'content-group'
  externalId: string
  parentExternalId?: string
  parentName?: string
  name: string
  factionName: string
  sourceTitle: string
  sourceUrl: string
  context: WahapediaHtmlContext
  characteristics: {
    move: string
    save: string
    control: string
    health: string
    ward?: string
  }
  descriptionHtml: string
  keywords: string[]
  unitSize?: number
  points?: number
  baseSizes: string[]
  regimentOptions: string[]
  notes: string[]
  canBeReinforced?: boolean
  weapons: WahapediaHtmlWeaponRecord[]
  abilities: WahapediaHtmlAbilityRecord[]
  meta: WahapediaHtmlRecordMeta
  artifact: ArtifactManifestEntry
}

export interface WahapediaHtmlFactionGroupRecord {
  externalId: string
  name: string
  context: WahapediaHtmlContext
  sourceTitle: string
  parentExternalId?: string
  /**
   * The source page explicitly classifies this section as an Army of Renown: current sections
   * carry a `div.h2_ArmyOfRenown` marker before the heading, and Legends/White Dwarf sections
   * open with the replace-rules sentence linking the core-rules `#Armies-of-Renown` anchor.
   * Derived from page structure, not part of the hashed record value, so record identity is
   * unchanged. Generation cross-checks the reviewed `armiesOfRenown` classification against it.
   */
  armyOfRenown?: true
  meta: WahapediaHtmlRecordMeta
}

export interface WahapediaHtmlFactionAbilityRecord extends WahapediaHtmlAbilityRecord {
  externalId: string
  groupExternalId: string
  context: WahapediaHtmlContext
}

export interface WahapediaHtmlFactionPageRecord {
  factionName: string
  sourceUrl: string
  groups: WahapediaHtmlFactionGroupRecord[]
  abilities: WahapediaHtmlFactionAbilityRecord[]
  artifact: ArtifactManifestEntry
}

export interface WahapediaHtmlRulesPageRecord {
  title: string
  sourceUrl: string
  context: WahapediaHtmlContext
  groups: WahapediaHtmlFactionGroupRecord[]
  abilities: WahapediaHtmlFactionAbilityRecord[]
  meta: WahapediaHtmlRecordMeta
  artifact: ArtifactManifestEntry
}

export type WahapediaHtmlDiagnosticCode =
  | 'invalid-utf8'
  | 'not-warscroll-page'
  | 'not-faction-page'
  | 'not-rules-page'
  | 'missing-source-id'
  | 'missing-characteristic'
  | 'malformed-weapon-row'
  | 'ability-pair-mismatch'
  | 'orphan-faction-ability'
  | 'orphan-rules-ability'
  | 'missing-battle-profile'

export interface WahapediaHtmlDiagnostic {
  code: WahapediaHtmlDiagnosticCode
  severity: 'warning' | 'error'
  url: string
  message: string
  section?: string
}

export interface WahapediaHtmlParseResult {
  page?: WahapediaHtmlWarscrollRecord
  diagnostics: WahapediaHtmlDiagnostic[]
}

export interface WahapediaHtmlCollectionParseResult {
  pages: WahapediaHtmlWarscrollRecord[]
  diagnostics: WahapediaHtmlDiagnostic[]
}

export interface WahapediaHtmlFactionParseResult {
  page?: WahapediaHtmlFactionPageRecord
  diagnostics: WahapediaHtmlDiagnostic[]
}

export interface WahapediaHtmlRulesParseResult {
  page?: WahapediaHtmlRulesPageRecord
  diagnostics: WahapediaHtmlDiagnostic[]
}
