import { TItemDescriptions } from 'factions/factionTypes'
import { pickEffects } from 'factions/metatagger'
import { IDONETH_DEEPKIN } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [IDONETH_DEEPKIN]: {
    effects: pickEffects(BattleTraits, ['Idoneth Deepkin']),
    mandatory: {
      prayers: [Prayers],
    },
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      mount_traits: [MountTraits],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
