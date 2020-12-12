import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandAbilities = {
  'Burning Skies': {
    effects: [
      {
        name: `Burning Skies`,
        desc: `In the movement phase, if an enemy unit can fly and moves more than 6", roll a D6. On a 4+ the enemy unit suffers 1 mortal wound. On a 6+ it suffers D3 mortal wounds instead.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Lord of the Black Fortress': {
    effects: [
      {
        name: `Lord of the Black Fortress`,
        desc: `You can use this command ability at the start of the battleshock phase if this model is on the battlefield. If you do so, do not take battleshock tests for friendly Legion of Azgorh units while they are wholly within 24" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Lord of the Ba`hal': {
    effects: [
      {
        name: `Lord of the Ba'hal`,
        desc: `You can use this command ability at the start of your charge phase if this model is on the battlefield. If you do so, you can reroll charge rolls for friendly Ba'hal units while they are wholly within 24" of this model in that charge phase. In addition, you can reroll hit rolls of 1 for attacks made with Crushing Hooves by friendly Ba'hal units while they are wholly within 24" of this model in the subsequent combat phase.`,
        when: [START_OF_CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Favour of the Burning God': {
    effects: [
      {
        name: `Favour of the Burning God`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability. Add 1 to hit rolls for attacks made with melee weapons by friendly Ba'hal units while they are wholly within 12" of that model until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Martial Contempt': {
    effects: [
      {
        name: `Martial Contempt`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 enemy unit within 12" of a friendly model with this command ability. Until the start of your next hero phase, add 1 to wound rolls for attacks made by friendly Legion of Azgorh units that target that unit. The same enemy unit cannot be picked as the target of this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
