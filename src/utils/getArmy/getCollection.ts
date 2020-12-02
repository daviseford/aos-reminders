import { sortBy, uniqBy } from 'lodash'
import { TCollection, TInitialArmy } from 'types/army'
import { TEffects, TEntry } from 'types/data'

/**
 * There are spells/artifacts/etc that only occur if a certain
 * allegiance/battalion/unit is selected. We want to make sure
 * that those are represented in the dropdowns.
 * @param army
 */
export const getCollection = (army: TInitialArmy): TCollection => {
  const {
    AlliedUnits = [],
    Artifacts = [],
    Battalions = [],
    CommandTraits = [],
    Flavors = [],
    Scenery = [],
    Units = [],
  } = army

  const Collection: TCollection = {
    Artifacts: [],
    Battalions: [],
    CommandAbilities: [],
    Spells: [],
    CommandTraits: [],
  }

  // Brute force it
  const types = [Flavors, AlliedUnits, Artifacts, Battalions, Scenery, CommandTraits, Units]

  // Go through each thing and get spells, artifacts, etc that are unusual
  types.forEach(items =>
    items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.spell || effect.prayer) {
          addToCollection(effect, Collection.Spells)
        } else if (effect.artifact) {
          addToCollection(effect, Collection.Artifacts)
        } else if (effect.command_trait) {
          addToCollection(effect, Collection.CommandTraits)
        } else if (effect.command_ability) {
          addToCollection(effect, Collection.CommandAbilities)
        }
      })
    })
  )

  return {
    Artifacts: sortBy(Collection.Artifacts, 'name'),
    Battalions: sortBy(Collection.Battalions, 'name'),
    CommandAbilities: sortBy(Collection.CommandAbilities, 'name'),
    CommandTraits: sortBy(Collection.CommandTraits, 'name'),
    Spells: sortBy(Collection.Spells, 'name'),
  }
}

const addToCollection = (effect: TEffects, collection: TEntry[]): void => {
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
