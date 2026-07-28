import type { SourceRecordId } from '../domain'

export type NormalizationDiagnosticCode =
  | 'unknown-timing'
  | 'conflicting-perspective'
  | 'conflicting-window'
  | 'unsafe-html-element'
  | 'unsafe-html-url'
  | 'unsafe-html-attribute'
  | 'duplicate-ability-section'
  | 'unlabeled-ability-preamble'
  | 'missing-ability-effect'
  | 'missing-reaction-trigger'
  | 'reaction-flag-mismatch'
  | 'effect-phase-windows'
  | 'source-timing-correction'
  | 'source-phase-conflict'
  | 'source-incomplete-weapon-profile'
  | 'source-marker-removed'

export type NormalizationDiagnosticSeverity = 'warning' | 'error'

export interface NormalizationDiagnostic {
  code: NormalizationDiagnosticCode
  severity: NormalizationDiagnosticSeverity
  message: string
  sourceRecordId?: SourceRecordId
}

export interface NormalizationResult<T> {
  value: T
  diagnostics: NormalizationDiagnostic[]
}
