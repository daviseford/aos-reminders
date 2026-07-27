import { validateCatalog, type Aos4Catalog, type SourceRecordId } from '../domain'
import type { ReconciliationDiagnostic } from '../reconcile'

export type SourceDisposition =
  | {
      sourceRecordId: SourceRecordId
      status: 'ignored'
      reason: string
    }
  | {
      sourceRecordId: SourceRecordId
      status: 'unresolved'
      reason: string
    }

export type GenerationIssueCode =
  | 'domain-validation'
  | 'duplicate-source-disposition'
  | 'consumed-source-disposition'
  | 'unconsumed-source-record'
  | 'unknown-source-disposition'
  | 'source-disposition-without-reason'
  | 'unresolved-source-record'
  | 'unknown-timing'
  | 'unsafe-html'
  | 'reconciliation-error'

export interface GenerationIssue {
  code: GenerationIssueCode
  severity: 'warning' | 'error'
  subject: string
  message: string
}

export interface GenerationIntegrityResult {
  ok: boolean
  consumedSourceRecordIds: SourceRecordId[]
  issues: GenerationIssue[]
}

const compareIssues = (left: GenerationIssue, right: GenerationIssue): number =>
  left.severity.localeCompare(right.severity) ||
  left.code.localeCompare(right.code) ||
  left.subject.localeCompare(right.subject) ||
  left.message.localeCompare(right.message)

const containsHtml = (value: unknown): boolean => /<\s*\/?\s*[a-z][^>]*>/i.test(JSON.stringify(value))

export const validateGenerationIntegrity = (
  catalog: Aos4Catalog,
  dispositions: SourceDisposition[] = [],
  reconciliationDiagnostics: ReconciliationDiagnostic[] = []
): GenerationIntegrityResult => {
  const issues: GenerationIssue[] = validateCatalog(catalog).map(issue => ({
    code: 'domain-validation',
    severity: 'error',
    subject: issue.subject,
    message: `${issue.code}: ${issue.message}`,
  }))
  const sourceRecordIds = new Set(catalog.sourceRecords.map(record => record.id))
  const consumed = new Set(
    catalog.entities.flatMap(entity => entity.sourceRefs.map(reference => reference.sourceRecordId))
  )
  const dispositionBySource = new Map<SourceRecordId, SourceDisposition>()

  dispositions.forEach(disposition => {
    if (dispositionBySource.has(disposition.sourceRecordId)) {
      issues.push({
        code: 'duplicate-source-disposition',
        severity: 'error',
        subject: disposition.sourceRecordId,
        message: 'Source record has more than one review disposition',
      })
    } else {
      dispositionBySource.set(disposition.sourceRecordId, disposition)
    }
    if (!sourceRecordIds.has(disposition.sourceRecordId)) {
      issues.push({
        code: 'unknown-source-disposition',
        severity: 'error',
        subject: disposition.sourceRecordId,
        message: 'Source disposition refers to a record outside the catalog',
      })
    }
    if (!disposition.reason.trim()) {
      issues.push({
        code: 'source-disposition-without-reason',
        severity: 'error',
        subject: disposition.sourceRecordId,
        message: 'Source disposition requires a review reason',
      })
    }
    if (consumed.has(disposition.sourceRecordId)) {
      issues.push({
        code: 'consumed-source-disposition',
        severity: 'error',
        subject: disposition.sourceRecordId,
        message: 'Consumed source record must not also have a review disposition',
      })
    }
    if (disposition.status === 'unresolved') {
      issues.push({
        code: 'unresolved-source-record',
        severity: 'error',
        subject: disposition.sourceRecordId,
        message: disposition.reason,
      })
    }
  })

  catalog.sourceRecords.forEach(record => {
    if (!consumed.has(record.id) && !dispositionBySource.has(record.id)) {
      issues.push({
        code: 'unconsumed-source-record',
        severity: 'error',
        subject: record.id,
        message: 'Source record is neither consumed nor dispositioned',
      })
    }
  })

  catalog.entities.forEach(entity => {
    if (entity.kind === 'ability' && entity.timings.some(timing => timing.window.kind === 'unknown')) {
      issues.push({
        code: 'unknown-timing',
        severity: 'error',
        subject: entity.id,
        message: `Ability ${entity.name} has unclassified runtime timing`,
      })
    }
    if (containsHtml(entity)) {
      issues.push({
        code: 'unsafe-html',
        severity: 'error',
        subject: entity.id,
        message: `Entity ${entity.name} contains HTML instead of normalized text`,
      })
    }
  })

  reconciliationDiagnostics
    .filter(diagnostic => diagnostic.severity === 'error')
    .forEach(diagnostic => {
      issues.push({
        code: 'reconciliation-error',
        severity: 'error',
        subject:
          diagnostic.entityId ??
          diagnostic.factIds?.join(',') ??
          diagnostic.overrideIds?.join(',') ??
          diagnostic.code,
        message: diagnostic.message,
      })
    })

  const sortedIssues = issues.sort(compareIssues)
  return {
    ok: !sortedIssues.some(issue => issue.severity === 'error'),
    consumedSourceRecordIds: Array.from(consumed).sort((left, right) => left.localeCompare(right)),
    issues: sortedIssues,
  }
}
