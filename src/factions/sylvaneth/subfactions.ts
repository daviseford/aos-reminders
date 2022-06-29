import { keyPicker, pickEffects } from 'factions/metatagger'
import { SYLVANETH } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [SYLVANETH]: {
    effects: pickEffects(BattleTraits, [SYLVANETH, 'Battle Tactics']),

    mandatory: {
      spells: [keyPicker(Spells, ['Verdant Blessing'])],
    },

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
