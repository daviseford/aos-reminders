export interface DelimitedRow {
  line: number
  values: string[]
  raw: string
  lineEnding: '' | '\n' | '\r' | '\r\n'
}

export interface DelimitedDiagnostic {
  code: 'unterminated-quoted-field' | 'unexpected-character-after-quote'
  line: number
  column: number
  message: string
}

export interface DelimitedParseResult {
  rows: DelimitedRow[]
  diagnostics: DelimitedDiagnostic[]
}

const withoutTerminalSentinel = (values: string[], endedWithDelimiter: boolean): string[] =>
  endedWithDelimiter && values.at(-1) === '' ? values.slice(0, -1) : values

export const parsePipeDelimited = (source: string): DelimitedParseResult => {
  const rows: DelimitedRow[] = []
  const diagnostics: DelimitedDiagnostic[] = []
  let values: string[] = []
  let value = ''
  let line = 1
  let column = 1
  let rowLine = 1
  let rowStart = 0
  let inQuotedField = false
  let closedQuotedField = false
  let endedWithDelimiter = false

  const pushRow = (raw: string, lineEnding: DelimitedRow['lineEnding']): void => {
    values.push(value)
    const normalizedValues = withoutTerminalSentinel(values, endedWithDelimiter)
    if (normalizedValues.some(cell => cell.length > 0)) {
      if (rows.length === 0 && normalizedValues[0]?.startsWith('\uFEFF')) {
        normalizedValues[0] = normalizedValues[0].slice(1)
      }
      rows.push({ line: rowLine, values: normalizedValues, raw, lineEnding })
    }
    values = []
    value = ''
    closedQuotedField = false
    endedWithDelimiter = false
  }

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    const next = source[index + 1]

    if (inQuotedField) {
      if (character === '"' && next === '"') {
        value += '"'
        index += 1
        column += 2
        continue
      }
      if (character === '"') {
        inQuotedField = false
        closedQuotedField = true
        column += 1
        continue
      }
      if (character === '\r' && next === '\n') {
        value += '\n'
        index += 1
        line += 1
        column = 1
        continue
      }
      if (character === '\n' || character === '\r') {
        value += '\n'
        line += 1
        column = 1
        continue
      }
      value += character
      column += 1
      continue
    }

    if (closedQuotedField && character !== '|' && character !== '\r' && character !== '\n') {
      diagnostics.push({
        code: 'unexpected-character-after-quote',
        line,
        column,
        message: 'Unexpected character after a closing quote',
      })
      closedQuotedField = false
    }

    if (character === '"' && value.length === 0 && next !== '|') {
      inQuotedField = true
      endedWithDelimiter = false
      column += 1
      continue
    }
    if (character === '|') {
      values.push(value)
      value = ''
      closedQuotedField = false
      endedWithDelimiter = true
      column += 1
      continue
    }
    if (character === '\r' || character === '\n') {
      const lineEnding = character === '\r' && next === '\n' ? '\r\n' : character
      const rowEnd = index
      if (lineEnding === '\r\n') index += 1
      pushRow(source.slice(rowStart, rowEnd), lineEnding)
      line += 1
      column = 1
      rowLine = line
      rowStart = index + 1
      continue
    }

    value += character
    endedWithDelimiter = false
    column += 1
  }

  if (inQuotedField) {
    diagnostics.push({
      code: 'unterminated-quoted-field',
      line: rowLine,
      column,
      message: 'Quoted field was not terminated before the end of the file',
    })
  }

  if (values.length || value.length || endedWithDelimiter) {
    pushRow(source.slice(rowStart), '')
  }

  return { rows, diagnostics }
}
