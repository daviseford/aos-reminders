import type {
  Aos4ImportDiagnostic,
  Aos4ParsedRosterResult,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from '../aos4/import'
import type { Aos4ImportLine } from './detectTextSource'

const pointsLinePattern = /^(?:(\d+)\s*[x×]\s+)?(.+?)\s+\(\s*\d+\s*(?:pts?|points?)?\s*\)\s*$/i
const pointsSuffixPattern = /\s*\(\s*\+?\d+\s*(?:pts?|points?)?\s*\)\s*$/i
const rosterNamePattern = /^(.+?)\s+\d+\s*\/\s*\d+\s*(?:pts?|points?)\s*$/i
const lorePattern = /^(Spell Lore|Prayer Lore|Manifestation Lore)\s*[-:]\s*(.+)$/i
const battleFormationPattern = /^Battle Formation\s*[-:]\s*(.+)$/i
const contextPattern = /^(?:General['’]s Handbook|GHB)\b/i
const officialMetadataPattern =
  /^(?:Created with Warhammer Age of Sigmar: The App|App:|Exported with App Version:|Drops?:|Total:|Auxiliaries:|Battle Tactics? Cards?:|Army of Renown\s*$)/i
const sectionPattern =
  /^(?:REGIMENTS?|Regiment \d+|AUXILIARIES|AUXILIARY UNITS|FACTION TERRAIN|REGIMENTS OF RENOWN)$/i
/** The app pads its exports with runs of dashes between blocks. They carry no roster content. */
const separatorPattern = /^[-–—]{3,}$/
/**
 * A `• Legends` bullet is not an enhancement — it marks the warscroll above it as Legends content.
 * The app emits it per unit rather than declaring the opt-in once in the header.
 */
const legendsBulletPattern = /^[•]\s*Legends\s*$/i

/**
 * A bundled sub-unit — an unpointed line directly beneath a pointed one, covered by that unit's
 * cost. Two shapes use it: the Freeguild Command Corps, where `Adjutants (200)` is followed by bare
 * `Auxiliaries` and `Whisperblade` lines, and a regiment of renown, where the pointed bundle is
 * followed by its member warscrolls. Both are real warscrolls with their own rules.
 *
 * Guarded against the free rules prose the app also emits unpointed: names are short, do not lead
 * with a list marker, and carry no sentence punctuation. Colons are allowed — `Scourge of Aqshy:
 * Mancrusher Gargant` is a unit name.
 */
const bundledWarscrollPattern = /^[^-•][^.!?;]*$/
const MAX_BUNDLED_LABEL_LENGTH = 60

type Section = 'none' | 'units' | 'faction-terrain' | 'regiment-of-renown'

const stripPointsSuffix = (value: string): string => value.replace(pointsSuffixPattern, '').trim()

const loreKind = (label: string): ParsedRosterSelectionKind => {
  if (/^Prayer Lore$/i.test(label)) return 'prayer-lore'
  if (/^Manifestation Lore$/i.test(label)) return 'manifestation-lore'
  return 'spell-lore'
}

/**
 * Split an English list — `A, B and C` — into its members.
 *
 * Only the final comma segment is split on ` and `, because members themselves contain the word:
 * the battle tactic `Intercept and Recover` is one name, not two. That mirrors how the app
 * serialises the list, and leaves a single-member value untouched.
 */
const splitConjoinedList = (value: string): string[] => {
  const segments = value
    .split(',')
    .map(segment => segment.trim())
    .filter(Boolean)
  const last = segments.pop()
  if (!last) return []
  const conjunction = last.lastIndexOf(' and ')
  if (conjunction === -1) return [...segments, last]
  return [...segments, last.slice(0, conjunction), last.slice(conjunction + ' and '.length)]
    .map(segment => segment.trim())
    .filter(Boolean)
}

const sectionFor = (text: string): Section => {
  if (/^REGIMENTS OF RENOWN$/i.test(text)) return 'regiment-of-renown'
  if (/^FACTION TERRAIN$/i.test(text)) return 'faction-terrain'
  return 'units'
}

/**
 * Read the header line that names the faction.
 *
 * The leading parts vary — a grand alliance (`Grand Alliance Order | Cities of Sigmar |
 * Grudgebound War Throng`), a parent publication (`Orruk Warclans | Ironjawz | Weirdfist`), or
 * nothing at all for an Army of Renown (`Gloomspite Gitz | Da King's Gitz`). What is stable is the
 * tail: the header always ends `faction | battle formation`. So drop a leading grand alliance,
 * then read the last two parts. Only the faction is required — `Grand Alliance Order | Stormcast
 * Eternals` declares no formation.
 *
 * Taking the tail rather than the head is what makes `Ironjawz` the faction instead of `Orruk
 * Warclans`, which is a publication and resolves against nothing.
 */
const splitPipeHeader = (text: string): string[] | undefined => {
  if (!text.includes('|')) return undefined
  const parts = text.split('|').map(part => part.trim())
  if (parts.length < 2 || parts.length > 3 || parts.some(part => !part)) return undefined
  const withoutAlliance = /^Grand Alliance\b/i.test(parts[0]) ? parts.slice(1) : parts
  return withoutAlliance.length ? withoutAlliance.slice(-2) : undefined
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

const parseBundledWarscroll = (
  line: Aos4ImportLine,
  previousEntryLine: number | undefined
): ParsedRosterSelection | undefined => {
  if (previousEntryLine === undefined || line.number !== previousEntryLine + 1) return undefined
  if (line.text.length > MAX_BUNDLED_LABEL_LENGTH) return undefined
  if (!bundledWarscrollPattern.test(line.text)) return undefined
  return { line: line.number, label: line.text, kindHint: 'warscroll' }
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

  // The header sits above the first section, so anything at or below one cannot be it. That keeps
  // the pipe-delimited `App: … | Data: …` footer from being read as a faction declaration.
  const firstSectionLine = populated.find(line => sectionPattern.test(line.text))
  const headerCandidates = populated.filter(
    line =>
      (firstSectionLine === undefined || line.number < firstSectionLine.number) &&
      !rosterNamePattern.test(line.text) &&
      !officialMetadataPattern.test(line.text) &&
      !contextPattern.test(line.text) &&
      !separatorPattern.test(line.text) &&
      !lorePattern.test(line.text)
  )

  const pipeHeader = headerCandidates.find(line => splitPipeHeader(line.text))
  const pipeParts = pipeHeader ? splitPipeHeader(pipeHeader.text) : undefined

  const factionLine = pipeHeader ?? headerCandidates[0]
  const declaredFaction = pipeParts ? pipeParts[0] : factionLine?.text
  const formationLine = pipeHeader ?? headerCandidates[1]
  const formationLabel = pipeParts ? pipeParts[1] : headerCandidates[1]?.text

  if (!declaredFaction) {
    return { diagnostics: [missingFaction(nameLine?.number)] }
  }

  const formation: ParsedRosterSelection | undefined = formationLabel
    ? {
        line: formationLine?.number ?? 1,
        label: stripPointsSuffix(formationLabel),
        kindHint: 'battle-formation',
      }
    : undefined

  const headerLineNumbers = new Set(
    [nameLine?.number, factionLine?.number, formation ? formationLine?.number : undefined].filter(
      (number): number is number => number !== undefined
    )
  )

  const contextLine = populated.find(line => contextPattern.test(line.text))
  const selections: ParsedRosterSelection[] = formation ? [formation] : []
  let section: Section = 'none'
  let allowsLegends = false
  /** The most recent warscroll, so a trailing `• Legends` bullet can mark it. */
  let lastWarscroll: ParsedRosterSelection | undefined
  /** The most recent line that produced roster content, for bundled sub-unit adjacency. */
  let lastEntryLine: number | undefined

  const record = (selection: ParsedRosterSelection, isWarscroll: boolean): void => {
    selections.push(selection)
    lastEntryLine = selection.line
    if (isWarscroll) lastWarscroll = selection
  }

  lines.forEach(line => {
    if (!line.text || headerLineNumbers.has(line.number)) return
    if (separatorPattern.test(line.text)) return

    if (sectionPattern.test(line.text)) {
      section = sectionFor(line.text)
      lastWarscroll = undefined
      lastEntryLine = undefined
      return
    }

    if (legendsBulletPattern.test(line.text)) {
      allowsLegends = true
      if (lastWarscroll) lastWarscroll.isLegends = true
      lastEntryLine = line.number
      return
    }

    if (officialMetadataPattern.test(line.text) || contextPattern.test(line.text)) return

    const lore = line.text.match(lorePattern)
    if (lore) {
      const kindHint = loreKind(lore[1])
      // Every lore row can hold several picks — `Spell Lore - Lore of Hysh, Lore of the Awakened
      // Realms and Lore of Prismatic Resonance (10 Points)` is three selections, not one lore named
      // after all of them. Safe to split because no lore the catalog carries has a comma or the
      // word "and" in its name; battle formations do (`Pioneers and Scavengers`) and are not split.
      splitConjoinedList(lore[2]).forEach(label => {
        selections.push({ line: line.number, label: stripPointsSuffix(label), kindHint })
      })
      return
    }

    const explicitFormation = line.text.match(battleFormationPattern)
    if (explicitFormation) {
      selections.push({
        line: line.number,
        label: stripPointsSuffix(explicitFormation[1]),
        kindHint: 'battle-formation',
      })
      return
    }

    const bullet = parseBullet(line)
    if (bullet && section !== 'none') {
      record(bullet, false)
      return
    }

    if (section === 'faction-terrain') {
      const pointed = parsePointedWarscroll(line)
      record(pointed ?? { line: line.number, label: line.text, kindHint: 'warscroll' }, true)
      return
    }

    if (section === 'regiment-of-renown') {
      // Only the members are roster content. The renown regiment itself — `Big Grikk's Kruleshots
      // (320)` — is a purchasable bundle with no warscroll of its own, so it carries the points
      // but never resolves. Chain its members off it without recording it.
      const container = parsePointedWarscroll(line)
      if (container) {
        lastEntryLine = line.number
        return
      }
      // Older exports dashed their members; v1.36 lists them bare, like bundled sub-units.
      const dashed = line.text.match(/^-\s*(.+)$/)
      if (dashed) {
        record(
          {
            line: line.number,
            label: stripPointsSuffix(dashed[1]),
            kindHint: 'warscroll',
            isRegimentOfRenown: true,
          },
          true
        )
        return
      }
      const member = parseBundledWarscroll(line, lastEntryLine)
      if (member) record({ ...member, isRegimentOfRenown: true }, true)
      return
    }

    if (section === 'units') {
      const warscroll = parsePointedWarscroll(line)
      if (warscroll) {
        record(warscroll, true)
        return
      }
      const bundled = parseBundledWarscroll(line, lastEntryLine)
      if (bundled) record(bundled, true)
    }
  })

  return {
    parsedRoster: {
      source: 'official-app-text',
      proposedName: nameMatch?.[1].trim() || `${declaredFaction} imported army`,
      declaredFaction,
      ...(contextLine ? { declaredContext: contextLine.text } : {}),
      ...(allowsLegends ? { allowsLegends: true } : {}),
      selections: selections.sort((left, right) => left.line - right.line),
    },
    diagnostics: [],
  }
}
