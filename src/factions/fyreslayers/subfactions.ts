import { pickEffects } from 'factions/metatagger'
import { FYRESLAYERS } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Units from './units'

const subFactions = {
  [FYRESLAYERS]: {
    effects: pickEffects(BattleTraits, [FYRESLAYERS, 'Battle Tactics', 'Ur-Gold Runes']),
    available: {
      artifacts: [Artifacts],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      mount_traits: [MountTraits],
      prayers: [Prayers],
      scenery: [Scenery],
      units: [Units],
    },
  },
}

export default subFactions
