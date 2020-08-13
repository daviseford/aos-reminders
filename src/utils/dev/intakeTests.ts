const fs = require('fs')

const INTAKE_DIR = 'src/tests/fixtures/intake'

const AZYR_JSON_DIR = 'src/tests/fixtures/azyr/json'
const BS_DIR = 'src/tests/fixtures/battlescribe/html'
const WSB_JSON_DIR = 'src/tests/fixtures/warscroll/json'
const WSB_PDF_DIR = 'src/tests/fixtures/warscroll/pdf'

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

const getFilesizeInBytes = (filename: string) => {
  const stats = fs.statSync(filename)
  const fileSizeInBytes = stats['size']
  return fileSizeInBytes
}

let AZYR_JSON_OUTPUT_TXT = ''
let BS_OUTPUT_TXT = ''
let WSB_JSON_OUTPUT_TXT = ''
let WSB_PDF_OUTPUT_TXT = ''

const run = () => {
  const intake_files: string[] = fs.readdirSync(INTAKE_DIR).filter((x: string) => !x.endsWith('.txt'))
  const existing_files: string[] = FIXTURE_DIRS.map(x => fs.readdirSync(x)).flat()

  // console.log(intake_files)
  // console.log(existing_files)

  intake_files.forEach(filename => {
    const src = `${INTAKE_DIR}/${filename}`

    const bytes = getFilesizeInBytes(src)

    if (bytes < 10) {
      fs.unlinkSync(src) // Remove the file
      return console.error(`Ignoring file (too small): ${filename}`)
    }

    if (existing_files.includes(filename)) {
      fs.unlinkSync(src) // Remove the file
      return console.error(`Ignoring file (exists already): ${filename}`)
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

const AZYR_REPORT = `${INTAKE_DIR}/${`AZYR_tests.txt`}`
const BS_REPORT = `${INTAKE_DIR}/${`BATTLESCRIBE_tests.txt`}`
const WSB_JSON_REPORT = `${INTAKE_DIR}/${`WSB_JSON_tests.txt`}`
const WSB_PDF_REPORT = `${INTAKE_DIR}/${`WSB_PDF_tests.txt`}`

const print = () => {
  try {
    fs.unlinkSync(AZYR_REPORT)
    fs.unlinkSync(BS_REPORT)
    fs.unlinkSync(WSB_JSON_REPORT)
    fs.unlinkSync(WSB_PDF_REPORT)
  } catch (err) {
    // pass
  }

  if (AZYR_JSON_OUTPUT_TXT) fs.writeFileSync(AZYR_REPORT, AZYR_JSON_OUTPUT_TXT)
  if (BS_OUTPUT_TXT) fs.writeFileSync(BS_REPORT, BS_OUTPUT_TXT)
  if (WSB_JSON_OUTPUT_TXT) fs.writeFileSync(WSB_JSON_REPORT, WSB_JSON_OUTPUT_TXT)
  if (WSB_PDF_OUTPUT_TXT) fs.writeFileSync(WSB_PDF_REPORT, WSB_PDF_OUTPUT_TXT)
}

run()
print()
console.log('Done')

// So node doesn't complain
export {}
