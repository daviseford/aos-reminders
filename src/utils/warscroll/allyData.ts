import { uniq, without } from 'lodash'
import { getAllyArmyUnits } from 'utils/getArmy/getAllyArmyUnits'
import { titleCase } from 'utils/textUtils'
import { getNameMap, checkSelection, createWarning } from './warscrollUtils'
import { TSupportedFaction } from 'meta/factions'
import { TAllySelectionStore } from 'types/store'
import { IAllySelections } from 'types/selections'
import { TError } from 'types/warscrollTypes'

export const getAllyData = (
  allyUnits: string[],
  factionName: TSupportedFaction,
  errors: TError[]
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
      const unitsMap = getNameMap(units)

      const checkVal = checkSelection(units, unitsMap, errors, false)
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
        createWarning(
          `Allied ${unit} can belong to ${collisions[unit]
            .map(titleCase)
            .join(' or ')}. Please add this unit manually.`
        )
      )

      // Remove the unit from allySelections
      // And if that empties the array,
      // Remove the entry + remove it from allyFactionNames
      collisions[unit].forEach(faction => {
        ;(allyData.allySelections[faction] as IAllySelections).units = without(
          (allyData.allySelections[faction] as IAllySelections).units as string[],
          unit
        )
        if ((allyData.allySelections[faction] as IAllySelections).units.length === 0) {
          delete allyData.allySelections[faction]
          allyData.allyFactionNames = without(allyData.allyFactionNames, faction)
        }
      })
    }
  })

  return allyData
}
