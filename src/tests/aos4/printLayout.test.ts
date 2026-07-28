import { describe, expect, it } from 'vitest'
import {
  COMPACT_PRESET,
  STANDARD_PRESET,
  createAos4PrintDocument,
  createJsPdfMeasurer,
  planPrintLayout,
  withPageSize,
  type PlacedLine,
  type PrintDocument,
  type PrintPlan,
  type PrintPreset,
  type PrintReminderInput,
} from '../../aos4/print'

/** Inches. Generous enough to absorb float noise, far tighter than a visible overflow. */
const EPSILON = 0.001

const sentence = (words: number, seed: string) =>
  Array.from({ length: words }, (_, index) => `${seed}${index}word`).join(' ')

const reminder = (overrides: Partial<PrintReminderInput> & { id: string }): PrintReminderInput => ({
  name: `Rule ${overrides.id}`,
  windowKey: 'hero-phase',
  windowLabel: 'Hero Phase',
  typeLabel: 'Active · Your turn',
  effect: sentence(40, overrides.id),
  hidden: false,
  ...overrides,
})

/** Long enough to spill over several pages in both presets. */
const bigDocument = (): PrintDocument =>
  createAos4PrintDocument(
    Array.from({ length: 60 }, (_, index) =>
      reminder({
        id: `r${index}`,
        windowKey: `window-${index % 5}`,
        windowLabel: `Window ${index % 5}`,
        effect: sentence(20 + (index % 7) * 15, `r${index}`),
        ...(index % 4 === 0 ? { declare: sentence(12, `d${index}`) } : {}),
        ...(index % 6 === 0 ? { note: sentence(10, `n${index}`) } : {}),
      })
    ),
    {
      armyName: 'Geometry Test Army',
      factionName: 'Stormcast Eternals',
      warscrolls: Array.from({ length: 20 }, (_, index) => ({
        name: `Unit With A Fairly Long Name ${index}`,
        profile: { points: 100 + index, unitSize: 5 },
      })),
    }
  )

const plan = (preset: PrintPreset, document = bigDocument()): PrintPlan =>
  planPrintLayout(document, preset, createJsPdfMeasurer())

const presets: [string, PrintPreset][] = [
  ['standard', STANDARD_PRESET],
  ['compact', COMPACT_PRESET],
]

const leftEdge = (line: PlacedLine) => (line.align === 'center' ? line.xIn - line.widthIn / 2 : line.xIn)
const rightEdge = (line: PlacedLine) =>
  line.align === 'center' ? line.xIn + line.widthIn / 2 : line.xIn + line.widthIn

describe.each(presets)('planPrintLayout (%s preset)', (_label, preset) => {
  const result = plan(preset)

  it('produces at least one page and places every line on a real page', () => {
    expect(result.pageCount).toBeGreaterThan(1)
    result.lines.forEach(line => {
      expect(line.page).toBeGreaterThanOrEqual(0)
      expect(line.page).toBeLessThan(result.pageCount)
      expect(line.column).toBeGreaterThanOrEqual(0)
      expect(line.column).toBeLessThan(preset.page.columns)
    })
  })

  it('never lets text cross the left or right margin', () => {
    const { page } = preset
    const overflowing = result.lines.filter(
      line =>
        leftEdge(line) < page.marginLeftIn - EPSILON ||
        rightEdge(line) > page.widthIn - page.marginRightIn + EPSILON
    )
    expect(overflowing.map(line => `${line.role}: ${line.text}`)).toEqual([])
  })

  it('never lets text cross the top or bottom margin', () => {
    const { page } = preset
    const overflowing = result.lines.filter(
      line =>
        line.yIn - line.heightIn < page.marginTopIn - EPSILON ||
        line.yIn > page.heightIn - page.marginBottomIn + EPSILON
    )
    expect(overflowing.map(line => `${line.role}: ${line.text}`)).toEqual([])
  })

  it('keeps every column-bound line inside its own column', () => {
    result.lines
      .filter(line => !line.spansColumns)
      .forEach(line => {
        const origin = result.columnOriginsIn[line.column]
        expect(leftEdge(line)).toBeGreaterThanOrEqual(origin - EPSILON)
        expect(rightEdge(line)).toBeLessThanOrEqual(origin + result.columnWidthIn + EPSILON)
      })
  })

  it('never splits a rule across a column or a page', () => {
    const placements = new Map<string, Set<string>>()
    result.lines
      .filter(line => line.blockId?.startsWith('rule:'))
      .forEach(line => {
        const key = line.blockId as string
        const seen = placements.get(key) ?? new Set<string>()
        seen.add(`${line.page}/${line.column}`)
        placements.set(key, seen)
      })

    const split = Array.from(placements.entries()).filter(([, seen]) => seen.size > 1)
    expect(split.map(([id, seen]) => `${id} -> ${Array.from(seen).join(', ')}`)).toEqual([])
  })

  it('keeps a section heading with at least the first line of its first rule', () => {
    const headingIndexes = result.lines
      .map((line, index) => (line.role === 'sectionHeading' ? index : -1))
      .filter(index => index >= 0)
    expect(headingIndexes.length).toBeGreaterThan(0)

    headingIndexes.forEach(index => {
      const heading = result.lines[index]
      const following = result.lines.slice(index + 1).find(line => line.role !== 'sectionHeading')
      expect(following).toBeDefined()
      expect(following?.page).toBe(heading.page)
      expect(following?.column).toBe(heading.column)
    })
  })

  it('repeats the section heading when a section continues onto a new column or page', () => {
    const firstOfColumn = new Map<string, number>()
    result.lines.forEach((line, index) => {
      const key = `${line.page}/${line.column}`
      if (!firstOfColumn.has(key)) firstOfColumn.set(key, index)
    })

    const repeated = result.lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.role === 'sectionHeading' && line.text.includes('(continued)'))

    expect(repeated.length).toBeGreaterThan(0)
    repeated.forEach(({ line, index }) => {
      expect(firstOfColumn.get(`${line.page}/${line.column}`)).toBe(index)
    })
  })

  it('emits every rule title exactly once, reassembled from its wrapped lines', () => {
    const document = bigDocument()
    const titlesByBlock = new Map<string, string[]>()
    result.lines
      .filter(line => line.role === 'ruleTitle' && line.blockId)
      .forEach(line => {
        const key = line.blockId as string
        titlesByBlock.set(key, [...(titlesByBlock.get(key) ?? []), line.text])
      })

    const expected = document.sections.flatMap(section => section.rules.map(rule => rule.title)).sort()
    const actual = document.sections
      .flatMap(section => section.rules)
      .map(rule => (titlesByBlock.get(`rule:${rule.id}`) ?? []).join(' '))
      .sort()

    expect(actual).toEqual(expected)
  })

  it('preserves paragraph text through wrapping', () => {
    const document = bigDocument()
    document.sections
      .flatMap(section => section.rules)
      .forEach(rule => {
        rule.paragraphs.forEach((paragraph, index) => {
          const blockId = `rule:${rule.id}`
          const lines = result.lines.filter(
            line => line.blockId === blockId && line.paragraphIndex === index && line.role === paragraph.role
          )
          expect(lines.length).toBeGreaterThan(0)
          expect(lines.map(line => line.text).join(' ')).toBe(paragraph.text)
          expect(lines[0].label).toBe(paragraph.label)
          lines.slice(1).forEach(line => expect(line.label).toBeUndefined())
        })
      })
  })

  it('does not overlap lines within a column', () => {
    const byColumn = new Map<string, PlacedLine[]>()
    result.lines.forEach(line => {
      const key = `${line.page}/${line.column}`
      byColumn.set(key, [...(byColumn.get(key) ?? []), line])
    })

    byColumn.forEach(lines => {
      lines.forEach((line, index) => {
        if (index === 0) return
        expect(line.yIn).toBeGreaterThan(lines[index - 1].yIn - EPSILON)
      })
    })
  })
})

describe('planPrintLayout edge cases', () => {
  it('splits a rule only when it cannot fit in an empty column, and marks the continuation', () => {
    const document = createAos4PrintDocument([reminder({ id: 'huge', effect: sentence(2000, 'huge') })], {
      armyName: 'Test Army',
      factionName: 'Stormcast Eternals',
    })
    const result = planPrintLayout(document, COMPACT_PRESET, createJsPdfMeasurer())

    const columns = new Set(
      result.lines.filter(line => line.blockId === 'rule:huge').map(line => `${line.page}/${line.column}`)
    )
    expect(columns.size).toBeGreaterThan(1)
    expect(result.lines.some(line => line.role === 'ruleTitle' && line.text.includes('(continued)'))).toBe(
      true
    )
  })

  it('balances the columns on a short compact document instead of leaving one empty', () => {
    const document = createAos4PrintDocument(
      Array.from({ length: 8 }, (_, index) =>
        reminder({ id: `r${index}`, effect: sentence(45, `r${index}`) })
      ),
      { armyName: 'Short Army', factionName: 'Stormcast Eternals' }
    )
    const result = planPrintLayout(document, COMPACT_PRESET, createJsPdfMeasurer())

    expect(result.pageCount).toBe(1)

    const top = COMPACT_PRESET.page.marginTopIn
    const depth = (column: number) => {
      const lines = result.lines.filter(line => line.column === column && !line.spansColumns)
      return lines.length ? Math.max(...lines.map(line => line.yIn)) - top : 0
    }

    expect(depth(1)).toBeGreaterThan(0)
    // Neither column should be more than half again as deep as the other.
    expect(Math.max(depth(0), depth(1))).toBeLessThan(Math.min(depth(0), depth(1)) * 1.5)
  })

  it('handles a document with no reminders without throwing', () => {
    const document = createAos4PrintDocument([], {
      armyName: 'Empty Army',
      factionName: 'Stormcast Eternals',
    })
    const result = planPrintLayout(document, STANDARD_PRESET, createJsPdfMeasurer())

    expect(result.pageCount).toBe(1)
    expect(result.lines.some(line => line.role === 'documentTitle')).toBe(true)
  })

  it('lays out on US Letter as well as A4 without overflowing', () => {
    const letter = withPageSize(STANDARD_PRESET, 'letter')
    expect(letter.page.widthIn).toBeCloseTo(8.5)
    expect(letter.page.heightIn).toBeCloseTo(11)

    const result = plan(letter)
    const overflowing = result.lines.filter(
      line => rightEdge(line) > letter.page.widthIn - letter.page.marginRightIn + EPSILON
    )
    expect(overflowing).toEqual([])
  })

  it('wraps to the real column width, not to an implicit font-size-scaled width', () => {
    // Regression guard for the jsPDF 1.x splitTextToSize trap documented in docs/printing.md:
    // the widest line must genuinely approach the column width rather than a multiple of it.
    const result = plan(COMPACT_PRESET)
    const bodyLines = result.lines.filter(line => line.role === 'ruleBody')
    const widest = Math.max(...bodyLines.map(line => line.widthIn))

    expect(widest).toBeLessThanOrEqual(result.columnWidthIn + EPSILON)
    expect(widest).toBeGreaterThan(result.columnWidthIn * 0.6)
  })
})
