import { ITurnAction } from 'meta/turn_structure'

export const addToGame = (game, when: string[], entry: ITurnAction) => {
  if (when.length === 1) {
    game[when[0]] = game[when[0]] ? [...game[when[0]], entry] : [entry]
  } else {
    game[when[0]] = game[when[0]] ? game[when[0]] : { [when[1]]: [] }
    game[when[0]][when[1]] = [...game[when[0]][when[1]], entry]
  }
}
