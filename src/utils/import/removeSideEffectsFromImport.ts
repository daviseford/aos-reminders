import { difference } from 'lodash'
import { IArmy } from 'types/army'
import { lowerToUpperLookup } from 'types/data'
import { TImportParsers } from 'types/import'
import { TSelections, TSelectionTypes } from 'types/selections'
import { logIgnoredImport } from 'utils/analytics'

/**
 * Remove side effects (such as spells, artifacts, etc) from our imported selections
 * @param selections
 * @param Army
 * @param parser
 */
export const removeSideEffectsFromImport = (
  selections: TSelections,
  Army: IArmy,
  parser: TImportParsers
): TSelections => {
  Object.keys(selections).forEach(slice => {
    let _slice = slice as TSelectionTypes
    // Store the previous state of our selections
    const previous: string[] = [...selections[_slice]]

    // Get an array of effect names that are side effects from the Army
    const SideEffects = Army[lowerToUpperLookup[_slice]].filter(x => x.isSideEffect).map(x => x.name)

    // Update our _slice of selections to NOT include any side effects
    selections[_slice] = difference(previous, SideEffects)

    // And then get a list of ignored side effects and send them to GA
    const removed = difference(previous, selections[_slice])
    removed.forEach(s => logIgnoredImport(s, parser))
  })

  return selections
}
