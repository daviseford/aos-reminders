import fs from 'fs'

const AZYR_JSON = {
  tests: ['src/tests/azyr/getAzyrArmy.test.ts', 'src/tests/azyr/azyrImport.test.ts'],
  fixtures: 'src/tests/fixtures/azyr/json',
  extension: '.json',
}
const BS_HTML = {
  tests: ['src/tests/battlescribe/battlescribeHTML.test.ts'],
  fixtures: 'src/tests/fixtures/battlescribe/html',
  extension: '.html',
}
const WSB_JSON = {
  tests: ['src/tests/warscroll/warscrollJson.test.ts'],
  fixtures: 'src/tests/fixtures/warscroll/json',
  extension: '.json',
}
const WSB_PDF = {
  tests: ['src/tests/warscroll/warscrollPdf.test.ts'],
  fixtures: 'src/tests/fixtures/warscroll/pdf',
  extension: '.pdf',
}
const WH_APP = {
  tests: [
    'src/tests/warhammer_app/warhammerApp.test.ts',
    'src/tests/warhammer_app/warhammerAppUtils.test.ts',
  ],
  fixtures: 'src/tests/fixtures/warhammer_app',
  extension: '.txt',
}

const ALL_TESTS = [WSB_JSON, WSB_PDF, BS_HTML, AZYR_JSON, WH_APP]

let AZYR_JSON_OUTPUT = ''
let BS_OUTPUT = ''
let WSB_JSON_OUTPUT = ''
let WSB_PDF_OUTPUT = ''
let WH_APP_OUTPUT = ''

const pruneTests = (info: {
  tests: string[]
  fixtures: string
  extension: string // '.html' | '.txt' | '.json'
}): string => {
  const testsText = info.tests
    .map(x => fs.readFileSync(x, { encoding: 'utf-8' }))
    .flat()
    .join('\n')

  const usedfileNames =
    testsText
      .match(/= getFile\(.+\)/g)
      ?.map(x => x.replace(/= getFile\(['"]/, '').replace(/['"]\)/, ''))
      ?.map(x => `${x}${info.extension}`) || []

  const existingFixtures = fs.readdirSync(info.fixtures)

  // console.log({ usedfileNames, existingFixtures })

  const filesToDelete = existingFixtures.filter(x => !usedfileNames?.includes(x))

  console.log({ filesToDelete })

  return ''
}

pruneTests(WSB_JSON)

// const run = () => {
//   const intake_files: string[] = fs
//     .readdirSync(INTAKE_DIR)
//     .filter((x: string) => !x.endsWith('.txt') || x.endsWith('Warhammer_App.txt'))

//   const existing_files: string[] = ALL_TESTS.map(x => fs.readdirSync(x)).flat()

//   // console.log(intake_files)
//   console.log(existing_files)

//   intake_files.forEach(filename => {
//     const src = `${INTAKE_DIR}/${filename}`

//     const bytes = getFilesizeInBytes(src)

//     if (bytes < 10) {
//       fs.unlinkSync(src) // Remove the file
//       return console.error(`Ignoring file (too small): ${filename}`)
//     }

//     if (existing_files.includes(filename)) {
//       fs.unlinkSync(src) // Remove the file
//       return console.error(`Ignoring file (exists already): ${filename}`)
//     }

//     // WSB
//     if (filename.includes('Warscroll_Builder')) {
//       if (filename.endsWith('.json')) {
//         fs.copyFileSync(src, `${WSB_JSON}/${filename}`)
//         WSB_JSON_OUTPUT = `${WSB_JSON_OUTPUT}\n${wsbJsonTest(filename.replace('.json', ''))}`
//       } else {
//         fs.copyFileSync(src, `${WSB_PDF}/${filename}`)
//         WSB_PDF_OUTPUT = `${WSB_PDF_OUTPUT}\n${wsbPdfTest(filename.replace('.pdf', ''))}`
//       }
//     }

//     // Battlescribe
//     if (filename.endsWith('.html')) {
//       fs.copyFileSync(src, `${BS_HTML}/${filename}`)
//       BS_OUTPUT = `${BS_OUTPUT}\n${bsHtmlTest(filename.replace('.html', ''))}`
//     }

//     // Azyr
//     if (filename.includes('Azyr') && filename.endsWith('.json')) {
//       fs.copyFileSync(src, `${AZYR_JSON}/${filename}`)
//       AZYR_JSON_OUTPUT = `${AZYR_JSON_OUTPUT}\n${azyrJsonTest(filename.replace('.json', ''))}`
//     }

//     // Warhammer App
//     if (filename.includes('Warhammer_App') && filename.endsWith('.txt')) {
//       fs.copyFileSync(src, `${WH_APP}/${filename}`)
//       WH_APP_OUTPUT = `${WH_APP_OUTPUT}\n${warhammerAppTest(filename.replace('.txt', ''))}`
//     }

//     // Remove the file
//     fs.unlinkSync(src)
//   })
// }

// const print = () => {
//   const HAS_PROCESSED_FILES = !!(
//     AZYR_JSON_OUTPUT ||
//     BS_OUTPUT ||
//     WSB_JSON_OUTPUT ||
//     WSB_PDF_OUTPUT ||
//     WH_APP_OUTPUT
//   )

//   if (!HAS_PROCESSED_FILES) return // No use if there's no data

//   const reportMap = {
//     [`${INTAKE_DIR}/${`AZYR_TESTS.txt`}`]: AZYR_JSON_OUTPUT,
//     [`${INTAKE_DIR}/${`BATTLESCRIBE_TESTS.txt`}`]: BS_OUTPUT,
//     [`${INTAKE_DIR}/${`WSB_JSON_TESTS.txt`}`]: WSB_JSON_OUTPUT,
//     [`${INTAKE_DIR}/${`WSB_PDF_TESTS.txt`}`]: WSB_PDF_OUTPUT,
//     [`${INTAKE_DIR}/${`WH_APP_TESTS.txt`}`]: WH_APP_OUTPUT,
//   }

//   Object.keys(reportMap).forEach(file => {
//     try {
//       fs.unlinkSync(file)
//     } catch (err) {}
//     const val = reportMap[file]
//     if (val) fs.writeFileSync(file, reportMap[file])
//   })
// }

// run()
// print()
console.log('Done')

// So node doesn't complain
export {}
