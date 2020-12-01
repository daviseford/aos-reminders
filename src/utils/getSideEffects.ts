import { uniq } from 'lodash'
import { TEntry, TEntryProperties } from 'types/data'
import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'

export const getSideEffects = (items: TEntry[]) => {
  const Collection = items.reduce((accum, item) => {
    accum[item.name] = {}
    item.effects.forEach(effect => {
      if (effect.spell || effect.prayer) {
        addToAccum(accum, item.name, effect.name, 'spell')
      } else if (effect.artifact) {
        addToAccum(accum, item.name, effect.name, 'artifact')
      } else if (effect.command_trait) {
        addToAccum(accum, item.name, effect.name, 'command_trait')
      } else if (effect.command_ability) {
        addToAccum(accum, item.name, effect.name, 'command_ability')
      }
    })
    return accum
  }, {} as IWithSelectMultipleWithSideEffectsPayload)

  return Collection
}

const addToAccum = (
  accum: IWithSelectMultipleWithSideEffectsPayload,
  itemName: string,
  effectName: string,
  type: TEntryProperties
) => {
  const obj = accum[itemName][type] || {}
  const values = obj.values || []
  accum[itemName][type] = { values: uniq(values.concat(effectName)) }
}
