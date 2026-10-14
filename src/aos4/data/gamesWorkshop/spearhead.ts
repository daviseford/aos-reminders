import { createHash } from 'node:crypto'
import { createPdfJsDocumentLoader, type PdfDocumentLoader, type PdfTextItem } from './pdfText'

/**
 * Official Games Workshop Spearhead packs (one army per four pages: composition, army rules, two
 * warscroll pages of two warscrolls each) read from text-item positions.
 *
 * A pack is a fixed print template, so the reader is positional rather than textual: the plain page
 * text interleaves two-column ability layouts and the stat badge into an order no grammar can undo.
 * Every extracted string must reappear in the page's own text (whitespace-normalized), and anything
 * the template does not place is reported, so a layout change fails closed instead of inventing or
 * dropping rules.
 */

export interface GamesWorkshopSpearheadAbility {
  section: string
  page: number
  name: string
  /** The printed timing banner (`Passive`, `Once Per Battle, Your Hero Phase`, `Reaction: …`). */
  timing: string
  /** Italic flavour text between the name and the first rules label. */
  legend: string
  /** Rules text printed above the banner that governs the ability (e.g. a unit set up later). */
  preface?: string
  declare?: string
  effect: string
}

export interface GamesWorkshopSpearheadWeapon {
  section: string
  line: number
  name: string
  weaponType: 'MELEE' | 'RANGED'
  range: string
  attacks: string
  hit: string
  wound: string
  rend: string
  damage: string
  abilities: string
}

export interface GamesWorkshopSpearheadWarscroll {
  section: string
  page: number
  name: string
  move: string
  save: string
  control: string
  health: string
  ward: string
  keywords: string[]
  notes: string[]
  weapons: GamesWorkshopSpearheadWeapon[]
  abilities: GamesWorkshopSpearheadAbility[]
}

export interface GamesWorkshopSpearheadArmy {
  faction: string
  name: string
  section: string
  pages: number[]
  general: string
  /** Units as printed; `count` only when the pack prints one (a lone hero prints none). */
  units: Array<{ count?: number; name: string }>
  battleTraits: GamesWorkshopSpearheadAbility[]
  regimentAbilities: GamesWorkshopSpearheadAbility[]
  enhancements: GamesWorkshopSpearheadAbility[]
  warscrolls: GamesWorkshopSpearheadWarscroll[]
  /** SHA-256 of the extracted army, which the reviewed source entry pins. */
  checksum: string
}

export interface GamesWorkshopSpearheadDiagnostic {
  code:
    | 'spearhead-layout'
    | 'spearhead-unplaced-text'
    | 'spearhead-unverified-text'
    | 'spearhead-unknown-warscroll'
  severity: 'error'
  message: string
  page?: number
}

export interface GamesWorkshopSpearheadFragment {
  page: number
  text: string
}

export interface GamesWorkshopSpearheadExtraction {
  armies: GamesWorkshopSpearheadArmy[]
  /** Text the template places nowhere; each must be dispositioned by review or extraction fails. */
  fragments: GamesWorkshopSpearheadFragment[]
  diagnostics: GamesWorkshopSpearheadDiagnostic[]
}

interface Item {
  str: string
  x: number
  y: number
  width: number
  height: number
}

interface Segment {
  x: number
  right: number
  y: number
  height: number
  items: Item[]
  text: string
}

const SECTION_HEADERS = ['BATTLE TRAITS', 'REGIMENT ABILITIES', 'ENHANCEMENTS'] as const
type SectionHeader = (typeof SECTION_HEADERS)[number]

// Template geometry, in PDF points.
const LINE_TOLERANCE = 1.5
const SEGMENT_GAP = 12
const PARAGRAPH_GAP = 12
const BANNER_GAP = 14.5
const PREFACE_GAP = 20
const COLUMN_SPLIT = 280
const BADGE_RIGHT = 140
const WARD_X = 115
const BODY_LEFT = 145
const LORE_HEIGHT = 7.5
const WEAPON_ABILITY_LEFT = 480

const collapse = (value: string): string => value.replace(/\s+/g, ' ').trim()
const squash = (value: string): string => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')
const slug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

const toItems = (items: PdfTextItem[]): Item[] =>
  items.flatMap(item =>
    item.str.trim() && item.x !== undefined && item.y !== undefined
      ? [{ str: item.str, x: item.x, y: item.y, width: item.width ?? 0, height: item.height ?? 0 }]
      : []
  )

/** Joins positioned items into text, keeping a split word or attached punctuation together. */
const joinItems = (items: Item[]): string =>
  items.reduce((text, item, index) => {
    if (index === 0) return item.str.trim()
    const previous = items[index - 1]
    const touching = item.x - (previous.x + previous.width) < 1
    const attached = /^[,.;:’'!?)]/.test(item.str.trim()) || /[(‘]$/.test(text)
    return `${text}${touching || attached ? '' : ' '}${item.str.trim()}`
  }, '')

/** Groups items into baseline lines, then splits each line at wide gaps into column segments. */
const segmentsOf = (items: Item[]): Segment[] => {
  const sorted = [...items].sort((left, right) => right.y - left.y || left.x - right.x)
  const lines: Item[][] = []
  sorted.forEach(item => {
    const line = lines.find(candidate => Math.abs(candidate[0].y - item.y) <= LINE_TOLERANCE)
    if (line) line.push(item)
    else lines.push([item])
  })
  return lines.flatMap(line => {
    const ordered = [...line].sort((left, right) => left.x - right.x)
    const groups: Item[][] = []
    ordered.forEach(item => {
      const group = groups[groups.length - 1]
      const last = group?.[group.length - 1]
      if (group && last && item.x - (last.x + last.width) <= SEGMENT_GAP) group.push(item)
      else groups.push([item])
    })
    return groups.map(group => ({
      x: group[0].x,
      right: Math.max(...group.map(item => item.x + item.width)),
      y: Math.max(...group.map(item => item.y)),
      height: Math.max(...group.map(item => item.height)),
      items: group,
      text: collapse(joinItems(group)),
    }))
  })
}

const isAbilityName = (segment: Segment): boolean => {
  const first = segment.items[0].str.trim()
  if (/^[A-Z0-9’'!&,\-–() ]+:$/.test(first) && /[A-Z]{2}/.test(first)) return true
  // A few names print without a colon (BATTLE DAMAGED); the whole line is then capitals.
  return /^[A-Z][A-Z0-9’'!&\-–() ]+$/.test(segment.text) && /[A-Z]{4}/.test(segment.text)
}

const splitName = (segment: Segment): { name: string; rest: string } => {
  const index = segment.items.findIndex(item => item.str.trim().endsWith(':'))
  if (index < 0) return { name: segment.text, rest: '' }
  return {
    name: collapse(joinItems(segment.items.slice(0, index + 1))).replace(/:$/, ''),
    rest: collapse(joinItems(segment.items.slice(index + 1))),
  }
}

interface ParsedColumnAbility {
  ability: Omit<GamesWorkshopSpearheadAbility, 'section' | 'page'>
  nameY: number
}

/**
 * Reads the abilities in one column of segments (top to bottom).
 *
 * A banner is the run of lines directly above a name line; rules lines that precede a banner after
 * a paragraph break belong to the next ability as its preface. Lines no ability can claim are
 * returned so the caller can report them.
 */
const parseColumn = (
  column: Segment[],
  isBannerSegment: (segment: Segment) => boolean
): { abilities: ParsedColumnAbility[]; unplaced: Segment[] } => {
  const segments = [...column].sort((left, right) => right.y - left.y)
  const nameIndexes = segments.flatMap((segment, index) => (isAbilityName(segment) ? [index] : []))
  const bannerOf = new Map<number, number[]>()
  nameIndexes.forEach(nameIndex => {
    const banner: number[] = []
    let cursor = nameIndex - 1
    let below = segments[nameIndex]
    while (cursor >= 0) {
      const candidate = segments[cursor]
      const gap = candidate.y - below.y
      const limit = banner.length ? 10 : BANNER_GAP
      if (gap > limit || isAbilityName(candidate) || !isBannerSegment(candidate)) break
      banner.unshift(cursor)
      below = candidate
      cursor -= 1
    }
    bannerOf.set(nameIndex, banner)
  })
  const bannerIndexes = new Set(Array.from(bannerOf.values()).flat())
  const abilities: ParsedColumnAbility[] = []
  const unplaced: Segment[] = []
  let pending: Segment[] = []
  let current:
    | {
        ability: ParsedColumnAbility
        part: 'legend' | 'declare' | 'effect'
        lastY: number
        buffers: Record<'legend' | 'declare' | 'effect', string[]>
      }
    | undefined

  const flush = () => {
    if (!current) return
    const { ability, buffers } = current
    ability.ability.legend = collapse(buffers.legend.join(' '))
    const declare = buffers.declare
      .join(' ')
      .replace(/ *\n */g, '\n')
      .trim()
    const effect = buffers.effect
      .join(' ')
      .replace(/ *\n */g, '\n')
      .trim()
    if (declare) ability.ability.declare = declare
    ability.ability.effect = effect
    abilities.push(ability)
    current = undefined
  }

  segments.forEach((segment, index) => {
    if (bannerIndexes.has(index)) return
    if (nameIndexes.includes(index)) {
      // A preface prints directly above its banner; anything farther up is not part of this rule.
      const bannerTop = segments[(bannerOf.get(index) ?? [])[0] ?? index].y
      const lastPending = pending[pending.length - 1]
      const preface = lastPending && lastPending.y - bannerTop <= PREFACE_GAP ? pending : []
      if (!preface.length) unplaced.push(...pending)
      pending = []
      flush()
      const banner = (bannerOf.get(index) ?? []).map(bannerIndex => segments[bannerIndex].text).join(' ')
      const { name, rest } = splitName(segment)
      current = {
        ability: {
          ability: {
            name,
            timing: collapse(banner),
            legend: '',
            ...(preface.length ? { preface: collapse(preface.map(line => line.text).join(' ')) } : {}),
            effect: '',
          },
          nameY: segment.y,
        },
        part: 'legend',
        lastY: segment.y,
        buffers: { legend: rest ? [rest] : [], declare: [], effect: [] },
      }
      return
    }
    if (!current) {
      pending.push(segment)
      return
    }
    const gap = current.lastY - segment.y
    const nextName = nameIndexes.find(nameIndex => nameIndex > index)
    // After a paragraph break, lines that run straight into another ability's banner are its preface.
    if (gap > PARAGRAPH_GAP && nextName !== undefined) {
      const between = segments
        .slice(index, nextName)
        .filter((_, offset) => !bannerIndexes.has(index + offset))
      const runsIntoBanner = between.every(line => !/^(Declare|Effect):/.test(line.text))
      const precedesBanner = (bannerOf.get(nextName) ?? []).length > 0
      if (runsIntoBanner && precedesBanner && current.part === 'effect') {
        flush()
        pending.push(segment)
        return
      }
    }
    let text = segment.text
    if (/^Declare:/.test(text)) {
      current.part = 'declare'
      text = text.replace(/^Declare:\s*/, '')
    } else if (/^Effect:/.test(text)) {
      current.part = 'effect'
      text = text.replace(/^Effect:\s*/, '')
    } else if (gap > PARAGRAPH_GAP && current.part !== 'legend') {
      text = `\n${text}`
    }
    current.buffers[current.part].push(text)
    current.lastY = segment.y
  })
  flush()
  unplaced.push(...pending)
  return { abilities, unplaced }
}

const sectionFor = (
  headers: Array<{ header: SectionHeader; y: number }>,
  y: number
): SectionHeader | undefined =>
  [...headers].filter(header => header.y > y).sort((left, right) => left.y - right.y)[0]?.header

interface PageData {
  page: number
  items: Item[]
  text: string
}

const verifier = (pages: PageData[], diagnostics: GamesWorkshopSpearheadDiagnostic[]) => {
  const normalizedPages = new Map(pages.map(page => [page.page, squash(page.text)]))
  return (page: number, label: string, value: string | undefined): void => {
    if (!value) return
    value.split('\n').forEach(part => {
      if (!squash(part)) return
      if (!normalizedPages.get(page)?.includes(squash(part))) {
        diagnostics.push({
          code: 'spearhead-unverified-text',
          severity: 'error',
          page,
          message: `${label} does not appear on page ${page}: ${part.slice(0, 80)}`,
        })
      }
    })
  }
}

const parseComposition = (
  page: PageData,
  diagnostics: GamesWorkshopSpearheadDiagnostic[]
):
  | { faction: string; name: string; general: string; units: Array<{ count?: number; name: string }> }
  | undefined => {
  const segments = segmentsOf(page.items)
  const faction = segments.find(segment => segment.height >= 25)?.text
  const name = segments.find(segment => segment.height >= 17 && segment.height < 25)?.text
  const listing = segments
    .filter(segment => segment.x < 230 && segment.height < 12)
    .sort((left, right) => right.y - left.y)
  const generalIndex = listing.findIndex(segment => segment.text === 'GENERAL')
  const unitsIndex = listing.findIndex(segment => segment.text === 'UNITS')
  if (!faction || !name || generalIndex < 0 || unitsIndex < generalIndex) {
    diagnostics.push({
      code: 'spearhead-layout',
      severity: 'error',
      page: page.page,
      message: 'Spearhead composition page has no faction, army name, GENERAL, or UNITS block',
    })
    return undefined
  }
  const entries = (from: number, to: number) => {
    const values: string[] = []
    listing.slice(from + 1, to).forEach(segment => {
      if (segment.text.startsWith('♦')) values.push(collapse(segment.text.slice(1)))
      else if (values.length && segment.y > listing[to - 1].y - 1)
        values[values.length - 1] += ` ${segment.text}`
    })
    return values
  }
  const unitsEnd = listing.findIndex(
    (segment, index) =>
      index > unitsIndex && !segment.text.startsWith('♦') && listing[index - 1].y - segment.y > 12
  )
  const general = entries(generalIndex, unitsIndex)
  const units = entries(unitsIndex, unitsEnd < 0 ? listing.length : unitsEnd).map(entry => {
    const match = /^(\d+)\s+(.+)$/.exec(entry)
    return match ? { count: Number(match[1]), name: match[2] } : { name: entry }
  })
  if (general.length !== 1 || !units.length) {
    diagnostics.push({
      code: 'spearhead-layout',
      severity: 'error',
      page: page.page,
      message: `Spearhead composition page lists ${general.length} generals and ${units.length} units`,
    })
    return undefined
  }
  return { faction, name, general: general[0].replace(/^\d+\s+/, ''), units }
}

const parseRulesPage = (
  page: PageData,
  armySection: string,
  fragments: GamesWorkshopSpearheadFragment[],
  diagnostics: GamesWorkshopSpearheadDiagnostic[]
): Record<SectionHeader, GamesWorkshopSpearheadAbility[]> => {
  const segments = segmentsOf(page.items).filter(segment => segment.y < 715)
  const headers = segments.flatMap(segment => {
    const header = SECTION_HEADERS.find(candidate => segment.text.startsWith(candidate))
    return header && segment.height >= 11 ? [{ header, y: segment.y }] : []
  })
  const result: Record<SectionHeader, GamesWorkshopSpearheadAbility[]> = {
    'BATTLE TRAITS': [],
    'REGIMENT ABILITIES': [],
    ENHANCEMENTS: [],
  }
  if (headers.length !== 3) {
    diagnostics.push({
      code: 'spearhead-layout',
      severity: 'error',
      page: page.page,
      message: `Spearhead rules page has ${headers.length} of 3 section headers`,
    })
    return result
  }
  const body = segments.filter(
    segment => !headers.some(header => header.y === segment.y && segment.height >= 11)
  )
  const bodyTop = Math.max(...headers.map(header => header.y))
  // Banners print smaller than rules text on the army page.
  const isBanner = (segment: Segment) => segment.height <= 8.5
  ;[
    body.filter(segment => segment.x < COLUMN_SPLIT),
    body.filter(segment => segment.x >= COLUMN_SPLIT),
  ].forEach(column => {
    const { abilities, unplaced } = parseColumn(
      column.filter(segment => segment.y < bodyTop),
      isBanner
    )
    abilities.forEach(({ ability, nameY }) => {
      const header = sectionFor(headers, nameY)
      if (!header) return
      result[header].push({
        ...ability,
        section: `${armySection}/${slug(header)}:${slug(ability.name)}`,
        page: page.page,
      })
    })
    unplaced.forEach(segment => fragments.push({ page: page.page, text: segment.text }))
  })
  return result
}

const parseWarscrollPage = (
  page: PageData,
  armySection: string,
  knownNames: string[],
  fragments: GamesWorkshopSpearheadFragment[],
  diagnostics: GamesWorkshopSpearheadDiagnostic[]
): GamesWorkshopSpearheadWarscroll[] => {
  const banners = page.items
    .filter(item => squash(item.str) === 'SPEARHEADWARSCROLL')
    .sort((left, right) => right.y - left.y)
  if (!banners.length) {
    diagnostics.push({
      code: 'spearhead-layout',
      severity: 'error',
      page: page.page,
      message: 'No warscroll blocks',
    })
    return []
  }
  return banners.flatMap((banner, index) => {
    const top = banner.y + 15
    const bottom = banners[index + 1] ? banners[index + 1].y + 15 : -Infinity
    const block = page.items.filter(item => item.y <= top && item.y > bottom && item !== banner)
    const fail = (message: string) => {
      diagnostics.push({ code: 'spearhead-layout', severity: 'error', page: page.page, message })
      return []
    }

    // Stat badge: four values in a diamond plus an optional ward shield to its upper right.
    const values = block.filter(item => item.height >= 13 && item.x < BADGE_RIGHT)
    const wardItem = values.find(item => item.x > WARD_X)
    const stats = values.filter(item => item !== wardItem)
    if (stats.length !== 4) return fail(`Warscroll block at y ${banner.y} has ${stats.length} stat values`)
    const byY = [...stats].sort((left, right) => right.y - left.y)
    const [move, control] = [byY[0], byY[3]]
    const [health, save] = [byY[1], byY[2]].sort((left, right) => left.x - right.x)

    // Title: the large heading, optionally continued by a smaller second line.
    const title = block
      .filter(item => item.x >= BODY_LEFT && item.height >= 9.5 && item.height < 25 && item.y > banner.y - 45)
      .filter(item => !/WEAPONS$/.test(item.str.trim()))
      .sort((left, right) => right.y - left.y)
    const squashedTitle = squash(title.map(item => item.str).join(''))
    const name = knownNames.find(candidate => squash(candidate) === squashedTitle)
    if (!name) {
      diagnostics.push({
        code: 'spearhead-unknown-warscroll',
        severity: 'error',
        page: page.page,
        message: `Warscroll title ${title.map(item => item.str).join(' ')} names no unit in the army`,
      })
      return []
    }
    const section = `${armySection}/warscroll:${slug(name)}`

    // Keywords line.
    const keywordLabel = block.find(item => squash(item.str) === 'KEYWORDS')
    if (!keywordLabel) return fail(`Warscroll ${name} has no KEY WORDS line`)
    const keywordItems = block.filter(
      item => Math.abs(item.y - keywordLabel.y) <= LINE_TOLERANCE + 0.5 && item.x > keywordLabel.x + 50
    )
    const keywords = collapse(joinItems(keywordItems.sort((left, right) => left.x - right.x)))
      .split(',')
      .map(keyword => collapse(keyword).toUpperCase())
      .filter(Boolean)
    const ward = /WARD \((\d\+)\)/.exec(keywords.join(' '))?.[1] ?? wardItem?.str.trim() ?? ''
    if (wardItem && wardItem.str.trim() !== ward)
      return fail(`Warscroll ${name} ward shield disagrees with its keywords`)

    // Weapon tables: a header row per weapon type, then value rows aligned to its columns.
    const headers = block
      .filter(item => /^(MELEE|RANGED) WEAPONS$/.test(item.str.trim()))
      .sort((left, right) => right.y - left.y)
    if (!headers.length) return fail(`Warscroll ${name} has no weapon table`)
    const headerRowYs = new Set(headers.map(header => header.y))
    const columnItem = (header: Item, label: string) =>
      block.find(item => Math.abs(item.y - header.y) < 1 && item.str.trim().startsWith(label))
    // Table text prints at 8.5pt, between the 9pt headers and the 8pt rules text and notes.
    const tableItems = block.filter(
      item =>
        item.height > 8.2 &&
        item.height < 9 &&
        item.x >= BODY_LEFT &&
        !headerRowYs.has(item.y) &&
        item.y < headers[0].y &&
        item.y > keywordLabel.y
    )
    // Every weapon row prints a value in the Hit column, so its centre anchors the rows.
    const hitCentres = headers.flatMap(header => {
      const hit = columnItem(header, 'Hit')
      return hit ? [hit.x + hit.width / 2] : []
    })
    if (hitCentres.length !== headers.length) return fail(`Warscroll ${name} weapon table has no Hit column`)
    const centre = (item: Item) => item.x + item.width / 2
    const headerAbove = (y: number) =>
      headers.filter(header => header.y > y).sort((left, right) => left.y - right.y)[0]
    const rowYs = Array.from(
      new Set(
        tableItems
          .filter(item => hitCentres.some(hitCentre => Math.abs(centre(item) - hitCentre) < 6))
          .map(item => item.y)
      )
    ).sort((left, right) => right - left)
    // Each table item belongs to the nearest row under the same header (wrapped names and
    // abilities straddle their row's baseline).
    const rowOf = new Map<Item, number>()
    tableItems.forEach(item => {
      const header = headerAbove(item.y)
      const candidates = rowYs.filter(rowY => headerAbove(rowY) === header && Math.abs(rowY - item.y) <= 6)
      const nearest = candidates.sort((left, right) => Math.abs(left - item.y) - Math.abs(right - item.y))[0]
      if (nearest !== undefined) rowOf.set(item, nearest)
    })
    const weapons: GamesWorkshopSpearheadWeapon[] = []
    const consumed = new Set<Item>(rowOf.keys())
    for (const rowY of rowYs) {
      const ranged = headerAbove(rowY)!.str.trim().startsWith('RANGED')
      const row = tableItems.filter(item => rowOf.get(item) === rowY)
      const nameItems = row
        .filter(item => item.x < 290)
        .sort((left, right) => right.y - left.y || left.x - right.x)
      const abilityItems = row
        .filter(item => item.x >= WEAPON_ABILITY_LEFT)
        .sort((left, right) => right.y - left.y || left.x - right.x)
      const valueItems = row.filter(
        item => item.x >= 290 && item.x < WEAPON_ABILITY_LEFT && Math.abs(item.y - rowY) < 1
      )
      const byColumn = (low: number, high: number) =>
        valueItems
          .filter(item => centre(item) >= low && centre(item) < high)
          .map(item => item.str.trim())
          .join('')
      const weapon: GamesWorkshopSpearheadWeapon = {
        section: `${section}/weapon:${weapons.length + 1}`,
        line: weapons.length + 1,
        name: collapse(nameItems.map(item => item.str).join(' ')),
        weaponType: ranged ? 'RANGED' : 'MELEE',
        range: ranged ? byColumn(290, 325) : '',
        attacks: byColumn(325, 355),
        hit: byColumn(355, 388),
        wound: byColumn(388, 420),
        rend: byColumn(420, 450),
        damage: byColumn(450, WEAPON_ABILITY_LEFT),
        abilities: collapse(abilityItems.map(item => item.str).join(' ')).replace(/^-$/, ''),
      }
      if (
        !weapon.name ||
        !weapon.attacks ||
        !weapon.hit ||
        !weapon.wound ||
        !weapon.rend ||
        !weapon.damage ||
        (ranged && !weapon.range)
      ) {
        return fail(`Warscroll ${name} weapon row at y ${rowY} is incomplete`)
      }
      weapons.push(weapon)
    }
    const weaponFloor = Math.min(...rowYs, ...headers.map(header => header.y)) - 6

    // Notes and abilities: the body column below the weapons and above the keywords, without lore.
    const bodyItems = block.filter(
      item =>
        item.x >= BODY_LEFT &&
        item.height > LORE_HEIGHT &&
        item.height < 9 &&
        item.y < weaponFloor &&
        item.y > keywordLabel.y + 2 &&
        !consumed.has(item)
    )
    const segments = segmentsOf(bodyItems)
    const columns = [
      segments.filter(segment => segment.x < COLUMN_SPLIT),
      segments.filter(segment => segment.x >= COLUMN_SPLIT),
    ]
    const notes: string[] = []
    const abilities: GamesWorkshopSpearheadAbility[] = []
    columns.forEach(column => {
      const { abilities: parsed, unplaced } = parseColumn(column, () => true)
      parsed.forEach(({ ability }) =>
        abilities.push({ ...ability, section: `${section}/ability:${slug(ability.name)}`, page: page.page })
      )
      unplaced.forEach(segment => notes.push(segment.text))
    })
    abilities.forEach(ability => {
      if (ability.preface) {
        notes.push(ability.preface)
        delete ability.preface
      }
    })
    if (!abilities.length) return fail(`Warscroll ${name} has no abilities`)

    // Anything else in the rules area of the block is unexplained.
    const placed = new Set<Item>([
      ...stats,
      ...(wardItem ? [wardItem] : []),
      ...title,
      keywordLabel,
      ...keywordItems,
      ...headers,
      ...Array.from(consumed),
      ...bodyItems,
    ])
    block
      .filter(
        item =>
          !placed.has(item) &&
          item.height > LORE_HEIGHT &&
          !/^(MOVE|SAVE|HEALTH|CONTROL)$/.test(item.str.trim()) &&
          !headers.some(header => Math.abs(header.y - item.y) < 1)
      )
      .forEach(item => fragments.push({ page: page.page, text: item.str.trim() }))

    return [
      {
        section,
        page: page.page,
        name,
        move: move.str.trim(),
        save: save.str.trim(),
        control: control.str.trim(),
        health: health.str.trim(),
        ward,
        keywords,
        notes,
        weapons,
        abilities,
      },
    ]
  })
}

/**
 * The page's text in column reading order (the lore and stat strip, the left rules column, then the
 * right one, each top to bottom), so every multi-line rule the template prints reads contiguously.
 */
const normalizedPageText = (items: Item[]): string => {
  const bucket = (segment: Segment) => (segment.x < BODY_LEFT ? 0 : segment.x < COLUMN_SPLIT ? 1 : 2)
  return segmentsOf(items)
    .sort((left, right) => bucket(left) - bucket(right) || right.y - left.y || left.x - right.x)
    .map(segment => segment.text)
    .join(' ')
}

export const extractGamesWorkshopSpearheads = async (
  bytes: Uint8Array,
  artifactChecksum: string,
  loader: PdfDocumentLoader = createPdfJsDocumentLoader()
): Promise<GamesWorkshopSpearheadExtraction> => {
  const diagnostics: GamesWorkshopSpearheadDiagnostic[] = []
  const fragments: GamesWorkshopSpearheadFragment[] = []
  const document = await loader.load(bytes)
  const pages: PageData[] = []
  try {
    for (let page = 1; page <= document.numPages; page += 1) {
      const items = toItems(await (await document.getPage(page)).getTextItems())
      pages.push({ page, items, text: normalizedPageText(items) })
    }
  } finally {
    await document.destroy()
  }
  const verify = verifier(pages, diagnostics)
  const armies: GamesWorkshopSpearheadArmy[] = []
  let current:
    | (Omit<GamesWorkshopSpearheadArmy, 'checksum' | 'battleTraits' | 'regimentAbilities' | 'enhancements'> &
        Partial<Pick<GamesWorkshopSpearheadArmy, 'battleTraits' | 'regimentAbilities' | 'enhancements'>>)
    | undefined
  const finish = () => {
    if (!current) return
    if (!current.battleTraits || !current.warscrolls.length) {
      diagnostics.push({
        code: 'spearhead-layout',
        severity: 'error',
        message: `Spearhead ${current.name} is missing its army rules or warscrolls`,
      })
    } else {
      const army = current as Omit<GamesWorkshopSpearheadArmy, 'checksum'>
      const expected = [army.general, ...army.units.map(unit => unit.name)].map(squash)
      const found = army.warscrolls.map(warscroll => squash(warscroll.name))
      if (expected.some(name => !found.includes(name)) || found.length !== new Set(expected).size) {
        diagnostics.push({
          code: 'spearhead-layout',
          severity: 'error',
          message: `Spearhead ${army.name} warscrolls do not match its composition`,
        })
      }
      armies.push({ ...army, checksum: checksum(army) })
    }
    current = undefined
  }
  pages.forEach(page => {
    const text = squash(page.text)
    if (text.includes('THISSPEARHEADARMYCONSISTS')) {
      finish()
      const composition = parseComposition(page, diagnostics)
      if (!composition) return
      const section = `${slug(composition.faction)}:${slug(composition.name)}`
      current = { ...composition, section, pages: [page.page], warscrolls: [] }
      return
    }
    if (!current) {
      diagnostics.push({
        code: 'spearhead-layout',
        severity: 'error',
        page: page.page,
        message: 'Page precedes any army',
      })
      return
    }
    current.pages.push(page.page)
    if (text.includes('BATTLETRAITS') && text.includes('ENHANCEMENTS')) {
      const sections = parseRulesPage(page, current.section, fragments, diagnostics)
      current.battleTraits = sections['BATTLE TRAITS']
      current.regimentAbilities = sections['REGIMENT ABILITIES']
      current.enhancements = sections.ENHANCEMENTS
      return
    }
    current.warscrolls.push(
      ...parseWarscrollPage(
        page,
        current.section,
        [current.general, ...current.units.map(unit => unit.name)],
        fragments,
        diagnostics
      )
    )
  })
  finish()

  armies.forEach(army => {
    const composition = army.pages[0]
    verify(composition, `${army.name} faction`, army.faction)
    verify(composition, `${army.name} name`, army.name)
    verify(composition, `${army.name} general`, army.general)
    army.units.forEach(unit =>
      verify(composition, `${army.name} unit`, unit.count ? `${unit.count} ${unit.name}` : unit.name)
    )
    const abilities = [
      ...army.battleTraits,
      ...army.regimentAbilities,
      ...army.enhancements,
      ...army.warscrolls.flatMap(warscroll => warscroll.abilities),
    ]
    abilities.forEach(ability =>
      [
        ability.name,
        ability.timing,
        ability.legend,
        ability.preface,
        ability.declare,
        ability.effect,
      ].forEach(value => verify(ability.page, `${ability.name}`, value))
    )
    army.warscrolls.forEach(warscroll => {
      warscroll.notes.forEach(note => verify(warscroll.page, `${warscroll.name} note`, note))
      // Table cells wrap around their row's values, so table text is verified word by word.
      warscroll.weapons.forEach(weapon =>
        [weapon.name, weapon.abilities]
          .flatMap(value => value.split(' '))
          .forEach(word => verify(warscroll.page, `${weapon.name}`, word))
      )
      warscroll.keywords.forEach(keyword => verify(warscroll.page, `${warscroll.name} keyword`, keyword))
    })
    if (!army.battleTraits.length || !army.enhancements.length) {
      diagnostics.push({
        code: 'spearhead-layout',
        severity: 'error',
        message: `Spearhead ${army.name} has ${army.battleTraits.length} battle traits and ${army.enhancements.length} enhancements`,
      })
    }
  })
  return { armies, fragments, diagnostics }
}
