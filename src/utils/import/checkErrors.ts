import { remove } from 'lodash'
import { IArmy } from 'types/army'
import { TImportError } from 'types/import'
import { getAllWarnings } from 'utils/import/warnings'
import { DeprecatedSelections } from './options'

/**
 * Mutates the errors array if it finds a suitable match in the allegiance abilities
 * @param Army
 * @param flavors
 * @param errors
 */
export const checkErrorsForAllegianceAbilities = (Army: IArmy, flavors: string[], errors: TImportError[]) => {
  if (errors.length === 0 || flavors.length === 0) return

  const warnings = getAllWarnings(errors).map(({ text }) => text)
  let foundError = false

  flavors.forEach(a => {
    if (foundError) return
    const entry = Army.Flavors.find(al => al.name === a)
    if (!entry) return

    entry.effects.forEach(e => {
      if (foundError) return
      const match = warnings.find(err => err.toUpperCase() === e.name.toUpperCase())
      if (match) {
        foundError = true
        remove(errors, x => x.text === match)
      }
    })
  })
}

/**
 * Mutates the errors array to provide appropriate messages for deprecated selections
 * @param errors
 */
export const checkErrorsForDeprecations = (errors: TImportError[]) => {
  errors.forEach(error => {
    const deprecation = DeprecatedSelections[error.text]
    if (deprecation !== undefined) {
      error.severity = 'deprecation-warn'
      error.reason = deprecation
    }
  })
}
