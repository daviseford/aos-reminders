import { ITurnAction, TGameStructure } from 'meta/turn_structure'
import { TTurnWhen } from 'types/phases'

export const addToGame = (game: TGameStructure, when: TTurnWhen, entry: ITurnAction) => {
  if (!game[when]) {
    game[when] = [entry]
  } else if (!game[when].some(x => x.name === entry.name)) {
    game[when] = [...game[when], entry]
  }
}
