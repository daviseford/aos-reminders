import { last } from 'lodash'
import { TImportError } from '../../types/import'
import { azyrTypoMap } from './options'
import { stripPunctuation } from 'utils/textUtils'
import { createWarning, replaceOf } from 'utils/warscroll/warscrollUtils'

export const checkImportSelection = (
  Names: string[],
  NameMap: { [key: string]: string },
  errors: TImportError[],
  logError: boolean = true,
  checkPoorSpacing: boolean
) => (val: string) => {
  // Check for typos
  if (azyrTypoMap[val]) val = azyrTypoMap[val]

  if (NameMap[val]) return val

  // See if we have something like it...
  const valUpper = val.toUpperCase()
  const match = Names.find(x => x.toUpperCase().includes(valUpper))
  if (match) return match

  // Maybe we have a trailing '... of Slaanesh'?
  const valShortened = replaceOf(valUpper)
  const match2 = Names.find(x => x.toUpperCase().includes(valShortened))
  if (match2) return match2

  // Maybe punctuation is in our way?
  const valNoPunc = stripPunctuation(valUpper)
  const match3 = Names.find(x => stripPunctuation(x.toUpperCase()).includes(valNoPunc))
  if (match3) return match3

  // Sometimes parentheses get in our way
  const valNoParens = valUpper.replace(/\(.+\)/g, '').trim()
  const match4 = Names.find(x =>
    x
      .toUpperCase()
      .replace(/\(.+\)/g, '')
      .includes(valNoParens)
  )
  if (match4) return match4

  // Maybe semicolons?
  const valNoSemi = last(valUpper.split(':')) as string
  const match5 = Names.find(x => x.toUpperCase().includes(valNoSemi))
  if (match5) return match5

  if (checkPoorSpacing) {
    // Last chance - check for bad spacing
    const match6 = Names.find(x => isPoorlySpacedMatch(val, x))
    if (match6) return match6
  }

  if (logError) {
    errors.push(createWarning(val))
  }
  return ''
}

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
