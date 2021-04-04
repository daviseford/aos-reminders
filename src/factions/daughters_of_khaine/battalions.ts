import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Cauldron Guard': {
    mandatory: {
      units: [keyPicker(Units, ['Hag Queen', 'Witch Aelves', 'Khinerai Lifetakers'])],
    },
    effects: [
      {
        name: `Frenzied Devotees`,
        desc: `Add 1 to the run and charge rolls made for units from this battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Slaughter Troupe': {
    mandatory: {
      units: [keyPicker(Units, ['Slaughter Queen', 'Sisters of Slaughter', 'Khinerai Heartrenders'])],
    },
    effects: [
      {
        name: `Gladiatorial Acrobatics`,
        desc: `Slaughter Troupe units that retreat can still shoot and charge in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Shadow Patrol': {
    mandatory: {
      units: [keyPicker(Units, ['Doomfire Warlocks'])],
    },
    effects: [
      {
        name: `Shadowpaths`,
        desc: `Instead of making a normal move with a unit from this battalion, you can remove and set up the unit anywhere on the battlefield more than 9" from enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Scathcoven: {
    mandatory: {
      units: [keyPicker(Units, ['Blood Sisters', 'Blood Stalkers'])],
    },
    effects: [
      {
        name: `Devoted to Morathi`,
        desc: `Do not take battleshocks test for this battalion's units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Vyperic Guard': {
    mandatory: {
      units: [keyPicker(Units, ['Morathi-Khaine', 'The Shadow Queen'])],
    },
    effects: [
      {
        name: `Vaunted Slayers`,
        desc: `Once per battle, a hero from this battalion can use a command ability without spending a command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Shrine Blood': {
    mandatory: {
      units: [keyPicker(Units, ['Bloodwrack Shrine'])],
    },
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `You can pick any number this battalion's units within 6" of a battallion Bloodwrack Shrine. 1 model from each selected unit is slain. Heal 1 allocated wound for each slain Harpy or 2 allocated wounds for each slain Melusai on the Shrine.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'War Coven of Morathi': {
    mandatory: {
      battalions: [
        keyPicker(RegularBattalions, [
          'Vyperic Guard',
          'Cauldron Guard',
          'Slaughter Troupe',
          'Scathcoven',
          'Shadow Patrol',
        ]),
      ],
    },
    effects: [
      {
        name: `Devout Followers`,
        desc: `Do not take battleshock tests for this battalion's units if Morathi-Khaine is on the battlefield and part of your army.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')
