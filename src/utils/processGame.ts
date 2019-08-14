import { TBattalions, TArtifacts, TUnits, TTraits, TSpells, TEndlessSpells, TAllegiances } from 'types/army'
import { addToGame } from './addToGame'
import { TGameStructure, Game } from 'meta/game_structure'
import { TEntry, TEffects, TTurnAction, ENTRY_PROPERTIES } from 'types/data'

type TEntries = TAllegiances | TArtifacts | TBattalions | TEndlessSpells | TSpells | TTraits | TUnits

export const processGame = (entries: TEntries[]): TGameStructure => {
  const game = { ...Game }
  entries.forEach(e => processEntry(game, e))
  return game
}

const processEntry = (game: TGameStructure, entries: TEntries): void => {
  entries.forEach(entry => {
    const withEntry = addProps(entry)
    entry.effects.forEach(effect => {
      const action = withEntry(effect)
      effect.when.forEach(phase => addToGame(game, phase, action))
    })
  })
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
