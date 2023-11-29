import { pickEffects } from 'factions/metatagger'
import { BEASTS_OF_CHAOS } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import BattleTactics from './battle_tactics'
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

const baseSubFaction: IItemDescription = {
  effects: [],
  available: {
    artifacts: [Artifacts],
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
}

const SubFactions = {
  [BEASTS_OF_CHAOS]: {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, [BEASTS_OF_CHAOS]),
  },
} satisfies TItemDescriptions

export default SubFactions
