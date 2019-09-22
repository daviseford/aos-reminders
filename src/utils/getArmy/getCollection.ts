import { sortBy, uniqBy } from 'lodash'
import { IInitialArmy, ICollection, TArtifacts, TBattalions, TCommands, TSpells, TTraits } from 'types/army'
import { TEffects, TEntry } from 'types/data'

/**
 * There are spells/artifacts/etc that only occur if a certain
 * allegiance/battalion/unit is selected. We want to make sure
 * that those are represented in the dropdowns.
 * @param army
 */
export const getCollection = (army: IInitialArmy): ICollection => {
  const {
    Allegiances = [],
    AlliedUnits = [],
    Artifacts = [],
    Battalions = [],
    Scenery = [],
    Traits = [],
    Units = [],
  } = army

  const Collection = {
    Artifacts: [] as TArtifacts,
    Battalions: [] as TBattalions,
    Commands: [] as TCommands,
    Spells: [] as TSpells,
    Traits: [] as TTraits,
  }

  // Brute force it
  const types = [Allegiances, AlliedUnits, Artifacts, Battalions, Scenery, Traits, Units]

  // Go through each thing and get spells, artifacts, etc that are unusual
  types.forEach(items =>
    items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.spell) {
          addToCollection(effect, Collection.Spells)
        } else if (effect.artifact) {
          addToCollection(effect, Collection.Artifacts)
        } else if (effect.command_trait) {
          addToCollection(effect, Collection.Traits)
        } else if (effect.command_ability) {
          addToCollection(effect, Collection.Commands)
        }
      })
    })
  )

  return {
    Artifacts: sortBy(Collection.Artifacts, 'name'),
    Battalions: sortBy(Collection.Battalions, 'name'),
    Commands: sortBy(Collection.Commands, 'name'),
    Spells: sortBy(Collection.Spells, 'name'),
    Traits: sortBy(Collection.Traits, 'name'),
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
  }
}
