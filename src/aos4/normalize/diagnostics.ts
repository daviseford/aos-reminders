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
  | 'source-phase-fallback'

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
