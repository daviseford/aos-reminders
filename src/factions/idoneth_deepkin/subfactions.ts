import { pickEffects } from 'factions/metatagger'
import { IDONETH_DEEPKIN } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import BattleTactics from './battle_tactics'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MonstrousRampages from './monstrous_rampages'
import MountTraits from './mount_traits'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'

const baseSubfaction = {
  effects: [],

  available: {
    artifacts: [Artifacts],
    battle_tactics: [BattleTactics],
    command_traits: [CommandTraits],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    monstrous_rampages: [MonstrousRampages],
    mount_traits: [MountTraits],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
} satisfies IItemDescription

const subFactions = {
  [IDONETH_DEEPKIN]: {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [IDONETH_DEEPKIN]),
  },
} satisfies TItemDescriptions

export default subFactions
