import { replaceOf } from './replaceOf'
import { stripPunctuation } from 'utils/textUtils'
import { last } from 'lodash'
import { isPoorlySpacedMatch } from './isPoorlySpacedMatch'

export const Validators = (Names: string[]) => {
  /**
   * Accepts an UPPERCASED value
   * @param val
   */
  const matchUpper = (val: string) => Names.find(x => x.toUpperCase().includes(val))

  /**
   * Accepts an UPPERCASED value
   * Removes trailing '... of Slaanesh'
   * @param val
   */
  const matchNoOf = (val: string) => {
    const valShortened = replaceOf(val)
    return Names.find(x => x.toUpperCase().includes(valShortened))
  }

  /**
   * Accepts an UPPERCASED value
   * Removes punctuation
   * @param val
   */
  const matchNoPunc = (val: string) => {
    const valNoPunc = stripPunctuation(val)
    return Names.find(x => stripPunctuation(x.toUpperCase()).includes(valNoPunc))
  }

  /**
   * Accepts an UPPERCASED value
   * Removes parentheses
   * @param val
   */
  const matchNoParens = (val: string) => {
    const valNoParens = val.replace(/\(.+\)/g, '').trim()
    return Names.find(x =>
      x
        .toUpperCase()
        .replace(/\(.+\)/g, '')
        .includes(valNoParens)
    )
  }

  /**
   * Accepts an UPPERCASED value
   * Removes semicolons ':'
   * @param val
   */
  const matchNoSemicolons = (val: string) => {
    const valNoSemi = last(val.split(':')) as string
    return Names.find(x => x.toUpperCase().includes(valNoSemi))
  }

  /**
   * Accepts any value (does not need to be uppercased)
   * Checks for poor spacing
   * @param val
   */
  const matchPoorSpacing = (val: string) => Names.find(x => isPoorlySpacedMatch(val, x))

  return {
    matchNoOf,
    matchNoParens,
    matchNoPunc,
    matchNoSemicolons,
    matchPoorSpacing,
    matchUpper,
  }
}
