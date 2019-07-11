const replace = require('replace-in-file')

const replaceOptions = {
  files: 'src/**/*.*(ts|tsx)',
  from: [
    /[‘’]/g, // Replace special apostrophes
    /[“”]/g, // Replace special quotes
    /(?<=[name|desc]: )` +(?=.+`)/g, // Remove leading whitespaces
    /(?<!:)(?<=[name|desc]: `.+) +`/g, // Remove trailed whitespaces
    /(?<!:)(?<=desc: `.+\w)`/g, // Add a period to descriptions
  ],
  to: [`'`, `"`, '`', '`', '.`'],
}

/**
 *
 * @param results - { file: string; hasChanged: boolean }[]
 */
const getChanged = results => results.filter(x => x.hasChanged)

const run = async () => {
  try {
    const results = await replace(replaceOptions)
    const changed = getChanged(results)
    if (changed.length) {
      console.log('Files modified:', changed)
      process.exit(1)
    } else {
      console.log('No files were modified.')
    }
  } catch (error) {
    console.error('Error occurred:', error)
    process.exit(1)
  }
}

// Go!
run()
