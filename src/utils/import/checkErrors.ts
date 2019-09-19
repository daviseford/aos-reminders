import { remove } from 'lodash'
import { IArmy } from 'types/army'
import { TImportError } from 'types/import'
import { getAllWarnings } from './warnings'

/**
 * Mutates the errors array if it finds a suitable match in the allegiance abilities
 * @param Army
 * @param allegiances
 * @param errors
 */
export const checkErrorsForAllegianceAbilities = (
  Army: IArmy,
  allegiances: string[],
  errors: TImportError[]
) => {
  if (errors.length === 0 || allegiances.length === 0) return

  const warnings = getAllWarnings(errors).map(({ text }) => text)
  let foundError = false

  allegiances.forEach(a => {
    if (foundError) return
    const entry = Army.Allegiances.find(al => al.name === a)
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
