import { jsPDF } from 'jspdf'
import type { PlacedLine, PrintPlan, PrintRoleStyle } from './types'

const BLACK: readonly [number, number, number] = [0, 0, 0]
const FURNITURE: readonly [number, number, number] = [128, 128, 128]
const ACCENT: readonly [number, number, number] = [28, 117, 149]

const applyStyle = (doc: jsPDF, style: PrintRoleStyle) => {
  const [red, green, blue] = style.color ?? BLACK
  doc.setFont('helvetica', style.weight)
  doc.setFontSize(style.sizePt)
  doc.setTextColor(red, green, blue)
}

/**
 * Draws a planned line. Labels are a bold run before the body text, so the first line of a paragraph
 * is drawn in two passes at measured offsets rather than by padding the string.
 */
const drawLine = (doc: jsPDF, plan: PrintPlan, line: PlacedLine) => {
  const style = plan.preset.roles[line.role]
  applyStyle(doc, style)

  if (line.label) {
    const labelText = `${line.label}: `
    doc.setFont('helvetica', 'bold')
    doc.text(labelText, line.xIn, line.yIn)
    const labelWidthIn = doc.getTextWidth(labelText)
    doc.setFont('helvetica', style.weight)
    doc.text(line.text, line.xIn + labelWidthIn, line.yIn)
    return
  }

  if (line.align === 'center') {
    doc.text(line.text, line.xIn, line.yIn, { align: 'center' })
    return
  }

  doc.text(line.text, line.xIn, line.yIn)
}

/**
 * Draws a line's tag boxes. Every coordinate arrives resolved from the plan; this only picks ink and
 * paints. The box is centred on the text baseline so a tag sitting beside a title reads as part of
 * the same line.
 */
const drawTags = (doc: jsPDF, plan: PrintPlan, line: PlacedLine) => {
  if (!line.tags?.length) return
  const style = plan.preset.roles.ruleTag
  const textHeightIn = style.sizePt / 72
  const boxHeightIn = textHeightIn + 0.05
  const top = line.yIn - textHeightIn - 0.012

  line.tags.forEach(tag => {
    const tone = plan.preset.tagTones[tag.tone]
    doc.setLineWidth(0.005)
    doc.setDrawColor(tone.border[0], tone.border[1], tone.border[2])

    if (tone.fill) {
      doc.setFillColor(tone.fill[0], tone.fill[1], tone.fill[2])
      doc.roundedRect(tag.xIn, top, tag.widthIn, boxHeightIn, 0.02, 0.02, 'FD')
    } else {
      doc.roundedRect(tag.xIn, top, tag.widthIn, boxHeightIn, 0.02, 0.02, 'S')
    }

    doc.setFont('helvetica', style.weight)
    doc.setFontSize(style.sizePt)
    doc.setTextColor(tone.text[0], tone.text[1], tone.text[2])
    doc.text(tag.label, tag.xIn + plan.preset.tagPaddingXIn, line.yIn - 0.008)
  })

  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
}

const drawSectionBox = (doc: jsPDF, plan: PrintPlan, line: PlacedLine) => {
  const style = plan.preset.roles[line.role]
  const height = (style.sizePt * style.leading) / 72
  const left = line.spansColumns ? plan.preset.page.marginLeftIn : plan.columnOriginsIn[line.column]
  const width = line.spansColumns
    ? plan.preset.page.widthIn - plan.preset.page.marginLeftIn - plan.preset.page.marginRightIn
    : plan.columnWidthIn

  doc.setLineWidth(0.008)
  doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2])
  doc.roundedRect(left, line.yIn - height + 0.045, width, height + 0.02, 0.04, 0.04, 'S')
}

const drawPageFurniture = (doc: jsPDF, plan: PrintPlan, pageIndex: number) => {
  const { page } = plan.preset
  const y = Math.max(page.marginTopIn - 0.22, 0.18)
  const style = plan.preset.roles.footer

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(Math.min(style.sizePt, 8))
  doc.setTextColor(FURNITURE[0], FURNITURE[1], FURNITURE[2])
  doc.text('aosreminders.com', page.marginLeftIn, y)
  doc.text(`${pageIndex + 1} / ${plan.pageCount}`, page.widthIn - page.marginRightIn, y, {
    align: 'right',
  })
  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
}

export interface RenderPdfOptions {
  title: string
}

/**
 * Thin adapter over the plan. It contains no layout decisions — every coordinate already exists in
 * `plan.lines`, which is what makes the layout testable without parsing a PDF.
 */
export const renderPrintPlanToPdf = (plan: PrintPlan, options: RenderPdfOptions): jsPDF => {
  const { page } = plan.preset
  // jsPDF 2+ takes an explicit `format` array in the document unit (here inches).
  const formatIn: [number, number] = [page.widthIn, page.heightIn]
  const doc = new jsPDF({ unit: 'in', format: formatIn })

  doc.setProperties({ title: options.title })

  for (let pageIndex = 0; pageIndex < plan.pageCount; pageIndex += 1) {
    if (pageIndex > 0) doc.addPage(formatIn)
    drawPageFurniture(doc, plan, pageIndex)

    plan.lines
      .filter(line => line.page === pageIndex)
      .forEach(line => {
        if (line.boxed) drawSectionBox(doc, plan, line)
        drawTags(doc, plan, line)
        if (line.text) drawLine(doc, plan, line)
      })
  }

  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
  return doc
}
