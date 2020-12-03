import { TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import { Battalions } from './battalions'
import { BattleTraits } from './battle_traits'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import { Prayers } from './prayers'
import { Spells } from './spells'
import { Units } from './units'

const subFactions: TItemDescriptions = {
  DAUGHTERS_OF_KHAINE: {
    effects: pickEffects(BattleTraits, ['Daughters of Khaine']),

    available: {
      command_traits: [keyPicker(CommandTraits, ['Daughters of Khaine'])],
      artifacts: [keyPicker(Artifacts, ['Gifts of Morathi', 'Artifacts of Shadow', 'Relics of Khaine'])],
      spells: [Spells],
      prayers: [Prayers],
      units: [Units],
      battalions: [Battalions],
      flavors: [keyPicker(Flavors, ['Hagg Nar', 'Draichi Ganeth', 'Kraith', 'Khailebron', 'Zainthar Kai'])],
    },
  },
}

export default subFactions
