import { keyPicker } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_SETUP, END_OF_MOVEMENT_PHASE, TURN_ONE_MOVEMENT_PHASE } from 'types/phases'
import Artifacts from './artifacts'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Spells from './spells'

// TODO: Write a concise description of what a flavor is

const Flavors = {
  // Name of your flavor
  Vanilla: {
    // Any battle traits associated with this flavor
    effects: [
      {
        name: `Vanilla Effect 1`,
        desc: `Here's an effect.`,
        when: [DURING_SETUP],
      },
      {
        name: `Vanilla Effect 2`,
        desc: `Here's another effect.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  Chocolate: {
    mandatory: {
      // Required items
      artifacts: [keyPicker(Artifacts, ['Artifact 1'])],
      command_traits: [keyPicker(CommandTraits, ['A Generic Command Trait'])],
    },
    effects: [
      {
        name: `First to Battle`,
        desc: `In the first battle round, add 3" to the Move characteristic of FANGS OF SOTEK SKINK units.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
    ],
  },

  Strawberry: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Artifact 1'])],
      command_traits: [keyPicker(CommandTraits, ['A Generic Command Trait'])],
      command_abilities: [keyPicker(CommandAbilities, ['A Third Command Ability', 'Command Ability 1'])],
      endless_spells: [keyPicker(EndlessSpells, ['Made Up Endless Spell'])],
      spells: [keyPicker(Spells, ['A Whole Spell Lore'])],
    },
    effects: [
      {
        name: `Strawberry Effect`,
        desc: `a strawberry effect`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
