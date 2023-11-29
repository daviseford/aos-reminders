import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MonstrousRampages from './monstrous_rampages'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { SYLVANETH } from 'meta/factions'

const baseSubFaction = {
  mandatory: {
    spells: [keyPicker(Spells, ['Verdant Blessing'])],
  },
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    monstrous_rampages: [MonstrousRampages],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
  effects: [],
} satisfies IItemDescription

const subFactions = {
  'The Burgeoning': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Burgeoning', SYLVANETH]),
  },
  'The Reaping': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Reaping', SYLVANETH]),
  },
  'The Dwindling': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Dwindling', SYLVANETH]),
  },
  Everdusk: {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Everdusk', SYLVANETH]),
  },
  'The Evergreen Hunt': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Evergreen Hunt']),
  },
} satisfies TItemDescriptions

export default subFactions
