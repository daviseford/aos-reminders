import { uniq } from 'lodash'
import { IArmy } from 'types/army'
import { TImportError } from 'types/import'
import { TSelections, TSelectionTypes } from 'types/selections'
import { checkImportSelection } from 'utils/import/checkImportSelection'
import { importUnitOptionMap, TNameMap } from 'utils/import/options'
import { Validators } from 'utils/import/validators'
import { mapListToDict } from 'utils/mapListToDict'
import { lowerToUpperLookup } from './removeSideEffectsFromImport'

export const importSelectionLookup = (
  Army: IArmy,
  selections: TSelections,
  errors: TImportError[],
  unknownSelections: string[],
  foundSelections: string[],
  checkPoorSpacing: boolean,
  typoMap: TNameMap
) => (type: TSelectionTypes): string[] => {
  const Names: string[] = Army[lowerToUpperLookup[type]].map(({ name }) => name)
  const NameMap = mapListToDict(Names)
  const validators = Validators(Names)
  const checkVal = checkImportSelection(Names, NameMap, errors, true, checkPoorSpacing, typoMap)

  const errorFree = selections[type].map(checkVal).filter(x => !!x)

  const found = unknownSelections
    .map(val => {
      const orig = `${val}`

      // Check for typos
      if (typoMap[val]) val = typoMap[val]

      // Ideally, we return here because the name exactly matches what we have stored
      if (NameMap[val]) {
        foundSelections.push(orig)
        return val
      }

      // See if we have a matching conversion for a certain weapon -> unit
      // e.g. 'Ritual Knife' -> 'Keeper of Secrets w/ Ritual Knife'
      if (type === 'units' && importUnitOptionMap[orig]) {
        foundSelections.push(orig)
        return importUnitOptionMap[orig]
      }

      // We will check everything against uppercased values
      const valUpper = val.toUpperCase()

      // Simple check, it would be great if we found it here
      const match = validators.matchUpper(valUpper)
      if (match) {
        foundSelections.push(orig)
        return match
      }

      // Sometimes parentheses get in our way
      const match2 = validators.matchNoParens(valUpper)
      if (match2) {
        foundSelections.push(orig)
        return match2
      }

      if (checkPoorSpacing) {
        // Last chance - check for bad spacing
        const match3 = validators.matchPoorSpacing(valUpper)
        if (match3) {
          foundSelections.push(orig)
          return match3
        }
      }

      return ''
    })
    .filter(x => !!x)

  return uniq(errorFree.concat(found))
}
