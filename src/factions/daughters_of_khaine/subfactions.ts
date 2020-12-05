import { TItemDescriptions } from 'factions/factionTypes'
import { pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  DAUGHTERS_OF_KHAINE: {
    effects: pickEffects(BattleTraits, ['Daughters of Khaine']),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      prayers: [Prayers],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
