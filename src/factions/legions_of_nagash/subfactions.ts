import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import GHoNArtifacts from './grand_host_of_nagash/artifacts'
import GHoNBattalions from './grand_host_of_nagash/battalions'
import GHoNCommandTraits from './grand_host_of_nagash/command_traits'
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
      // TODO Add Nighthaunt Endless SPells
      // endless_spells: [NighthauntEndlessSpells],
      battalions: [keyPicker(Battalions, ['Deathmarch', 'Castellans of the Crimson Keep']), GHoNBattalions],
      artifacts: [GHoNArtifacts],
      command_traits: [GHoNCommandTraits],
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
