import { MEGA_GARGANT_MERCENARIES } from 'meta/factions'
import { pickEffects } from '../metatagger'
import BattleTraits from './battle_traits'
import Units from './units'

const subFactions = {
  [MEGA_GARGANT_MERCENARIES]: {
    effects: pickEffects(BattleTraits, ['Disruptive Presence']),
    available: {
      units: [Units],
    },
  },
}

export default subFactions
