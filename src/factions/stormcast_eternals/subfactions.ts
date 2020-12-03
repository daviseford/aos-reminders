import { TItemDescription } from 'factions/factionTypes'
import { pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'

const livingTempest: TItemDescription = {
  effects: pickEffects(BattleTraits, ['Legends of the Living Tempest']),
  // Command Traits
  //command_traits:

  // Artifacts
  //artifacts:
}

const subFactions = {
  LIVING_TEMPEST: livingTempest,
  CELESTIAL_SENTINELS: {
    ...livingTempest,
    effects: pickEffects(BattleTraits, ['Celestial Sentinels']),
  },
}

export default subFactions
