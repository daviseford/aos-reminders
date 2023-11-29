import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'
import { TItemDescriptions } from 'factions/factionTypes'

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
} satisfies TItemDescriptions

export default Flavors
