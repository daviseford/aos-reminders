// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import type { Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import {
  COMPACT_PRESET,
  STANDARD_PRESET,
  createAos4PrintDocument,
  createJsPdfMeasurer,
  planPrintLayout,
  tagBoxHeightIn,
  withPageSize,
  type PlacedLine,
  type PrintPlan,
  type PrintPreset,
} from '../../aos4/print'
import { createAos4ArmyDocument } from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderViewModel,
  type Aos4ReminderViewModel,
} from '../../aos4/view'

/**
 * Cost tags (#1856, #2032) sit first in a rule's tag row, ahead of the source label. A long source
 * label then pushes the row past the column edge unless the row wraps. These checks run the real
 * accepted catalog through every print layout and page size.
 */

const EPSILON = 0.001

const measurer = createJsPdfMeasurer()

const layouts: Array<[string, PrintPreset]> = [
  ['standard A4', STANDARD_PRESET],
  ['standard letter', withPageSize(STANDARD_PRESET, 'letter')],
  ['compact A4', COMPACT_PRESET],
  ['compact letter', withPageSize(COMPACT_PRESET, 'letter')],
]

const armyReminders = (explicitSelectionIds: string[]): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-cost-tag-geometry',
      name: 'Cost Tag Geometry',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: explicitSelectionIds as never,
    })
  )

const entityNamed = (kind: 'faction' | 'warscroll', name: string) => {
  const entity = AOS4_CATALOG.entities.find(candidate => candidate.kind === kind && candidate.name === name)
  if (!entity) throw new Error(`No ${kind} named ${name}`)
  return entity as Faction | Warscroll
}

/**
 * Every tag box inside its column, never overlapping its neighbour, the title beside it, or the
 * boxes of the tag row above it. Box geometry mirrors `drawTags` in pdf.ts.
 */
const tagGeometryProblems = (plan: PrintPlan): string[] => {
  const problems: string[] = []
  const tagStyle = plan.preset.roles.ruleTag
  const boxTop = (line: PlacedLine) => line.yIn - tagStyle.sizePt / 72 - 0.012
  let title = ''
  let previousTagRow: PlacedLine | undefined
  plan.lines.forEach((line: PlacedLine) => {
    if (line.role === 'ruleTitle') title = line.text
    if (!line.tags?.length) {
      previousTagRow = undefined
      return
    }
    if (
      previousTagRow &&
      previousTagRow.page === line.page &&
      previousTagRow.column === line.column &&
      boxTop(line) < boxTop(previousTagRow) + tagBoxHeightIn(tagStyle) - EPSILON
    ) {
      problems.push(`${title}: a wrapped tag row overlaps the row above it`)
    }
    previousTagRow = line
    const columnLeft = plan.columnOriginsIn[line.column]
    const columnRight = columnLeft + plan.columnWidthIn
    // A title-right line carries the title's own run to the left of its tags.
    let previousRight = line.text ? line.xIn + line.widthIn : -Infinity
    line.tags.forEach(tag => {
      const right = tag.xIn + tag.widthIn
      if (tag.xIn < columnLeft - EPSILON || right > columnRight + EPSILON) {
        problems.push(`${title} / ${tag.label}: ${(right - columnRight).toFixed(3)}in past the column`)
      }
      if (tag.xIn < previousRight - EPSILON) {
        problems.push(`${title} / ${tag.label}: overlaps the element before it`)
      }
      previousRight = right
    })
  })
  return problems
}

describe('print cost tags stay inside their column (#2032)', () => {
  // The seasonal Zenestra warscroll carries the longest source label a cost-tagged reminder prints.
  const ZENESTRA = 'Scourge of Aqshy Pontifex Zenestra, Matriarch of the Great Wheel'
  const zenestraReminders = () =>
    armyReminders([entityNamed('faction', 'Cities of Sigmar').id, entityNamed('warscroll', ZENESTRA).id])

  it.each(layouts)(
    'wraps the Sigmar’s Blessing chanting-value row inside the column (%s)',
    (_label, preset) => {
      const reminders = zenestraReminders()
      const blessing = reminders.find(reminder => reminder.name === 'SIGMAR’S BLESSING')
      expect(blessing?.tags.map(tag => tag.label)).toEqual(['ChV 5', ZENESTRA, 'Active', 'Your turn'])

      const plan = planPrintLayout(
        createAos4PrintDocument(reminders, { armyName: 'Zenestra', factionName: 'Cities of Sigmar' }),
        preset,
        measurer
      )
      expect(tagGeometryProblems(plan)).toEqual([])
      // Every tag still prints in full and in order; only the row breaks.
      const titleIndex = plan.lines.findIndex(
        line => line.role === 'ruleTitle' && line.text === 'SIGMAR’S BLESSING'
      )
      const printedTags = plan.lines
        .slice(titleIndex, titleIndex + 4)
        .filter(line => line.role === 'ruleTag' || line.role === 'ruleTitle')
        .flatMap(line => line.tags ?? [])
        .map(tag => tag.label)
      expect(printedTags).toEqual(['ChV 5', ZENESTRA, 'Active', 'Your turn'])
    }
  )

  it.each(layouts)('shortens only a source label wider than the whole column (%s)', (_label, preset) => {
    const endless = Array.from({ length: 30 }, (_, index) => `Word${index}`).join(' ')
    const plan = planPrintLayout(
      createAos4PrintDocument(
        [
          {
            id: 'reminder:overlong-label',
            name: 'OVERLONG LABEL',
            windowKey: 'hero-phase',
            windowLabel: 'Hero Phase',
            typeLabel: 'Active',
            effect: 'Effect text.',
            hidden: false,
            tags: [
              { label: 'CV 7', tone: 'cost' },
              { label: endless, tone: 'source' },
            ],
          },
        ],
        { armyName: 'Army', factionName: 'Faction' }
      ),
      preset,
      measurer
    )
    expect(tagGeometryProblems(plan)).toEqual([])
    const labels = plan.lines.flatMap(line => line.tags ?? []).map(tag => tag.label)
    expect(labels[0]).toBe('CV 7')
    expect(labels[1]).toMatch(/^Word0 Word1 .*\.\.\.$/)
  })

  // Built once and shared by every layout: each army with every offered option that directly
  // includes a costed ability selected. Selecting only those keeps the sweep cheap.
  const costParentIds = (() => {
    const costed = new Set(
      AOS4_CATALOG.entities
        .filter(entity => entity.kind === 'ability' && entity.cost)
        .map(entity => entity.id)
    )
    return new Set(
      AOS4_CATALOG.relationships.filter(relationship => costed.has(relationship.to)).map(({ from }) => from)
    )
  })()
  let costTaggedArmies: Array<{ name: string; reminders: Aos4ReminderViewModel[] }> | undefined
  const allCostTaggedArmies = () =>
    (costTaggedArmies ??= AOS4_CATALOG.entities
      .filter((entity): entity is Faction => entity.kind === 'faction')
      .map(faction => {
        const offered = createAos4BuilderViewModel(
          AOS4_CATALOG,
          createAos4ArmyDocument({
            id: 'army:test-cost-tag-geometry',
            name: 'Cost Tag Geometry',
            rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
            explicitSelectionIds: [faction.id],
          })
        )
          .options.filter(option => option.available && costParentIds.has(option.id))
          .map(option => option.id)
        return {
          name: faction.name,
          reminders: armyReminders([faction.id, ...offered]).filter(reminder =>
            reminder.tags.some(tag => tag.tone === 'cost')
          ),
        }
      })
      .filter(army => army.reminders.length))

  it.each(layouts)(
    'fits every cost-tagged reminder of every army (%s)',
    { timeout: 60_000 },
    (_label, preset) => {
      const armies = allCostTaggedArmies()
      const problems = armies.flatMap(army =>
        tagGeometryProblems(
          planPrintLayout(
            createAos4PrintDocument(army.reminders, { armyName: army.name, factionName: army.name }),
            preset,
            measurer
          )
        ).map(problem => `${army.name}: ${problem}`)
      )

      expect(armies.reduce((total, army) => total + army.reminders.length, 0)).toBeGreaterThan(700)
      expect(problems).toEqual([])
    }
  )
})
