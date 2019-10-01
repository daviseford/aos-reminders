/**
 * Sometimes the text formatting from PDF.js leads to extra spaces in a word
 * What we want to do is smush the word together (removing all spaces)
 * And then expand the word, adding spaces where our potential match has them
 * And check if we've got a partial match
 * @param value
 * @param potentialMatch
 */
export const isPoorlySpacedMatch = (value: string, potentialMatch: string): boolean => {
  const smushed = value.replace(/ +/g, '')
  const spaceIndices = potentialMatch
    .split('')
    .map((x, i) => (x === ' ' ? i : -1))
    .filter(x => x > -1)

  let smushedIdx = 0
  let assemblyStore: string[] = []
  for (let i = 0; i <= smushed.length; i++) {
    if (spaceIndices.includes(i)) {
      assemblyStore.push(' ')
    } else {
      assemblyStore.push(smushed[smushedIdx])
      smushedIdx++
    }
  }
  const reassembledVal = assemblyStore.join('')

  return potentialMatch.toUpperCase().includes(reassembledVal.toUpperCase())
}
