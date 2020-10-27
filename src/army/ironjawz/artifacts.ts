import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Armour of Gork`,
    effects: [
      {
        name: `Armour of Gork`,
        desc: `If you roll an unmodified 6 for your save against a melee attack, deal 1 mortal wound to the attacking unit once all attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Destroyer`,
    effects: [
      {
        name: `Destroyer`,
        desc: `Pick one of the bearer's melee weapons. Once per battle add +3 to the damage of that weapon.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Daubing of Mork`,
    effects: [
      {
        name: `Daubing of Mork`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to the bearer. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `The Golden Toof`,
    effects: [
      {
        name: `The Golden Toof`,
        desc: `Do not take battleshock tests for friendly IRONJAWZ units while they are wholly within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Metalrippa's Klaw`,
    effects: [
      {
        name: `Metalrippa's Klaw`,
        desc: `Pick one of the bearer's melee weapons. Change the Rend characteristic of that weapon to -3 before applying any other modifiers to that weapon's Rend characteristic.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Boss Skewer`,
    effects: [
      {
        name: `The Boss Skewer`,
        desc: `Add 1 to the Bravery characteristic of friendly IRONJAWZ units while they are wholly within 18" of the bearer, and subtract 1 from the Bravery characteristic of enemy units while they are within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Great Green Visions`,
    effects: [
      {
        name: `Great Green Visions`,
        desc: `Roll a D6 at the start of your hero phase, on a 4+ get 1 CP .`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Amberbone Hoard`,
    effects: [
      {
        name: `Amberbone Hoard`,
        desc: `+1 save for the wearer, in addition add 1 to attacks with your melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shamanic Skullcape`,
    effects: [
      {
        name: `Shamanic Skullcape`,
        desc: `Add 1 to casting rolls, if you kill an enemy WIZARD with your melee weapon, pick 1 spell from the slain Unit and the bearer can cast that spell for the rest of the game.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
