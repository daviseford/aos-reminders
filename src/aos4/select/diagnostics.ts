import type { CanonicalId, RulesContextId } from '../domain'

export type SelectionDiagnosticCode =
  | 'missing-rules-context'
  | 'missing-explicit-selection'
  | 'inapplicable-explicit-selection'
  | 'missing-relationship-context'
  | 'dangling-relationship-source'
  | 'dangling-relationship-target'
  | 'inapplicable-relationship-target'
  | 'relationship-cycle'
  | 'excluded-selection'

export interface SelectionDiagnostic {
  code: SelectionDiagnosticCode
  severity: 'warning' | 'error'
  subject: string
  message: string
  entityIds?: CanonicalId[]
  rulesContextId?: RulesContextId
}

export const normalizeSelectionDiagnostics = (diagnostics: SelectionDiagnostic[]): SelectionDiagnostic[] => {
  const unique = new Map<string, SelectionDiagnostic>()
  diagnostics.forEach(diagnostic => {
    const key = `${diagnostic.code}|${diagnostic.subject}|${diagnostic.rulesContextId ?? ''}`
    if (!unique.has(key)) unique.set(key, diagnostic)
  })

  return Array.from(unique.values()).sort(
    (left, right) =>
      left.code.localeCompare(right.code) ||
      left.subject.localeCompare(right.subject) ||
      left.message.localeCompare(right.message)
  )
}
