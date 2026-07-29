/**
 * Test-only readers for New Recruit roster exports.
 *
 * These exist to prove fixture invariants, not to import rosters. The real adapter lands with
 * plan `2026-07-29-001` step U4 and will bring its own parser and dependency choices; nothing
 * here should be promoted into `src/aos4/`.
 *
 * Both readers are deliberately strict: they throw on anything outside the observed
 * BattleScribe/New Recruit subset rather than guessing. A false negative is a loud test failure;
 * a lenient reader could silently agree with a malformed fixture.
 */
import { inflateRawSync } from 'node:zlib'

// --- ZIP -------------------------------------------------------------------------------------

export interface ZipEntry {
  name: string
  encrypted: boolean
  compressionMethod: number
  data: Buffer
}

const EOCD_SIGNATURE = 0x06054b50
const CENTRAL_SIGNATURE = 0x02014b50
const LOCAL_SIGNATURE = 0x04034b50

/** Enumerate every zip entry via the central directory, including metadata-only entries. */
export const readZipEntries = (archive: Buffer): ZipEntry[] => {
  let eocd = -1
  for (let offset = archive.length - 22; offset >= 0; offset -= 1) {
    if (archive.readUInt32LE(offset) === EOCD_SIGNATURE) {
      eocd = offset
      break
    }
  }
  if (eocd < 0) throw new Error('Not a zip archive: no end-of-central-directory record')

  const entryCount = archive.readUInt16LE(eocd + 10)
  let cursor = archive.readUInt32LE(eocd + 16)
  const entries: ZipEntry[] = []

  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(cursor) !== CENTRAL_SIGNATURE) {
      throw new Error(`Malformed central directory at entry ${index}`)
    }
    const flags = archive.readUInt16LE(cursor + 8)
    const compressionMethod = archive.readUInt16LE(cursor + 10)
    const compressedSize = archive.readUInt32LE(cursor + 20)
    const nameLength = archive.readUInt16LE(cursor + 28)
    const extraLength = archive.readUInt16LE(cursor + 30)
    const commentLength = archive.readUInt16LE(cursor + 32)
    const localOffset = archive.readUInt32LE(cursor + 42)
    const name = archive.toString('utf8', cursor + 46, cursor + 46 + nameLength)

    if (archive.readUInt32LE(localOffset) !== LOCAL_SIGNATURE) {
      throw new Error(`Malformed local header for ${name}`)
    }
    const localNameLength = archive.readUInt16LE(localOffset + 26)
    const localExtraLength = archive.readUInt16LE(localOffset + 28)
    const dataStart = localOffset + 30 + localNameLength + localExtraLength
    const raw = archive.subarray(dataStart, dataStart + compressedSize)
    const encrypted = (flags & 0x1) === 1

    let data = Buffer.alloc(0)
    if (!encrypted) {
      if (compressionMethod === 0) data = Buffer.from(raw)
      else if (compressionMethod === 8) data = inflateRawSync(raw)
      else throw new Error(`Unsupported compression method ${compressionMethod} for ${name}`)
    }

    entries.push({ name, encrypted, compressionMethod, data })
    cursor += 46 + nameLength + extraLength + commentLength
  }

  return entries
}

// --- XML -------------------------------------------------------------------------------------

export interface XmlElement {
  tag: string
  attributes: Record<string, string>
  children: XmlElement[]
  text: string
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

const decodeEntities = (value: string): string =>
  value.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body.startsWith('#x')) return String.fromCodePoint(Number.parseInt(body.slice(2), 16))
    if (body.startsWith('#')) return String.fromCodePoint(Number.parseInt(body.slice(1), 10))
    const named = ENTITIES[body]
    if (named === undefined) throw new Error(`Unsupported XML entity: ${match}`)
    return named
  })

/**
 * Parse the BattleScribe roster XML subset New Recruit emits.
 *
 * Rejected on sight: DOCTYPE, entity declarations, CDATA, comments, processing instructions
 * beyond the leading declaration, namespace-prefixed names, and mixed content. Those are either
 * absent from real exports or are the hostile shapes U4 must fail closed on.
 */
export const parseRosterXml = (source: string): XmlElement => {
  let cursor = 0
  const stack: XmlElement[] = []
  let root: XmlElement | undefined

  const fail = (message: string): never => {
    const line = source.slice(0, cursor).split('\n').length
    throw new Error(`${message} (line ${line})`)
  }

  while (cursor < source.length) {
    const open = source.indexOf('<', cursor)
    if (open < 0) break

    if (open > cursor) {
      const text = source.slice(cursor, open)
      const current = stack[stack.length - 1]
      if (text.trim()) {
        if (!current) fail('Text outside the root element')
        current!.text += decodeEntities(text)
      }
    }

    if (source.startsWith('<?xml', open)) {
      if (open !== 0) fail('XML declaration must be the first token')
      cursor = source.indexOf('?>', open) + 2
      continue
    }
    if (source.startsWith('<!--', open)) fail('Comments are not supported')
    if (source.startsWith('<![CDATA[', open)) fail('CDATA sections are not supported')
    if (source.startsWith('<!DOCTYPE', open) || source.startsWith('<!ENTITY', open)) {
      fail('Doctype and entity declarations are rejected')
    }
    if (source.startsWith('<?', open)) fail('Processing instructions are not supported')

    const close = source.indexOf('>', open)
    if (close < 0) fail('Unterminated tag')
    const isClosing = source[open + 1] === '/'
    const selfClosing = source[close - 1] === '/'
    const body = source.slice(open + 1 + (isClosing ? 1 : 0), selfClosing ? close - 1 : close)

    if (isClosing) {
      const element = stack.pop()
      if (!element) fail(`Unexpected closing tag </${body.trim()}>`)
      if (element!.tag !== body.trim()) fail(`Mismatched closing tag </${body.trim()}>`)
      cursor = close + 1
      continue
    }

    const nameMatch = /^([^\s/>]+)/.exec(body)
    if (!nameMatch) fail('Unreadable tag name')
    const tag = nameMatch![1]
    if (tag.includes(':')) fail(`Namespace-prefixed element ${tag} is not supported`)

    const attributes: Record<string, string> = {}
    const attributePattern = /([^\s=]+)\s*=\s*"([^"]*)"/g
    let attribute: RegExpExecArray | null
    const attributeSource = body.slice(nameMatch![1].length)
    while ((attribute = attributePattern.exec(attributeSource))) {
      attributes[attribute[1]] = decodeEntities(attribute[2])
    }
    if (attributeSource.trim() && !/^(\s*[^\s=]+\s*=\s*"[^"]*")*\s*$/.test(attributeSource)) {
      fail(`Unparsed attribute syntax in <${tag}>`)
    }

    const element: XmlElement = { tag, attributes, children: [], text: '' }
    const parent = stack[stack.length - 1]
    if (parent) parent.children.push(element)
    else if (root) fail('Multiple root elements')
    else root = element

    if (!selfClosing) stack.push(element)
    cursor = close + 1
  }

  if (stack.length) throw new Error(`Unclosed element <${stack[stack.length - 1].tag}>`)
  if (!root) throw new Error('No root element')
  return root
}

// --- Transliteration -------------------------------------------------------------------------

/**
 * Does New Recruit serialise this attribute value as a JSON number?
 *
 * The rule is **by value, not by attribute name**. It first looked like a fixed set of numeric
 * attributes (`number`, `value`, `battleScribeVersion`, …), but a Cities of Sigmar capture carried
 * `id="52408"` — a selection id that happens to be all digits — and the JSON export typed it as
 * the number `52408`. Meanwhile `id="kanfwh"` and `gameSystemId="e51d-b1a3-75fc-dc3g"` stay
 * strings, so the serialiser is simply coercing anything that parses cleanly as a number.
 *
 * The round-trip check (`String(Number(v)) === v`) is what keeps that from over-reaching: it
 * rejects `"0151-9c5b-2f1e-32d4"`, and also `"007"`, which would not survive the trip.
 *
 * This matters to the importer: ids cannot be assumed to be strings after a JSON decode.
 */
const isNumericValue = (value: string): boolean =>
  value !== '' && Number.isFinite(Number(value)) && String(Number(value)) === value

/** Attributes New Recruit serialises as JSON booleans. */
const BOOLEAN_ATTRIBUTES = new Set(['primary', 'hidden'])

export type RosterNode = Record<string, unknown>

/**
 * Convert parsed roster XML into the exact shape New Recruit's `.json` export uses.
 *
 * A child element is transliterated one of three ways, by shape:
 *
 * - **Container** (has element children) — becomes an array keyed by the container's tag.
 *   BattleScribe's schema strictly alternates containers (`<selections>`) and items
 *   (`<selection>`), so this is the common case.
 * - **Text-valued property** (no children, has text) — becomes a plain string property. This is
 *   how `<rule><description>…</description></rule>` serialises: `{name, id, description: "…"}`.
 *   Note it is *not* `$text`, which carries an element's own text alongside its attributes.
 * - **Empty** (no children, no text) — omitted, matching the JSON export.
 */
export const xmlToRosterJson = (element: XmlElement): RosterNode => {
  const node: RosterNode = {}

  for (const child of element.children) {
    if (child.children.length === 0) {
      if (child.text) node[child.tag] = child.text
      continue // empty container: absent from the JSON export
    }
    node[child.tag] = child.children.map(xmlToRosterJson)
  }

  for (const [key, value] of Object.entries(element.attributes)) {
    if (isNumericValue(value)) {
      node[key] = Number(value)
    } else if (BOOLEAN_ATTRIBUTES.has(key)) {
      if (value !== 'true' && value !== 'false') {
        throw new Error(`Attribute ${key} is not boolean: ${value}`)
      }
      node[key] = value === 'true'
    } else {
      node[key] = value
    }
  }

  if (element.children.length === 0 && element.text) {
    node.$text = element.text
  } else if (element.children.length > 0 && element.text.trim()) {
    throw new Error(`Mixed content in <${element.tag}> is not supported`)
  }

  return node
}

/** Canonical form: object keys sorted, array order preserved (order is meaningful). */
export const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)])
    )
  }
  return value
}

const leaves = (value: unknown, path = '', into: Map<string, unknown> = new Map()) => {
  if (Array.isArray(value)) value.forEach((item, index) => leaves(item, `${path}[${index}]`, into))
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) leaves(item, `${path}/${key}`, into)
  } else into.set(path, value)
  return into
}

/** Human-readable leaf-level differences, for test failure messages. */
export const describeDifferences = (left: unknown, right: unknown, limit = 10): string[] => {
  const a = leaves(left)
  const b = leaves(right)
  const report: string[] = []

  a.forEach((value, path) => {
    if (!b.has(path)) report.push(`only in XML:  ${path} = ${JSON.stringify(value)}`)
    else if (JSON.stringify(b.get(path)) !== JSON.stringify(value)) {
      report.push(`differs: ${path} — XML ${JSON.stringify(value)} vs JSON ${JSON.stringify(b.get(path))}`)
    }
  })
  b.forEach((value, path) => {
    if (!a.has(path)) report.push(`only in JSON: ${path} = ${JSON.stringify(value)}`)
  })

  return report.slice(0, limit)
}
