import jsPDF from 'jspdf'
import { saveCompactPdf } from 'utils/pdf/generate/layouts/compact'
import { saveDefaultPdf } from 'utils/pdf/generate/layouts/default'
import { TSavePdfType, IPrintPdf } from 'types/pdf'

export const savePdf = (type: TSavePdfType, data: IPrintPdf): jsPDF => {
  if (type === 'compact') return saveCompactPdf(data)
  return saveDefaultPdf(data)
}
