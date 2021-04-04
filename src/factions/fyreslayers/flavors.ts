import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Vostarg (Lodge)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Vosaxe'])],
      command_traits: [keyPicker(CommandTraits, ['Fiery Endurance'])],
      command_abilities: [keyPicker(CommandAbilities, ['Honour Our Ancestors'])],
    },
    effects: [...pickEffects(BattleTraits, ['Vostarg (Lodge)'])],
  },
  'Greyfyrd (Lodge)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Helm of Obsidia'])],
      command_traits: [keyPicker(CommandTraits, ['Battle-scarred Veteran'])],
      command_abilities: [keyPicker(CommandAbilities, ['Expert Cohesion'])],
    },
    effects: [...pickEffects(BattleTraits, ['Greyfyrd (Lodge)'])],
  },
  'Hermdar (Lodge)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Tyrant Slayer'])],
      command_traits: [keyPicker(CommandTraits, ['Warrior Indominate'])],
      command_abilities: [keyPicker(CommandAbilities, ['Skull-breakers and Oath-takers'])],
    },
    effects: [...pickEffects(BattleTraits, ['Hermdar (Lodge)'])],
  },
  'Lofnir (Lodge)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Igneous Battle-throne'])],
      command_traits: [keyPicker(CommandTraits, ['Explosive Charge'])],
      command_abilities: [keyPicker(CommandAbilities, ['Torrent of Magma'])],
    },
    effects: [...pickEffects(BattleTraits, ['Lofnir (Lodge)'])],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
