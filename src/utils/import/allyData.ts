import { uniq, without } from 'lodash'
import { checkImportSelection } from 'utils/import/checkImportSelection'
import { createAllyWarning } from 'utils/import/warnings'
import { getAllyArmyUnits } from 'utils/getArmy/getAllyArmyUnits'
import { IAllySelections } from 'types/selections'
import { mapListToDict } from 'utils/mapListToDict'
import { titleCase } from 'utils/textUtils'
import { TNameMap } from 'utils/import/options'
import { TSupportedFaction } from 'meta/factions'
import { TImportError } from 'types/import'
import { TAllySelectionStore } from 'types/store'

export const getAllyData = (
  allyUnits: string[],
  factionName: TSupportedFaction,
  errors: TImportError[],
  checkPoorSpacing: boolean,
  typoMap: TNameMap
): {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
} => {
  if (allyUnits.length === 0) {
    return {
      allyFactionNames: [],
      allySelections: {},
    }
  }

  const allyArmyUnits = getAllyArmyUnits(factionName)

  const allyData = Object.keys(allyArmyUnits).reduce(
    (a, allyName) => {
      const units: string[] = allyArmyUnits[allyName]
      const unitsMap = mapListToDict(units)

      const checkVal = checkImportSelection(units, unitsMap, errors, false, checkPoorSpacing, typoMap)
      const errorFreeAllyUnits = allyUnits.map(checkVal).filter(x => !!x)

      if (errorFreeAllyUnits.length > 0) {
        if (!a.allySelections[allyName]) {
          a.allySelections[allyName] = { units: [] }
        }

        a.allySelections[allyName].units = errorFreeAllyUnits
        a.allyFactionNames = uniq(a.allyFactionNames.concat(allyName as TSupportedFaction))
      }

      return a
    },
    { allySelections: {} as TAllySelectionStore, allyFactionNames: [] as TSupportedFaction[] }
  )

  // Check for unit name collisions and mark them as errors
  const collisions = Object.keys(allyData.allySelections).reduce(
    (a, allyName) => {
      const units: string[] = allyData.allySelections[allyName].units
      units.forEach(unit => {
        if (a[unit]) {
          a[unit] = a[unit].concat(allyName as TSupportedFaction)
        } else {
          a[unit] = [allyName as TSupportedFaction]
        }
      })
      return a
    },
    {} as { [key: string]: TSupportedFaction[] }
  )

  Object.keys(collisions).forEach(unit => {
    if (collisions[unit].length > 1) {
      errors.push(
        createAllyWarning(
          `Allied ${unit} can belong to ${collisions[unit]
            .map(titleCase)
            .join(' or ')}. Please add this unit manually.`
        )
      )

      // Remove the unit from allySelections
      // And if that empties the array,
      // Remove the entry + remove it from allyFactionNames
      collisions[unit].forEach(faction => {
        const factionSelections = allyData.allySelections[faction] as IAllySelections
        factionSelections.units = without(factionSelections.units as string[], unit)
        if (factionSelections.units.length === 0) {
          delete allyData.allySelections[faction]
          allyData.allyFactionNames = without(allyData.allyFactionNames, faction)
        }
      })
    }
  })

  return allyData
}
