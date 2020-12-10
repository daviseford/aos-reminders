import { TItemDescriptions } from 'factions/factionTypes'
import { TOMB_KINGS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [TOMB_KINGS]: {
    effects: pickEffects(BattleTraits, ['Deathless Minions']),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
