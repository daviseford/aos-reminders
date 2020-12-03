import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Lurid Haze': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Lurid Haze'])],
      command_traits: [keyPicker(CommandTraits, ['Lurid Haze'])],
      command_abilities: [keyPicker(CommandAbilities, ['Intoxicating Pall'])],
    },
    effects: [...pickEffects(BattleTraits, ['Lurid Haze'])],
  },
  'Faultless Blades': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Faultless Blades'])],
      command_traits: [keyPicker(CommandTraits, ['Faultless Blades'])],
      command_abilities: [keyPicker(CommandAbilities, ['Armour of Arrogance'])],
    },
    effects: [...pickEffects(BattleTraits, ['Faultless Blades'])],
  },
  'Scarlet Cavalcade': {
    mandatory: {
      artifacts: [keyPicker(CommandTraits, ['Scarlet Cavalcade'])],
      command_traits: [keyPicker(Artifacts, ['Scarlet Cavalcade'])],
      command_abilities: [keyPicker(CommandAbilities, ['Vicious Spurs'])],
    },
    effects: [...pickEffects(BattleTraits, ['Scarlet Cavalcade'])],
  },
}

export default Flavors
