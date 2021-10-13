import { KHARADRON_OVERLORDS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Triumphs from './triumphs'
import Units from './units'

const subFactions = {
  [KHARADRON_OVERLORDS]: {
    effects: pickEffects(BattleTraits, [KHARADRON_OVERLORDS]),
    available: {
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      mount_traits: [MountTraits],
      triumphs: [Triumphs], // Note that KO has custom Triumphs (currently the only army to follow this pattern)
      units: [Units],
    },
  },
}

export default subFactions
