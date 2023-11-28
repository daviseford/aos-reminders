import { NURGLE } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import MonstrousRampages from './monstrous_rampages'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions = {
  Nurgle: {
    effects: pickEffects(BattleTraits, [NURGLE, 'Battle Tactics']),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      monstrous_rampages: [MonstrousRampages],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
