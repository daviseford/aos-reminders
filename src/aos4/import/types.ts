import type { CanonicalId } from '../domain'
import type { Aos4ArmyDocument } from '../state'

export type Aos4ImportSource = 'official-app-text' | 'listbot-text' | 'roster-xml'

export type ParsedRosterSelectionKind =
  | 'faction'
  | 'warscroll'
  | 'enhancement'
  | 'battle-formation'
  | 'artefact-of-power'
  | 'spell-lore'
  | 'prayer-lore'
  | 'manifestation-lore'
  | 'regiment-of-renown'

export interface ParsedRosterSelection {
  line: number
  label: string
  kindHint: ParsedRosterSelectionKind
  count?: number
}

export interface ParsedRoster {
  source: Aos4ImportSource
  proposedName: string
  declaredContext?: string
  declaredFaction?: string
  selections: ParsedRosterSelection[]
}

export interface Aos4ParsedRosterResult {
  parsedRoster?: ParsedRoster
  diagnostics: Aos4ImportDiagnostic[]
}

export type Aos4ImportDiagnosticCode =
  | 'unsupported-source'
  | 'unsafe-input'
  | 'input-too-large'
  | 'unsupported-context'
  | 'missing-faction'
  | 'unknown-selection'
  | 'ambiguous-selection'
  | 'inapplicable-selection'
  | 'invalid-selection-graph'

export interface Aos4ImportDiagnostic {
  code: Aos4ImportDiagnosticCode
  severity: 'warning' | 'error'
  message: string
  line?: number
}

export interface Aos4ImportMatch {
  line: number
  label: string
  canonicalId: CanonicalId
}

export interface Aos4ImportPreview {
  source: Aos4ImportSource
  proposedDocument?: Aos4ArmyDocument
  matches: Aos4ImportMatch[]
  diagnostics: Aos4ImportDiagnostic[]
}
