import { TImportError } from 'types/import'
import { TNameMap } from 'utils/import/options'
import { createAmbiguityWarning } from 'utils/import/warnings'

/**
 * Adds an error for each selection we've identified could be wrong based on ambiguous naming in the source
 * @param errors
 * @param selections
 * @param ambiguousNamesMap
 */
export const addAmbiguousSelectionErrors = (
  errors: TImportError[],
  selections: string[],
  ambiguousNamesMap: TNameMap
) => {
  selections.forEach(selection => {
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
