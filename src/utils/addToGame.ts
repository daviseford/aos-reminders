import { TGameStructure } from 'meta/game_structure'
import { TTurnWhen } from 'types/phases'
import { ITurnAction } from 'types/data'

export const addToGame = (game: TGameStructure, when: TTurnWhen, entry: ITurnAction) => {
  game[when] = game[when] ? game[when].concat(entry) : [entry]
}
