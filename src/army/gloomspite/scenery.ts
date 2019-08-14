import { TScenery } from 'types/army'
import { BATTLESHOCK_PHASE, END_OF_TURN } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Bad Moon Loonshrine`,
    effects: [
      {
        name: `Loonatic Courage`,
        desc: `GLOOMSPITE GITZ units wholly within 12" of the Bad Moon Loonshrine do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Moonclan Lairs`,
        desc: `At the end of each of your turns, you can pick 1 friendly STABBAS or SHOOTAS unit that has been destroyed. If you do so, roll a dice. On a 4+ a new replacement unit with half of the models from the unit that was destroyed (rounding fractions up) is added to your army. You must set up the replacement unit wholly within 12" of a friendly BAD MOON LOONSHRINE, and more than 3" from any enemy units. Each destroyed unit can only be replaced once – replacement units cannot themselves be replaced.`,
        when: [END_OF_TURN],
      },
    ],
  },
]

export default Scenery
