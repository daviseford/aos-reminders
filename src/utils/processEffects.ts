import { TBattalions, TArtifacts, TUnits } from 'types/army'
import { addToGame } from './addToGame'
import { TGameStructure } from 'meta/turn_structure'

type entries = TBattalions | TArtifacts | TUnits

export const processEffects = (game: TGameStructure, entries: entries[]) => {
  entries.forEach(e => processEntry(game, e))
}

const processEntry = (game: TGameStructure, arr: TBattalions | TArtifacts | TUnits) => {
  arr.forEach(x => {
    x.effects.forEach(e => {
      addToGame(game, e.when, {
        condition: [x.name],
        name: e.name || x.name,
        action: e.desc,
      })
    })
  })
}
