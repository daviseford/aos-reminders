import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'

const subFactions = {
  'Living Tempest': {
    effects: pickEffects(BattleTraits, ['Legends of the Living Tempest']),
  },
  'Celestial Senitels': {
    effects: pickEffects(BattleTraits, ['Celestial Sentinels']),
  },
}

export default subFactions
