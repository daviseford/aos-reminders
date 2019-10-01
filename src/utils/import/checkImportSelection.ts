import { createWarning } from 'utils/import/warnings'
import { TNameMap } from 'utils/import/options'
import { Validators } from 'utils/import/validators'
import { TImportError } from 'types/import'

export const checkImportSelection = (
  Names: string[],
  NameMap: TNameMap,
  errors: TImportError[],
  logError: boolean = true,
  checkPoorSpacing: boolean,
  typoMap: TNameMap
) => {
  const validators = Validators(Names)

  return (val: string) => {
    // Check for typos
    if (typoMap[val]) val = typoMap[val]

    if (NameMap[val]) return val

    // Going to check against uppercased values
    const valUpper = val.toUpperCase()

    // Simple check if maybe some capitalization is off
    const match = validators.matchUpper(valUpper)
    if (match) return match

    // Maybe we have a trailing '... of Slaanesh'?
    const match2 = validators.matchNoOf(valUpper)
    if (match2) return match2

    // Maybe punctuation is in our way?
    const match3 = validators.matchNoPunc(valUpper)
    if (match3) return match3

    // Sometimes parentheses get in our way
    const match4 = validators.matchNoParens(valUpper)
    if (match4) return match4

    // Maybe semicolons?
    const match5 = validators.matchNoSemicolons(valUpper)
    if (match5) return match5

    // Last chance - check for bad spacing (if enabled)
    if (checkPoorSpacing) {
      const match6 = validators.matchPoorSpacing(valUpper)
      if (match6) return match6
    }

    if (logError) {
      errors.push(createWarning(val))
    }
    return ''
  }
}
