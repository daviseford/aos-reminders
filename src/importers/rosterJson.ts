import type { Aos4ParsedRosterResult } from '../aos4/import'
import { parseAos4RosterTree, rosterError, type RosterNode } from './rosterTree'

/**
 * New Recruit's `.json` export, read as the roster tree it transliterates.
 *
 * The export is mechanical rather than a second format: the same field names, each XML container
 * flattened to an array under its own key, element text as `$text`, and any attribute value that
 * round-trips as a number typed as one. That last rule is the trap — a selection id of `52408` is
 * a JSON *number*, while `kanfwh` and `e51d-b1a3-75fc-dc3g` stay strings — so nothing here may
 * assume an id, count, or version is textual.
 *
 * Everything the roster means is read by `parseAos4RosterTree`, so a `.json` upload and the `.ros`
 * it was exported alongside cannot drift apart.
 */
type JsonObject = Record<string, unknown>

const isJsonObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * A hostile file can nest far deeper than a roster ever does, and the tree is walked recursively.
 *
 * Real exports run about a dozen levels; the cap is set well clear of that so it can only ever be
 * reached by input that was never a roster.
 */
export const MAX_ROSTER_JSON_DEPTH = 64

const exceedsDepth = (value: unknown, limit: number): boolean => {
  const pending: { value: unknown; depth: number }[] = [{ value, depth: 1 }]
  while (pending.length) {
    const current = pending.pop()
    if (!current) break
    if (current.depth > limit) return true
    const children = Array.isArray(current.value)
      ? current.value
      : isJsonObject(current.value)
        ? Object.values(current.value)
        : []
    children.forEach(child => pending.push({ value: child, depth: current.depth + 1 }))
  }
  return false
}

/**
 * The item name for a container key.
 *
 * BattleScribe's schema strictly alternates plural containers and singular items — `<selections>`
 * holds `<selection>` — and the JSON export keeps only the plural, as the array's key. Restoring
 * the singular is what lets the shared reader ask the same parentage questions of both formats.
 * The three that carry meaning are listed rather than derived, because `categories` does not
 * singularise the way a rule would guess; the fallback exists only so unrecognised containers
 * still get a stable name, and nothing consults them.
 */
const ITEM_NAMES: Record<string, string> = {
  categories: 'category',
  costLimits: 'costLimit',
  costs: 'cost',
  characteristics: 'characteristic',
  forces: 'force',
  profiles: 'profile',
  publications: 'publication',
  rules: 'rule',
  selections: 'selection',
}

const itemName = (container: string): string =>
  ITEM_NAMES[container] ?? container.replace(/ies$/, 'y').replace(/s$/, '')

/**
 * Read a property as attribute text.
 *
 * Only scalars qualify: an array is a container, and an object is not a shape the export produces.
 * Numbers and booleans are stringified back to what the XML attribute held, which is what makes
 * `String(2.03) === '2.03'` and `String(52408) === '52408'` the right answer rather than a
 * coincidence — the export typed them from exactly that text.
 */
const attributeText = (value: JsonObject, key: string): string | undefined => {
  const item = value[key]
  if (typeof item === 'string') return item
  if (typeof item === 'number') return Number.isFinite(item) ? String(item) : undefined
  if (typeof item === 'boolean') return String(item)
  return undefined
}

/**
 * Where each id first appears in the file, so diagnostics can point at it.
 *
 * New Recruit minifies the export, which puts the whole roster on line 1 — but a player who
 * pretty-printed the file before uploading it gets real positions for one scan of the raw text,
 * which is the only place they survive at all: `JSON.parse` discards them.
 */
const selectionLines = (json: string): Map<string, number> => {
  const lines = new Map<string, number>()
  const idPattern = /"id"\s*:\s*(?:"((?:[^"\\]|\\.)*)"|(-?\d+(?:\.\d+)?))/g
  let currentLine = 1
  let previousIndex = 0
  let match: RegExpExecArray | null
  while ((match = idPattern.exec(json))) {
    currentLine += (json.slice(previousIndex, match.index).match(/\n/g) ?? []).length
    previousIndex = match.index
    const id = match[1] ?? match[2]
    if (id && !lines.has(id)) lines.set(id, currentLine)
  }
  return lines
}

const jsonNode = (
  name: string,
  value: JsonObject,
  parent: RosterNode | undefined,
  lineById: Map<string, number>
): RosterNode => {
  const node: RosterNode = {
    name,
    parent,
    line: lineById.get(attributeText(value, 'id') ?? '') ?? 1,
    attribute: key => attributeText(value, key),
    children: () =>
      Object.entries(value).flatMap(([key, item]) => {
        if (!Array.isArray(item)) return []
        /**
         * The container the array stands in for. XML spells this level out, and the roster's
         * meaning depends on it, so the adapter puts it back rather than teaching the reader two
         * ways to find a unit.
         */
        const container: RosterNode = {
          name: key,
          parent: node,
          line: node.line,
          attribute: () => undefined,
          children: () =>
            item.filter(isJsonObject).map(entry => jsonNode(itemName(key), entry, container, lineById)),
        }
        return [container]
      }),
  }
  return node
}

export const parseAos4RosterJson = (json: string): Aos4ParsedRosterResult => {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return rosterError('unsafe-input', 'Roster JSON is malformed and cannot be imported.')
  }

  /**
   * The export wraps the roster in a single `roster` key, mirroring the XML's single root. Anything
   * else is a different file that happens to be JSON, and is refused rather than searched.
   */
  const roster = isJsonObject(parsed) ? parsed.roster : undefined
  if (!isJsonObject(parsed) || Object.keys(parsed).length !== 1 || !isJsonObject(roster)) {
    return rosterError('unsafe-input', 'The file must contain exactly one supported roster JSON root.')
  }
  if (exceedsDepth(roster, MAX_ROSTER_JSON_DEPTH)) {
    return rosterError(
      'unsafe-input',
      `Roster JSON may not nest more than ${MAX_ROSTER_JSON_DEPTH} levels deep.`
    )
  }

  return parseAos4RosterTree(jsonNode('roster', roster, undefined, selectionLines(json)))
}
