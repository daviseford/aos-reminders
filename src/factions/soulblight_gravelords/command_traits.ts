import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE } from 'types/phases'

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
        desc: `You can re-roll charge rolls for friendly LEGION OF BLOOD units while they are wholly within 12" of this general.`,
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

  'Legion of Night': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },

  'Vyrkos Dynasty': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },

  'Kastelai Dynasty': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },

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
