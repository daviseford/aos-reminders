const replace = require('replace-in-file')

const replaceOptions = {
  files: 'src/army/**/*.*(ts|tsx)',
  from: [
    /[‘’]/g, // Replace special apostrophes
    /[“”]/g, // Replace special quotes
    /[‑–—]/g, // Replace special dashes
    / /g, // Remove non ASCII-spaces
    /½/g, // Remove 1/2 character
    // eslint-disable-next-line no-control-regex
    /[^\x00-\x7F]/g, // Remove all other non-ASCII characters
    /[.] {2,5}/g, // Replace extra spaces after punctuation
    /[:] {2,5}/g, // Replace extra spaces after punctuation
    /[,] {2,5}/g, // Replace extra spaces after punctuation
    /(?<=[name|desc|tag]: )` +(?=.+`)/g, // Remove leading whitespaces
    /(?<!:)(?<=[name|desc|tag]: `.+) +`/g, // Remove trailing whitespaces
    /(?<!:)(?<=desc: `.+\w)`/g, // Add a period to descriptions
    /(?<=[desc]: `)[\w' ]+ has a casting value of+(?=.+`)/g, // Shorten casting descriptions
  ],
  to: [`'`, `"`, '-', ' ', '1/2', '', '. ', ': ', ', ', '`', '`', '.`', `Casting value of`],
}

/**
 *
 * @param results - { file: string; hasChanged: boolean }[]
 */
const getChanged = results => results.filter(x => x.hasChanged).map(x => x.file)

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
