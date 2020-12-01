import { uniq } from 'lodash'
import { IArmy } from 'types/army'
import { TSelections, TSelectionTypes } from 'types/selections'
import { getSideEffects } from 'utils/getSideEffects'
import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'

type TSideEffectKeys = Record<
  Extract<TSelectionTypes, 'flavors' | 'battalions' | 'command_traits' | 'units'>,
  IWithSelectMultipleWithSideEffectsPayload
>

/**
 * Add side effects (such as spells, artifacts, etc) to our imported selections
 * @param selections
 * @param Army
 */
export const addSideEffectsToImport = (selections: TSelections, Army: IArmy): TSelections => {
  const sideEffects: TSideEffectKeys = {
    flavors: getSideEffects(Army.Flavors),
    battalions: getSideEffects(Army.Battalions),
    command_traits: getSideEffects(Army.CommandTraits),
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
