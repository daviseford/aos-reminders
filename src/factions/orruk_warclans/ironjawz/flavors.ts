import { keyPicker } from 'factions/metatagger'
import { END_OF_COMBAT_PHASE, HERO_PHASE } from 'types/phases'
import command_abilities from './command_abilities'
import { TItemDescriptions } from 'factions/factionTypes'

const IronjawzFlavors = {
  Ironsunz: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ["Alright, Get 'Em!"])],
    },
    effects: [],
  },
  Bloodtoofs: {
    effects: [
      {
        name: `Hunt and Crush`,
        desc: `At the end of the combat phase, friendly BLOODTOOFS GORE-GRUNTAS units that fought in that phase and are within 3" of any enemy units can make a pile-in move. In addition, those that fought but are not within 3" of any enemy units can each make a normal move or attempt a charge.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Da Choppas': {
    effects: [
      {
        name: `Rabble Rousers`,
        desc: `When you use the Violent Fury ability of a friendly DA CHOPPAS WARCHANTER, you can pick up to 3 different friendly DA CHOPPAS BRUTES units or DA CHOPPAS ARDBOYS units, in any combination, to be affected by the ability instead of 1 friendly IRONJAWZ unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default IronjawzFlavors
