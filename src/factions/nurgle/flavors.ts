import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'

const Flavors = {
  'Munificent Wanderers': {
    effects: [...pickEffects(BattleTraits, ['Nurgle', 'Infested With Wonders'])],
  },

  'Befouling Host': {
    effects: [...pickEffects(BattleTraits, ['Nurgle', 'Festerbark Pox'])],
  },

  'Droning Guard': {
    effects: [...pickEffects(BattleTraits, ['Nurgle', 'Cloying Stench'])],
  },

  'The Blessed Sons': {
    effects: [...pickEffects(BattleTraits, ['Nurgle', "Nurgle's Embrace"])],
  },

  'Drowned Men': {
    effects: [...pickEffects(BattleTraits, ['Nurgle', 'Lords of Sea and Sky'])],
  },

  Filthbringers: {
    effects: [...pickEffects(BattleTraits, ['Nurgle', 'Rot Covens'])],
  },
}

export default Flavors
