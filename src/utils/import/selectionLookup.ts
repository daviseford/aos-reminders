import { uniq } from 'lodash'
import { checkImportSelection } from 'utils/import/checkImportSelection'
import { mapListToDict } from 'utils/mapListToDict'
import { TImportError } from 'types/import'
import { TNameMap } from 'utils/import/options'
import { Validators } from 'utils/import/validators'
import { IArmy } from 'types/army'
import { ISelections } from 'types/selections'

type TLookupType =
  | 'allegiances'
  | 'artifacts'
  | 'battalions'
  | 'endless_spells'
  | 'spells'
  | 'traits'
  | 'units'

export const importSelectionLookup = (
  Army: IArmy,
  selections: ISelections,
  errors: TImportError[],
  unknownSelections: string[],
  foundSelections: string[],
  checkPoorSpacing: boolean,
  typoMap: TNameMap
) => (type: TLookupType): string[] => {
  const lookup = {
    allegiances: 'Allegiances',
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    endless_spells: 'EndlessSpells',
    spells: 'Spells',
    traits: 'Traits',
    units: 'Units',
  }

  const Names: string[] = Army[lookup[type]].map(({ name }) => name)
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
