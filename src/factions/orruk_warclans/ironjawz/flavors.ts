import { keyPicker } from 'factions/metatagger'
import { END_OF_COMBAT_PHASE, HERO_PHASE } from 'types/phases'
import command_abilities from './command_abilities'

const IronjawzFlavors = {
  Ironsunz: {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Sunzblessed Armour'])],
      command_abilities: [keyPicker(command_abilities, ["Alright, Get 'Em!"])],
      // command_traits: [keyPicker(command_traits, ['Right Fist of Dakkbad'])],
    },
    effects: [
      // {
      //   name: `Ironsunz Kunnin'`,
      //   desc: `-1 to be hit for enemy attacks in the first battle round.`,
      //   when: [SHOOTING_PHASE, COMBAT_PHASE],
      // },
    ],
  },
  Bloodtoofs: {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Quickduff Amulet'])],
      // command_abilities: [keyPicker(command_abilities, ['Break Through da Line'])],
      // command_traits: [keyPicker(command_traits, ['Get Da Realmgate'])],
    },
    effects: [
      {
        name: `Hunt and Crush`,
        desc: `At the end of the combat phase, friendly BLOODTOOFS GORE- GRUNTAS units that fought in that phase and are within 3" of any enemy units can make a pile- in move. In addition, those that fought but are not within 3" of any enemy units can each make a normal move or attempt a charge.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Da Choppas': {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Megaskull Staff'])],
      // command_abilities: [keyPicker(command_abilities, ['Rabble Rouser'])],
      // command_traits: [keyPicker(command_traits, ['Checked Out'])],
    },
    effects: [
      {
        name: `Rabble Rousers`,
        desc: `When you use the Violent Fury ability of a friendly DA CHOPPAS WARCHANTER, you can pick up to 3 different friendly DA CHOPPAS BRUTES units or DA CHOPPAS ARDBOYS units, in any combination, to be affected by the ability instead of 1 friendly IRONJAWZ unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default IronjawzFlavors
