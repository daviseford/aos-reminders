import { SYLVANETH } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import RegularBattalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [SYLVANETH]: {
    effects: pickEffects(BattleTraits, [SYLVANETH]),
    available: {
      artifacts: [Artifacts],
      battalions: [RegularBattalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
