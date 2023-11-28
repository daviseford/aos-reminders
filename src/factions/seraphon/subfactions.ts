import { IItemDescription } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MonstrousRampages from './monstrous_rampages'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubFaction: IItemDescription = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    grand_strategies: [GrandStrategies],
    monstrous_rampages: [MonstrousRampages],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
}

const subFactions = {
  Coalesced: {
    effects: pickEffects(BattleTraits, ['COALESCED']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
    },
  },

  Starborne: {
    effects: pickEffects(BattleTraits, ['STARBORNE']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ["Dracothion's Tail", 'Fangs of Sotek'])],
    },
  },
}

export default subFactions
