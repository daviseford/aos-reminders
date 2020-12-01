import { difference } from 'lodash'
import { IArmy } from 'types/army'
import { TEntry } from 'types/data'
import { TImportParsers } from 'types/import'
import { TSelections, TSelectionTypes } from 'types/selections'
import { logIgnoredImport } from 'utils/analytics'

type TLookup = Record<TSelectionTypes, Partial<keyof IArmy>>

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
  const lookup: TLookup = {
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    command_abilities: 'CommandTraits',
    command_traits: 'CommandTraits',
    endless_spells: 'EndlessSpells',
    flavors: 'Flavors',
    scenery: 'Scenery',
    spells: 'Spells',
    triumphs: 'Triumphs',
    units: 'Units',
  }
  Object.keys(selections).forEach(slice => {
    // Store the previous state of our selections
    const previous: string[] = [...selections[slice]]

    // Get an array of effect names that are side effects from the Army
    const SideEffects = (Army[lookup[slice]] as TEntry[]).filter(x => x.isSideEffect).map(x => x.name)

    // Update our slice of selections to NOT include any side effects
    selections[slice] = difference(previous, SideEffects)

    // And then get a list of ignored side effects and send them to GA
    const removed = difference(previous, selections[slice])
    removed.forEach(s => logIgnoredImport(s, parser))
  })

  return selections
}
