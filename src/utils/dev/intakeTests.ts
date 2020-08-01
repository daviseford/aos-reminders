const fs = require('fs')

const PLACEHOLDER_TXT = 'placeholder.txt'
const WSB_PDF_OUTPUT = `WSB_pdf_tests.txt`
const WSB_JSON_OUTPUT = `WSB_json_tests.txt`
const BS_OUTPUT = `BATTLESCRIBE_tests.txt`
const AZYR_JSON_OUTPUT = `AZYR_json_tests.txt`

const IGNORED_FILES = [PLACEHOLDER_TXT, WSB_PDF_OUTPUT, WSB_JSON_OUTPUT, BS_OUTPUT, AZYR_JSON_OUTPUT]

const INTAKE_DIR = 'src/tests/fixtures/intake'
const FAILED_DIR = 'src/tests/fixtures/intake/failed'

const WSB_JSON_DIR = 'src/tests/fixtures/warscroll/json'
const WSB_PDF_DIR = 'src/tests/fixtures/warscroll/pdf'
const BS_DIR = 'src/tests/fixtures/battlescribe/html'
const AZYR_JSON_DIR = 'src/tests/fixtures/azyr/json'

const FIXTURE_DIRS = [WSB_JSON_DIR, WSB_PDF_DIR, BS_DIR, AZYR_JSON_DIR]

const azyrJsonTest = (filename: string) => `
it('should correctly read ${filename}', () => {
    const fileTxt = getFile('${filename}')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
})`

const bsHtmlTest = (filename: string) => `
it('should correctly read ${filename}', () => {
    const parsedText = getFile('${filename}')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
})`

const wsbJsonTest = (filename: string) => `
it('should correctly read ${filename}', () => {
    const parsedText = getFile('${filename}')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
})`

const wsbPdfTest = (filename: string) => `
it('should correctly read ${filename}', () => {
    const pdfText = getFile('${filename}')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.errors).toEqual([])
})`

let WSB_JSON_OUTPUT_TXT = ''
let WSB_PDF_OUTPUT_TXT = ''
let AZYR_JSON_OUTPUT_TXT = ''
let BS_OUTPUT_TXT = ''

const run = () => {
  const intake_files: string[] = fs.readdirSync(INTAKE_DIR).filter(x => !IGNORED_FILES.includes(x))
  const existing_files: string[] = FIXTURE_DIRS.map(x => fs.readdirSync(x)).flat()

  console.log(intake_files)
  //  console.log(existing_files)

  intake_files.forEach(filename => {
    const src = `${INTAKE_DIR}/${filename}`

    if (existing_files.includes(filename)) {
      console.error('Exists already: ' + filename)
      moveToFailed(filename)
      return
    }

    // WSB
    if (filename.includes('Warscroll_Builder')) {
      if (filename.endsWith('.json')) {
        fs.copyFileSync(src, `${WSB_JSON_DIR}/${filename}`)
        WSB_JSON_OUTPUT_TXT = `${WSB_JSON_OUTPUT_TXT}\n${wsbJsonTest(filename.replace('.json', ''))}`
      } else {
        fs.copyFileSync(src, `${WSB_PDF_DIR}/${filename}`)
        WSB_PDF_OUTPUT_TXT = `${WSB_PDF_OUTPUT_TXT}\n${wsbPdfTest(filename.replace('.pdf', ''))}`
      }
    }

    // Battlescribe
    if (filename.endsWith('.html')) {
      fs.copyFileSync(src, `${BS_DIR}/${filename}`)
      BS_OUTPUT_TXT = `${BS_OUTPUT_TXT}\n${bsHtmlTest(filename.replace('.html', ''))}`
    }

    // Azyr
    if (filename.includes('Azyr') && filename.endsWith('.json')) {
      fs.copyFileSync(src, `${AZYR_JSON_DIR}/${filename}`)
      AZYR_JSON_OUTPUT_TXT = `${AZYR_JSON_OUTPUT_TXT}\n${azyrJsonTest(filename.replace('.json', ''))}`
    }

    // Remove the file
    fs.unlinkSync(src)
  })
}

const moveToFailed = filename => {
  const src = `${INTAKE_DIR}/${filename}`
  fs.copyFileSync(src, `${FAILED_DIR}/${filename}`)
}

const print = () => {
  try {
    fs.unlinkSync(`${INTAKE_DIR}/${WSB_PDF_OUTPUT}`)
    fs.unlinkSync(`${INTAKE_DIR}/${WSB_JSON_OUTPUT}`)
    fs.unlinkSync(`${INTAKE_DIR}/${BS_OUTPUT}`)
    fs.unlinkSync(`${INTAKE_DIR}/${AZYR_JSON_OUTPUT}`)
  } catch (err) {
    // pass
  }

  if (WSB_PDF_OUTPUT_TXT) fs.writeFileSync(`${INTAKE_DIR}/${WSB_PDF_OUTPUT}`, WSB_PDF_OUTPUT_TXT)
  if (WSB_JSON_OUTPUT_TXT) fs.writeFileSync(`${INTAKE_DIR}/${WSB_JSON_OUTPUT}`, WSB_JSON_OUTPUT_TXT)
  if (BS_OUTPUT_TXT) fs.writeFileSync(`${INTAKE_DIR}/${BS_OUTPUT}`, BS_OUTPUT_TXT)
  if (AZYR_JSON_OUTPUT_TXT) fs.writeFileSync(`${INTAKE_DIR}/${AZYR_JSON_OUTPUT}`, AZYR_JSON_OUTPUT_TXT)
}

run()
print()
console.log('Done')

// So node doesn't complain
export {}
