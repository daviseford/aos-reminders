import { LUMINETH_REALMLORDS } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import RegularBattalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [LUMINETH_REALMLORDS]: {
    effects: pickEffects(BattleTraits, [LUMINETH_REALMLORDS]),
    available: {
      artifacts: [Artifacts],
      battalions: [RegularBattalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
