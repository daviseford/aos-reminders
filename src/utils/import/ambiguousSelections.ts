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
  selections: Record<string, string[]>,
  allyData: { allyFactionNames: TSupportedFaction[]; allySelections: TAllySelectionStore },
  ambiguousNamesMap: TNameMap
) => {
  const flatAllySelections = Object.values(allyData.allySelections)
    .map(x => (x ? x.units : []))
    .flat()

  const flatSelections = Object.values(selections).concat(flatAllySelections).flat()
  flatSelections.forEach(selection => {
    const match = ambiguousNamesMap[selection]
    if (match) {
      errors.push(
        createAmbiguityWarning(
          `Azyr lists more than one unit as '${match}'. Please check that we have imported the correct one.`
        )
      )
    }
  })
}
