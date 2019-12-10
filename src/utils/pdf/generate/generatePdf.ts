import jsPDF from 'jspdf'
import { TSavePdfType, IPrintPdf } from 'types/pdf'
import { saveDefaultPdf } from './layouts/default'

export const savePdf = (type: TSavePdfType, data: IPrintPdf): jsPDF => {
  // if (type === 'default') {
  return saveDefaultPdf(data)
  // }
}
