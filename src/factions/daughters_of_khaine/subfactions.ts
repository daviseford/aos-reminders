import { pickEffects } from 'factions/metatagger'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [DAUGHTERS_OF_KHAINE]: {
    effects: pickEffects(BattleTraits, ['Apostles of the Murder God']),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      prayers: [Prayers],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
