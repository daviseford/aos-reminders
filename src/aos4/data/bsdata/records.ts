import type { SourceRecordId } from '../../domain'

export const BSDATA_ADAPTER_VERSION = 'bsdata-cat/1'

export const pinnedBsDataUrl = (repository: string, ref: string, filePath: string): string =>
  `https://raw.githubusercontent.com/${repository}/${ref}/${filePath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`

/**
 * Structured warscroll facts extracted from a pinned BSData catalogue file.
 *
 * BSData is the third source tier: a community fallback admitted only when an official Games
 * Workshop publication establishes the content but Wahapedia does not yet carry the rules. Facts
 * extracted here are always marked provisional, and official battle-profile facts override every
 * overlapping field downstream.
 */

export type BsDataAbilityKind = 'activated' | 'passive' | 'spell' | 'prayer' | 'command'

export interface BsDataAbilityFact {
  line: number
  name: string
  kind: BsDataAbilityKind
  /** Raw timing text, e.g. `Once Per Turn (Army), Any Combat Phase`; empty for passives. */
  timing: string
  declare?: string
  effect: string
  keywords: string[]
  /** Casting, chanting, or command-point value when the ability carries one. */
  costValue?: number
  sourceRecordId: SourceRecordId
  recordChecksum: string
}

export interface BsDataWeaponFact {
  line: number
  name: string
  weaponType: 'melee' | 'ranged'
  range?: string
  attacks: string
  hit: string
  wound: string
  rend: string
  damage: string
  abilityLabels: string[]
  sourceRecordId: SourceRecordId
  recordChecksum: string
}

export interface BsDataWarscrollFact {
  kind: 'unit-warscroll'
  name: string
  section: string
  characteristics: {
    move: string
    save: string
    control: string
    health: string
  }
  keywords: string[]
  abilities: BsDataAbilityFact[]
  weapons: BsDataWeaponFact[]
  baseSizes: string[]
  sourceRecordId: SourceRecordId
  factChecksum: string
}

/**
 * Roster-option kinds the community fallback tier may supply. Each maps to the official Battle
 * Profiles `optionType` label that establishes the option's existence.
 */
export type BsDataFactionOptionType = 'battle-formation' | 'heroic-trait' | 'artefact-of-power'

export interface BsDataFactionOptionFact {
  kind: 'faction-option'
  optionType: BsDataFactionOptionType
  /** The option name as transcribed by BSData; the official spelling wins downstream. */
  name: string
  section: string
  /** The BSData selection-entry group the option was found in, e.g. `Traits of Endless Hunger`. */
  groupName: string
  abilities: BsDataAbilityFact[]
  sourceRecordId: SourceRecordId
  factChecksum: string
}

export type BsDataDiagnosticCode =
  | 'invalid-xml'
  | 'unit-not-found'
  | 'duplicate-unit'
  | 'unknown-profile-type'
  | 'missing-characteristic'
  | 'missing-ability-effect'
  | 'option-not-found'
  | 'duplicate-option'
  | 'missing-option-ability'

export interface BsDataDiagnostic {
  code: BsDataDiagnosticCode
  severity: 'warning' | 'error'
  message: string
  unit?: string
}

export interface BsDataExtractionResult {
  facts: BsDataWarscrollFact[]
  diagnostics: BsDataDiagnostic[]
}

export interface BsDataFactionOptionExtractionResult {
  facts: BsDataFactionOptionFact[]
  diagnostics: BsDataDiagnostic[]
}
