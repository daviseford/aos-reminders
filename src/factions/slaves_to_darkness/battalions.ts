import { keyPicker, tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
} from 'types/phases'
import CommandTraits from './command_traits'
import Spells from './spells'
import Units from './units'

const RegularBattalions = {
  'Godsworn Champions of Ruin': {
    effects: [
      {
        name: `Fury of the Damned`,
        desc: `You can pick 1 hero from this battalion that is within 3" of an enemy unit. That hero can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Godswrath Warband': {
    mandatory: {
      units: [keyPicker(Units, ['Chaos Warshrine'])],
    },
    effects: [
      {
        name: `Searing Doombolts`,
        desc: `You can pick 1 Chaos Warshrine from this battalion and roll a D6 for each enemy unit within 24" and visible. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ruinbringer Warband': {
    effects: [
      {
        name: `Dark Cavalry`,
        desc: `Each time a unit from this battalion finishes a charge move, you can pick 1 enemy unit within 1" of the charging unit. Roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bloodmarked Warband': {
    effects: [
      {
        name: `Blood Rage`,
        desc: `If a hero from this battalion slays any enemy models in this phase, you can pick 1 unit from the same battalion wholly within 12" of that hero. Add 1 to the attacks characteristic of the unit's melee weapons until your next hero phase. The same unit cannot benefit from this ability more than once per battle round.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Fatesworn Warband': {
    mandatory: {
      spells: [keyPicker(Spells, ['Stolen Sting'])],
    },
    effects: [
      {
        name: `Scions of Change`,
        desc: `You can pick 1 unit from this battalion that has 9 or more models during the start of your hero phase. Until the end of the phase, that unit can attempt to cast 1 spell and attempt to dispel 1 endless spell. It knows the Stolen Sting spell.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Plaguetouched Warband': {
    effects: [
      {
        name: `Grandfather's Favour`,
        desc: `If the unmodified melee wound roll of 6 is made against a unit in this battatlion, the attacking unit suffers 1 mortal wound after all of its attacks have resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grandfather's Favour`,
        desc: `You can pick 1 unit from this battalion and 1 enemy unit within 1" of the selected unit. Roll a D6. On a 3+ that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pleasurebound Warband': {
    effects: [
      {
        name: `Perverse Yearnings`,
        desc: `If a model from a unit in this battalion was slain in this phase, units from the same battalion can move an extra 3" when they pile in until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Overlords of Chaos': {
    manadatory: {
      units: [keyPicker(Units, ['Varanguard'])],
    },
    effects: [
      {
        name: `The Circles Unleashed`,
        desc: `You can replace one of The Eight Circles of the Varanguard keywords with a different keyword from the same list for each unit in this battalion.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Gresh`s Iron Reapers': {
    manadatory: {
      command_traits: [keyPicker(CommandTraits, ['Profane Oratory'])],
      units: [keyPicker(Units, ['Gorebeast Chariots'])],
    },
    effects: [
      {
        name: `Soulbutcher`,
        desc: `The Idolator Lord's Chaos Greatblade has an attacks characteristic of 4 and a damage characteristic of D3. Unmodified hit rolls of 6 with this weapon inflict D3 mortal wounds and ends the attack sequence.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Chaos Horde': {
    manadatory: {
      battalions: [keyPicker(RegularBattalions, ['Godsworn Champions of Ruin'])],
    },
    effects: [
      {
        name: `Oncoming Onslaught`,
        desc: `Once per turn you can use 1 command ability on the warscroll of a hero from this battalion without spending a command point.`,
        when: [DURING_GAME],
      },
      {
        name: `Oncoming Onslaught`,
        desc: `Add 2 to the move characteristic of units from this battalion.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
    ],
  },
}

// Merge the Battalions
const Battalions = { ...RegularBattalions, ...SuperBattalions }

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
