import { keyPicker, pickEffects } from 'factions/metatagger'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [DAUGHTERS_OF_KHAINE]: {
    effects: pickEffects(BattleTraits, [DAUGHTERS_OF_KHAINE, 'Battle Tactics']),

    mandatory: {
      command_abilities: keyPicker(CommandAbilities, ['All-out Slaughter']),
    },

    available: {
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      prayers: [Prayers],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
