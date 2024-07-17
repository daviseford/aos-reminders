import { mergeParentEffectObjs } from 'factions/temporaryAdapter'
import { isString, sortBy, uniqBy } from 'lodash'
import { IArmy, TCollection, TInitialArmy } from 'types/army'
import { entryKeyToSelectionsKey, lowerToUpperLookup, TEffects, TEntry } from 'types/data'
import { getTagFromEntry } from 'utils/getTag'

/**
 * There are spells/artifacts/etc that only occur if a certain
 * allegiance/battalion/unit is selected. We want to make sure
 * that those are represented in the dropdowns.
 * @param army
 */
export const getCollection = (army: TInitialArmy): TCollection => {
  const Collection: TCollection = {
    Artifacts: [],
    Battalions: [],
    BattleTactics: [],
    CommandAbilities: [],
    CommandTraits: [],
    CoreRules: [],
    EndlessSpells: [],
    Flavors: [],
    GrandStrategies: [],
    Incarnates: [],
    MonstrousRampages: [],
    MountTraits: [],
    Prayers: [],
    Scenery: [],
    Spells: [],
    Triumphs: [],
    Units: [],
  }

  if (!army) return Collection

  // Brute force it
  const types = [
    army.AlliedUnits || [],
    army.Artifacts || [],
    army.Battalions || [],
    army.BattleTactics || [],
    army.CommandAbilities || [],
    army.CommandTraits || [],
    army.CoreRules || [],
    army.EndlessSpells || [],
    army.Flavors || [],
    army.GrandStrategies || [],
    army.Incarnates || [],
    army.MonstrousRampages || [],
    army.MountTraits || [],
    army.Prayers || [],
    army.Scenery || [],
    army.Spells || [],
    army.Triumphs || [],
    army.Units || [],
  ]

  // Go through each thing and get spells, artifacts, etc that are unusual
  // TODO: Get rid of this?
  // Might need to keep it as a backup in case people don't use the new data structure correctly
  types.forEach(items =>
    items?.forEach(item => {
      item.effects.forEach(effect => checkEffects(effect, Collection))
    })
  )

  // This is now our preferred way of checking for side effects/mandatory items
  const checkForMandatoryItems = (entry?: TEntry): void => {
    if (!entry?.mandatory) return

    Object.keys(entry.mandatory).forEach(sliceKey => {
      const slice = entry?.mandatory?.[sliceKey as keyof TEntry]
      if (!slice || !slice.length) return

      const mergedEntries = mergeParentEffectObjs(slice)

      mergedEntries.forEach(_entry => {
        const { effects } = _entry as TEntry
        const _tag = getTagFromEntry(_entry)
        const upperSlice = isString(slice)
          ? lowerToUpperLookup[slice]
          : _tag
            ? lowerToUpperLookup[entryKeyToSelectionsKey[_tag]]
            : undefined

        effects.forEach(effect => checkEffects(effect, Collection, upperSlice))
      })
    })
  }

  // Check the subfaction, and then each group of items beneath it
  checkForMandatoryItems(army.SubFaction)
  types.forEach(x => x?.forEach(checkForMandatoryItems))

  return {
    Artifacts: sortBy(Collection.Artifacts, 'name'),
    Battalions: sortBy(Collection.Battalions, 'name'),
    BattleTactics: sortBy(Collection.BattleTactics, 'name'),
    CommandAbilities: sortBy(Collection.CommandAbilities, 'name'),
    CommandTraits: sortBy(Collection.CommandTraits, 'name'),
    CoreRules: sortBy(Collection.CoreRules, 'name'),
    EndlessSpells: sortBy(Collection.EndlessSpells, 'name'),
    Flavors: sortBy(Collection.Flavors, 'name'),
    GrandStrategies: sortBy(Collection.GrandStrategies, 'name'),
    Incarnates: sortBy(Collection.Incarnates, 'name'),
    MonstrousRampages: sortBy(Collection.MonstrousRampages, 'name'),
    MountTraits: sortBy(Collection.MountTraits, 'name'),
    Prayers: sortBy(Collection.Prayers, 'name'),
    Scenery: sortBy(Collection.Scenery, 'name'),
    Spells: sortBy(Collection.Spells, 'name'),
    Triumphs: sortBy(Collection.Triumphs, 'name'),
    Units: sortBy(Collection.Units, 'name'),
  }
}

const checkEffects = (effect: TEffects, Collection: TCollection, forceKey?: keyof IArmy) => {
  let stopped = false

  Object.entries(lowerToUpperLookup).forEach(([key, value]) => {
    if (stopped || !effect[key]) return
    addToCollection(effect, Collection[value])
    stopped = true
  })

  // We can't trust "Units" - this will cause a bug if you remove this check.
  if (!stopped && forceKey && forceKey !== 'Units') {
    addToCollection(effect, Collection[forceKey])
  }
}

const addToCollection = (effect: TEffects, collection: TEntry[] = []): void => {
  const existingIdx = collection.findIndex(x => x.name === effect.name)
  if (existingIdx > -1) {
    const existingEntry = { ...collection[existingIdx] }
    const effects = uniqBy([...existingEntry.effects, effect], 'name')
    collection[existingIdx] = { ...existingEntry, effects }
  } else {
    collection.push(effectToEntry(effect))
  }
}

const effectToEntry = (effect: TEffects): TEntry => {
  return {
    name: effect.name,
    effects: [effect],
    isSideEffect: true,
  }
}
