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

const pruneTests = (info: {
  tests: string[]
  fixtures: string
  extension: string // '.html' | '.txt' | '.json'
}): void => {
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

  const filesToDelete = existingFixtures.filter(x => !usedfileNames?.includes(x))

  // console.log({ usedfileNames, existingFixtures, filesToDelete })

  if (filesToDelete.length) {
    filesToDelete.forEach(fileName => {
      fs.unlinkSync(`${info.fixtures}/${fileName}`) // Remove the file
      console.log(`Deleted ${fileName}`)
    })
  } else {
    console.log(`No files deleted in ${info.fixtures}`)
  }
}

const run = () => ALL_TESTS.forEach(x => pruneTests(x))

run()
console.log('Done')

// So node doesn't complain
export {}
