import type { FactPrecedenceResult, LinkRecordsResult, ReconciliationDiagnosticCode } from './records'

export interface ReconciliationReport {
  linkedFacts: number
  unlinkedFacts: number
  resolvedFields: number
  unresolvedFields: number
  diagnostics: Partial<Record<ReconciliationDiagnosticCode, number>>
}

export const createReconciliationReport = (
  links: LinkRecordsResult,
  precedence: FactPrecedenceResult
): ReconciliationReport => {
  const counts: Partial<Record<ReconciliationDiagnosticCode, number>> = {}
  ;[...links.diagnostics, ...precedence.diagnostics].forEach(diagnostic => {
    counts[diagnostic.code] = (counts[diagnostic.code] ?? 0) + 1
  })

  return {
    linkedFacts: links.linked.length,
    unlinkedFacts: links.unresolved.length,
    resolvedFields: precedence.resolutions.filter(item => item.status === 'resolved').length,
    unresolvedFields: precedence.resolutions.filter(item => item.status === 'unresolved').length,
    diagnostics: Object.fromEntries(
      Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))
    ),
  }
}
