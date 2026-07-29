import type {
  Aos4ImportDiagnostic,
  Aos4ParsedRosterResult,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from '../../aos4/import'
import type { Aos4ImportLine } from './detectTextSource'

const pointsLinePattern = /^(?:(\d+)\s*[x×]\s+)?(.+?)\s+\(\s*\d+\s*(?:pts?|points?)?\s*\)\s*$/i
const rosterNamePattern = /^(.+?)\s+\d+\s*\/\s*\d+\s*(?:pts?|points?)\s*$/i
const lorePattern = /^(Spell Lore|Prayer Lore|Manifestation Lore)\s*[-:]\s*(.+)$/i
const battleFormationPattern = /^Battle Formation\s*[-:]\s*(.+)$/i
const contextPattern = /^(?:General['’]s Handbook|GHB)\b/i
const officialMetadataPattern =
  /^(?:Created with Warhammer Age of Sigmar: The App|App:|Exported with App Version:|Drops?:|Total:)/i
const sectionPattern = /^(?:REGIMENTS?|Regiment \d+|AUXILIARIES|FACTION TERRAIN|REGIMENTS OF RENOWN)$/i

const loreKind = (label: string): ParsedRosterSelectionKind => {
  if (/^Prayer Lore$/i.test(label)) return 'prayer-lore'
  if (/^Manifestation Lore$/i.test(label)) return 'manifestation-lore'
  return 'spell-lore'
}

const parsePointedWarscroll = (line: Aos4ImportLine): ParsedRosterSelection | undefined => {
  const match = line.text.match(pointsLinePattern)
  if (!match) return undefined
  return {
    line: line.number,
    label: match[2].trim(),
    kindHint: 'warscroll',
    ...(match[1] ? { count: Number(match[1]) } : {}),
  }
}

const parseBullet = (line: Aos4ImportLine): ParsedRosterSelection | undefined => {
  const match = line.text.match(/^[•]\s*(.+)$/)
  if (!match) return undefined
  const label = match[1].trim()
  if (
    /^(?:General|Reinforced)$/i.test(label) ||
    /^\d+\s*[x×]\s+/i.test(label) ||
    /\bx\d+\b/i.test(label) ||
    label.includes(';')
  ) {
    return undefined
  }

  const typed = label.match(
    /^(Artefact of Power|Spell Lore|Prayer Lore|Manifestation Lore|Heroic Trait)\s*[-:]\s*(.+)$/i
  )
  if (!typed) return { line: line.number, label, kindHint: 'enhancement' }
  const kindHint = /^Artefact of Power$/i.test(typed[1])
    ? 'artefact-of-power'
    : /^Heroic Trait$/i.test(typed[1])
      ? 'enhancement'
      : loreKind(typed[1])
  return { line: line.number, label: typed[2].trim(), kindHint }
}

const missingFaction = (line?: number): Aos4ImportDiagnostic => ({
  code: 'missing-faction',
  severity: 'error',
  message: 'The official app export does not declare a faction in a supported AoS 4 header.',
  ...(line === undefined ? {} : { line }),
})

export const parseOfficialAppRoster = (lines: Aos4ImportLine[]): Aos4ParsedRosterResult => {
  const populated = lines.filter(line => line.text)
  const nameLine = populated.find(line => rosterNamePattern.test(line.text))
  const nameMatch = nameLine?.text.match(rosterNamePattern)
  const pipeHeader = populated.find(line => {
    const parts = line.text.split('|').map(part => part.trim())
    return parts.length >= 3 && /^Grand Alliance\b/i.test(parts[0])
  })
  const pipeParts = pipeHeader?.text.split('|').map(part => part.trim())

  let declaredFaction = pipeParts?.[1]
  let formation: ParsedRosterSelection | undefined = pipeParts?.[2]
    ? {
        line: pipeHeader?.number ?? 1,
        label: pipeParts[2],
        kindHint: 'battle-formation',
      }
    : undefined

  if (!declaredFaction && nameLine) {
    const following = populated.filter(
      line =>
        line.number > nameLine.number &&
        !officialMetadataPattern.test(line.text) &&
        !contextPattern.test(line.text) &&
        !sectionPattern.test(line.text)
    )
    declaredFaction = following[0]?.text
    if (following[1] && !pointsLinePattern.test(following[1].text) && !lorePattern.test(following[1].text)) {
      formation = {
        line: following[1].number,
        label: following[1].text,
        kindHint: 'battle-formation',
      }
    }
  }

  if (!declaredFaction) {
    return { diagnostics: [missingFaction(nameLine?.number)] }
  }

  const contextLine = populated.find(line => contextPattern.test(line.text))
  const selections: ParsedRosterSelection[] = formation ? [formation] : []
  let section: 'none' | 'units' | 'faction-terrain' | 'regiment-of-renown' = 'none'

  lines.forEach(line => {
    if (!line.text || line === pipeHeader || line === nameLine) return
    if (line.text === declaredFaction || line.text === formation?.label) return
    if (/^REGIMENTS OF RENOWN$/i.test(line.text)) {
      section = 'regiment-of-renown'
      return
    }
    if (/^FACTION TERRAIN$/i.test(line.text)) {
      section = 'faction-terrain'
      return
    }
    if (/^(?:REGIMENTS?|Regiment \d+|AUXILIARIES)$/i.test(line.text)) {
      section = 'units'
      return
    }
    if (officialMetadataPattern.test(line.text) || contextPattern.test(line.text)) return

    const lore = line.text.match(lorePattern)
    if (lore) {
      selections.push({ line: line.number, label: lore[2].trim(), kindHint: loreKind(lore[1]) })
      return
    }
    const explicitFormation = line.text.match(battleFormationPattern)
    if (explicitFormation) {
      selections.push({
        line: line.number,
        label: explicitFormation[1].trim(),
        kindHint: 'battle-formation',
      })
      return
    }
    const bullet = parseBullet(line)
    if (bullet && section !== 'none') {
      selections.push(bullet)
      return
    }
    if (section === 'faction-terrain') {
      selections.push({
        line: line.number,
        label: line.text.replace(pointsLinePattern, '$2').trim(),
        kindHint: 'warscroll',
      })
      section = 'none'
      return
    }
    if (section === 'regiment-of-renown') {
      const nested = line.text.match(/^-\s*(.+)$/)
      if (!nested) return
      selections.push({
        line: line.number,
        label: nested[1].replace(pointsLinePattern, '$2').trim(),
        kindHint: 'warscroll',
      })
      return
    }
    if (section === 'units') {
      const warscroll = parsePointedWarscroll(line)
      if (warscroll) selections.push(warscroll)
    }
  })

  return {
    parsedRoster: {
      source: 'official-app-text',
      proposedName: nameMatch?.[1].trim() || `${declaredFaction} imported army`,
      declaredFaction,
      ...(contextLine ? { declaredContext: contextLine.text } : {}),
      selections: selections.sort((left, right) => left.line - right.line),
    },
    diagnostics: [],
  }
}
