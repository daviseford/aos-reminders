import { LUMINETH_REALMLORDS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import BattleTactics from './battle_tactics'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'

const baseSubfaction = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
} satisfies IItemDescription

const subFactions = {
  [LUMINETH_REALMLORDS]: {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [LUMINETH_REALMLORDS]),
  },
} satisfies TItemDescriptions

export default subFactions
