import { keyPicker } from 'factions/metatagger'
import { HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'
import Artifacts from './artifacts'
import Battlalions from './battalions'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Jaws of Mork': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Syari Screamersquig'])],
      command_abilities: [keyPicker(CommandAbilities, ["Get Some Loonshine Down 'Em!"])],
      command_traits: [keyPicker(CommandTraits, ['Envoy of the Overbounder'])],
    },
    available: {
      batttalions: [keyPicker(Battlalions, ['Moon-Jumper Stampede', 'Moon-Biter Squigalanche'])],
    },
    effects: [
      {
        name: `Running Riot`,
        desc: `You can reroll the roll that determines the Move characteristic of friendly SQUIG units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  "Glogg's Megamob": {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Aetherquartz-studded Hide'])],
      command_abilities: [keyPicker(CommandAbilities, ['Oblivious to Sorcery'])],
      command_traits: [keyPicker(CommandTraits, ['Shepard of Idiotic Destruction'])],
    },
    available: {
      batttalions: [keyPicker(Battlalions, ['Stomping Megamob'])],
    },
    effects: [
      {
        name: `Monstrous Regeneration`,
        desc: `Add 1 to the dice that determines if a friendly GLOGG'S MEGAMOB TROGGOTH unit heals any wounds when it uses its Regeneration ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default Flavors
