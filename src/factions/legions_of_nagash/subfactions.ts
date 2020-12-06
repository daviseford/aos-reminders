import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'

const baseLegion: TItemDescription = {
  effects: pickEffects(BattleTraits, ['Core Legions']),
  mandatory: {
    command_abilities: [keyPicker(CommandAbilities, ['Endless Legions'])],
  },
  available: {
    // artifacts: [Artifacts],
    // battalions: [Battalions],
    command_abilities: [CommandAbilities],
    // command_traits: [CommandTraits],
    // endless_spells: [EndlessSpells],
    // prayers: [Prayers],
    // scenery: [Scenery],
    // spells: [Spells],
    // units: [Units],
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
