import { ITurnAction, TGameStructure } from 'meta/turn_structure'
import { TTurnWhen } from 'types/phases'

export const addToGame = (game: TGameStructure, when: TTurnWhen, entry: ITurnAction) => {
  game[when] = game[when] ? game[when].concat(entry) : [entry]
}
