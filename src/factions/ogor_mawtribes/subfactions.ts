import { OGOR_MAWTRIBES } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import OgorBattalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [OGOR_MAWTRIBES]: {
    effects: pickEffects(BattleTraits, [
      'Grasp of the Everwinter',
      'Might Makes Right',
      'Ravenous Brutes',
      'Trampling Charge',
      'Gulping Bites',
      'Battle Tactics',
    ]),
    available: {
      artifacts: [Artifacts],
      battalions: [OgorBattalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      mount_traits: [MountTraits],
      prayers: [Prayers],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
      grand_strategies: [GrandStrategies],
    },
  },
}

export default subFactions
