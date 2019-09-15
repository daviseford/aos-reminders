import { getAzyrArmy } from 'utils/azyr/getAzyrArmy'
import { readFileSync } from 'fs'

xdescribe('getAzyrArmy', () => {
  it('does it', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/azyr/pdf/Cats.and.Judicators.2000.pdf', 'utf8')
    getAzyrArmy()
  })
})
