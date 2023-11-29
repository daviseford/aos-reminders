import { LEGION_OF_AZGORH } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Spells from './spells'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [LEGION_OF_AZGORH]: {
    effects: pickEffects(BattleTraits, ['LegionOfAzgorh']),

    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Burning Skies'])],
      spells: [keyPicker(Spells, ['Fireball'])],
    },

    available: {
      artifacts: [Artifacts],
      battalions: [],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [],
      scenery: [],
      spells: [Spells],
      units: [Units],
      flavors: [],
    },
  },
} satisfies TItemDescriptions

export default subFactions
