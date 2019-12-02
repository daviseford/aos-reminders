import { difference } from 'lodash'
import { IArmy } from 'types/army'
import { TImportParsers } from 'types/import'
import { ISelections } from 'types/selections'
import { logIgnoredImport } from 'utils/analytics'
import { TEntry } from 'types/data'

/**
 * Remove side effects (such as spells, artifacts, etc) from our imported selections
 * @param selections
 * @param Army
 * @param parser
 */
export const removeSideEffectsFromImport = (
  selections: ISelections,
  Army: IArmy,
  parser: TImportParsers
): ISelections => {
  const lookup = {
    allegiances: 'Allegiances',
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    commands: 'Commands',
    endless_spells: 'EndlessSpells',
    scenery: 'Scenery',
    spells: 'Spells',
    traits: 'Traits',
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
