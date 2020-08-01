import { WARSCROLL_BUILDER, BATTLESCRIBE, AZYR } from 'types/import'

const fs = require('fs')

const PLACEHOLDER_TXT = 'placeholder.txt'
const WSB_OUTPUT = `${WARSCROLL_BUILDER}_tests.txt`
const BS_OUTPUT = `${BATTLESCRIBE}_tests.txt`
const AZYR_OUTPUT = `${AZYR}_tests.txt`

const IGNORED_FILES = [PLACEHOLDER_TXT, WSB_OUTPUT, BS_OUTPUT, AZYR_OUTPUT]

const INTAKE_DIR = 'src/tests/fixtures/intake/'
const WSB_JSON_DIR = 'src/tests/fixtures/warscroll/json'
const WSB_PDF_DIR = 'src/tests/fixtures/warscroll/pdf'
const BS_DIR = 'src/tests/fixtures/battlescribe/html'
const AZYR_JSON_DIR = 'src/tests/fixtures/azyr/json'
const AZYR_PDF_DIR = 'src/tests/fixtures/azyr/pdf'

const wsbTest = (file: string) => `
it('should work with ${file}', () => {
    const parsedText = getFile('${file}')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
})
`

fs.readdirSync('src/tests/fixtures/intake/').forEach(file => {
  if (IGNORED_FILES.includes(file)) return

  console.log(file)
})

export {}
