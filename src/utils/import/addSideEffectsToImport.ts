import { uniq } from 'lodash'
import { IArmy } from 'types/army'
import { lowerToUpperLookup } from 'types/data'
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
  // Handle subfaction side effects
  const subFactionSideEffects = getSideEffects([Army.SubFaction])

  Object.entries(subFactionSideEffects[Army.SubFaction.name]).forEach(([slice, obj]) => {
    if (!selections[slice]) {
      if (isDev) {
        console.warn(
          `Invalid side effect key: '${slice}'. It probably is a typo in this subfaction's files: "${Army.SubFaction.name}"`
        )
        debugger // If you've arrived here (as a dev), you need to fix the above error - no excuses.
      }
      return // Ignore bad values
    }
    if (!obj?.values) return
    selections[slice] = uniq(selections[slice].concat(obj.values))
  })

  // Handle selection side effects
  const selectionSideEffects = Object.entries(lowerToUpperLookup).reduce((a, [k, v]) => {
    a[k] = getSideEffects(Army[v])
    return a
  }, {} as Record<TSelectionTypes, ISideEffectsPayload>)

  Object.keys(selectionSideEffects).forEach(slice => {
    const effectsObj = selectionSideEffects[slice as TSelectionTypes]

    selections[slice].forEach((name: string) => {
      if (!effectsObj[name]) return

      Object.keys(effectsObj[name]).forEach(effectSlice => {
        const values: string[] = effectsObj[name]?.[effectSlice]?.values || []

        if (!selections[effectSlice]) {
          if (isDev) {
            console.warn(
              `Invalid side effect key: '${effectSlice}'. It probably is a typo in this subfaction's files: "${Army.SubFaction.name}"`
            )
            debugger // If you've arrived here (as a dev), you need to fix the above error - no excuses.
          }
          return // Ignore bad values
        }

        selections[effectSlice] = uniq(selections[effectSlice].concat(values))
      })
    })
  })

  return selections
}
