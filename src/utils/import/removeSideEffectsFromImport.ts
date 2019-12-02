import { difference } from 'lodash'
import { IArmy } from 'types/army'
import { ISelections } from 'types/selections'

/**
 * Remove side effects (such as spells, artifacts, etc) from our imported selections
 * @param selections
 * @param Army
 */
export const removeSideEffectsFromImport = (selections: ISelections, Army: IArmy): ISelections => {
  // console.log(selections)
  // console.log(Army)

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
    selections[slice] = difference(selections[slice], SideEffects)
  })

  return selections
}
