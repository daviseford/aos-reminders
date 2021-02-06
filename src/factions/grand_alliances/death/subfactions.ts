import { pickEffects } from 'factions/metatagger'
import { DEATH_GRAND_ALLIANCE } from 'meta/factions'
import DeathArtifacts from './artifacts'
import BattleTraits from './battle_traits'
import DeathCommandAbilities from './command_abilities'
import DeathCommandTraits from './command_traits'
import DeathUnits from './units'

const subFactions = {
  [DEATH_GRAND_ALLIANCE]: {
    effects: pickEffects(BattleTraits, ['Death']),
    available: {
      artifacts: [DeathArtifacts],
      command_abilities: [DeathCommandAbilities],
      command_traits: [DeathCommandTraits],
      units: [DeathUnits],
    },
  },
}

export default subFactions
