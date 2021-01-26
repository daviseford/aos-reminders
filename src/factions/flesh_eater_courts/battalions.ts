import Units from 'factions/flesh_eater_courts/units'
import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const RegularBattalions = {
  Abattoir: {
    mandatory: {
      units: [keyPicker(Units, ['Crypt Haunter Courtier', 'Crypt Horrors', 'Crypt Ghouls'])],
    },
    effects: [
      {
        name: `Body-part Acquisition`,
        desc: `At the end of the combat phase, roll 1 dice for each enemy model within 3" of any models from this battalion. For each 6, that enemy model's unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Attendants at Court': {
    mandatory: {
      units: [keyPicker(Units, ['Crypt Haunter Courtier', 'Crypt Horrors'])],
    },
    effects: [
      {
        name: `Loyal Subjects`,
        desc: `You can reroll hit rolls for attacks made by models from this battalion if your general is an ABHORRANT ARCHREGENT or ABHORRANT GHOUL KING and has not been slain.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Deadwatch: {
    mandatory: {
      units: [keyPicker(Units, ['Crypt Infernal Courtier', 'Crypt Flayers'])],
    },
    effects: [
      {
        name: `The Lord's Own`,
        desc: `In your hero phase, 1 unit from this battalion that is within 3" of an enemy unit can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ghoul Patrol': {
    mandatory: {
      units: [keyPicker(Units, ['Crypt Ghast Courtier', 'Crypt Ghouls'])],
    },
    effects: [
      {
        name: `On Patrol`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and say that it is on patrol in reserve. At the end of your first movement phase, you must set up all of the units from this battalion that are in reserve. Set up each unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'King`s Ghouls': {
    mandatory: {
      units: [keyPicker(Units, ['Crypt Ghast Courtier', 'Crypt Horrors', 'Crypt Ghouls'])],
    },
    effects: [
      {
        name: `Guardians of the Court`,
        desc: `Do not take battleshock tests for units from this battalion while they are wholly within 18" of the Crypt Ghast Courtier from the same battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Royal Family': {
    mandatory: {
      units: [keyPicker(Units, ['Abhorrant Ghoul King'])],
    },
    effects: [
      {
        name: `Lords of the Manor`,
        desc: `When a friendly COURTIER within 10" of any models from this battalion uses a Muster ability, you can roll 1 extra dice for that COURTIER when determining how many slain models the Muster ability allows you to return (usually this will mean that you roll 7 dice instead of 6 dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Royal Menagerie': {
    effects: [
      {
        name: `Monstrous Ensemble`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to each model from this battalion that is within 5" of any other models from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Royal Mordants': {
    mandatory: {
      units: [keyPicker(Units, ['Varghulf Courtier', 'Crypt Horrors', 'Crypt Flayers', 'Crypt Ghouls'])],
    },
    effects: [
      {
        name: `Delusional Discipline`,
        desc: `In your hero phase, pick 1 unit from this battalion wholly within 16" of the Varghulf Courtier from the same battalion. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Arcasanctorian Guard': {
    mandatory: {
      units: [keyPicker(Units, ['Abhorrant Archregent', 'Crypt Flayers', 'Crypt Horrors', 'Crypt Ghouls'])],
    },
    effects: [
      {
        name: `The Arcasanctorian Guard`,
        desc: `Units from this battalion reroll failed charges and do not take battleshock tests.`,
        when: [CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Cannibal Court': {
    mandatory: {
      battalions: [
        keyPicker(RegularBattalions, [
          'Royal Family',
          'Attendants at Court',
          'Deadwatch',
          'Abattoir',
          'Ghoul Patrol',
          'King`s Ghouls',
          'Royal Mordants',
          'Royal Menagerie',
        ]),
      ],
    },
    effects: [
      {
        name: `Dark Master`,
        desc: `If your general is an ABHORRANT ARCHREGENT or ABHORRANT GHOUL KING from this battalion, treat their warscroll as having the command abilities found on the warscrolls of any other units included in this battalion. 'If your general is from this battalion, he knows all of the command abilities on the warscrolls and battalions included in this battalion. In addition, you start the battle with 3 command points for having this battalion in your army instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')
