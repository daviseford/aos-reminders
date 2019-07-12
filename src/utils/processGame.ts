import { TBattalions, TArtifacts, TUnits } from 'types/army'
import { addToGame } from './addToGame'
import { TGameStructure, Game } from 'meta/turn_structure'

type entries = TBattalions | TArtifacts | TUnits

export const processGame = (entries: entries[]): TGameStructure => {
  const game = { ...Game }
  entries.forEach(e => processEntry(game, e))
  return game
}

const processEntry = (game: TGameStructure, arr: TBattalions | TArtifacts | TUnits) => {
  arr.forEach(entry => {
    entry.effects.forEach(effect => {
      effect.when.forEach(w => {
        addToGame(game, w, {
          condition: entry.name,
          name: effect.name,
          desc: effect.desc,
          tag: effect.tag || '',
          allegiance_ability: effect.allegiance_ability || false,
          artifact: effect.artifact || entry.artifact || false,
          command_ability: effect.command || false,
          command_trait: entry.command_ability || false,
        })
      })
    })
  })
}
