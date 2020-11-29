import { TSubFaction, TSubFactions } from 'factions/factionTypes'
import BattleTraits from './battle_traits'

const livingTempest: TSubFaction = {
  battle_traits: BattleTraits['Legends of the Living Tempest'],
}

const celestialSentinels: TSubFaction = {
  ...livingTempest,
  battle_traits: BattleTraits['Celestial Sentinels'],
}

const subFactions: TSubFactions = {
  LIVING_TEMPEST: livingTempest,
  CELESTIAL_SENTINELS: celestialSentinels,
}

export default subFactions
