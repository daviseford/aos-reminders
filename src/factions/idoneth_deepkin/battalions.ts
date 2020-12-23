import { keyPicker, tagAs } from 'factions/metatagger'
import SylvanethUnits from 'factions/sylvaneth/units'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Units from './units'

const RegularBattalions = {
  'Royal Council': {
    mandatory: {
      units: [keyPicker(Units, ['Isharann Tidecaster', 'Isharann Soulscryer'])],
      command_abilities: [keyPicker(CommandAbilities, ['Give Them No Respite'])],
    },
    effects: [],
  },
  'Akhelian Corps': {
    mandatory: {
      units: [keyPicker(Units, ['Akhelian Leviadon', 'Akhelian Allopexes'])],
    },
    effects: [
      {
        name: `Pulsing Rhythm of the Drums`,
        desc: `Once per phase, you can reroll one run roll for one unit from this battalion that is wholly within 12" of the Akhelian Leviadon from this battalion when the reroll is made.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Pulsing Rhythm of the Drums`,
        desc: `Once per phase, you can reroll one charge roll for one unit from this battalion that is wholly within 12" of the Akhelian Leviadon from this battalion when the reroll is made.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Pulsing Rhythm of the Drums`,
        desc: `Once per phase, you can reroll one hit, wound, or save roll for one unit from this battalion that is wholly within 12" of the Akhelian Leviadon from this battalion when the reroll is made.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Namarti Corps': {
    mandatory: {
      units: [keyPicker(Units, ['Isharann Soulrender', 'Namarti Thralls', 'Namarti Reavers'])],
    },
    effects: [
      {
        name: `Soul Bond`,
        desc: `If the Isharann Soulrender from this battalion uses their Lurelight ability on a NAMARTI unit from this battalion, the D3 roll to determine how many models are returned to the Namarti unit is treated as being a roll of 3 (there is no need to roll the dice).`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Deepsurge Raiding Party': {
    mandatory: {
      units: [
        keyPicker(Units, ['Isharann Tidecaster', 'Akhelian Allopexes', 'Namarti Thralls', 'Namarti Reavers']),
      ],
    },
    effects: [
      {
        name: `Protection of the Ethersea`,
        desc: `Each turn, you can use Spirit Guardian to negate the first wound allocated to 1 battalion model instead of negating a wound to this model.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Alliance of Wood and Sea': {
    mandatory: {
      units: [
        keyPicker(Units, ['Isharann Tidecaster', 'Akhelian Allopexes', 'Namarti Thralls', 'Namarti Reavers']),
        keyPicker(SylvanethUnits, ['Branchwych', 'Dryads', 'Treelord Ancient']),
      ],
    },
    effects: [
      {
        name: `Strength of the Ethersea`,
        desc: `SYLVANETH units from this battalion have the Tides of Death battle trait, and gain abilities from the Tides of Death table in the same manner as IDONETH DEEPKIN units.`,
        when: [DURING_GAME],
      },
    ],
  },
  'The Bloodsurf Hunt': {
    mandatory: {
      units: [keyPicker(Units, ['Akhelian King', 'Akhelian Allopexes'])],
    },
    effects: [
      {
        name: `Deadly Guardians`,
        desc: `Add 1 to hit rolls made by battallion Allopex Barbed Hooks and Blades wholly within 12" of the battalion's Akhelian King.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Guardians`,
        desc: `Each time a wound or mortal would would be allocated to the battalion's Akhelian King within 3" of battalion Allopex units, roll a D6. On a 2+ you must allocate the wounds to one of those Allopex units instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  Phalanx: {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Royal Council', 'Akhelian Corps', 'Namarti Corps'])],
    },
    effects: [
      {
        name: `Full Fury of the Storm`,
        desc: `If your army has the IDONETH DEEPKIN allegiance and includes this battalion, then once per battle at the start of a battle round, you can choose to use the High Tide ability from the Tides of Death table for that battle round instead of the ability that would normally be used.`,
        when: [START_OF_ROUND],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')
