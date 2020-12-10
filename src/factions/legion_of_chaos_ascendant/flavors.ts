import { keyPicker, pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const Flavors = {
  'Legion of the First Prince': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['The Shadow Legion'])],
      spells: [keyPicker(Spells, ['The Master`s Command'])],
    },
    effects: [...pickEffects(BattleTraits, ['First-Damned Prince'])],
  },
}

export default Flavors
