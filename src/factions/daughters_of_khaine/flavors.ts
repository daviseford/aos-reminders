import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import { BattleTraits } from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Hagg Nar': {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Hagg Nar'])],
    },
    effects: [...pickEffects(BattleTraits, ['Hagg Nar'])],
  },
  'Draichi Ganeth': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Draichi Ganeth'])],
    },
    effects: [...pickEffects(BattleTraits, ['Draichi Ganeth'])],
  },
  Kraith: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Kraith'])],
    },
    effects: [...pickEffects(BattleTraits, ['Kraith'])],
  },
  Khailebron: {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Khailebron'])],
    },
    effects: [...pickEffects(BattleTraits, ['Khailebron'])],
  },
  'Zainthar Kai': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Zainthar Kai'])],
      command_traits: [keyPicker(CommandTraits, ['Zainthar Kai'])],
    },
    effects: [...pickEffects(BattleTraits, ['Zainthar Kai'])],
  },
}

export default Flavors
