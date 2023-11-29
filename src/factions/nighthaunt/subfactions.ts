import { NIGHTHAUNT } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import BattleTactics from './battle_tactics'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Spells from './spells'
import Units from './units'
import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'

const baseSubfaction = {
  effects: [],
  mandatory: {
    command_abilities: [keyPicker(CommandAbilities, ['Discorporate'])],
  },
  available: {
    artifacts: [Artifacts],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    spells: [Spells],
    units: [Units],
  },
} satisfies IItemDescription

const subFactions = {
  [NIGHTHAUNT]: {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [NIGHTHAUNT]),
  },
} satisfies TItemDescriptions

export default subFactions
