import type {
  Aos4ImportDiagnostic,
  Aos4ParsedRosterResult,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from '../aos4/import'
import type { Aos4ImportLine } from './detectTextSource'

/*
 * Sigdex (https://sigdex.io/) exports a deterministic plain-text list, measured from its
 * serializer (src/modules/builder/exportList.ts in AjSchaff/Sigdex):
 *
 *   <name> <points>/<cap> pts
 *   <Faction>                       — or `<Base Army> | <Army of Renown>` + `Army of Renown`
 *   <Battle Formation> (pts)
 *   General's Handbook 2025-26
 *   Drops: N
 *   Wounds: N
 *   Spell Lore - <name> (pts)       — prayer/manifestation lores likewise
 *   Battle Tactic Cards: A, B
 *
 *   General's Regiment / Regiment N / Auxiliary Units — unit lines `Name (pts)` with `•` bullets
 *   for General, Reinforced, weapon options (`Nx <option>`), artefact, heroic trait, and
 *   enhancements. Faction Terrain and Regiments of Renown are their own sections.
 *
 *   Created with Sigdex: https://sigdex.io/
 *   App Version: <semver>
 *   Data Version: v<revision>
 *
 * Bullets are unlabeled, so anything that is not General/Reinforced/a weapon option imports with
 * the generic enhancement hint and resolves against artefacts, heroic traits, and enhancement
 * tables alike — the same treatment the official app's unlabeled bullets get.
 */

const footerPattern = /^(?:Created with Sigdex:.*|App Version:\s*.+|Server Version:\s*.+|Data Version:\s*.+)$/i
const rosterNamePattern = /^(.+?)\s+\d+\s*\/\s*\d+\s*(?:pts?|points?)\s*$/i
const contextPattern = /^(?:General['’]s Handbook|GHB)\b/i
const metadataPattern = /^(?:Drops?|Wounds?|Total|Points?)\s*:/i
const battleTacticsPattern = /^Battle Tactic Cards\s*:/i
const armyOfRenownPattern = /^Army of Renown$/i
const lorePattern = /^(Spell Lore|Prayer Lore|Manifestation Lore)\s*[-:]\s*(.+)$/i
const pointsSuffixPattern = /\s*\(\s*\+?\d+\s*(?:pts?|points?)?\s*\)\s*$/i
const unitSectionPattern = /^(?:General['’]s Regiment|Regiment\s+\d+|Auxiliary Units)$/i
const terrainSectionPattern = /^Faction Terrain$/i
const renownSectionPattern = /^Regiments of Renown$/i

type Section = 'header' | 'units' | 'terrain' | 'renown'

const stripPointsSuffix = (value: string): string => value.replace(pointsSuffixPattern, '').trim()

const loreKind = (label: string): ParsedRosterSelectionKind => {
  if (/^Prayer Lore$/i.test(label)) return 'prayer-lore'
  if (/^Manifestation Lore$/i.test(label)) return 'manifestation-lore'
  return 'spell-lore'
}

const parseBullet = (line: Aos4ImportLine): ParsedRosterSelection | undefined => {
  const match = line.text.match(/^[•]\s*(.+)$/)
  if (!match) return undefined
  const label = stripPointsSuffix(match[1])
  if (
    /^(?:General|Reinforced)$/i.test(label) ||
    /^\d+\s*[x×]\s+/i.test(label) ||
    /\bx\d+\b/i.test(label) ||
    label.includes(';')
  ) {
    return undefined
  }
  return { line: line.number, label, kindHint: 'enhancement' }
}

const missingFaction = (line?: number): Aos4ImportDiagnostic => ({
  code: 'missing-faction',
  severity: 'error',
  message: 'The Sigdex export must begin with a list name, faction, and battle formation.',
  ...(line === undefined ? {} : { line }),
})

export const parseSigdexRoster = (lines: Aos4ImportLine[]): Aos4ParsedRosterResult => {
  const populated = lines.filter(line => line.text && !footerPattern.test(line.text))
  const nameLine = populated[0]
  const nameMatch = nameLine?.text.match(rosterNamePattern)
  if (!nameLine || !nameMatch) {
    return { diagnostics: [missingFaction(nameLine?.number)] }
  }

  const selections: ParsedRosterSelection[] = []
  let declaredFaction: string | undefined
  let declaredContext: string | undefined
  let section: Section = 'header'
  let headerRow = 0

  for (const line of populated.slice(1)) {
    if (unitSectionPattern.test(line.text)) {
      section = 'units'
      continue
    }
    if (terrainSectionPattern.test(line.text)) {
      section = 'terrain'
      continue
    }
    if (renownSectionPattern.test(line.text)) {
      section = 'renown'
      continue
    }

    if (section === 'header') {
      if (contextPattern.test(line.text)) {
        declaredContext = line.text
        continue
      }
      if (metadataPattern.test(line.text) || battleTacticsPattern.test(line.text)) continue
      const lore = line.text.match(lorePattern)
      if (lore) {
        selections.push({
          line: line.number,
          label: stripPointsSuffix(lore[2]),
          kindHint: loreKind(lore[1]),
        })
        continue
      }
      if (armyOfRenownPattern.test(line.text)) continue
      if (headerRow === 0) {
        // Faction row. An Army of Renown export writes `<Base Army> | <Army of Renown>` here.
        const parts = line.text.split('|').map(part => part.trim())
        if (parts.length === 2 && parts.every(Boolean)) {
          declaredFaction = parts[0]
          selections.push({ line: line.number, label: parts[1], kindHint: 'battle-formation' })
        } else {
          declaredFaction = line.text
        }
        headerRow = 1
        continue
      }
      if (headerRow === 1) {
        selections.push({
          line: line.number,
          label: stripPointsSuffix(line.text),
          kindHint: 'battle-formation',
        })
        headerRow = 2
        continue
      }
      continue
    }

    const bullet = parseBullet(line)
    if (line.text.startsWith('•')) {
      if (bullet) selections.push(bullet)
      continue
    }

    if (section === 'renown' && !selections.some(selection => selection.kindHint === 'regiment-of-renown')) {
      selections.push({
        line: line.number,
        label: stripPointsSuffix(line.text),
        kindHint: 'regiment-of-renown',
        isRegimentOfRenown: true,
      })
      continue
    }

    selections.push({
      line: line.number,
      label: stripPointsSuffix(line.text),
      kindHint: 'warscroll',
      ...(section === 'renown' ? { isRegimentOfRenown: true } : {}),
    })
  }

  if (!declaredFaction) {
    return { diagnostics: [missingFaction(nameLine.number)] }
  }

  return {
    parsedRoster: {
      source: 'sigdex-text',
      proposedName: nameMatch[1].trim(),
      ...(declaredContext ? { declaredContext } : {}),
      declaredFaction,
      selections,
    },
    diagnostics: [],
  }
}
