import { tagAs } from 'factions/metatagger'
import { START_OF_ROUND, TURN_ONE_START_OF_ROUND } from 'types/phases'

const BattleTraits = {
  'Gloomspite Gitz': {
    effects: [
      {
        name: `Bad Moon Setup`,
        desc: `At the start of the first battle round, before determining who has the first turn, the player commanding the Gloomspite Gitz army must pick one corner of the battlefield as the starting location of the Bad Moon. If both players have Gloomspite Gitz armies, then they must roll off and the winner picks the starting location. The Bad Moon is located at the edge of the battlefield in that corner.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Bad Moon Movement`,
        desc: `Starting from the second battle round, before determining who has the first turn, the player commanding the Gloomspite Gitz army must roll a D6. On a 1 the Bad Moon does not move. On a 2-5 it makes 1 move. On a 6 it makes 2 moves.`,
        when: [START_OF_ROUND],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
