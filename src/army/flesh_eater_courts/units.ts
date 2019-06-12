import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  DURING_GAME,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  END_OF_COMBAT_PHASE,
  DURING_SETUP,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  BATTLESHOCK_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Abhorrant Ghoul King`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Abhorrant Ghoul King on Royal Terrorgheist`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Abhorrant Ghoul King on Royal Zombie Dragon`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Crypt Ghast Courtier`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Crypt Haunter Courtier`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Crypt Infernal Courtier`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Varghulf Courtier`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Abhorrant Archregent`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Crypt Ghouls`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Crypt Horrors`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Crypt Flayers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Royal Terrorgheist`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Royal Zombie Dragon`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Gristlegore Royal Terrorgheist`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Gristlegore Royal Zombie Dragon`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Abattoir`,
    effects: [
      {
        name: `Body-part Acquisition`,
        desc: `At the end of the combat phase, roll 1 dice for each enemy model within 3" of any models from this battalion. For each 6, that enemy model’s unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Attendants at Court`,
    effects: [
      {
        name: `Loyal Subjects`,
        desc: `You can re-roll hit rolls for attacks made by models from this battalion if your general is an ABHORRANT ARCHREGENT or ABHORRANT GHOUL KING and has not been slain.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Deadwatch`,
    effects: [
      {
        name: `The Lord's Own`,
        desc: `In your hero phase, 1 unit from this battalion that is within 3" of an enemy unit can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cannibal Court`,
    effects: [
      {
        name: `Dark Master`,
        desc: `If your general is an ABHORRANT ARCHREGENT or ABHORRANT GHOUL KING from this battalion, treat their warscroll as having the command abilities found on the warscrolls of any other units included in this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ghoul Patrol`,
    effects: [
      {
        name: `On Patrol`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and say that it is on patrol in reserve. At the end of your first movement phase, you must set up all of the units from this battalion that are in reserve. Set up each unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: "King's Ghouls",
    effects: [
      {
        name: `Guardians of the Court`,
        desc: `Do not take battleshock tests for units from this battalion while they are wholly within 18" of the Crypt Ghast Courtier from the same battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Royal Family`,
    effects: [
      {
        name: `Lords of the Manor`,
        desc: `When a friendly COURTIER within 10" of any models from this battalion uses a Muster ability, you can roll 1 extra dice for that COURTIER when determining how many slain models the Muster ability allows you to return (usually this will mean that you roll 7 dice instead of 6 dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Royal Menagerie`,
    effects: [
      {
        name: `Monstrous Ensemble`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to each model from this battalion that is within 5" of any other models from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Royal Mordants`,
    effects: [
      {
        name: `Delusional Discipline`,
        desc: `In your hero phase, pick 1 unit from this battalion wholly within 16" of the Varghulf Courtier from the same battalion. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Arcasanctorian Guard`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]
