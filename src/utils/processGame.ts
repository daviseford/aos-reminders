import { flatten } from 'lodash'
import { TBattalions, TArtifacts, TUnits, TTraits, TSpells, TEndlessSpells, TAllegiances } from 'types/army'
import { TGameStructure, Game } from 'meta/game_structure'
import { TEntry, TEffects, TTurnAction, ENTRY_PROPERTIES } from 'types/data'

type TEntries = TAllegiances | TArtifacts | TBattalions | TEndlessSpells | TSpells | TTraits | TUnits

export const processGame = (allEntries: TEntries[]): TGameStructure => {
  const entries = flatten(allEntries)

  return entries.reduce(
    (game, entry: TEntry) => {
      const withEntry = addProps(entry)
      entry.effects.forEach(effect => {
        const action = withEntry(effect)
        effect.when.forEach(phase => {
          game[phase] = game[phase] ? game[phase].concat(action) : [action]
        })
      })
      return game
    },
    { ...Game } as TGameStructure
  )
}

/**
 * Using this function, we avoid attaching two or more Props to an action
 * @param entry
 * @param effect
 */
const addProps = (entry: TEntry) => {
  // Figure out if an entry key is true and store it for now
  const entryProp = ENTRY_PROPERTIES.find(k => entry[k] === true)

  return (effect: TEffects): TTurnAction => {
    const action: TTurnAction = {
      condition: entry.name,
      name: effect.name,
      desc: effect.desc,
      tag: effect.tag || false,
    }

    // Figure out if an effects key is true
    const effectProp = ENTRY_PROPERTIES.find(k => effect[k] === true)
    if (effectProp) {
      return {
        ...action,
        [effectProp]: true,
      }
    }

    // It's probably a unit or battalion if there's no entryProp
    if (!entryProp) return action

    // Add the entryProp and return
    return {
      ...action,
      [entryProp]: true,
    }
  }
}
