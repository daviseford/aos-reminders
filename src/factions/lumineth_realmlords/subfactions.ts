import { TItemDescriptions } from 'factions/factionTypes'
import { LUMINETH_REALMLORDS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [LUMINETH_REALMLORDS]: {
    effects: pickEffects(BattleTraits, [LUMINETH_REALMLORDS]),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      mount_traits: [MountTraits],
      prayers: [Prayers],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
