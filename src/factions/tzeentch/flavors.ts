import { pickEffects } from 'factions/metatagger'

import BattleTraits from './battle_traits'

const Flavors = {
  'The Eternal Conflagration': {
    effects: [...pickEffects(BattleTraits, ['Twisters of Materiality'])],
  },

  'Hosts Duplicitous': {
    effects: [...pickEffects(BattleTraits, ['Ranks of Mischievous Mirages'])],
  },

  'Hosts Arcanum': {
    effects: [...pickEffects(BattleTraits, ['Thieves of All Things Arcane'])],
  },

  'Cult of the Transient Form': {
    effects: [...pickEffects(BattleTraits, ['The Change-gift'])],
  },

  'Pyrofane Cult': {
    effects: [...pickEffects(BattleTraits, ['Arrows of Tzeentch'])],
  },

  'Guild of Summoners': {
    effects: [...pickEffects(BattleTraits, ['Scions of the Exiled'])],
  },
}

export default Flavors
