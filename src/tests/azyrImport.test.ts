import { readFileSync } from 'fs'
import { getAzyrPdfText } from 'components/input/azyr/azyrPdf'

const pdfText = readFileSync(__dirname + '/fixtures/azyr/pdf/Cats.and.Judicators.2000.pdf').buffer

// TODO: Get this to work :(
// https://github.com/mozilla/pdf.js/issues/7612
xdescribe('getAzyrArmy', () => {
  it('does it', async () => {
    const typedArray = new Uint8Array(pdfText as any)
    const res = await getAzyrPdfText(typedArray)
    console.log(res)
  }, 300000)
})
