import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Munificent Wanderers': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Mucktalon'])],
      command_abilities: [keyPicker(CommandAbilities, ['Infested with Wonders'])],
      command_traits: [keyPicker(CommandTraits, ['One Last Gift'])],
    },
    effects: [...pickEffects(BattleTraits, ['Locus of Corrosion'])],
  },

  'Droning Guard': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Cloak of Flies'])],
      command_abilities: [keyPicker(CommandAbilities, ['Twice-blessed Rotspawn'])],
      command_traits: [keyPicker(CommandTraits, ['Rotwing Commander'])],
    },
    effects: [...pickEffects(BattleTraits, ['Locus of Corrosion'])],
  },

  'Blessed Sons': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Blotshell Bileplate'])],
      command_abilities: [keyPicker(CommandAbilities, ['Degraded and Defiled'])],
      command_traits: [keyPicker(CommandTraits, ['Foul Conqueror'])],
    },
    effects: [...pickEffects(BattleTraits, ["Nurgle's Embrace"])],
  },

  'Drowned Men': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Rot-kraken Hide'])],
      command_abilities: [keyPicker(CommandAbilities, ['Kneel Before the Plague'])],
      command_traits: [keyPicker(CommandTraits, ['Bloated Raider'])],
    },
    effects: [...pickEffects(BattleTraits, ["Nurgle's Embrace"])],
  },
}

export default Flavors
