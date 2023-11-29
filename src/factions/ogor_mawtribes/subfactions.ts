import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MonstrousRampages from './monstrous_rampages'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'

const baseSubfaction = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    flavors: [Flavors],
    mount_traits: [MountTraits],
    monstrous_rampages: [MonstrousRampages],
    prayers: [Prayers],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
    grand_strategies: [GrandStrategies],
  },
} satisfies IItemDescription

const subFactions = {
  'Ogor Mawtribes': {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [
      'Grasp of the Everwinter',
      'Might Makes Right',
      'Ravenous Brutes',
      'Trampling Charge',
      'Gulping Bites',
    ]),
  },
  'The Roving Maw': {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, ['The Roving Maw', 'Ravenous Brutes', 'Might Makes Right']),
  },
} satisfies TItemDescriptions

export default subFactions
