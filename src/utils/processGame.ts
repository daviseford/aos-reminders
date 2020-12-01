import { flatten } from 'lodash'
import { Game, TGameStructure } from 'meta/game_structure'
import {
  TArtifacts,
  TBattalions,
  TCommandTraits,
  TEndlessSpells,
  TFlavors,
  TSpells,
  TUnits,
} from 'types/army'
import { ENTRY_PROPERTIES, TEffects, TEntry, TTurnAction } from 'types/data'
import { TTurnWhen } from 'types/phases'
import { hashReminder } from 'utils/reminderUtils'

type TEntries = TFlavors | TArtifacts | TBattalions | TEndlessSpells | TSpells | TCommandTraits | TUnits

export const processGame = (allEntries: TEntries[]): TGameStructure => {
  const entries = flatten(allEntries)

  return entries.reduce(
    (game, entry: TEntry) => {
      const withEntry = addProps(entry)
      entry.effects.forEach(effect => {
        effect.when.forEach(phase => {
          const action = withEntry(effect, phase)
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

  return (effect: TEffects, when: TTurnWhen): TTurnAction => {
    const action: TTurnAction = {
      id: hashReminder(when, effect.name, effect.desc),
      condition: [entry.name],
      name: effect.name,
      desc: effect.desc,
      tag: effect.tag || false,
      when,
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
