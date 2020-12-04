import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Lurid Haze': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Oil of Exultation'])],
      command_traits: [keyPicker(CommandTraits, ['Feverish Anticipation'])],
      command_abilities: [keyPicker(CommandAbilities, ['Intoxicating Pall'])],
    },
    effects: [...pickEffects(BattleTraits, ['Lurid Haze'])],
  },
  'Faultless Blades': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Contemptuous Brand'])],
      command_traits: [keyPicker(CommandTraits, ['Contest of Cruelty'])],
      command_abilities: [keyPicker(CommandAbilities, ['Armour of Arrogance'])],
    },
    effects: [...pickEffects(BattleTraits, ['Faultless Blades'])],
  },
  'Scarlet Cavalcade': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Helm of the Last Rider'])],
      command_traits: [keyPicker(CommandTraits, ['Embodiment of Haste'])],
      command_abilities: [keyPicker(CommandAbilities, ['Vicious Spurs'])],
    },
    effects: [...pickEffects(BattleTraits, ['Scarlet Cavalcade'])],
  },
}

export default Flavors
