import { TEntry } from 'types/data'
import { BATTLESHOCK_PHASE, END_OF_TURN, START_OF_SETUP } from 'types/phases'

const Scenery: TEntry[] = [
  {
    name: `Bad Moon Loonshrine`,
    effects: [
      {
        name: `Bad Moon Loonshrine`,
        desc: `After territories have been chosen but before armies are set up, you can set up the BAD MOON LOONSHRINE wholly within your territory, more than 12" from enemy territory and more than 1" from any other terrain features.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Swarms of Lair Lurkers`,
        desc: `If your general has the SQUIG keyword, after you set up this terrain feature, you can replace its Moonclan Lairs ability with:

        'At the end of each of your turns, you can pick 1 friendly SQUIG HERD, SQUIG HOPPERS, or BOINGROT BOUNDERZ unit that has been destroyed. If you do so, roll a D6. On a 4+, a new replacement unit with half of the models from the unit that was destroyed (rounding fractions up) is added to your army. You must set up the replacement unit wholly within 12" of a friendly BAD MOON LOONSHRINE and more than 3" from any enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.'`,
        when: [START_OF_SETUP, END_OF_TURN],
      },
      {
        name: `Loonatic Courage`,
        desc: `GLOOMSPITE GITZ units wholly within 12" of the BAD MOON LOONSHRINE do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Moonclan Lairs`,
        desc: `At the end of each of your turns, you can pick 1 friendly STABBAS or SHOOTAS unit that has been destroyed. If you do so, roll a D6. On a 4+ a new replacement unit with half of the models from the unit that was destroyed (rounding fractions up) is added to your army. You must set up the replacement unit wholly within 12" of a friendly BAD MOON LOONSHRINE, and more than 3" from any enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [END_OF_TURN],
        tag: `Non-TROGGOTH general`,
      },
      {
        name: `Hidden Troggholes`,
        desc: `At the end of each of your turns, yo can pick 1 friendly FELLWATER TROGGOTH or ROCKGUT TROGGOTH unit that has been destroyed. If you do so, roll a D6. On a 4+, a new replacement unit with half of the models from the unit that was destroyed (rounding fractions up) is added to your army. You must set up the replacement unit wholly within 12" of a friendly BAD MOON LOONSHRINE and more than 3" from any enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [END_OF_TURN],
        tag: `TROGGOTH general`,
      },
    ],
  },
]

export default Scenery
