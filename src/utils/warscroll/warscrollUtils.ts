import { TError } from '../../types/warscrollTypes'
import { warscrollTypoMap } from './options'
import { stripPunctuation, titleCase } from 'utils/textUtils'
import { SUPPORTED_FACTIONS } from 'meta/factions'

export const cleanWarscrollText = (pdfText: string[]) => {
  return pdfText
    .map(txt =>
      txt
        .replace(/\\\(/g, '(') // Fix parentheses i.e. "\(value\)"
        .replace(/\\\)/g, ')') // Fix parentheses i.e. "\(value\)"
        .replace(/^[0-9]{1,2}"$/g, '') // Remove '12"' entries
        .replace(/^[0-9]{1,2}"\*$/g, '') // Remove '10"*' entries
        .replace(/^[0-9]{1,2}D6"/g, '') // Remove '2D6"' entries
        .replace(/ \([0-9]+\)/g, '') // Remove point values e.g. "Slann Starmaster (360)"
        .replace(/[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .trim()
    )
    .filter(
      txt =>
        !!txt &&
        txt.length > 2 &&
        txt !== 'Warscroll Builder on www.warhammer-community.com' &&
        txt !== '* See Warscroll'
    )
}

export const createError = (text: string): { text: string; severity: 'error' } => ({
  text,
  severity: 'error',
})
export const createWarning = (text: string): { text: string; severity: 'warn' } => ({
  text,
  severity: 'warn',
})

export const getNameMap = (names: string[]) => {
  return names.reduce(
    (a, b) => {
      a[b] = b
      return a
    },
    {} as { [key: string]: string }
  )
}

/**
 * Accepts an UPPERCASED value and looks for a faction in the name
 * e.g. Demon Prince of Slaanesh -> Demon Prince
 * @param val
 */
const replaceOf = (val: string) => {
  const factions = SUPPORTED_FACTIONS.map(titleCase).map(x => x.toUpperCase())
  const faction = factions.find(x => val.includes(` OF ${x}`))
  if (faction) val = val.replace(` OF ${faction}`, ``)
  return val
}

export const checkSelection = (
  Names: string[],
  NameMap: { [key: string]: string },
  errors: TError[],
  logError: boolean = true
) => (val: string) => {
  // Check for typos
  if (warscrollTypoMap[val]) val = warscrollTypoMap[val]

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

  if (logError) {
    errors.push(createWarning(val))
  }
  return ''
}
