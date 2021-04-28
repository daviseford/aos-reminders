import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'The Emerald Host': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ["The Traitor Knight's Blade"])],
      command_traits: [keyPicker(CommandTraits, ['Lord of the Host'])],
    },
    effects: [...pickEffects(BattleTraits, ['The Emerald Curse', 'Knights of Regret'])],
  },

  "Reikenor's Condemned": {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Corpse Candle'])],
      command_abilities: [keyPicker(CommandAbilities, ['Death Comes Swiftly'])],
    },
    effects: [...pickEffects(BattleTraits, ['Unrelenting Taskmasters', 'Acolyte of the Grimhailer'])],
  },
}

export default Flavors
