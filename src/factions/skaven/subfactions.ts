import { pickEffects } from 'factions/metatagger'
import { SKAVEN } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [SKAVEN]: {
    effects: pickEffects(BattleTraits, [SKAVEN, 'Battle Tactics']),
    available: {
      artifacts: [Artifacts],
      battalions: [],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      prayers: [Prayers],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
