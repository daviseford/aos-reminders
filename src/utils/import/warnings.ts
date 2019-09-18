export const createError = (text: string): { text: string; severity: 'error' } => ({
  text,
  severity: 'error',
})
export const createWarning = (text: string): { text: string; severity: 'warn' } => ({
  text,
  severity: 'warn',
})

export const createAllyWarning = (text: string): { text: string; severity: 'ally-warn' } => ({
  text,
  severity: 'ally-warn',
})
