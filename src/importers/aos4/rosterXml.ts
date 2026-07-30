import type { Aos4ParsedRosterResult } from '../../aos4/import'
import { MAX_TEXT_IMPORT_LINES } from './detectTextSource'
import { parseAos4RosterTree, rosterError, type RosterNode } from './rosterTree'

const ROSTER_NAMESPACE = 'http://www.battlescribe.net/schema/rosterSchema'

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

/** Present a parsed XML element as a roster node. Namespaces are ignored past the root check. */
const elementNode = (
  element: Element,
  parent: RosterNode | undefined,
  lineById: Map<string, number>
): RosterNode => {
  const node: RosterNode = {
    name: element.localName,
    parent,
    line: lineById.get(element.getAttribute('id') ?? '') ?? 1,
    attribute: key => element.getAttribute(key) ?? undefined,
    children: () => Array.from(element.children).map(child => elementNode(child, node, lineById)),
  }
  return node
}

export const parseAos4RosterXml = (xml: string): Aos4ParsedRosterResult => {
  if ((xml.match(/\n/g) ?? []).length + 1 > MAX_TEXT_IMPORT_LINES) {
    return rosterError('input-too-large', `Roster XML must contain ${MAX_TEXT_IMPORT_LINES} lines or fewer.`)
  }
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(xml)) {
    return rosterError('unsafe-input', 'Roster XML cannot contain doctype or entity declarations.')
  }

  const document = new DOMParser().parseFromString(xml, 'application/xml')
  if (document.getElementsByTagName('parsererror').length) {
    return rosterError('unsafe-input', 'Roster XML is malformed and cannot be imported.')
  }

  const root = document.documentElement
  const rosterElements = document.getElementsByTagNameNS('*', 'roster')
  if (root.localName !== 'roster' || root.namespaceURI !== ROSTER_NAMESPACE || rosterElements.length !== 1) {
    return rosterError('unsafe-input', 'The file must contain exactly one supported roster XML root.')
  }

  return parseAos4RosterTree(elementNode(root, undefined, selectionLines(xml)))
}
