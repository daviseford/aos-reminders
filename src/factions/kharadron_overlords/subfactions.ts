import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Units from './units'
import { IItemDescription } from 'factions/factionTypes'

const baseSubfaction: IItemDescription = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    mount_traits: [MountTraits],
    units: [Units],
  },
}

const subFactions = {
  'Kharadron Overlords': { ...baseSubfaction },
  'Grundstok Expeditionary Force': {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, ['Grundstok Expeditionary Force']),
  },
}

export default subFactions
