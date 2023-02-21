import { pickEffects } from 'factions/metatagger'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import Battalions from './battalions'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import GrandStrategies from './grand_strategies'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [GLOOMSPITE_GITZ]: {
    effects: pickEffects(BattleTraits, [GLOOMSPITE_GITZ]),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
