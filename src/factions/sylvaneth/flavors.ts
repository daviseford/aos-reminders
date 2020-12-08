// TODO: Write a concise description of what a flavor is

import { keyPicker } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_GAME, SHOOTING_PHASE } from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'

const Flavors = {
  'Oakenbrow (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Dawnflask'])],
      command_abilities: [keyPicker(command_abilities, ['Yield To None'])],
      command_traits: [keyPicker(command_traits, ['Regal Old-growth'])],
    },
    effects: [
      {
        name: `Our Roots Run Deep`,
        desc: `Subtract 2 from the number of wounds suffered by OAKENBROW SPIRITS OF DURTHU, OAKENBROW TREELORD ANCIENTS and OAKENBROW TREELORDS when determining which row on their damage table to use (to a minimum of 0).`,
        when: [DURING_GAME],
      },
    ],
  },
  'Gnarlroot (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Chalice of Nectar'])],
      command_abilities: [keyPicker(command_abilities, ['The Earth Defends'])],
      command_traits: [keyPicker(command_traits, ['Nurtured by Magic'])],
    },
    effects: [
      {
        name: `Shield the Arcane`,
        desc: `Reroll hit rolls of 1 for attacks made by friendly GNARLROOT units while they are wholly within 12" of any friendly GNARLROOT WIZARDS.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Heartwood (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Horn of the Consort'])],
      command_abilities: [keyPicker(command_abilities, ['Lord of the Hunt'])],
      command_traits: [keyPicker(command_traits, ['Legacy of Valour'])],
    },
    effects: [
      {
        name: `Courage For Kurnoth`,
        desc: `Add 1 to the Bravery characteristic of friendly HEARTWOOD units while they are wholly within 12" of any friendly HEARTWOOD HEROES.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Ironbark (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Ironbark Talisman'])],
      command_abilities: [keyPicker(command_abilities, ['Stand Firm'])],
      command_traits: [keyPicker(command_traits, ['Mere Rainfall'])],
    },
    effects: [
      {
        name: `Stubborn and Taciturn`,
        desc: `You can reroll battleshock tests for friendly IRONBARK units while they are wholly within 12" of any friendly IRONBARK HEROES.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Winterleaf (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Frozen Kernel'])],
      command_abilities: [keyPicker(command_abilities, ['Branch Blizzard'])],
      command_traits: [keyPicker(command_traits, ['My Heart Is Ice'])],
    },
    effects: [
      {
        name: `Winter's Bite`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a friendly WINTERLEAF unit is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dreadwood (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Jewel of Withering'])],
      command_abilities: [keyPicker(command_abilities, ['Sinister Ambush'])],
      command_traits: [keyPicker(command_traits, ['Paragon of Terror'])],
    },
    effects: [
      {
        name: `Malicious Tormentors`,
        desc: `You can reroll hit rolls of 1 for attacks made by DREADWOOD SPITE-REVENANTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Harvestboon (Glade)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['The Silent Sickle'])],
      command_abilities: [keyPicker(command_abilities, ['Fertile Ground'])],
      command_traits: [keyPicker(command_traits, ['Seek New Fruit'])],
    },
    effects: [
      {
        name: `Vibrant Surge`,
        desc: `You can reroll hit rolls of 1 for attacks made by friendly HARVESTBOON units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
