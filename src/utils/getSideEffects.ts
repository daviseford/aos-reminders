import { mergeParentEffectObjs } from 'factions/temporaryAdapter'
import { uniq } from 'lodash'
import { TEffects, TEntry } from 'types/data'
import { TSelectionTypes } from 'types/selections'
import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'

export const getSideEffects = (items: TEntry[]) => {
  const Collection = items.reduce((accum, item) => {
    accum[item.name] = {}

    if (item.mandatory) {
      Object.keys(item.mandatory).forEach(sliceKey => {
        let key = sliceKey as TSelectionTypes

        const slice = item?.mandatory?.[key]
        if (!slice || !slice.length) return

        const mergedEntries = mergeParentEffectObjs(slice)

        mergedEntries.forEach(_entry => {
          addToAccum(accum, item.name, _entry.name, key)
        })
      })
    }

    // We don't like doing it this way!
    item.effects.forEach(effect => checkEffects(effect, item.name, accum))
    return accum
  }, {} as IWithSelectMultipleWithSideEffectsPayload)

  return Collection
}

const checkEffects = (
  effect: TEffects,
  itemName: string,
  accum: IWithSelectMultipleWithSideEffectsPayload
) => {
  if (effect.spell || effect.prayer) {
    addToAccum(accum, itemName, effect.name, 'spells')
  } else if (effect.artifact) {
    addToAccum(accum, itemName, effect.name, 'artifacts')
  } else if (effect.command_trait) {
    addToAccum(accum, itemName, effect.name, 'command_traits')
  } else if (effect.command_ability) {
    addToAccum(accum, itemName, effect.name, 'command_abilities')
  }
}

const addToAccum = (
  accum: IWithSelectMultipleWithSideEffectsPayload,
  itemName: string,
  effectName: string,
  type: TSelectionTypes
) => {
  if (!accum[itemName]) accum[itemName] = { [type]: {} }
  const obj = accum[itemName][type] || { values: [] }
  const values = obj.values || []
  accum[itemName][type] = { values: uniq(values.concat(effectName)) }
}
