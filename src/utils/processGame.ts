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

const processEntry = (game: TGameStructure, entries: TEntries) => {
  entries.forEach(entry => {
    entry.effects.forEach(effect => {
      effect.when.forEach(w => addToGame(game, w, addProps(entry, effect)))
    })
  })
}

/**
 * Using this function, we avoid attaching two or more EntryProperties to an action
 * @param entry
 * @param effect
 */
const addProps = (entry: TEntry, effect: TEffects): TTurnAction => {
  const action: TTurnAction = {
    condition: entry.name,
    name: effect.name,
    desc: effect.desc,
    tag: effect.tag || false,
  }

  // Gotta figure out if an effects key is true
  const effectProp = ENTRY_PROPERTIES.find(k => effect[k] === true)
  if (effectProp) {
    return {
      ...action,
      [effectProp]: true,
    }
  }

  // If not, figure out if an entry key is true
  const entryProp = ENTRY_PROPERTIES.find(k => entry[k] === true)
  if (entryProp) {
    return {
      ...action,
      [entryProp]: true,
    }
  }

  // Otherwise, just return (it's probably a unit or battalion)
  return action
}
