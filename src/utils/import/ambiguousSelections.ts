import { TSupportedFaction } from 'meta/factions'
import { TImportError } from 'types/import'
import { TAllySelectionStore } from 'types/store'
import { TNameMap } from 'utils/import/options'
import { createAmbiguityWarning } from 'utils/import/warnings'

/**
 * Adds an error for each selection we've identified could be wrong based on ambiguous naming in the source
 * @param errors
 * @param selections
 * @param allyData
 * @param ambiguousNamesMap
 */
export const addAmbiguousSelectionErrors = (
  errors: TImportError[],
  selections: { [key: string]: string[] },
  allyData: { allyFactionNames: TSupportedFaction[]; allySelections: TAllySelectionStore },
  ambiguousNamesMap: TNameMap
) => {
  for (let key in selections) {
    selections[key].forEach(selection => {
      const match = ambiguousNamesMap[selection]
      if (match) {
        errors.push(
          createAmbiguityWarning(
            `Azyr lists more than one unit as '${match}'. Please check it has imported the correct one.`
          )
        )
      }
    })
  }
}
