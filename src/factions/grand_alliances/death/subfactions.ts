import { pickEffects } from 'factions/metatagger'
import { DEATH_GRAND_ALLIANCE } from 'meta/factions'
import DeathArtifacts from './artifacts'
import BattleTraits from './battle_traits'
import DeathCommandAbilities from './command_abilities'
import DeathCommandTraits from './command_traits'
import DeathUnits from './units'
import { TItemDescriptions } from 'factions/factionTypes'

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
} satisfies TItemDescriptions

export default subFactions
