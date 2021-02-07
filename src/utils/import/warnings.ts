import { TImportError } from 'types/import'

export const createAllyWarning = (text: string): { text: string; severity: 'ally-warn' } => ({
  text,
  severity: 'ally-warn',
})

export const createAmbiguityWarning = (text: string): { text: string; severity: 'ambiguity-warn' } => ({
  text,
  severity: 'ambiguity-warn',
})

export const createDeprecationWarning = (
  text: string,
  reason: string
): { text: string; severity: 'deprecation-warn'; reason: string } => ({
  text,
  severity: 'deprecation-warn',
  reason,
})

export const createFatalError = (text: string): { text: string; severity: 'error' } => ({
  text,
  severity: 'error',
})
export const createWarning = (text: string): { text: string; severity: 'warn' } => ({
  text,
  severity: 'warn',
})

export const getAllWarnings = (errors: TImportError[]) =>
  errors.filter(
    e =>
      e.severity === 'ally-warn' ||
      e.severity === 'ambiguity-warn' ||
      e.severity === 'deprecation-warn' ||
      e.severity === 'warn'
  )
export const getAllyWarnings = (errors: TImportError[]) => errors.filter(e => e.severity === 'ally-warn')
export const getWarnings = (errors: TImportError[]) => errors.filter(e => e.severity === 'warn')
const hasWarning = (errors: TImportError[]) => errors.some(e => e.severity === 'warn')
export const hasFatalError = (errors: TImportError[]) => errors.some(e => e.severity === 'error')
/**
 * Ignores ally warnings and ambiguity warnings
 * @param errors
 */
export const hasErrorOrWarning = (errors: TImportError[]) => {
  return hasFatalError(errors) || hasWarning(errors)
}
