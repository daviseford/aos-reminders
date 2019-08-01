import { TBattalions, TArtifacts, TUnits, TCommandTraits, TSpells, TEndlessSpells } from 'types/army'
import { addToGame } from './addToGame'
import { TGameStructure, Game } from 'meta/game_structure'

type entries = TBattalions | TArtifacts | TUnits

export const processGame = (entries: entries[]): TGameStructure => {
  const game = { ...Game }
  entries.forEach(e => processEntry(game, e))
  return game
}

const processEntry = (
  game: TGameStructure,
  arr: TBattalions | TArtifacts | TUnits | TCommandTraits | TSpells | TEndlessSpells
) => {
  arr.forEach(entry => {
    entry.effects.forEach(effect => {
      effect.when.forEach(w => {
        addToGame(game, w, {
          condition: entry.name,
          name: effect.name,
          desc: effect.desc,
          tag: effect.tag || false,
          allegiance_ability: effect.allegiance_ability || entry.allegiance_ability || false,
          artifact: effect.artifact || entry.artifact || false,
          command_ability: entry.command_ability || effect.command_ability || false,
          command_trait: entry.command_trait || effect.command_trait || false,
          endless_spell: entry.endless_spell || effect.endless_spell || false,
          spell: entry.spell || effect.spell || false,
        })
      })
    })
  })
}
