import { pickEffects } from 'factions/metatagger'
import { IDONETH_DEEPKIN } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [IDONETH_DEEPKIN]: {
    effects: pickEffects(BattleTraits, [IDONETH_DEEPKIN, 'Battle Tactics']),

    available: {
      artifacts: [Artifacts],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      mount_traits: [MountTraits],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
