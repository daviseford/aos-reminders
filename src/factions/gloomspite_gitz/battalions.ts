import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  // Moonclan
  Gobbapalooza: {
    mandatory: {
      units: [keyPicker(Units, ['Boggleye', 'Brewgit', 'Scaremonger', 'Shroomancer', 'Spiker'])],
    },
    effects: [
      {
        name: `Brew-fuelled Madness`,
        desc: `Add 1 to casting and Gobbapalooza Know-wotz rolls for a model from the Gobbapalooza battalion while that model is within 8" of any other models from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Skulkmob Horde': {
    effects: [
      {
        name: `Endless Hordes`,
        desc: `Once per battle, when you use a Bad Moon Loonshrine's Moonclan Lair ability to successfully replace a destroyed unit from the Endless Hordes battalion, the replacement unit has all of the models from the destroyed unit instead of half.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Moonclan Squiq
  'Squig Rider Stampede': {
    effects: [
      {
        name: `Madcap Momentum`,
        desc: `You can reroll the roll that determines the Move characteristic of units from the Squig Rider Stampede battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Moon-Jumper Stampede': {
    effects: [
      {
        name: `Crushing Gobs`,
        desc: `Add 1 to the Damage characteristic of Fang-filled Gob, Massive Fang-filled Gob and Huge Fang-filled Gobs weapons used by units from this battalion if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Spderfang
  'Arachnarok Spider Cluster': {
    effects: [
      {
        name: `Hunting Brood`,
        desc: `You can reroll hit rolls of 1 for attacks made by a model from the Arachnarok Spider Cluster battalion while it is within 6" of another model from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skitterstrand Nest': {
    mandatory: {
      units: [keyPicker(Units, ['Skitterstrand Arachnarok'])],
    },
    effects: [
      {
        name: `Burst from Beyond`,
        desc: `Add 1 to charge rolls for models from the Skitterstrand Nest battalion for each model from this battalion that was set up in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Spider Rider Skitterswarm': {
    mandatory: {
      units: [keyPicker(Units, ['Spider Riders'])],
    },
    effects: [
      {
        name: `Outriders of the Spider God`,
        desc: `Add 2" to the Move characteristic of units from this battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Troggoth
  Troggherd: {
    mandatory: {
      units: [keyPicker(Units, ['Dankhold Troggboss'])],
    },
    effects: [
      {
        name: `Eat on the Move`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon used by a model from the Troggherd battalion is 6, add 1 to the Damage characteristic for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Stomping Megamob': {
    mandatory: {
      units: [keyPicker(Units, ['Dankhold Troggboss'])],
    },
    effects: [
      {
        name: `One-track Minds`,
        desc: `Units from this battalion can retreat and still shoot and/or charge later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Moonclan Skrap': {
    mandatory: {
      units: [keyPicker(Units, ['Sneaky Snufflers'])],
      battalions: [keyPicker(RegularBattalions, ['Skulkmob Horde'])],
    },
    effects: [
      {
        name: `Spreading Loonacy`,
        desc: `Do not take battleshock tests for units from the Moonclan Skrap battalion while they are affected by the light of the Bad Moon.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Squigalanche: {
    mandatory: {
      units: [keyPicker(Units, ['Mangler Squigs'])],
      battalions: [keyPicker(RegularBattalions, ['Squig Rider Stampede'])],
    },
    effects: [
      {
        name: `Over Da Moon`,
        desc: `If the light of the Bad Moon affects a unit from the Squigalanche battalion at the start of a combat phase, that unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and can move an extra 3" when it piles in.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Moon-Biter Squigalanche': {
    mandatory: {
      units: [keyPicker(Units, ['Mangler Squigs'])],
      battalions: [keyPicker(RegularBattalions, ['Moon-Jumper Stampede'])],
    },
    effects: [
      {
        name: `Overbounding Loonatics`,
        desc: `After armies have been set up but before the first battle round begins, up to D3 units from this battalion can move up to 6". If both players can move units after armies have been set up, the players must roll off, and the winner chooses who moves their units first.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Spiderfang Stalk Tribe': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Arachnarok Spider Cluster', 'Spider Rider Skitterswarm'])],
    },
    effects: [
      {
        name: `Power of the Spider God`,
        desc: `You can reroll save rolls of 1 for attacks that target a unit from a Spiderfang Stalk Tribe battalion while the target unit is wholly within 24" of a SPIDERFANG WIZARD from the same battalion.`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')
