import { keyPicker } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'
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

  'Grimscuttle Tribes': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Shyishan Spider-sigils'])],
      command_abilities: [keyPicker(CommandAbilities, ['Masters of Feigned Flight'])],
      command_traits: [keyPicker(CommandTraits, ['Prophet of da Spider God'])],
    },
    available: {
      batttalions: [
        keyPicker(Battlalions, [
          'Grimscuttle Spider Cluster',
          'Grimscuttle Skitterswarm',
          'Grimscuttle Nest',
        ]),
      ],
    },
    effects: [
      {
        name: `Deff Grotz of Shyish`,
        desc: `Each time a friendly GRIMSCUTTLE SPIDERFANG unit is affected by a spell or endless spell, you can roll a dice. If you do so, on a 5+, ignore the effects of that spell or endless spell on that unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Drawn to the Aetherglow`,
        desc: `You can reroll hit rolls for attacks made with melee weapons by friendly SKITTERSTRAND models if the target is a Wizard of Priest.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default Flavors
