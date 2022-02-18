import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import { BEASTS_OF_CHAOS } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [BEASTS_OF_CHAOS]: {
    effects: pickEffects(BattleTraits, [BEASTS_OF_CHAOS, 'Battle Tactics', 'Monstrous Rampages']),

    available: {
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      grand_strategies: [GrandStrategies],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units, keyPicker(SlavesToDarknessUnits, ['Chaos Spawn'])],
      flavors: [Flavors],
    },
  },
}

export default subFactions
