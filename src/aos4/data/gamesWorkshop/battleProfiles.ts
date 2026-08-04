import { createHash } from 'node:crypto'
import { sourceRecordId, type SourceRecordId } from '../../domain'
import { createPdfJsDocumentLoader, type PdfDocumentLoader, type PdfTextItem } from './pdfText'
import type { GamesWorkshopDiagnostic } from './records'

export type GamesWorkshopBattleProfileContext = 'standard' | 'seasonal' | 'legends'

export interface GamesWorkshopUnitProfileFact {
  kind: 'unit'
  key: string
  page: number
  row: number
  faction: string
  context: GamesWorkshopBattleProfileContext
  name: string
  unitSize: number
  points: number
  regimentOptions: string[]
  relevantKeywords: string[]
  notes: string[]
  baseSizes: string[]
  sourceRecordId: SourceRecordId
  factChecksum: string
}

export interface GamesWorkshopRosterOptionFact {
  kind: 'roster-option'
  key: string
  page: number
  row: number
  faction: string
  context: GamesWorkshopBattleProfileContext
  optionType: string
  name: string
  points: number
  notes: string[]
  sourceRecordId: SourceRecordId
  factChecksum: string
}

export interface GamesWorkshopRegimentOfRenownFact {
  kind: 'regiment-of-renown'
  key: string
  page: number
  row: number
  faction: 'Regiments of Renown'
  context: 'standard'
  name: string
  points: number
  unitSummary: string[]
  notes: string[]
  sourceRecordId: SourceRecordId
  factChecksum: string
}

export type GamesWorkshopBattleProfileFact =
  GamesWorkshopUnitProfileFact | GamesWorkshopRosterOptionFact | GamesWorkshopRegimentOfRenownFact

export interface GamesWorkshopBattleProfileExtractionResult {
  facts: GamesWorkshopBattleProfileFact[]
  diagnostics: GamesWorkshopDiagnostic[]
}

interface PositionedItem extends PdfTextItem {
  x: number
  y: number
}

interface NumericRow {
  y: number
  value: number
}

const PROFILE_PAGE_FACTIONS: Record<number, string> = {
  3: 'Cities of Sigmar',
  4: 'Cities of Sigmar',
  5: 'Cities of Sigmar',
  6: 'Cities of Sigmar',
  7: 'Daughters of Khaine',
  8: 'Daughters of Khaine',
  9: 'Fyreslayers',
  10: 'Fyreslayers',
  11: 'Idoneth Deepkin',
  12: 'Idoneth Deepkin',
  13: 'Kharadron Overlords',
  14: 'Kharadron Overlords',
  15: 'Lumineth Realm-lords',
  16: 'Lumineth Realm-lords',
  17: 'Seraphon',
  18: 'Seraphon',
  19: 'Stormcast Eternals',
  20: 'Stormcast Eternals',
  21: 'Stormcast Eternals',
  22: 'Stormcast Eternals',
  23: 'Sylvaneth',
  24: 'Sylvaneth',
  25: 'Blades of Khorne',
  26: 'Blades of Khorne',
  27: 'Disciples of Tzeentch',
  28: 'Disciples of Tzeentch',
  29: 'Hedonites of Slaanesh',
  30: 'Hedonites of Slaanesh',
  31: 'Helsmiths of Hashut',
  32: 'Helsmiths of Hashut',
  33: 'Maggotkin of Nurgle',
  34: 'Maggotkin of Nurgle',
  35: 'Skaven',
  36: 'Skaven',
  37: 'Slaves to Darkness',
  38: 'Slaves to Darkness',
  39: 'Slaves to Darkness',
  40: 'Flesh-eater Courts',
  41: 'Flesh-eater Courts',
  42: 'Nighthaunt',
  43: 'Nighthaunt',
  44: 'Ossiarch Bonereapers',
  45: 'Ossiarch Bonereapers',
  46: 'Soulblight Gravelords',
  47: 'Soulblight Gravelords',
  48: 'Gloomspite Gitz',
  49: 'Gloomspite Gitz',
  50: 'Ironjawz',
  51: 'Ironjawz',
  52: 'Kruleboyz',
  53: 'Kruleboyz',
  54: 'Ogor Mawtribes',
  55: 'Ogor Mawtribes',
  56: 'Sons of Behemat',
}

const textValue = (items: PositionedItem[]): string =>
  items
    .sort((left, right) => right.y - left.y || left.x - right.x)
    .map(item => item.str.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

const listValue = (value: string): string[] =>
  value
    .split(/\s*(?:,|;|\n)\s*/)
    .map(item => item.trim())
    .filter(Boolean)

const cleanExtractedText = (value: string): string =>
  value
    .replace(/Ã—/g, '×')
    .replace(/â€™/g, '’')
    .replace(/\s+-\s*/g, '-')
    .replace(/([A-Za-z])-\s+(?=[A-Za-z])/g, '$1-')
    .replace(/\bO\s+g\s+or\s+M\s+aw\s+t\s+r\s+i\s+be\s+s\b/gi, 'Ogor Mawtribes')
    .replace(/\bWa\s+r\s+M\s+a\s+c\s+h\s+i\s+n\s+e\b/gi, 'War Machine')
    .replace(/\bTy\s+r\s+a\s+nt\b/gi, 'Tyrant')
    .replace(/\bH\s+o\s+r\s+n\s+To\s+s\s+s\b/gi, 'Horn Toss')
    .replace(/\bStea\s+m\s+Ta\s+n\s+k\b/gi, 'Steam Tank')
    .replace(/\bL\s+o\s+r\s+d-Te\s+r\s+m\s+i\s+n\s+o\s+s\b/gi, 'Lord-Terminos')
    .replace(/\bHobg\s+rot\s+Va\s+nd\s+a\s+l\s+z\b/gi, 'Hobgrot Vandalz')
    .replace(/\bTau\s+r\s+u\s+s\b/gi, 'Taurus')
    .replace(/\bVa\s+r\s+g\s+hei\s+s\s+t\s+s\b/gi, 'Vargheists')
    .replace(/\bWa\s+r-W\s+heela\b/gi, 'War-Wheela')
    .replace(/\bWa\s+rdok\s+k\b/gi, 'Wardokk')
    .replace(/\bS\s+p\s+i\s+r\s+e\s+Ty\s+r\s+a\s+nt\s+s\b/gi, 'Spire Tyrants')
    .replace(/\bTa\s+r\s+a\s+nt\s+u\s+los\s+Brood\b/gi, 'Tarantulos Brood')
    .replace(/\bTo\s+m\s+b\s+B\s+a\s+n\s+s\s+h\s+e\s+e\b/gi, 'Tomb Banshee')
    .replace(/\bTe\s+r\s+r\s+o\s+r\s+g\s+h\s+e\s+i\s+s\s+t\b/gi, 'Terrorgheist')
    .replace(/\bVa\s+r\s+gs\s+k\s+y\s+r\b/gi, 'Vargskyr')
    .replace(/\bHed\s+k\s+ra\s+k\s+k\s+a(?=’|')/gi, 'Hedkrakka')
    .replace(/\bMad\s+mob\b/gi, 'Madmob')
    .replace(/\bS\s+i\s+g\s+m\s+a\s+r\s+i\s+t\s+e\b/gi, 'Sigmarite')
    .replace(/\bC\s+ava\s+l\s+r\s+y\b/gi, 'Cavalry')
    .replace(
      /\bS\s+ou\s+l\s+b\s+l\s+i\s+g\s+h\s+t\s+G\s+r\s+av\s+e\s+l\s+o\s+r\s+d\s+s\b/gi,
      'Soulblight Gravelords'
    )
    .replace(/\bS\s+y\s+lva\s+n\s+e\s+t\s+h\b/gi, 'Sylvaneth')
    .replace(/\bSpider\s+fa\s+ng\b/gi, 'Spiderfang')
    .replace(/\bVa\s+n\s+a\s+r\s+i\s+Au\s+r\s+a\s+la\s+n\s+Wa\s+rdens\b/gi, 'Vanari Auralan Wardens')
    .replace(/\bI\s+ron\s+jaw\s+z\b/gi, 'Ironjawz')
    .replace(/\bB\s+o\s+s\s+s\s+r\s+o\s+k\s+k\s+Tow\s+e\s+r\b/gi, 'Bossrokk Tower')
    .replace(/\bC\s+h\s+a\s+r\s+n\s+e\s+l\s+Ve\s+s\s+t\s+m\s+e\s+nt\s+s\b/gi, 'Charnel Vestments')
    .replace(/\bD\s+ua\s+r\s+d\s+i\s+n\b/gi, 'Duardin')
    .replace(/\bDa\s+e\s+m\s+o\s+n\b/gi, 'Daemon')
    .replace(/\bK\s+n\s+i\s+g\s+h\s+t\s+s\b/gi, 'Knights')
    .replace(/\bNorg\s+r\s+i\s+m\s+m\b/gi, 'Norgrimm')
    .replace(/\bS\s+p\s+i\s+r\s+e\s+Tyrant\s+s\b/gi, 'Spire Tyrants')
    .replace(/\bTo\s+p\s+D\s+o\s+g\b/gi, 'Top Dog')
    .replace(/\bWa\s+r\s+Hyd\s+ra\b/gi, 'War Hydra')
    .replace(/\bTree-Revena\s+nts\b/gi, 'Tree-Revenants')
    .replace(/\bTzaa\s+ngors\b/gi, 'Tzaangors')
    .replace(/\bWa\s+r\s+Despot\b/gi, 'War Despot')
    .replace(/\bA\s+rch-Wa\s+rlock\b/gi, 'Arch-Warlock')
    .replace(/\bMor\s+tek\s+Tria\s+xes\b/gi, 'Mortek Triaxes')
    .replace(/\bWa\s+rcha\s+nter\b/gi, 'Warchanter')
    .replace(/\bBu\s+l\s+l\s+fat\s+her\s*([’'])s\s+Scor\s+n\b/gi, 'Bullfather$1s Scorn')
    .replace(/\bG\s+od\s+sw\s+rat\s+h\s+Wa\s+rba\s+nd\b/gi, 'Godswrath Warband')
    .replace(/\bFool\s*([’'])s\s+C\s+ap\b/gi, 'Fool$1s Cap')
    .replace(/\bTrophy\s+Sku\s+l\s+ls\b/gi, 'Trophy Skulls')
    .replace(/\bWa\s+rbeat\s+s\b/gi, 'Warbeats')
    .replace(/\bWei\s+rd\s+fi\s+st\b/gi, 'Weirdfist')
    .replace(/\bNu\s+rg\s+le\s*([’'])s\s+Gi\s+ft\b/gi, 'Nurgle$1s Gift')
    .replace(/\bK\s+r\s+it\s+tok\s*([’'])s\s+Claw\s+pack\b/gi, 'Krittok$1s Clawpack')
    .replace(/\bPhu\s+lgot\s+h\s*([’'])s\s+Shudderhood\b/gi, 'Phulgoth$1s Shudderhood')
    .replace(/\bK\s+a\s+ma\s+ndora\s*([’'])s\s+Blades\b/gi, 'Kamandora$1s Blades')
    .replace(/\bK\s+a\s+i\s+na\s+n\s*([’'])s\s+Reapers\b/gi, 'Kainan$1s Reapers')
    .replace(/\bZ\s+a\s+rbag\s*([’'])s\s+Git\s+z\b/gi, 'Zarbag$1s Gitz')
    .replace(/\bS\s+k\s+av\s+e\s+n\b/gi, 'Skaven')
    .replace(/\bOgor\s+M\s+aw\s+t\s+r\s+i\s+be\s+s\b/gi, 'Ogor Mawtribes')
    .replace(/\breg\s+i\s+ment\b/gi, 'regiment')
    .replace(/([A-Za-z])\s*[\u2010-\u2015]\s*(?=[A-Za-z])/g, '$1-')
    .replace(/\s+([’'])(?=s\b)/gi, '$1')
    .replace(/s\s+([’'])(?=\s)/gi, 's$1')
    .replace(/\s+-\s*/g, '-')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/([([]) +/g, '$1')
    .replace(/ +([)\]])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

const withoutColumnHeader = (value: string, header: RegExp): string =>
  cleanExtractedText(value.replace(header, ' '))

const cleanRelevantKeywords = (value: string): string =>
  cleanExtractedText(value)
    .replace(/^.*?R\s*E\s*L\s*E\s*V\s*A\s*N\s*T\s+K\s*E\s*Y\s*WOR\s*DS\s*/i, '')
    .replace(/^NOTES\s*/i, '')
    .replace(/\s+IDON\s*ETH\s+DEEPK\s*IN\s*$/i, '')
    .trim()

const splitKeywordNotes = (
  relevantKeywords: string,
  notes: string
): { relevantKeywords: string; notes: string } => {
  const cleanKeywords = cleanRelevantKeywords(relevantKeywords)
  const noteMatch = cleanKeywords.match(/\s+(?:NOTES\s+)?((?:This|You)\b.*)$/i)
  const derived = noteMatch?.[1]?.trim() ?? ''
  const wrappedKeyword = derived.match(
    /^(.*[.!?])\s+([A-Z][A-Za-z’'-]*(?:\s+[A-Z][A-Za-z’'-]*)?(?:\s*,\s*[A-Z][A-Za-z’'-]*(?:\s+[A-Z][A-Za-z’'-]*)?)*)$/
  )
  const derivedNote = wrappedKeyword?.[1] ?? derived
  const keywordText = [
    noteMatch ? cleanKeywords.slice(0, noteMatch.index).trim() : cleanKeywords,
    wrappedKeyword?.[2],
  ]
    .filter(Boolean)
    .join(', ')
  return {
    relevantKeywords: keywordText,
    notes: [notes, derivedNote].filter(Boolean).join(' '),
  }
}

const cleanBaseSizeText = (value: string): string =>
  cleanExtractedText(value)
    .replace(/^\.\s*(?=\d)/, '')
    .replace(/,\s*\.\s*(?=\d)/g, ', ')
    .replace(/\b(\d(?:\s+\d)+)\s*m\s*m\b/gi, (_match, digits: string) => `${digits.replace(/\s+/g, '')}mm`)
    .replace(/\b(\d+(?:\.\d+)?)\s*m\s+m\b/gi, '$1mm')

const EXTRACTED_BASE_MEASUREMENT = /(?:\d+(?:\.\d+)?|\d(?:\s+\d)+)(?:\s*[×x]\s*\d+(?:\.\d+)?)?\s*m\s*m\b/i

const containsBaseSizeValue = (value: string): boolean =>
  EXTRACTED_BASE_MEASUREMENT.test(value) || /\buse model\b/i.test(value)

const BASE_SIZE_QUALIFIER = /^(?:or|and|champion is)$/i

const cleanName = (value: string): string =>
  cleanExtractedText(
    value
      .replace(/(?:^|\s)(?:✹|NEW|UPDATED|DELETED)(?=\s|$)/gi, ' ')
      .replace(
        /(?:^|\s)(?:HEROES|UNITS|FACTION TERRAIN|WAR MACHINES|MONSTERS|LEGENDS|R\s*EGIMENTS|MERCENARY|NAME)(?=\s|$)/gi,
        ' '
      )
      .replace(/^(?:CH\s+AOS|OR\s+DER)\s+/i, '')
  )

const leadingIntegerAt = (value: string): number | undefined => {
  const match = value.replace(/\s+/g, '').match(/^(\d+)(?:\([+-]?\d+\))?$/)
  if (!match) return undefined
  const parsed = Number.parseInt(match[1], 10)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

const positioned = (items: PdfTextItem[]): PositionedItem[] =>
  items.flatMap(item =>
    typeof item.x === 'number' &&
    Number.isFinite(item.x) &&
    typeof item.y === 'number' &&
    Number.isFinite(item.y) &&
    item.str.trim()
      ? [{ ...item, x: item.x, y: item.y }]
      : []
  )

const nearestRowItems = (
  items: PositionedItem[],
  rows: NumericRow[],
  rowIndex: number,
  minimumX: number,
  maximumX: number
): PositionedItem[] => {
  const row = rows[rowIndex]
  return items.filter(item => {
    if (item.x < minimumX || item.x >= maximumX) return false
    const nearest = rows.reduce(
      (best, candidate, index) => {
        const distance = Math.abs(item.y - candidate.y)
        return distance < best.distance ? { index, distance } : best
      },
      { index: -1, distance: Number.POSITIVE_INFINITY }
    )
    const precedingGap = rowIndex > 0 ? Math.abs(rows[rowIndex - 1].y - row.y) : undefined
    const followingGap = rowIndex < rows.length - 1 ? Math.abs(row.y - rows[rowIndex + 1].y) : undefined
    const nearestGap = Math.min(
      precedingGap ?? Number.POSITIVE_INFINITY,
      followingGap ?? Number.POSITIVE_INFINITY
    )
    const distanceLimit = Number.isFinite(nearestGap) ? Math.min(30, Math.max(18, nearestGap * 0.75)) : 30
    return nearest.index === rowIndex && nearest.distance <= distanceLimit
  })
}

const centeredWrappedCellItemsForRow = (
  items: PositionedItem[],
  rows: NumericRow[],
  rowIndex: number,
  minimumX: number,
  maximumX: number
): PositionedItem[] => {
  const row = rows[rowIndex]
  const column = items.filter(item => item.x >= minimumX && item.x < maximumX)
  const lines = Array.from(new Set(column.map(item => item.y)))
    .sort((left, right) => right - left)
    .map(y => column.filter(item => Math.abs(item.y - y) < 0.5))
  const blocks: PositionedItem[][] = []
  lines.forEach(line => {
    const previous = blocks.at(-1)
    const previousBottomY = previous ? Math.min(...previous.map(item => item.y)) : undefined
    const lineTopY = Math.max(...line.map(item => item.y))
    const previousHeight = previous ? Math.max(...previous.map(item => item.height ?? 8)) : 8
    if (previous && previousBottomY !== undefined && previousBottomY - lineTopY <= previousHeight + 0.25) {
      previous.push(...line)
    } else {
      blocks.push([...line])
    }
  })
  for (let index = 0; index < blocks.length - 1; index += 1) {
    const block = blocks[index]
    const next = blocks[index + 1]
    const gap = Math.min(...block.map(item => item.y)) - Math.max(...next.map(item => item.y))
    if (
      new Set(block.map(item => item.y)).size === 1 &&
      /^This Regiment of Renown\b/i.test(textValue(block)) &&
      gap <= 12
    ) {
      block.push(...next)
      blocks.splice(index + 1, 1)
    }
  }
  return blocks.flatMap(block => {
    const centerY = (Math.max(...block.map(item => item.y)) + Math.min(...block.map(item => item.y))) / 2
    const nearest = rows.reduce(
      (best, candidate, index) => {
        const distance = Math.abs(centerY - candidate.y)
        return distance < best.distance ? { index, distance } : best
      },
      { index: -1, distance: Number.POSITIVE_INFINITY }
    )
    const precedingGap = rowIndex > 0 ? Math.abs(rows[rowIndex - 1].y - row.y) : undefined
    const followingGap = rowIndex < rows.length - 1 ? Math.abs(row.y - rows[rowIndex + 1].y) : undefined
    const nearestGap = Math.min(
      precedingGap ?? Number.POSITIVE_INFINITY,
      followingGap ?? Number.POSITIVE_INFINITY
    )
    const distanceLimit = Number.isFinite(nearestGap) ? Math.min(30, Math.max(18, nearestGap)) : 30
    return nearest.index === rowIndex && nearest.distance <= distanceLimit ? block : []
  })
}

const baseSizeItemsForRow = (
  items: PositionedItem[],
  rows: NumericRow[],
  rowIndex: number
): PositionedItem[] => {
  const column = items
    .filter(item => item.x >= 500 && item.x < 570)
    .filter(
      item =>
        item.x >= 510 ||
        containsBaseSizeValue(item.str) ||
        BASE_SIZE_QUALIFIER.test(cleanExtractedText(item.str)) ||
        /^[\d[\].,;Ã—x\s]+$/i.test(item.str)
    )
    .sort((left, right) => right.y - left.y || left.x - right.x)
  const lines = Array.from(new Set(column.map(item => item.y))).map(y =>
    column.filter(item => Math.abs(item.y - y) < 0.5)
  )
  const groups: PositionedItem[][] = []
  lines.forEach(line => {
    const previous = groups.at(-1)
    const previousBottomY = previous ? Math.min(...previous.map(item => item.y)) : undefined
    const lineTopY = Math.max(...line.map(item => item.y))
    const isWrappedLine = previousBottomY !== undefined && previousBottomY - lineTopY <= 10
    if (
      previous &&
      isWrappedLine &&
      (/[,;]\s*$/.test(textValue(previous)) || /^(?:\[\d+\]|or\b|and\b)/i.test(textValue(line)))
    ) {
      previous.push(...line)
    } else {
      groups.push([...line])
    }
  })
  return groups
    .filter(group => {
      const value = textValue(group)
      return containsBaseSizeValue(value) || BASE_SIZE_QUALIFIER.test(value)
    })
    .filter(group => {
      const centerY = group.reduce((sum, item) => sum + item.y, 0) / group.length
      const nearest = rows.reduce(
        (best, row, index) => {
          const distance = Math.abs(row.y - centerY)
          return distance < best.distance ? { index, distance } : best
        },
        { index: -1, distance: Number.POSITIVE_INFINITY }
      )
      return nearest.index === rowIndex && nearest.distance <= 30
    })
    .flat()
}

const sourceId = (checksum: string, page: number): SourceRecordId =>
  sourceRecordId('games-workshop', `${checksum}:page:${page}`)

const factChecksum = (fact: Omit<GamesWorkshopBattleProfileFact, 'factChecksum'>): string =>
  createHash('sha256').update(JSON.stringify(fact), 'utf8').digest('hex')

const withChecksum = <TFact extends Omit<GamesWorkshopBattleProfileFact, 'factChecksum'>>(
  fact: TFact
): TFact & { factChecksum: string } => ({ ...fact, factChecksum: factChecksum(fact) })

const unitRows = (items: PositionedItem[]): NumericRow[] =>
  items
    .flatMap(item => {
      if (item.x < 150 || item.x >= 200) return []
      const value = leadingIntegerAt(item.str)
      return value === undefined ? [] : [{ y: item.y, value }]
    })
    .sort((left, right) => right.y - left.y)

const pointsForUnitRow = (items: PositionedItem[], row: NumericRow): number | undefined => {
  const pointText = textValue(
    items.filter(item => item.x >= 205 && item.x < 250 && Math.abs(item.y - row.y) < 1.5)
  )
  const match = pointText.replace(/\s+/g, '').match(/^(\d+)/)
  return match ? Number.parseInt(match[1], 10) : undefined
}

const sectionForRow = (items: PositionedItem[], row: NumericRow): string => {
  const headers = items
    .filter(
      item =>
        item.x >= 30 &&
        item.x < 150 &&
        item.y > row.y &&
        /^(?:LEGENDS\s+)?(?:HEROES|UNITS|FACTION TERRAIN|WAR MACHINES|MONSTERS)$/i.test(
          item.str.replace(/\s+/g, ' ').trim()
        )
    )
    .sort((left, right) => left.y - right.y)
  return (
    headers[0]?.str
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase()
      .replace(/^LEGENDS\s+/, '') ?? 'UNITS'
  )
}

const extractUnitFacts = (
  items: PositionedItem[],
  page: number,
  checksum: string,
  factionOverride?: string
): GamesWorkshopUnitProfileFact[] => {
  const rows = unitRows(items)
  const faction = factionOverride ?? (page >= 64 ? 'Warhammer Legends' : PROFILE_PAGE_FACTIONS[page])
  if (!faction) return []

  return rows.flatMap((row, rowIndex) => {
    const points = pointsForUnitRow(items, row)
    if (points === undefined) return []
    const name = cleanName(textValue(nearestRowItems(items, rows, rowIndex, 30, 150)))
    if (!name || name.length < 3) return []
    const section = sectionForRow(items, row)
    const thirdColumn = withoutColumnHeader(
      textValue(nearestRowItems(items, rows, rowIndex, 250, 401)),
      /^.*?(?:R\s*EGIMENT OPTIONS|R\s*E\s*L\s*E\s*V\s*A\s*N\s*T K\s*E\s*Y\s*WOR\s*DS)\s*/i
    )
    const extractedNotes = withoutColumnHeader(
      textValue(centeredWrappedCellItemsForRow(items, rows, rowIndex, 401, 510)),
      /^NOTES\s*/i
    )
    const splitColumns =
      section === 'HEROES'
        ? { relevantKeywords: '', notes: extractedNotes }
        : splitKeywordNotes(thirdColumn, extractedNotes)
    const baseSizes = cleanBaseSizeText(
      withoutColumnHeader(textValue(baseSizeItemsForRow(items, rows, rowIndex)), /^BASE SIZE\s*/i)
    )
    const seasonal =
      /^Scourge of Aqshy\b/i.test(name) || /\bGeneral.s Handbook 20\d{2}[–-]\d{2}\b/i.test(splitColumns.notes)
    const fact = {
      kind: 'unit' as const,
      key: `page:${page}:unit:${rowIndex + 1}`,
      page,
      row: rowIndex + 1,
      faction,
      context: (page >= 64 ? 'legends' : seasonal ? 'seasonal' : 'standard') as
        'standard' | 'seasonal' | 'legends',
      name,
      unitSize: row.value,
      points,
      regimentOptions: section === 'HEROES' ? listValue(thirdColumn) : [],
      relevantKeywords: section === 'HEROES' ? [] : listValue(splitColumns.relevantKeywords),
      notes: splitColumns.notes ? [splitColumns.notes] : [],
      baseSizes: baseSizes ? listValue(baseSizes) : [],
      sourceRecordId: sourceId(checksum, page),
    }
    return [withChecksum(fact)]
  })
}

const rosterRows = (items: PositionedItem[]): NumericRow[] =>
  items
    .flatMap(item => {
      if (item.x < 275 || item.x >= 310) return []
      const value = leadingIntegerAt(item.str)
      return value === undefined ? [] : [{ y: item.y, value }]
    })
    .sort((left, right) => right.y - left.y)

const extractRosterOptionFacts = (
  items: PositionedItem[],
  page: number,
  checksum: string,
  factionOverride?: string
): GamesWorkshopRosterOptionFact[] => {
  const rows = rosterRows(items)
  const faction = factionOverride ?? PROFILE_PAGE_FACTIONS[page]
  if (!faction) return []
  return rows.flatMap((row, rowIndex) => {
    const optionType = withoutColumnHeader(
      textValue(nearestRowItems(items, rows, rowIndex, 30, 152)),
      /^TYPE\s*/i
    )
      .replace(/^(?:✹|NEW|UPDATED|U\s*PDATED)\s*/gi, '')
      .replace(/^[^A-Za-z0-9]+/, '')
    const name = cleanName(
      withoutColumnHeader(textValue(nearestRowItems(items, rows, rowIndex, 152, 275)), /^NAME\s*/i)
    )
    if (!optionType || !name) return []
    const notes = withoutColumnHeader(
      textValue(nearestRowItems(items, rows, rowIndex, 310, 570)),
      /^NOTES\s*/i
    )
    const seasonal = /\bScourge of Aqshy\b/i.test(notes)
    const fact = {
      kind: 'roster-option' as const,
      key: `page:${page}:roster-option:${rowIndex + 1}`,
      page,
      row: rowIndex + 1,
      faction,
      context: seasonal ? ('seasonal' as const) : ('standard' as const),
      optionType,
      name,
      points: row.value,
      notes: notes ? [notes] : [],
      sourceRecordId: sourceId(checksum, page),
    }
    return [withChecksum(fact)]
  })
}

const extractManifestationFacts = (
  items: PositionedItem[],
  page: number,
  checksum: string
): GamesWorkshopRosterOptionFact[] => {
  const rows = rosterRows(items)
  return rows.flatMap((row, rowIndex) => {
    const name = cleanName(
      withoutColumnHeader(textValue(nearestRowItems(items, rows, rowIndex, 30, 275)), /^NAME\s*/i)
    )
    if (!name) return []
    const notes = withoutColumnHeader(
      textValue(nearestRowItems(items, rows, rowIndex, 310, 570)),
      /^NOTES\s*/i
    )
    const fact = {
      kind: 'roster-option' as const,
      key: `page:${page}:manifestation-lore:${rowIndex + 1}`,
      page,
      row: rowIndex + 1,
      faction: 'Universal Manifestation Lores',
      context: 'standard' as const,
      optionType: 'Manifestation Lore',
      name,
      points: row.value,
      notes: notes ? [notes] : [],
      sourceRecordId: sourceId(checksum, page),
    }
    return [withChecksum(fact)]
  })
}

const regimentRows = (items: PositionedItem[]): NumericRow[] =>
  items
    .flatMap(item => {
      if (item.x < 245 || item.x >= 290) return []
      const value = leadingIntegerAt(item.str)
      return value === undefined ? [] : [{ y: item.y, value }]
    })
    .sort((left, right) => right.y - left.y)

const extractRegimentFacts = (
  items: PositionedItem[],
  page: number,
  checksum: string
): GamesWorkshopRegimentOfRenownFact[] => {
  const rows = regimentRows(items)
  return rows.flatMap((row, rowIndex) => {
    // The grand-alliance band header (e.g. CHAOS on page 61) attaches to the top row's name;
    // tolerate both the letterspaced `CH AOS` and the faithful `CHAOS` extraction.
    const name = cleanName(textValue(nearestRowItems(items, rows, rowIndex, 30, 120))).replace(
      /^CH\s*AOS\s+/i,
      ''
    )
    if (!name) return []
    const unitSummary = withoutColumnHeader(
      textValue(nearestRowItems(items, rows, rowIndex, 120, 245)),
      /^UNIT SUMMARY\s*/i
    )
    const notes = withoutColumnHeader(
      textValue(centeredWrappedCellItemsForRow(items, rows, rowIndex, 290, 570)),
      /^NOTES\s*/i
    )
    const fact = {
      kind: 'regiment-of-renown' as const,
      key: `page:${page}:regiment-of-renown:${rowIndex + 1}`,
      page,
      row: rowIndex + 1,
      faction: 'Regiments of Renown' as const,
      context: 'standard' as const,
      name,
      points: row.value,
      unitSummary: unitSummary ? [unitSummary] : [],
      notes: notes ? [notes] : [],
      sourceRecordId: sourceId(checksum, page),
    }
    return [withChecksum(fact)]
  })
}

const extract = async (
  bytes: Uint8Array,
  checksum: string,
  loader: PdfDocumentLoader
): Promise<GamesWorkshopBattleProfileExtractionResult> => {
  const diagnostics: GamesWorkshopDiagnostic[] = []
  const document = await loader.load(bytes)
  try {
    if (document.numPages < 57) {
      return {
        facts: [],
        diagnostics: [
          {
            code: 'ambiguous-layout',
            severity: 'error',
            message: `Battle Profiles document has ${document.numPages} pages; expected at least 57`,
          },
        ],
      }
    }
    const facts: GamesWorkshopBattleProfileFact[] = []
    for (let page = 3; page <= document.numPages; page += 1) {
      const items = positioned(await (await document.getPage(page)).getTextItems())
      if (!items.length) {
        diagnostics.push({
          code: 'ambiguous-layout',
          severity: 'error',
          message: `Battle Profiles page ${page} has no positioned text`,
          page,
        })
        continue
      }
      let pageFacts: GamesWorkshopBattleProfileFact[]
      if (page === 57) {
        pageFacts = extractManifestationFacts(items, page, checksum)
      } else if (page >= 58 && page <= 63) {
        pageFacts = extractRegimentFacts(items, page, checksum)
      } else if (
        page >= 64 ||
        items.some(
          item =>
            item.x >= 145 && item.x < 205 && /^U\s*NIT\s*SIZE$/i.test(item.str.replace(/\s+/g, ' ').trim())
        )
      ) {
        pageFacts = extractUnitFacts(items, page, checksum)
      } else {
        pageFacts = extractRosterOptionFacts(items, page, checksum)
      }
      facts.push(...pageFacts)
      if (!pageFacts.length) {
        diagnostics.push({
          code: 'fact-not-found',
          severity: 'error',
          message: `Battle Profiles page ${page} produced no structured facts`,
          page,
        })
      }
    }
    if (!facts.length) {
      diagnostics.push({
        code: 'fact-not-found',
        severity: 'error',
        message: 'Battle Profiles extraction produced no structured facts',
      })
    }
    return {
      facts,
      diagnostics,
    }
  } finally {
    await document.destroy()
  }
}

export const extractGamesWorkshopBattleProfiles = async (
  bytes: Uint8Array,
  artifactChecksum: string,
  loader: PdfDocumentLoader = createPdfJsDocumentLoader()
): Promise<GamesWorkshopBattleProfileExtractionResult> => {
  try {
    return await extract(bytes, artifactChecksum, loader)
  } catch (error) {
    return {
      facts: [],
      diagnostics: [
        {
          code: 'pdf-extraction-error',
          severity: 'error',
          message: `Battle Profiles extraction failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    }
  }
}

export const extractGamesWorkshopBattleProfileSupplement = async (
  bytes: Uint8Array,
  artifactChecksum: string,
  faction: string,
  loader: PdfDocumentLoader = createPdfJsDocumentLoader()
): Promise<GamesWorkshopBattleProfileExtractionResult> => {
  try {
    const diagnostics: GamesWorkshopDiagnostic[] = []
    const document = await loader.load(bytes)
    try {
      if (document.numPages !== 3) {
        return {
          facts: [],
          diagnostics: [
            {
              code: 'ambiguous-layout',
              severity: 'error',
              message: `Battle Profile supplement has ${document.numPages} pages; expected 3`,
            },
          ],
        }
      }
      const pageOne = positioned(await (await document.getPage(1)).getTextItems())
      const pageTwo = positioned(await (await document.getPage(2)).getTextItems())
      const pageThree = positioned(await (await document.getPage(3)).getTextItems())
      if (!pageOne.length || !pageTwo.length || !pageThree.length) {
        diagnostics.push({
          code: 'ambiguous-layout',
          severity: 'error',
          message: 'Battle Profile supplement contains a page without positioned text',
        })
      }
      const facts = [
        ...extractUnitFacts(pageOne, 1, artifactChecksum, faction),
        ...extractUnitFacts(pageTwo, 2, artifactChecksum, faction),
        ...extractRosterOptionFacts(pageTwo, 2, artifactChecksum, faction),
        ...extractRegimentFacts(pageThree, 3, artifactChecksum),
      ]
      if (!facts.length) {
        diagnostics.push({
          code: 'fact-not-found',
          severity: 'error',
          message: 'Battle Profile supplement extraction produced no structured facts',
        })
      }
      return { facts, diagnostics }
    } finally {
      await document.destroy()
    }
  } catch (error) {
    return {
      facts: [],
      diagnostics: [
        {
          code: 'pdf-extraction-error',
          severity: 'error',
          message: `Battle Profile supplement extraction failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    }
  }
}
