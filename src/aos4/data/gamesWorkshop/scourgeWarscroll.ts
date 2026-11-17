import { createHash } from 'node:crypto'
import { createPdfJsDocumentLoader, type PdfDocumentLoader } from './pdfText'
import {
  parseColumn,
  segmentsOf,
  toItems,
  type GamesWorkshopSpearheadWarscroll,
  type GamesWorkshopSpearheadWeapon,
  type Item,
  type Segment,
} from './spearhead'

/**
 * Full-page warscrolls in an official seasonal faction pack (`• SCOURGE OF AQSHY WARSCROLL •`, one
 * warscroll per page; #1757). The pages share one template but not one geometry (the Khazalite
 * Holds pack prints a full-width and a half-width warscroll), so the reader works from relative
 * positions: the stat badge is the 14pt values, each weapon row is its 10pt values with the name just
 * above and the weapon abilities just below, the rules text reuses the Spearhead column parser, and
 * the keywords sit beside their label. Every extracted string must reappear in the page text, and
 * the review pins the extracted warscroll's checksum, so a layout change fails closed.
 */

export type OfficialWarscrollAbility = GamesWorkshopSpearheadWarscroll['abilities'][number] & {
  keywords: string[]
}
export type OfficialWarscrollPage = Omit<GamesWorkshopSpearheadWarscroll, 'abilities'> & {
  abilities: OfficialWarscrollAbility[]
  checksum: string
}

const BANNER = 'SCOURGEOFAQSHYWARSCROLL'
const collapse = (value: string): string => value.replace(/\s+/g, ' ').trim()
const squash = (value: string): string => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
const slug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')
const near = (left: number, right: number, tolerance: number) => Math.abs(left - right) <= tolerance
const fail = (page: number, message: string): never => {
  throw new Error(`Official warscroll page ${page}: ${message}`)
}

/**
 * A name too long for its column wraps (`FIRE, BLOOD AND` / `VENGEANCE: Should…`): a capitals-only
 * line directly above a line that opens with a capitals word and a colon is that name's first line.
 */
const mergeWrappedNames = (segments: Segment[]): Segment[] => {
  const result = [...segments].sort((left, right) => right.y - left.y || left.x - right.x)
  for (let index = 0; index < result.length; index += 1) {
    const top = result[index]
    if (!/^[A-Z][A-Z0-9’'!&, -]+$/.test(top.text) || top.text.endsWith(':')) continue
    const next = result.find(
      candidate =>
        candidate !== top &&
        near(candidate.x, top.x, 3) &&
        top.y - candidate.y > 0 &&
        top.y - candidate.y <= 10
    )
    const colonAt = next?.items.findIndex(item => /^[A-Z0-9’'!&, -]+:$/.test(item.str.trim())) ?? -1
    if (!next || colonAt !== 0) continue
    const first = next.items[0]
    const merged: Segment = {
      ...next,
      // The name reads from its first line, so its timing banner stays directly above it.
      y: top.y,
      items: [{ ...first, y: top.y, str: `${top.text} ${first.str.trim()}` }, ...next.items.slice(1)],
      text: `${top.text} ${next.text}`,
    }
    result.splice(result.indexOf(next), 1, merged)
    result.splice(index, 1)
    index -= 1
  }
  return result
}

/** Reads one warscroll page; `printedTitle` is the reviewed title as the page prints it. */
export const parseOfficialWarscrollPage = (
  rawItems: Item[],
  page: number,
  printedTitle: string,
  section: string
): OfficialWarscrollPage => {
  const items = rawItems.filter(item => item.str.trim())
  if (!items.some(item => squash(item.str) === BANNER)) fail(page, 'no Scourge of Aqshy warscroll banner')

  // Title: the large heading (possibly two lines) that spells the reviewed title.
  const titleItems = items.filter(item => item.height >= 10 && item.height < 25 && /[A-Z]/.test(item.str))
  const title = titleItems.filter(
    item => squash(printedTitle).includes(squash(item.str)) && squash(item.str).length > 3
  )
  if (
    squash(
      title
        .sort((l, r) => r.y - l.y)
        .map(item => item.str)
        .join('')
    ) !== squash(printedTitle)
  ) {
    fail(page, `title does not read ${printedTitle}`)
  }

  // Stat badge: four values in a diamond and the ward shield, the topmost value.
  const values = items.filter(item => near(item.height, 14, 0.6))
  if (values.length !== 5 && values.length !== 4) fail(page, `stat badge has ${values.length} values`)
  const byY = [...values].sort((left, right) => right.y - left.y)
  const wardItem = values.length === 5 ? byY.shift()! : undefined
  const [move, middleA, middleB, control] = byY
  const [health, save] = [middleA, middleB].sort((left, right) => left.x - right.x)

  // Keywords: the lines beside the KEY WORDS label (a two-line wrap is one list).
  const label = items.find(item => squash(item.str) === 'KEYWORDS')
  if (!label) fail(page, 'no KEY WORDS label')
  const keywordItems = items.filter(
    item =>
      item !== label && near(item.y, label!.y, 14) && item.height < 9 && !/^Keywords$/i.test(item.str.trim())
  )
  const keywordLines = segmentsOf(keywordItems).sort((left, right) => right.y - left.y || left.x - right.x)
  // A line that ends in a comma wraps; otherwise the next line starts a new keyword group.
  const keywords = keywordLines
    .map(segment => segment.text)
    .reduce(
      (joined, line) => (!joined ? line : joined.endsWith(',') ? `${joined} ${line}` : `${joined}, ${line}`),
      ''
    )
    .split(',')
    .map(keyword => collapse(keyword).toUpperCase())
    .filter(Boolean)
  const ward = /WARD \((\d\+)\)/.exec(keywords.join(' '))?.[1] ?? ''
  if ((wardItem?.str.trim() ?? '') !== ward) fail(page, 'ward shield disagrees with its keywords')

  // Weapons: each row is its 10pt values; the name prints just above, abilities just below.
  const headers = items
    .filter(item => /^(MELEE|RANGED) WEAPONS$/.test(item.str.trim()))
    .sort((left, right) => right.y - left.y)
  if (!headers.length) fail(page, 'no weapon table')
  const tableLeft = Math.min(...headers.map(header => header.x)) - 25
  const cells = items.filter(
    item => near(item.height, 10, 0.6) && item.y < headers[0].y && item.x > tableLeft
  )
  const rowYs = Array.from(new Set(cells.map(cell => Math.round(cell.y)))).sort((left, right) => right - left)
  const used = new Set<Item>([...cells])
  const weapons: GamesWorkshopSpearheadWeapon[] = rowYs.map((rowY, index) => {
    const header = headers.filter(candidate => candidate.y > rowY).sort((l, r) => l.y - r.y)[0]
    const ranged = header.str.trim().startsWith('RANGED')
    const row = cells.filter(cell => Math.round(cell.y) === rowY).sort((left, right) => left.x - right.x)
    if (row.length !== (ranged ? 6 : 5)) fail(page, `weapon row at y ${rowY} has ${row.length} values`)
    const firstValue = row[0].x
    const text = items.filter(
      item =>
        !used.has(item) &&
        item.x >= tableLeft &&
        item.x < firstValue - 2 &&
        item.height > 7.5 &&
        item.height < 9.6 &&
        item.y > rowY - 9 &&
        item.y < rowY + 9 &&
        item !== header
    )
    text.forEach(item => used.add(item))
    const lineText = (list: Item[]) =>
      collapse(
        segmentsOf(list)
          .sort((left, right) => right.y - left.y || left.x - right.x)
          .map(segment => segment.text)
          .join(' ')
      )
    const name = lineText(text.filter(item => item.y > rowY))
    const abilities = lineText(text.filter(item => item.y < rowY))
    const value = (offset: number) => row[offset].str.trim()
    const weapon: GamesWorkshopSpearheadWeapon = {
      section: `${section}/weapon:${index + 1}`,
      line: index + 1,
      name,
      weaponType: ranged ? 'RANGED' : 'MELEE',
      range: ranged ? value(0) : '',
      attacks: value(ranged ? 1 : 0),
      hit: value(ranged ? 2 : 1),
      wound: value(ranged ? 3 : 2),
      rend: value(ranged ? 4 : 3),
      damage: value(ranged ? 5 : 4),
      abilities,
    }
    if (!weapon.name) fail(page, `weapon row at y ${rowY} has no name`)
    return weapon
  })
  const weaponFloor = Math.min(...rowYs) - 9

  // Rules text: 8pt body text below the weapons and above the keywords, by column.
  const body = items.filter(
    item =>
      !used.has(item) &&
      near(item.height, 8, 0.4) &&
      item.y < weaponFloor &&
      item.y > label!.y + 14 &&
      !keywordItems.includes(item)
  )
  const segments = mergeWrappedNames(segmentsOf(body))
  const starts = Array.from(new Set(segments.map(segment => Math.round(segment.x)))).sort((l, r) => l - r)
  const columnStarts = starts.filter((x, index) => index === 0 || x - starts[index - 1] > 60)
  const columnOf = (segment: Segment) => columnStarts.filter(start => segment.x >= start - 12).length - 1
  const notes: string[] = []
  const abilities = columnStarts.flatMap((_, column) => {
    const { abilities: parsed, unplaced } = parseColumn(
      segments.filter(segment => columnOf(segment) === column),
      segment => /^(Passive|Reaction:|Once Per|Your |Enemy |Any |Deployment|End of)/.test(segment.text)
    )
    unplaced.forEach(segment => notes.push(segment.text))
    return parsed.map(({ ability }) => {
      if (ability.preface) {
        notes.push(ability.preface)
        delete ability.preface
      }
      // An ability's own keywords print as a last `Keywords …` line under its effect.
      const keywordLine = /\n?Keywords ([^\n]+)$/.exec(ability.effect)
      return {
        ...ability,
        effect: keywordLine ? ability.effect.slice(0, keywordLine.index).trim() : ability.effect,
        keywords: keywordLine ? keywordLine[1].split(',').map(keyword => collapse(keyword)) : [],
        section: `${section}/ability:${slug(ability.name)}`,
        page,
      }
    })
  })
  if (!abilities.length) fail(page, 'no abilities')
  abilities.forEach(ability => {
    if (!ability.timing) fail(page, `ability ${ability.name} has no timing banner`)
  })

  // Everything must be printed on the page.
  const pageText = squash(items.map(item => item.str).join(' '))
  const printed = (value: string, what: string) => {
    if (value && !pageText.includes(squash(value))) fail(page, `${what} is not printed on the page`)
  }
  abilities.forEach(ability =>
    [
      ability.name,
      ability.timing,
      ability.legend,
      ability.declare ?? '',
      ability.effect,
      ...ability.keywords,
    ].forEach(value => printed(value, `ability ${ability.name}`))
  )
  weapons.forEach(weapon =>
    [weapon.name, ...weapon.abilities.split(' ')].forEach(value => printed(value, `weapon ${weapon.name}`))
  )
  notes.forEach(note => printed(note, 'note'))

  const warscroll = {
    section,
    page,
    name: printedTitle,
    move: move.str.trim(),
    save: save.str.trim(),
    control: control.str.trim(),
    health: health.str.trim(),
    ward,
    keywords,
    notes,
    weapons,
    abilities,
  }
  return { ...warscroll, checksum: checksum(warscroll) }
}

export const extractOfficialWarscrollPage = async (
  bytes: Uint8Array,
  page: number,
  printedTitle: string,
  section: string,
  loader: PdfDocumentLoader = createPdfJsDocumentLoader()
): Promise<OfficialWarscrollPage> => {
  const document = await loader.load(bytes)
  try {
    if (page < 1 || page > document.numPages)
      throw new Error(`Official warscroll page ${page} does not exist`)
    const items = toItems(await (await document.getPage(page)).getTextItems())
    return parseOfficialWarscrollPage(items, page, printedTitle, section)
  } finally {
    await document.destroy()
  }
}
