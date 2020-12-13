import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import Spells from './spells'
import Units from './units'

const baseLegion: TItemDescription = {
  effects: pickEffects(BattleTraits, ['Core Legions']),
  mandatory: {
    command_abilities: [keyPicker(CommandAbilities, ['Endless Legions'])],
  },
  available: {
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    spells: [Spells],
    units: [Units],
  },
}

const subFactions: TItemDescriptions = {
  'Grand Host of Nagash': {
    ...baseLegion,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Grand Host of Nagash']),

    available: {
      ...baseLegion.available,
    },
  },
  'Legion of Blood': {
    ...baseLegion,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Blood']),
    available: {
      ...baseLegion.available,
    },
  },
  'Legion of Night': {
    ...baseLegion,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Night']),

    available: {
      ...baseLegion.available,
    },
  },
  'Legion of Sacrament': {
    ...baseLegion,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Sacrament']),
    available: {
      ...baseLegion.available,
    },
  },
  Soulblight: {
    effects: pickEffects(BattleTraits, ['Soulblight']),
    available: {},
  },
}

export default subFactions
