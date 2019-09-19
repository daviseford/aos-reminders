import { last } from 'lodash'
import { TNameMap } from 'utils/import/options'
import { replaceOf } from 'utils/import/replaceOf'
import { stripPunctuation } from 'utils/textUtils'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'
import { createWarning } from 'utils/import/warnings'
import { TImportError } from 'types/import'

export const checkImportSelection = (
  Names: string[],
  NameMap: TNameMap,
  errors: TImportError[],
  logError: boolean = true,
  checkPoorSpacing: boolean,
  typoMap: TNameMap
) => (val: string) => {
  // Check for typos
  if (typoMap[val]) val = typoMap[val]

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
