import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import battle_traits from './battle_traits'
import command_abilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const baseSubFaction = {
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_abilities: [command_abilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    prayers: [Prayers],
    spells: [Spells],
    units: [Units],
  },
  effects: [],
} satisfies IItemDescription

const subFactions = {
  Ravagers: {
    effects: pickEffects(battle_traits, ['Ravagers']),
    available: {
      ...baseSubFaction.available,
    },
  },
  Cabalists: {
    effects: pickEffects(battle_traits, ['Cabalists']),
    available: {
      ...baseSubFaction.available,
    },
  },
  Despoilers: {
    effects: pickEffects(battle_traits, ['Despoilers']),
    available: {
      ...baseSubFaction.available,
    },
  },
  'Host of the Everchosen': {
    effects: pickEffects(battle_traits, ['Host of the Everchosen']),
    available: {
      ...baseSubFaction.available,
    },
  },
  'The Knights of the Empty Throne': {
    effects: pickEffects(battle_traits, ['The Knights of the Empty Throne']),
    available: {
      ...baseSubFaction.available,
    },
  },
  'Legions of the First Prince': {
    effects: pickEffects(battle_traits, ['Legions of the First Prince']),
    available: {
      ...baseSubFaction.available,
    },
  },
} satisfies TItemDescriptions

export default subFactions
