import { uniq } from 'lodash'
import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'
import { getSideEffects } from 'components/input/getSideEffects'
import { IArmy } from 'types/army'
import { ISelections } from 'types/selections'

/**
 * Add side effects (such as spells, artifacts, etc) to our imported selections
 * @param selections
 * @param Army
 */
export const addSideEffectsToImport = (selections: ISelections, Army: IArmy): ISelections => {
  const sideEffects = {
    allegiances: getSideEffects(Army.Allegiances),
    battalions: getSideEffects(Army.Battalions),
    units: getSideEffects(Army.Units),
  }

  Object.keys(sideEffects).forEach(slice => {
    const effectsObj = sideEffects[slice] as IWithSelectMultipleWithSideEffectsPayload

    selections[slice].forEach((name: string) => {
      if (!effectsObj[name]) return

      Object.keys(effectsObj[name]).forEach(effectSlice => {
        const values: string[] = effectsObj[name][effectSlice].values || []
        selections[effectSlice] = uniq(selections[effectSlice].concat(values))
      })
    })
  })

  return selections
}
