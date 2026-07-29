import type {
  Aos4ImportDiagnostic,
  Aos4ParsedRosterResult,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from '../../aos4/import'
import { MAX_IMPORT_SELECTIONS, MAX_TEXT_IMPORT_LINES } from './detectTextSource'

const ROSTER_NAMESPACE = 'http://www.battlescribe.net/schema/rosterSchema'

const error = (
  code: Aos4ImportDiagnostic['code'],
  message: string,
  line?: number
): Aos4ParsedRosterResult => ({
  diagnostics: [
    {
      code,
      severity: 'error',
      message,
      ...(line === undefined ? {} : { line }),
    },
  ],
})

const childElements = (parent: Element, localName: string): Element[] =>
  Array.from(parent.children).filter(child => child.localName === localName)

const groupKind = (group: string): ParsedRosterSelectionKind | undefined => {
  if (/^Battle Formations(?:\b|:)/i.test(group)) return 'battle-formation'
  if (/^Artefacts? of Power(?:\b|:)/i.test(group)) return 'artefact-of-power'
  if (/^Heroic Traits?(?:\b|:)/i.test(group)) return 'enhancement'
  if (/^Spell Lores?(?:\b|:)/i.test(group)) return 'spell-lore'
  if (/^Prayer Lores?(?:\b|:)/i.test(group)) return 'prayer-lore'
  if (/^Manifestation Lores?(?:\b|:)/i.test(group)) return 'manifestation-lore'
  if (/^Regiments? of Renown(?:\b|:)/i.test(group)) return 'regiment-of-renown'
  return undefined
}

const selectionLines = (xml: string): Map<string, number> => {
  const lines = new Map<string, number>()
  const tagPattern = /<selection\b[^>]*>/gi
  let currentLine = 1
  let previousIndex = 0
  let match: RegExpExecArray | null
  while ((match = tagPattern.exec(xml))) {
    currentLine += (xml.slice(previousIndex, match.index).match(/\n/g) ?? []).length
    previousIndex = match.index
    const id = match[0].match(/\bid\s*=\s*(["'])(.*?)\1/i)?.[2]
    if (id && !lines.has(id)) lines.set(id, currentLine)
  }
  return lines
}

const selectionLine = (selection: Element, lines: Map<string, number>): number =>
  lines.get(selection.getAttribute('id') ?? '') ?? 1

const directModelName = (selection: Element): string | undefined => {
  const modelNames = new Set(
    childElements(selection, 'selections')
      .flatMap(container => childElements(container, 'selection'))
      .filter(child => child.getAttribute('type') === 'model')
      .map(child => child.getAttribute('name')?.trim())
      .filter((name): name is string => Boolean(name))
  )
  if (modelNames.size !== 1) return undefined
  return Array.from(modelNames)[0]
}

/**
 * New Recruit marks each retired entry with a `Legends` category on the selection itself, which is
 * a far stronger signal than recognising the name later: it says which side of the Legends
 * boundary *the builder* filed this entry on. Only the selection's direct `categories` child is
 * consulted — the same category id also appears on nested upgrade children, which describe the
 * upgrade, not the unit.
 */
const hasLegendsCategory = (selection: Element): boolean =>
  childElements(selection, 'categories')
    .flatMap(container => childElements(container, 'category'))
    .some(category => category.getAttribute('name')?.trim().toLocaleLowerCase('en') === 'legends')

const unitLabel = (selection: Element): string => {
  const selectedName = selection.getAttribute('name')?.trim() ?? ''
  const modelName = directModelName(selection)
  return modelName && selectedName.startsWith(`${modelName} (`) ? modelName : selectedName
}

const declaredContextFromForce = (force: Element): string | undefined => {
  const name = (force.getAttribute('name') ?? '').replace(/^[^A-Za-z0-9]+/, '').trim()
  const supportedShape = name.match(
    /(?:General['’]s Handbook|GHB)\b.*$|^(?:Spearhead|Legends|Current Standard)\b.*$/i
  )
  return supportedShape?.[0].trim()
}

export const parseAos4RosterXml = (xml: string): Aos4ParsedRosterResult => {
  if ((xml.match(/\n/g) ?? []).length + 1 > MAX_TEXT_IMPORT_LINES) {
    return error('input-too-large', `Roster XML must contain ${MAX_TEXT_IMPORT_LINES} lines or fewer.`)
  }
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(xml)) {
    return error('unsafe-input', 'Roster XML cannot contain doctype or entity declarations.')
  }

  const document = new DOMParser().parseFromString(xml, 'application/xml')
  if (document.getElementsByTagName('parsererror').length) {
    return error('unsafe-input', 'Roster XML is malformed and cannot be imported.')
  }

  const root = document.documentElement
  const rosterElements = document.getElementsByTagNameNS('*', 'roster')
  if (root.localName !== 'roster' || root.namespaceURI !== ROSTER_NAMESPACE || rosterElements.length !== 1) {
    return error('unsafe-input', 'The file must contain exactly one supported roster XML root.')
  }
  if (
    root.getAttribute('gameSystemName') !== 'Age of Sigmar 4.0' ||
    !/^2\./.test(root.getAttribute('battleScribeVersion') ?? '')
  ) {
    return error(
      'unsupported-source',
      'The roster is not marked as an Age of Sigmar 4.0 roster-schema export.'
    )
  }

  const allSelectionElements = Array.from(document.getElementsByTagNameNS('*', 'selection'))
  if (allSelectionElements.length > MAX_IMPORT_SELECTIONS) {
    return error(
      'input-too-large',
      `Roster XML may contain at most ${MAX_IMPORT_SELECTIONS} selection nodes.`
    )
  }

  const forcesContainers = childElements(root, 'forces')
  const topForces = forcesContainers.flatMap(container => childElements(container, 'force'))
  if (topForces.length !== 1) {
    return error('unsafe-input', 'The roster must contain exactly one top-level army force.')
  }
  const topForce = topForces[0]
  const declaredFaction = topForce.getAttribute('catalogueName')?.trim()
  if (!declaredFaction) {
    return error('missing-faction', 'The roster does not declare a faction catalogue.')
  }

  const lineById = selectionLines(xml)
  const selections: ParsedRosterSelection[] = []
  allSelectionElements.forEach(selection => {
    const group = selection.getAttribute('group')?.trim()
    const kindHint = group ? groupKind(group) : undefined
    if (kindHint) {
      const label = selection.getAttribute('name')?.trim()
      if (label) {
        selections.push({
          line: selectionLine(selection, lineById),
          label,
          kindHint,
          ...(hasLegendsCategory(selection) ? { isLegends: true } : {}),
        })
      }
      return
    }

    const container = selection.parentElement
    const force = container?.parentElement
    if (
      selection.getAttribute('type') !== 'unit' ||
      container?.localName !== 'selections' ||
      force?.localName !== 'force'
    ) {
      return
    }
    const label = unitLabel(selection)
    if (!label) return
    const count = Number(selection.getAttribute('number'))
    selections.push({
      line: selectionLine(selection, lineById),
      label,
      kindHint: 'warscroll',
      ...(Number.isFinite(count) && count > 1 ? { count } : {}),
      ...(hasLegendsCategory(selection) ? { isLegends: true } : {}),
    })
  })

  const declaredContext = declaredContextFromForce(topForce)
  /**
   * New Recruit records the Legends opt-in as an ordinary configuration selection rather than an
   * attribute, so it is recognised by name. Without it, a roster full of retired warscrolls is
   * indistinguishable from one full of typos.
   */
  const allowsLegends = allSelectionElements.some(
    selection => selection.getAttribute('name')?.trim().toLocaleLowerCase('en') === 'allow legends'
  )

  return {
    parsedRoster: {
      source: 'roster-xml',
      proposedName: root.getAttribute('name')?.trim() || `${declaredFaction} imported army`,
      declaredFaction,
      ...(declaredContext ? { declaredContext } : {}),
      ...(allowsLegends ? { allowsLegends } : {}),
      selections,
    },
    diagnostics: [],
  }
}
