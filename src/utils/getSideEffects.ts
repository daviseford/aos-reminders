import { mergeParentEffectObjs } from 'factions/temporaryAdapter'
import { uniq } from 'lodash'
import { TEffects, TEntry, TEntryProperties } from 'types/data'
import { TSelectionTypes } from 'types/selections'
import { ISideEffectsPayload } from 'utils/withSelect'

export const getSideEffects = (items: TEntry[]) => {
  const Collection = items?.reduce((accum, item) => {
    accum[item.name] = {}

    // We like using mandatory (and we will probably ONLY do this in the future)
    checkForMandatory(item, accum, item.name)

    // We don't like doing it this way!
    item.effects.forEach(effect => checkEffects(effect, item.name, accum))

    return accum
  }, {} as ISideEffectsPayload)

  return Collection
}

const entryKeyToSelectionsKey: Record<Exclude<TEntryProperties, 'battle_trait'>, TSelectionTypes> = {
  artifact: 'artifacts',
  battalion: 'battalions',
  command_ability: 'command_abilities',
  command_trait: 'command_traits',
  endless_spell: 'endless_spells',
  mount_trait: 'mount_traits',
  prayer: 'prayers',
  scenery: 'scenery',
  spell: 'spells',
  triumph: 'triumphs',
  unit: 'units',
}

const checkEffects = (effect: TEffects, itemName: string, accum: ISideEffectsPayload) => {
  let addedToAccum = false

  Object.keys(entryKeyToSelectionsKey).forEach(key => {
    if (addedToAccum) return
    if (effect[key]) {
      addToAccum(accum, itemName, effect.name, entryKeyToSelectionsKey[key])
      addedToAccum = true
    }
  })
}

const addToAccum = (
  accum: ISideEffectsPayload,
  itemName: string,
  effectName: string,
  type: TSelectionTypes
) => {
  if (!accum[itemName]) accum[itemName] = { [type]: {} }
  const obj = accum[itemName][type] || { values: [] }
  const values = obj.values || []
  accum[itemName][type] = { values: uniq(values.concat(effectName)) }
}

/**
 * A recursive function that checks for all children's mandatory keys
 * Probably not very good for performance... This is why Google won't hire me.
 *
 * @param item
 * @param accum
 * @param accumKey - Where should we save these sideEffects in accum? - aka item.name
 */
const checkForMandatory = (item: TEntry, accum: ISideEffectsPayload, accumKey: string) => {
  if (!item.mandatory) return

  Object.keys(item.mandatory).forEach(sliceKey => {
    let key = sliceKey as TSelectionTypes

    const slice = item?.mandatory?.[key]
    if (!slice || !slice.length) return

    const mergedEntries = mergeParentEffectObjs(slice)

    mergedEntries.forEach(_entry => {
      addToAccum(accum, accumKey, _entry.name, key)
      if (_entry.mandatory) checkForMandatory(_entry, accum, accumKey)
    })
  })
}
