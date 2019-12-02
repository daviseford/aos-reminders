import { difference } from 'lodash'
import { IArmy } from 'types/army'
import { TImportParsers } from 'types/import'
import { ISelections } from 'types/selections'
import { logIgnoredImport } from 'utils/analytics'

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
    const SideEffects: (boolean | undefined)[] = Army[lookup[slice]]
      .filter(x => x.fromEffect)
      .map(x => x.name)
    const previous = selections[slice]
    selections[slice] = difference(previous, SideEffects)
    const removed: string[] = difference(previous, selections[slice])
    removed.forEach(s => logIgnoredImport(s, parser))
  })

  return selections
}
