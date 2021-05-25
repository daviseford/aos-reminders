import { keyPicker, tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, START_OF_HERO_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Red Banqueters': {
    mandatory: {
      units: [keyPicker(Units, ['Blood Knights', 'Vampire Lords'])],
    },
    effects: [
      {
        name: `The Blood is the Life`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to each unit in this battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fellwing Flock': {
    mandatory: {
      units: [keyPicker(Units, ['Fell Bats', 'Vargheists'])],
    },
    effects: [
      {
        name: `Swooping Predators`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by units in this battalion if those units made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Deathstench Drove': {
    mandatory: {
      units: [keyPicker(Units, ['Corpse Carts', 'Dire Wolves', 'Deadwalker Zombies'])],
    },
    effects: [
      {
        name: `Nexus of Malevolence`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by units in this battalion while those units are wholly within 12" of any CORPSE CARTS in this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Deathmarch: {
    mandatory: {
      units: [keyPicker(Units, ['Wight King', 'Black Knights', 'Grave Guard', 'Deathrattle Skeletons'])],
    },
    effects: [
      {
        name: `March of the Dead`,
        desc: `At the start of your movement phase, you can pick up to 3 different friendly units in this battalion that are wholly within 12" of this battalion's WIGHT KING. If you do so, add 3" to the Move characteristic of each of those units in that phase (they can still either run or charge).`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Legion of Shyish': {
    mandatory: {
      battalions: [
        keyPicker(RegularBattalions, ['Red Banqueters', 'Deathmarch', 'Fellwing Flock', 'Deathstench Drove']),
      ],
    },
    effects: [
      {
        name: `Horror Unending`,
        desc: `Do not roll a dice to determine the number of wounds healed or models returned by the Deathly Invocation battle trait for a friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit in this battalion. Instead, you can heal up to 3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 3 or less.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

// Merge the Battalions
const Battalions = { ...RegularBattalions, ...SuperBattalions }

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
