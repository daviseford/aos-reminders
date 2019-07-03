const replace = require('replace-in-file')

const replaceOptions = {
  files: 'src/**/*.*',
  from: [/’/g, /”/g],
  to: [`'`, `"`],
}

/**
 *
 * @param results - { file: string; hasChanged: boolean }[]
 */
const parseResults = results => {
  return results.filter(x => x.hasChanged)
}

const run = async () => {
  try {
    const results = await replace(replaceOptions)
    const parsed = parseResults(results)
    if (parsed.length) {
      console.log('Replacement results:', parsed)
    } else {
      console.log('No files were modified.')
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

// Go!
run()
