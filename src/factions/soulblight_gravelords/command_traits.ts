import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },

  'Legion of Blood': {
    effects: [
      {
        name: `Premeditated Violence`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack scores 2 hits on the target instead of 1, Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soul-crushing Contempt`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Aristocracy of Blood`,
        desc: `You can reroll charge rolls for friendly LEGION OF BLOOD units while they are wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Aura of Dark Majesty`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Walking Death`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this general is 6, that attack inflicts a number of mortal wounds equal to the Damage characteristic of the weapon used for the attack and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sanguine Blur`,
        desc: `Friendly units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  // Legion of Night
  'Above Suspicion': {
    effects: [
      {
        name: `Above Suspicion`,
        desc: `If this general is set up in ambush using the Ageless Cunning battle trait, at the end of your movement phase, you can set up this general anywhere on the battlefield more than 9" from all enemy units, instead of wholly within 6" of the battlefield edge.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  'Swift Form': {
    effects: [
      {
        name: `Swift Form`,
        desc: `Add 2 to run and charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Unbending Will': {
    effects: [
      {
        name: `Unbending Will`,
        desc: `Do not take battleshock tests for friendly LEGION OF NIGHT units while they are wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Merciless Hunter': {
    effects: [
      {
        name: `Merciless Hunter`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Unholy Impetus': {
    effects: [
      {
        name: `Unholy Impetus`,
        desc: `In the combat phase, if any enemy models are slain by attacks made with melee weapons by this general in that phase, add 1 to the Attacks characteristic of melee weapons used by friendly LEGION OF NIGHT units wholly within 12" of this general until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Terrifying Visage': {
    effects: [
      {
        name: `Terrifying Visage`,
        desc: `Subtract 1 from wound rolls for attacks made
    with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },



  // Vyrkos Dynasty
  'Vyrkos Dynasty': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },

  // Kastelai Dynasty
  'Kastelai Dynasty': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },

  // Avengorii Dynasty
  'Avengorii Dynasty': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
