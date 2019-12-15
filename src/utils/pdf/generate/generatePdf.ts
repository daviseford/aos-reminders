import jsPDF from 'jspdf'
import { saveCompactPdf } from 'utils/pdf/generate/layouts/compact'
import { saveDefaultPdf } from 'utils/pdf/generate/layouts/default'
import { IPrintPdf } from 'types/pdf'

type TSavePdf = (
  data: IPrintPdf
) => {
  default: jsPDF
  compact: jsPDF
}

export const savePdf: TSavePdf = data => {
  return {
    default: saveDefaultPdf(data),
    compact: saveCompactPdf(data),
  }
}
