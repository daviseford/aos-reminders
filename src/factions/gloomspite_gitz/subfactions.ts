import { pickEffects } from 'factions/metatagger'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import MonstrousRampages from './monstrous_rampages'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
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
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    monstrous_rampages: [MonstrousRampages],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
} satisfies IItemDescription

const subFactions = {
  'Gloomspite Gitz': {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [GLOOMSPITE_GITZ, 'The Bad Moon']),
  },

  "Trugg's Troggherd": {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, ["Trugg's Troggherd", 'The Bad Moon']),
  },
} satisfies TItemDescriptions

export default subFactions
