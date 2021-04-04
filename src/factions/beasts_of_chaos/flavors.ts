import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  Allherd: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Blade of the Desecrator'])],
      command_abilities: [keyPicker(CommandAbilities, ['Booming Roar'])],
      command_traits: [keyPicker(CommandTraits, ['Dominator'])],
    },
    effects: [...pickEffects(BattleTraits, ['Bestial Might'])],
  },

  Gavespawn: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Mutating Gnarlblade'])],
      command_abilities: [keyPicker(CommandAbilities, ['Propagator of Devolution'])],
      command_traits: [keyPicker(CommandTraits, ['Unravelling Aura'])],
    },
    effects: [...pickEffects(BattleTraits, ['Gift of Morghur'])],
  },

  Darkwalkers: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Desolate Shard'])],
      command_abilities: [keyPicker(CommandAbilities, ['Savage Encirclement'])],
      command_traits: [keyPicker(CommandTraits, ['Nomadic Leader'])],
    },
    effects: [...pickEffects(BattleTraits, ['Shadowbeasts'])],
  },
}

export default Flavors
