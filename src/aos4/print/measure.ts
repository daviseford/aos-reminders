import { jsPDF } from 'jspdf'
import type { PrintTextMeasurer } from './types'

/**
 * Measures with jsPDF's own font metrics, at the size the text will actually be drawn.
 *
 * The old implementation measured before any `setFontSize`, so every width was silently scaled by
 * `16 / fontSize` and the wrap constants had to be reverse-engineered by trial and error. Setting
 * the size before measuring is the entire fix; see docs/printing.md.
 */
export const createJsPdfMeasurer = (): PrintTextMeasurer => {
  const doc = new jsPDF({ unit: 'in' })

  return {
    widthIn: (text, style) => {
      if (!text) return 0
      doc.setFont('helvetica', style.weight)
      doc.setFontSize(style.sizePt)
      return doc.getTextWidth(text)
    },
  }
}
