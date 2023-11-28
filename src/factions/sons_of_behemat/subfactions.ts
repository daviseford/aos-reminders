import { SONS_OF_BEHEMAT } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Units from './units'
import { pickEffects } from 'factions/metatagger'
import battle_traits from './battle_traits'
import MonstrousRampages from './monstrous_rampages'
import { IItemDescription } from 'factions/factionTypes'

const baseSubFaction: IItemDescription = {
  effects: [],

  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_traits: [CommandTraits],
    grand_strategies: [GrandStrategies],
    flavors: [Flavors],
    monstrous_rampages: [MonstrousRampages],
    units: [Units],
  },
}

const subFactions = {
  'Sons Of Behemat': {
    ...baseSubFaction,
    effects: pickEffects(battle_traits, [SONS_OF_BEHEMAT, 'Battle Tactics']),
  },

  "King Brodd's Stomp": {
    ...baseSubFaction,
    effects: pickEffects(battle_traits, ["King Brodd's Stomp", "King Brodd's Stomp Battle Tactics"]),
  },
}

export default subFactions
