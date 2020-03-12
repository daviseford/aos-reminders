import { uniq } from 'lodash'
import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'
import { TEntry } from 'types/data'

export const getSideEffects = (items: TEntry[]) => {
  const Collection = items.reduce((accum, item) => {
    accum[item.name] = {}
    item.effects.forEach(effect => {
      if (effect.spell || effect.prayer) {
        addToAccum(accum, item.name, effect.name, 'spells')
      } else if (effect.artifact) {
        addToAccum(accum, item.name, effect.name, 'artifacts')
      } else if (effect.command_trait) {
        addToAccum(accum, item.name, effect.name, 'traits')
      } else if (effect.command_ability) {
        addToAccum(accum, item.name, effect.name, 'commands')
      }
    })
    if (item.entries) {
      item.entries.forEach(entry => {
        addToAccum(accum, item.name, entry.name, 'units')
      })
    }
    return accum
  }, {} as IWithSelectMultipleWithSideEffectsPayload)

  return Collection
}

const addToAccum = (
  accum: IWithSelectMultipleWithSideEffectsPayload,
  itemName: string,
  effectName: string,
  type: string
) => {
  const obj = accum[itemName][type] || {}
  const values = obj.values || []
  accum[itemName][type] = { values: uniq(values.concat(effectName)) }
}
