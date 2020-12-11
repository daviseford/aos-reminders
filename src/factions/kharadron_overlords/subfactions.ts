import { TItemDescriptions } from 'factions/factionTypes'
import { KHARADRON_OVERLORDS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Units from './units'

const subFactions: TItemDescriptions = {
  [KHARADRON_OVERLORDS]: {
    effects: pickEffects(BattleTraits, [KHARADRON_OVERLORDS]),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      mount_traits: [MountTraits],
      units: [Units],
    },
  },
}

export default subFactions
