import { TGameStructure } from 'meta/game_structure'
import { TTurnWhen } from 'types/phases'
import { TTurnAction } from 'types/data'

export const addToGame = (game: TGameStructure, when: TTurnWhen, entry: TTurnAction) => {
  game[when] = game[when] ? game[when].concat(entry) : [entry]
}
