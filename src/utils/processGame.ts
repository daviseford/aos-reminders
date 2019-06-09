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
  arr.forEach(x => {
    x.effects.forEach(e => {
      e.when.forEach(w => {
        addToGame(game, w, {
          condition: x.name,
          name: e.name || x.name,
          action: e.desc,
        })
      })
    })
  })
}
