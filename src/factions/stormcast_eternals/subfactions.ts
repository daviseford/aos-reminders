import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'

const subFactions = {
  LIVING_TEMPEST: {
    effects: pickEffects(BattleTraits, ['Legends of the Living Tempest']),
  },
  CELESTIAL_SENTINELS: {
    effects: pickEffects(BattleTraits, ['Celestial Sentinels']),
  },
}

export default subFactions
