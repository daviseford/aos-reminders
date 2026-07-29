import type { Aos4ParsedRosterResult } from '../../aos4/import'
import { detectAos4TextSource, enforceParsedSelectionLimit, type Aos4ImportLine } from './detectTextSource'
import { parseListbotRoster } from './listbot'
import { parseOfficialAppRoster } from './officialApp'

export * from './detectTextSource'
export * from './listbot'
export * from './officialApp'
export * from './rosterFile'
export * from './rosterXml'

const parseDetectedRoster = (
  source: 'official-app-text' | 'listbot-text',
  lines: Aos4ImportLine[]
): Aos4ParsedRosterResult =>
  source === 'official-app-text' ? parseOfficialAppRoster(lines) : parseListbotRoster(lines)

export const decodeAos4TextRoster = (input: string): Aos4ParsedRosterResult => {
  const detection = detectAos4TextSource(input)
  if (!detection.source) return { diagnostics: detection.diagnostics }
  return enforceParsedSelectionLimit(parseDetectedRoster(detection.source, detection.lines))
}
