import jsPDF from 'jspdf'
import type { PlacedLine, PrintPlan, PrintRoleStyle } from './types'

const BLACK: readonly [number, number, number] = [0, 0, 0]
const FURNITURE: readonly [number, number, number] = [128, 128, 128]
const ACCENT: readonly [number, number, number] = [28, 117, 149]

const applyStyle = (doc: jsPDF, style: PrintRoleStyle) => {
  const [red, green, blue] = style.color ?? BLACK
  doc.setFont('helvetica')
  doc.setFontStyle(style.weight)
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
    doc.setFontStyle('bold')
    doc.text(labelText, line.xIn, line.yIn)
    const labelWidthIn = doc.getTextWidth(labelText)
    doc.setFontStyle(style.weight)
    doc.text(line.text, line.xIn + labelWidthIn, line.yIn)
    return
  }

  if (line.align === 'center') {
    doc.text(line.text, line.xIn, line.yIn, null as never, null as never, 'center')
    return
  }

  doc.text(line.text, line.xIn, line.yIn)
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

  doc.setFont('helvetica')
  doc.setFontStyle('normal')
  doc.setFontSize(Math.min(style.sizePt, 8))
  doc.setTextColor(FURNITURE[0], FURNITURE[1], FURNITURE[2])
  doc.text('aosreminders.com', page.marginLeftIn, y)
  doc.text(
    `${pageIndex + 1} / ${plan.pageCount}`,
    page.widthIn - page.marginRightIn,
    y,
    null as never,
    null as never,
    'right'
  )
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
  // jsPDF 1.x takes an explicit `format` array in points, whatever the document unit is.
  const formatPt: [number, number] = [page.widthIn * 72, page.heightIn * 72]
  const doc = new jsPDF({ unit: 'in', format: formatPt })

  doc.setProperties({ title: options.title })

  for (let pageIndex = 0; pageIndex < plan.pageCount; pageIndex += 1) {
    if (pageIndex > 0) doc.addPage(formatPt)
    drawPageFurniture(doc, plan, pageIndex)

    plan.lines
      .filter(line => line.page === pageIndex)
      .forEach(line => {
        if (line.boxed) drawSectionBox(doc, plan, line)
        drawLine(doc, plan, line)
      })
  }

  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
  return doc
}
