import { keyPicker, tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  // Daemons
  'Warpflame Host': {
    mandatory: {
      units: [keyPicker(Units, ['Exalted Flamers of Tzeentch'])],
    },
    effects: [
      {
        name: `Storm of Daemonic Fire`,
        desc: `At the end of the charge phase, roll a D6 for each enemy unit within 9" of any friendly units from this battalion. On a 6, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Multitudinous Host': {
    mandatory: {
      units: [keyPicker(Units, ['Changecaster, Herald of Tzeentch', 'Horrors of Tzeentch'])],
    },
    effects: [
      {
        name: `Horrors Without Number`,
        desc: `At the start of your hero phases, you can return D3 slain Horrors of Tzeentch models to each friendly Horrors of Tzeentch unit from this battalion (roll separately for each unit)`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Aether-eater Host': {
    mandatory: {
      units: [keyPicker(Units, ['Fateskimmer, Herald of Tzeentch on Burning Chariot'])],
    },
    effects: [
      {
        name: `Feed of Magic`,
        desc: `If a friendly unit from this battalion successfully unbinds a spell in the enemy hero phase, you can immediately heal D3 wounds allocated to that unit. In addition, 1 friendly Screamers of Tzeentch unit from this battalion can attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Changehost: {
    mandatory: {
      units: [keyPicker(Units, ['Lord of Change'])],
    },
    effects: [
      {
        name: `Deceive and Dismay`,
        desc: `At the start of your hero phase, if the LORD OF CHANGE from this battalion is your general and is on the battlefield, you can pick 1 other friendly unit from this battalion and remove it from the battlefield. If you do so, set up that unit again anywhere on the battlefield more than 9" from any enemy units. The unit you set up in this manner cannot move in the following movement phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Overseer`s Fate-twisters': {
    mandatory: {
      units: [keyPicker(Units, ['Lord of Change'])],
    },
    effects: [
      {
        name: `The Will of Tzeentch`,
        desc: `At the start of your hero phases, if 1 or more friendly units from this battalion are on the battlefield, you can roll a D6 and add it to your Destiny Dice. In addition, at the start of your hero phase, if the Lord of Change from this battalion is on the battlefield, you can reroll one of your Destiny Dice.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Omniscient Oracles': {
    mandatory: {
      units: [keyPicker(Units, ['Kairos Fateweaver', 'Lord of Change'])],
    },
    effects: [
      {
        name: `Knowledge of Past, Present and Future`,
        desc: `You can reroll any hit, wound, save and run rolls of 1 for models from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Mortals
  'Arcanite Cabal': {
    effects: [
      {
        name: `Master of the Cult`,
        desc: `After armies are set up but before the first battle round begins, pick 1 friendly model from this battalion. For the rest of the battle, each time you spend a Destiny Dice to replace a dice roll for that model, roll a D6. On a 2+, you can replace one of your remaining Destiny Dice with that roll.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Alter-kin Coven': {
    mandatory: {
      // TODO ADD TZAANGORS UNITS WHEN BOC FINISHED
      units: [
        keyPicker(Units, [
          'Kairic Acolytes', //'Tzaangors', 'Tzaangor Skyfires'])],
        ]),
      ],
    },
    effects: [
      {
        name: `Boon of Mutation`,
        desc: `In each of the charge phase, roll a D6 for each enemy unit that is within 3" of a unit from an Alter-kin Coven. On a roll of a 6, the unit being rolled for suffers D3 mortal wounds. If any models are slain in this manner, you can add 1 Tzaangor model to an existing Tzaangor unit in your army. If you do so, set up that Tzaangor model within 1" of a friendly Tzaangor unit that is within 9" of the slain model. The model can only be set up within 3" of an enemy unit if the friendly Tzaangor unit was within 3" of that enemy unit before any models were added.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Witchfyre Coven': {
    mandatory: {
      // TODO ADD TZAANGORS UNITS WHEN BOC FINISHED
      units: [
        keyPicker(Units, [
          'Kairic Acolytes', //'Tzaangor Enlightened'])],
        ]),
      ],
    },
    effects: [
      {
        name: `Mastery of Wyrdflame`,
        desc: `Once per turn, in your hero phase, pick 1 Kairic Acolyte unit in this battalion. That unit can make a shooting attack.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Skyshoal Coven': {
    mandatory: {
      // TODO ADD TZAANGORS UNITS WHEN BOC FINISHED
      //units: [keyPicker(Units, ['Tzaangor Enlightened', 'Tzaangor Skyfires'])],
    },
    effects: [
      {
        name: `Diving from the skies`,
        desc: `After a friendly uni from this battalion made a normal move, you can pick 1 enemy unit that has any models passed across by any models fro that friendly unit and roll a D6. On a 2", that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzaangor Coven': {
    mandatory: {
      // TODO ADD TZAANGORS UNITS WHEN BOC FINISHED
      //units: [keyPicker(Units, ['Tzaangors', 'Tzaangor Enlightened', 'Tzaangor Skyfires'])],
    },
    effects: [
      {
        name: `Pride of the Gor-kin`,
        desc: `At the start of your hero phase, you can pick 1 friendly unit from this battalion that is within 3" of an enemy unit. That unit can shoot or fight.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Other battalions.
  'Ab-Het`s Skyseekers': {
    mandatory: {
      // TODO ADD TZAANGORS UNITS WHEN BOC FINISHED
      units: [
        keyPicker(Units, [
          'Magister on Disc of Tzeentch',
          'Screamers of Tzeentch', //'Tzaangor Enlightened', 'Tzaangor Skyfires'
        ]),
      ],
    },
    effects: [
      {
        name: `Foreseen Manoeuveres`,
        desc: `When making a charge roll for a unit from this battalion, roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine the charge roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'M`zarr`s Aetherhost': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Flamers of Tzeentch',
          'Screamers of Tzeentch',
          'Horrors of Tzeentch',
          'Burning Chariots of Tzeentch',
        ]),
      ],
    },
    effects: [
      {
        name: `Spontaneous Destruction`,
        desc: `In each of your hero phases; pick either the Herald of Tzeentch or another unit from this battalion within 9" of them; you can choose either to cast one additional spell with that unit this phase or make a shooting attack with all the models in that unit as if it were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  // Daemons
  'Fate Legion': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Overseer`s Fate-twisters'])],
    },
    effects: [
      {
        name: `Three times three, the offerings be`,
        desc: `If your army includes this battalion, you start the battle with 9 Fate Points.`,
        when: [START_OF_GAME],
      },
    ],
  },
  // Mortals
  'Arcanite Cult': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Arcanite Cabal'])],
    },
    effects: [
      {
        name: `Destiny Preordained`,
        desc: `When generating your Destiny Dice pool at the start of the battle, you can choose the results of 6 of the dice before rolling the remaining 3 dice as normal.`,
        when: [END_OF_SETUP],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }
export default tagAs(Battalions, 'battalion')
