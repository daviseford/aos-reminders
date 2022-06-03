import { NIGHTHAUNT } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Spells from './spells'
import Units from './units'
import GrandStrategies from './grand_strategies'

const subFactions = {
  [NIGHTHAUNT]: {
    effects: pickEffects(BattleTraits, [NIGHTHAUNT]),
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Discorporate'])],
    },
    available: {
      artifacts: [Artifacts],
      battalions: [],
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
