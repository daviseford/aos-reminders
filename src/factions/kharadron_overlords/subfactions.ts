import { KHARADRON_OVERLORDS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Triumphs from './triumphs'
import Units from './units'

const subFactions = {
  [KHARADRON_OVERLORDS]: {
    effects: pickEffects(BattleTraits, [KHARADRON_OVERLORDS, 'Battle Tactics']),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      mount_traits: [MountTraits],
      triumphs: [Triumphs], // Note that KO has custom Triumphs (currently the only army to follow this pattern)
      units: [Units],
    },
  },
}

export default subFactions
