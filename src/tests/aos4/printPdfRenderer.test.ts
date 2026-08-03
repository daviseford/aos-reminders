// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import {
  COMPACT_PRESET,
  STANDARD_PRESET,
  createAos4PrintDocument,
  createJsPdfMeasurer,
  planPrintLayout,
  renderPrintPlanToPdf,
  type PrintReminderInput,
} from '../../aos4/print'

const reminder = (id: string, words: number): PrintReminderInput => ({
  id,
  name: `Rule ${id}`,
  windowKey: 'hero-phase',
  windowLabel: 'Hero Phase',
  typeLabel: 'Active',
  effect: Array.from({ length: words }, (_, index) => `${id}${index}word`).join(' '),
  hidden: false,
})

const document = () =>
  createAos4PrintDocument(
    Array.from({ length: 25 }, (_, index) => reminder(`r${index}`, 30 + index * 5)),
    { armyName: 'Renderer Army', factionName: 'Stormcast Eternals' }
  )

/**
 * jsPDF writes one `x y Td` followed by `(text) Tj` per drawn string. Reading them back is the only
 * way to prove the PDF actually matches the plan rather than the plan matching itself.
 */
const readDrawnText = (pdf: string) =>
  Array.from(pdf.matchAll(/([\d.]+) ([\d.]+) Td\s*\((.*?)\) Tj/g)).map(match => ({
    xPt: Number(match[1]),
    yPt: Number(match[2]),
    text: match[3],
  }))

describe('renderPrintPlanToPdf', () => {
  it('draws one string per planned line at the planned coordinates', () => {
    const preset = STANDARD_PRESET
    const plan = planPrintLayout(document(), preset, createJsPdfMeasurer())
    const doc = renderPrintPlanToPdf(plan, { title: 'Renderer Army' })
    const drawn = readDrawnText(doc.output())

    expect(drawn.length).toBeGreaterThanOrEqual(plan.lines.length)

    plan.lines.slice(0, 40).forEach(line => {
      const expectedX = (line.align === 'center' ? line.xIn - line.widthIn / 2 : line.xIn) * 72
      const expectedY = (preset.page.heightIn - line.yIn) * 72
      const match = drawn.find(
        item => Math.abs(item.xPt - expectedX) < 1.5 && Math.abs(item.yPt - expectedY) < 0.5
      )
      expect(
        match,
        `no drawn text near (${expectedX.toFixed(1)}, ${expectedY.toFixed(1)}) for "${line.text}"`
      ).toBeDefined()
    })
  })

  it('emits the planned number of pages', () => {
    const plan = planPrintLayout(document(), COMPACT_PRESET, createJsPdfMeasurer())
    const doc = renderPrintPlanToPdf(plan, { title: 'Renderer Army' })

    expect(doc.internal.getNumberOfPages()).toBe(plan.pageCount)
  })

  it('sets the document title', () => {
    const plan = planPrintLayout(document(), STANDARD_PRESET, createJsPdfMeasurer())
    const doc = renderPrintPlanToPdf(plan, { title: 'Renderer Army' })

    expect(doc.output()).toContain('Renderer Army')
  })

  it('renders no text outside the printable area', () => {
    const preset = COMPACT_PRESET
    const plan = planPrintLayout(document(), preset, createJsPdfMeasurer())
    const doc = renderPrintPlanToPdf(plan, { title: 'Renderer Army' })
    const drawn = readDrawnText(doc.output())

    const pageWidthPt = preset.page.widthIn * 72
    const pageHeightPt = preset.page.heightIn * 72

    drawn.forEach(item => {
      expect(item.xPt).toBeGreaterThanOrEqual(0)
      expect(item.xPt).toBeLessThanOrEqual(pageWidthPt)
      expect(item.yPt).toBeGreaterThanOrEqual(0)
      expect(item.yPt).toBeLessThanOrEqual(pageHeightPt)
    })
  })
})
