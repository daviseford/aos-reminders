import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Hagg Nar': {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Devoted Disciples'])],
    },
    effects: [...pickEffects(BattleTraits, ['Daughters of the First Temple'])],
  },
  'Draichi Ganeth': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['The Darksword'])],
    },
    effects: [...pickEffects(BattleTraits, ['Bladed Killers'])],
  },
  Kraith: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Venom of Nagendra'])],
    },
    effects: [...pickEffects(BattleTraits, ['Disciples of Slaughter'])],
  },
  Khailebron: {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Mistress of Illusion'])],
    },
    effects: [...pickEffects(BattleTraits, ['Concealment and Stealth'])],
  },
  'Zainthar Kai': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Power in the Blood'])],
      command_traits: [keyPicker(CommandTraits, ['Curse of the Bloody-Handed'])],
    },
    effects: [...pickEffects(BattleTraits, ['Khaine`s Essence'])],
  },
}

export default Flavors
