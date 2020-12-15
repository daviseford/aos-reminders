import { uniq } from 'lodash'
import { IArmy } from 'types/army'
import { TSelections, TSelectionTypes } from 'types/selections'
import { isDev } from 'utils/env'
import { getSideEffects } from 'utils/getSideEffects'
import { ISideEffectsPayload } from 'utils/withSelect'

/**
 * Add side effects (such as spells, artifacts, etc) to our imported selections
 * @param selections
 * @param Army
 */
export const addSideEffectsToImport = (selections: TSelections, Army: IArmy): TSelections => {
  const sideEffects: Record<TSelectionTypes, ISideEffectsPayload> = {
    artifacts: getSideEffects(Army.Artifacts),
    battalions: getSideEffects(Army.Battalions),
    command_abilities: getSideEffects(Army.CommandAbilities),
    command_traits: getSideEffects(Army.CommandTraits),
    endless_spells: getSideEffects(Army.EndlessSpells),
    flavors: getSideEffects(Army.Flavors),
    mount_traits: getSideEffects(Army.MountTraits),
    prayers: getSideEffects(Army.Prayers),
    scenery: getSideEffects(Army.Scenery),
    spells: getSideEffects(Army.Spells),
    triumphs: getSideEffects(Army.Triumphs),
    units: getSideEffects(Army.Units),
  }

  Object.keys(sideEffects).forEach(slice => {
    const effectsObj = sideEffects[slice as TSelectionTypes]

    selections[slice].forEach((name: string) => {
      if (!effectsObj[name]) return

      Object.keys(effectsObj[name]).forEach(effectSlice => {
        const values: string[] = effectsObj[name]?.[effectSlice]?.values || []

        if (!selections[effectSlice]) {
          if (isDev) {
            console.warn(
              `Invalid side effect key: '${effectSlice}'. It probably is a typo in this subfaction's files: "${Army.SubFaction.name}"`
            )
            debugger // If you've arrived here, you need to fix the above error - no excuses.
          }
          return // Ignore bad values
        }

        selections[effectSlice] = uniq(selections[effectSlice].concat(values))
      })
    })
  })

  return selections
}
