import { BATTLESHOCK_PHASE, END_OF_TURN, TURN_ONE_START_OF_ROUND, START_OF_ROUND } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Bad Moon Loonshrine: Loonatic Courage`,
    desc: `GLOOMSPITE GITZ units wholly within 12" of the Bad Moon Loonshrine do not take battleshock tests.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Bad Moon Loonshrine: Moonclan Lairs`,
    desc: `At the end of each of your turns, you can pick 1 friendly STABBAS or SHOOTAS unit that has been destroyed. If you do so, roll a dice. On a 4+ a new replacement unit with half of the models from the unit that was destroyed (rounding fractions up) is added to your army. You must set up the replacement unit wholly within 12" of a friendly BAD MOON LOONSHRINE, and more than 3" from any enemy units. Each destroyed unit can only be replaced once – replacement units cannot themselves be replaced.`,
    when: [END_OF_TURN],
  },
  {
    name: `Bad Moon Setup`,
    desc: `At the start of the first battle round, before determining who has the first turn, the player commanding the Gloomspite Gitz army must pick one corner of the battlefield as the starting location of the Bad Moon. If both players have Gloomspite Gitz armies, then they must roll off and the winner picks the starting location. The Bad Moon is located at the edge of the battlefield in that corner.`,
    when: [TURN_ONE_START_OF_ROUND],
  },
  {
    name: `Bad Moon Movement`,
    desc: `Starting from the second battle round, before determining who has the first turn, the player commanding the Gloomspite Gitz army must roll a dice. On a 1 the Bad Moon does not move. On a 2-5 it makes 1 move. On a 6 it makes 2 moves.`,
    when: [START_OF_ROUND],
  },
]

export default Abilities
