import type { CanonicalId } from '../domain'
import type { Aos4ArmyDocument } from '../state'

export type Aos4ImportSource = 'official-app-text' | 'listbot-text' | 'sigdex-text' | 'roster-xml'

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
  /**
   * The source builder filed this entry as Legends content. Names can collide across the Legends
   * boundary — a unit retired and reintroduced keeps its name but gets a new warscroll — and this
   * flag records which side the roster meant, so resolution can prefer the Legends candidate
   * instead of guessing from the label.
   */
  isLegends?: boolean
  /**
   * The entry came from a regiment of renown, so it is not bound by the army's faction.
   *
   * A regiment of renown is a bought-in mercenary band: an Ironjawz army can field Gloomspite,
   * Ossiarch and Kharadron units through one. Those names are real warscrolls the army simply
   * cannot reach through its own faction, so without this they resolve as "not available to this
   * faction" and the whole band is dropped.
   */
  isRegimentOfRenown?: boolean
}

export interface ParsedRoster {
  source: Aos4ImportSource
  proposedName: string
  declaredContext?: string
  declaredFaction?: string
  /**
   * The roster opted into Legends content.
   *
   * New Recruit carries this as an "Allow Legends" configuration entry, and it changes what the
   * player expects: with it set, retired warscrolls in the list are deliberate rather than
   * mistakes. Knowing it lets the importer say *why* such a unit was skipped instead of reporting
   * it as an unrecognised name.
   */
  allowsLegends?: boolean
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
