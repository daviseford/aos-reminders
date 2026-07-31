import type { Aos4ParsedRosterResult } from '../aos4/import'
import { detectAos4TextSource, enforceParsedSelectionLimit, type Aos4ImportLine } from './detectTextSource'
import { parseListbotRoster } from './listbot'
import { parseOfficialAppRoster } from './officialApp'
import { parseSigdexRoster } from './sigdex'

const parseDetectedRoster = (
  source: 'official-app-text' | 'listbot-text' | 'sigdex-text',
  lines: Aos4ImportLine[]
): Aos4ParsedRosterResult => {
  if (source === 'official-app-text') return parseOfficialAppRoster(lines)
  if (source === 'sigdex-text') return parseSigdexRoster(lines)
  return parseListbotRoster(lines)
}

export const decodeAos4TextRoster = (input: string): Aos4ParsedRosterResult => {
  const detection = detectAos4TextSource(input)
  if (!detection.source) return { diagnostics: detection.diagnostics }
  return enforceParsedSelectionLimit(parseDetectedRoster(detection.source, detection.lines))
}
