import { IArmy } from 'types/army'
import { ISelections } from 'types/selections'
import { mapListToDict } from 'utils/mapListToDict'

/**
 * Remove side effects (such as spells, artifacts, etc) to our imported selections
 * @param selections
 * @param Army
 */
export const removeSideEffectsFromImport = (selections: ISelections, Army: IArmy): ISelections => {
  console.log(selections)
  console.log(Army)

  const lookup = {
    allegiances: 'Allegiances',
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    endless_spells: 'EndlessSpells',
    spells: 'Spells',
    traits: 'Traits',
    units: 'Units',
  }
  Object.keys(selections).forEach(slice => {
    const Names: string[] = Army[lookup[slice]].map(({ name }) => name)
    const NameMap = mapListToDict(Names)
    console.log(NameMap)
  })

  return selections
}
