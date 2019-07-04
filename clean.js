const replace = require('replace-in-file')

const replaceOptions = {
  files: 'src/**/*.*(ts|tsx)',
  from: [/[‘’]/g, /[“”]/g, /(?<=[name|desc]: )` +(?=.+`)/g, /(?<!:)(?<=[name|desc]: `.+) +`/g],
  to: [`'`, `"`, '`', '`'],
}

/**
 *
 * @param results - { file: string; hasChanged: boolean }[]
 */
const parseResults = results => results.filter(x => x.hasChanged)

const run = async () => {
  try {
    const results = await replace(replaceOptions)
    const parsed = parseResults(results)
    if (parsed.length) {
      console.log('Files modified:', parsed)
      process.exit(1)
    } else {
      console.log('No files were modified.')
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

// Go!
run()
