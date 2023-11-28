import { pickEffects } from 'factions/metatagger'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { IItemDescription } from 'factions/factionTypes'

const baseSubfaction: IItemDescription = {
  effects: [],

  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
}

const subFactions = {
  'Gloomspite Gitz': {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [GLOOMSPITE_GITZ, 'The Bad Moon']),
  },

  "Trugg's Troggherd": {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, ["Trugg's Troggherd", 'The Bad Moon']),
  },
}

export default subFactions
