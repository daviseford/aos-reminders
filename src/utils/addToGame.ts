import { ITurnAction } from 'meta/turn_structure'

export const addToGame = (game, when: string, entry: ITurnAction) => {
  game[when] = game[when] ? [...game[when], entry] : [entry]
}
