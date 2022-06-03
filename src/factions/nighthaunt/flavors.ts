import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'

const Flavors = {
  'The Emerald Host': {
    effects: pickEffects(BattleTraits, ['The Emerald Host']),
  },

  'The Scarlet Doom': {
    effects: pickEffects(BattleTraits, ['The Scarlet Doom']),
  },

  'The Quicksilver Dead': {
    effects: pickEffects(BattleTraits, ['The Quicksilver Dead']),
  },

  'The Grieving Legion': {
    effects: pickEffects(BattleTraits, ['The Grieving Legion']),
  },
}

export default Flavors
