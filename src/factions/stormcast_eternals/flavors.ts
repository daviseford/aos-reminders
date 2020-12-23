import { keyPicker } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
} from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'

const Flavors = {
  'Hammers of Sigmar (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['God-forged Blade'])],
      command_abilities: [keyPicker(command_abilities, ['Soul of the Stormhost'])],
      command_traits: [keyPicker(command_traits, ['We Cannot Fail'])],
    },
    effects: [
      {
        name: `First to be Forged`,
        desc: `Add 1 to the Bravery characteristic of friendly HAMMERS OF SIGMAR units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Hallowed Knights (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Parchment of Purity'])],
      command_abilities: [keyPicker(command_abilities, ['Holy Crusaders'])],
      command_traits: [keyPicker(command_traits, ["Martyr's Strength"])],
    },
    effects: [
      {
        name: `Only the Faithful`,
        desc: `If a friendly HALLOWED KNIGHTS unit is affected by a spell or endless spell, roll a D6. On a 6+ ignore the effects of that spell on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Vindicators (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Stormrage Blade'])],
      command_abilities: [keyPicker(command_abilities, ['Righteous Hatred'])],
      command_traits: [keyPicker(command_traits, ['Single-minded Fury'])],
    },
    effects: [
      {
        name: `Driven by Vengeance`,
        desc: `You can reroll hit rolls of 1 for attacks made by friendly CELESTIAL VINDICATORS units if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Anvils of the Heldenhammer (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Soulthief'])],
      command_abilities: [keyPicker(command_abilities, ['Heroes of Another Age'])],
      command_traits: [keyPicker(command_traits, ['Deathly Aura'])],
    },
    effects: [
      {
        name: `No True Death`,
        desc: `You can reroll failed battleshock tests for friendly ANVILS OF THE HELDENHAMMER units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Knights Excelsior (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Chains of Celestial Lightning'])],
      command_abilities: [keyPicker(command_abilities, ['No Mercy'])],
      command_traits: [keyPicker(command_traits, ['Divine Executioner'])],
    },
    effects: [
      {
        name: `Storm of Annihilation`,
        desc: `If a friendly KNIGHTS EXCELSIOR unit makes an attack that destroys an enemy unit, you can reroll hit rolls of 1 for attacks made by that KNIGHTS EXCELSIOR unit for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Celestial Warbringers (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Hammers of Augury'])],
      command_abilities: [keyPicker(command_abilities, ['Astral Conjunction'])],
      command_traits: [keyPicker(command_traits, ['Portents and Omens'])],
    },
    effects: [
      {
        name: `Fearless Foresight`,
        desc: `Pick D3 friendly CELESTIAL WARBRINGERS units and set them up again (any restrictions in the set-up instructions for the battleplan being used still apply).`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Tempest Lords (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ["Patrician's Helm"])],
      command_abilities: [keyPicker(command_abilities, ['Rousing Oratory'])],
      command_traits: [keyPicker(command_traits, ['Bonds of Noble Duty'])],
    },
    effects: [
      {
        name: `Grand Strategists`,
        desc: `At the start of your hero phase roll a D6. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Astral Templars (Stormhost)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Godbeast Plate'])],
      command_abilities: [keyPicker(command_abilities, ['Cut off the Head'])],
      command_traits: [keyPicker(command_traits, ['Dauntless Hunters'])],
    },
    effects: [
      {
        name: `Beast Stalkers`,
        desc: `Add 1 to hit rolls for attacks made by ASTRAL TEMPLARS units that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
