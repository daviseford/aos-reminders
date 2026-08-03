import type {
  CanonicalId,
  EntityKind,
  RulesContextId,
  SourceClassification,
  SourcePublisher,
  SourceRecordId,
} from '../domain'

export type ReconciliationValue =
  null | boolean | number | string | ReconciliationValue[] | { [key: string]: ReconciliationValue }

export interface ReconciliationEntity {
  id: CanonicalId
  kind: EntityKind
  name: string
  rulesContextIds: RulesContextId[]
  externalIds: Partial<Record<SourcePublisher, string[]>>
}

export interface CandidateFact {
  id: string
  entityKind: EntityKind
  entityName: string
  field: string
  value: ReconciliationValue
  publisher: SourcePublisher
  authority: SourceClassification
  sourceRecordId: SourceRecordId
  rulesContextIds: RulesContextId[]
  externalEntityId?: string
  effectiveDate?: string
}

export interface LinkedCandidateFact extends CandidateFact {
  entityId: CanonicalId
  linkedBy: 'external-id' | 'normalized-name'
}

export type ReconciliationDiagnosticCode =
  | 'duplicate-fact-id'
  | 'unmatched-entity'
  | 'ambiguous-entity'
  | 'normalized-name-link'
  | 'conflicting-authoritative-facts'
  | 'secondary-newer-than-official'
  | 'invalid-override-id'
  | 'invalid-override-reason'
  | 'invalid-override-author'
  | 'invalid-override-date'
  | 'invalid-override-sources'
  | 'invalid-override-context'
  | 'conflicting-overrides'
  | 'reviewed-override-applied'

export interface ReconciliationDiagnostic {
  code: ReconciliationDiagnosticCode
  severity: 'warning' | 'error'
  message: string
  factIds?: string[]
  entityId?: CanonicalId
  field?: string
  overrideIds?: string[]
}

export interface LinkRecordsResult {
  linked: LinkedCandidateFact[]
  unresolved: CandidateFact[]
  diagnostics: ReconciliationDiagnostic[]
}

export interface ReviewedOverride {
  id: string
  entityId: CanonicalId
  field: string
  value: ReconciliationValue
  reason: string
  author: string
  reviewedAt: string
  sourceRecordIds: SourceRecordId[]
  rulesContextIds: RulesContextId[]
}

export interface OverrideValidationResult {
  valid: ReviewedOverride[]
  diagnostics: ReconciliationDiagnostic[]
}

export interface ResolvedFact {
  entityId: CanonicalId
  field: string
  rulesContextId: RulesContextId
  status: 'resolved' | 'unresolved'
  value?: ReconciliationValue
  chosenFactIds: string[]
  retainedFactIds: string[]
  overrideId?: string
}

export interface FactPrecedenceResult {
  resolutions: ResolvedFact[]
  diagnostics: ReconciliationDiagnostic[]
}
