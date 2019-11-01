import { TImportError } from 'types/import'
import { createAmbiguityWarning } from 'utils/import/warnings'

/**
 * Mutates the errors array if it finds a suitable match in the allegiance abilities
 * @param errors
 * @param selections
 * @param ambiguousNames
 */
export const addAmbiguousSelectionErrors = (
  errors: TImportError[],
  selections: string[],
  ambiguousNames: string[]
) => {
  selections.forEach(selection => {
    if (ambiguousNames.find(name => name.toUpperCase() === selection.toUpperCase())) {
      errors.push(
        createAmbiguityWarning(
          `Azyr lists more than one unit as '${selection}'. Please check it has imported the correct one.`
        )
      )
    }
  })
}
