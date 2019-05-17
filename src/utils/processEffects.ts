import { IBattalions, IArtifacts, IUnits } from 'types/army'
import { addToGame } from './addToGame'

type entries = IBattalions | IArtifacts | IUnits

export const processEffects = (game, entries: entries[]) => {
  entries.forEach(e => processEntry(game, e))
}

const processEntry = (game, obj: IBattalions | IArtifacts | IUnits) => {
  Object.values(obj).forEach(x => {
    x.effects.forEach(e => {
      addToGame(game, e.when, {
        condition: [x.name],
        name: e.name,
        action: e.desc,
      })
    })
  })
}
