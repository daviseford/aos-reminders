import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'

const Flavors = {
  'Munificent Wanderers': {
    effects: pickEffects(BattleTraits, ['Infested With Wonders']),
  },

  'Befouling Host': {
    effects: pickEffects(BattleTraits, ['Festerbark Pox']),
  },

  'Droning Guard': {
    effects: pickEffects(BattleTraits, ['Cloying Stench']),
  },

  'The Blessed Sons': {
    effects: pickEffects(BattleTraits, ["Nurgle's Embrace"]),
  },

  'Drowned Men': {
    effects: pickEffects(BattleTraits, ['Lords of Sea and Sky']),
  },

  Filthbringers: {
    effects: pickEffects(BattleTraits, ['Rot Covens']),
  },
}

export default Flavors
