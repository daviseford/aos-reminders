// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import {
  COMPACT_PRESET,
  STANDARD_PRESET,
  createAos4PrintDocument,
  createJsPdfMeasurer,
  planPrintLayout,
  type PlacedLine,
  type PrintReminderInput,
  type PrintTag,
} from '../../aos4/print'

const EPSILON = 0.001

const tags: PrintTag[] = [
  { label: 'Active', tone: 'kind-active' },
  { label: 'Your turn', tone: 'turn-your' },
  { label: '1 / turn · army', tone: 'usage' },
]

const reminder = (overrides: Partial<PrintReminderInput> & { id: string }): PrintReminderInput => ({
  name: `Rule ${overrides.id}`,
  windowKey: 'hero-phase',
  windowLabel: 'Hero Phase',
  typeLabel: 'Active · Your turn · 1 per turn (army)',
  effect: 'Short effect text.',
  hidden: false,
  ...overrides,
})

const planFor = (preset: typeof STANDARD_PRESET, input: PrintReminderInput) =>
  planPrintLayout(
    createAos4PrintDocument([input], { armyName: 'Army', factionName: 'Faction' }),
    preset,
    createJsPdfMeasurer()
  )

const titleLine = (lines: PlacedLine[]) => lines.find(line => line.role === 'ruleTitle')
const tagLine = (lines: PlacedLine[]) => lines.find(line => line.role === 'ruleTag')

describe('print tags', () => {
  it('drops the flattened prefix from the title once tags are supplied', () => {
    const document = createAos4PrintDocument([reminder({ id: 'a', tags })], {
      armyName: 'Army',
      factionName: 'Faction',
    })
    expect(document.sections[0].rules[0].title).toBe('Rule a')
    expect(document.sections[0].rules[0].tags).toEqual(tags)
  })

  it('keeps the legacy prefixed title when a caller supplies no tags', () => {
    const document = createAos4PrintDocument([reminder({ id: 'a' })], {
      armyName: 'Army',
      factionName: 'Faction',
    })
    expect(document.sections[0].rules[0].title).toBe('Active · Your turn · 1 per turn (army) - Rule a')
    expect(document.sections[0].rules[0].tags).toBeUndefined()
  })

  it('right-aligns tags on the title line in the standard preset', () => {
    const plan = planFor(STANDARD_PRESET, reminder({ id: 'a', tags }))
    const title = titleLine(plan.lines)

    expect(title?.tags).toHaveLength(3)
    expect(tagLine(plan.lines)).toBeUndefined()

    const placed = title!.tags!
    const rightEdge = placed[placed.length - 1].xIn + placed[placed.length - 1].widthIn
    const columnRight = plan.columnOriginsIn[0] + plan.columnWidthIn
    expect(rightEdge).toBeCloseTo(columnRight, 2)

    // Tags start after the title text ends, so the two never overlap.
    expect(placed[0].xIn).toBeGreaterThan(title!.xIn + title!.widthIn)
  })

  it('puts tags on their own line below the title in the compact preset', () => {
    const plan = planFor(COMPACT_PRESET, reminder({ id: 'a', tags }))
    const title = titleLine(plan.lines)
    const below = tagLine(plan.lines)

    expect(title?.tags).toBeUndefined()
    expect(below?.tags).toHaveLength(3)
    expect(below!.yIn).toBeGreaterThan(title!.yIn)
    expect(below!.tags![0].xIn).toBeCloseTo(plan.columnOriginsIn[below!.column], 2)
  })

  it('falls back to a tag line when a long title leaves no room beside it', () => {
    const longName = 'A Preposterously Overlong Ability Name That Consumes The Entire Measure Alone'
    const plan = planFor(STANDARD_PRESET, reminder({ id: 'a', name: longName, tags }))

    expect(titleLine(plan.lines)?.tags).toBeUndefined()
    expect(tagLine(plan.lines)?.tags).toHaveLength(3)
  })

  it('keeps every tag box inside the column in both presets', () => {
    ;[STANDARD_PRESET, COMPACT_PRESET].forEach(preset => {
      const plan = planFor(preset, reminder({ id: 'a', tags }))
      plan.lines
        .filter(line => line.tags?.length)
        .forEach(line => {
          const columnLeft = plan.columnOriginsIn[line.column]
          const columnRight = columnLeft + plan.columnWidthIn
          line.tags!.forEach(tag => {
            expect(tag.xIn).toBeGreaterThanOrEqual(columnLeft - EPSILON)
            expect(tag.xIn + tag.widthIn).toBeLessThanOrEqual(columnRight + EPSILON)
          })
        })
    })
  })

  it('never overlaps adjacent tag boxes', () => {
    const plan = planFor(COMPACT_PRESET, reminder({ id: 'a', tags }))
    const placed = tagLine(plan.lines)!.tags!
    placed.slice(1).forEach((tag, index) => {
      const previous = placed[index]
      expect(tag.xIn).toBeGreaterThanOrEqual(previous.xIn + previous.widthIn - EPSILON)
    })
  })

  it('resolves a tone for every tag in both presets', () => {
    const tones: PrintTag['tone'][] = [
      'cost',
      'kind-active',
      'kind-reaction',
      'kind-passive',
      'turn-your',
      'turn-enemy',
      'turn-neutral',
      'usage',
      'priority',
      'source',
      'provenance',
    ]
    ;[STANDARD_PRESET, COMPACT_PRESET].forEach(preset => {
      tones.forEach(tone => {
        const style = preset.tagTones[tone]
        expect(style, `${preset.id} is missing a tone for ${tone}`).toBeDefined()
        expect(style.text).toHaveLength(3)
        expect(style.border).toHaveLength(3)
      })
    })
  })
})
