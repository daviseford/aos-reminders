import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const IronjawzArtifacts = {
  'Armour of Gork': {
    effects: [
      {
        name: `Armour of Gork`,
        desc: `The bearer has a ward of 6+.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Armour of Gork`,
        desc: `You can add 1 to hit rolls for attacks made with melee weapons by the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Armour of Gork`,
        desc: `You must subtract 2" from the bearer's Move characteristic and the bearer cannot run.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Destroyer: {
    effects: [
      {
        name: `Destroyer`,
        desc: `Pick one of the bearer's melee weapons. Once per battle, at the start of the combat phase, you can add 3 to the Damage characteristic of that weapon until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Boss Skewer': {
    effects: [
      {
        name: `The Boss Skewer`,
        desc: `Add 1 to the Bravery characteristic of friendly IRONJAWZ units while they are wholly within 18" of the bearer, and subtract 1 from the Bravery characteristic of enemy units while they are within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  // Removed in 2021
  // 'Daubing of Mork': {
  //   effects: [
  //     {
  //       name: `Daubing of Mork`,
  //       desc: `Roll a D6 each time a wound or mortal wound is allocated to the bearer. On a 6+ the wound is negated.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  // 'The Golden Toof': {
  //   effects: [
  //     {
  //       name: `The Golden Toof`,
  //       desc: `Do not take battleshock tests for friendly IRONJAWZ units while they are wholly within 12" of the bearer.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // "Metalrippa's Klaw": {
  //   effects: [
  //     {
  //       name: `Metalrippa's Klaw`,
  //       desc: `Pick one of the bearer's melee weapons. Change the Rend characteristic of that weapon to -3 before applying any other modifiers to that weapon's Rend characteristic.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Great Green Visions': {
  //   effects: [
  //     {
  //       name: `Great Green Visions`,
  //       desc: `Roll a D6 at the start of your hero phase, on a 4+ get 1 CP .`,
  //       when: [START_OF_HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Amberbone Hoard': {
  //   effects: [
  //     {
  //       name: `Amberbone Hoard`,
  //       desc: `+1 save for the wearer, in addition add 1 to attacks with your melee weapons.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Shamanic Skullcape': {
  //   effects: [
  //     {
  //       name: `Shamanic Skullcape`,
  //       desc: `Add 1 to casting rolls, if you kill an enemy WIZARD with your melee weapon, pick 1 spell from the slain Unit and the bearer can cast that spell for the rest of the game.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Sunzblessed Armour': {
  //   effects: [
  //     {
  //       name: `Sunzblessed Armour`,
  //       desc: `Attacks that target the bearer have their rend reduced by 1, to a minimum of 0.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  // 'Quickduff Amulet': {
  //   effects: [
  //     {
  //       name: `Quickduff Amulet`,
  //       desc: `Once per battle, the bearer may automatically cast the Great Green Hand of Gork for free and cannot be unbound.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Megaskull Staff': {
  //   effects: [
  //     {
  //       name: `Megaskull Staff`,
  //       desc: `The bearer gains the Megaboss keyword for the purposes of using the IRONJAWZ Waaagh! ability.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(IronjawzArtifacts, 'artifact')
