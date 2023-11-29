import { IItemDescription } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import NighthauntEndlessSpells from '../nighthaunt/endless_spells'
import NighthauntUnits from '../nighthaunt/units'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import GHoNArtifacts from './grand_host_of_nagash/artifacts'
import GHoNCommandTraits from './grand_host_of_nagash/command_traits'
import LegionOfBloodArtifacts from './legion_of_blood/artifacts'
import LegionOfBloodCommandTraits from './legion_of_blood/command_traits'
import LegionOfNightArtifacts from './legion_of_night/artifacts'
import LegionOfNightCommandTraits from './legion_of_night/command_traits'
import LegionOfSacramentArtifacts from './legion_of_sacrament/artifacts'
import LegionOfSacramentCommandTraits from './legion_of_sacrament/command_traits'
import SoulblightArtifacts from './soulblight/artifacts'
import SoulblightCommandTraits from './soulblight/command_traits'
import SoulblightFlavors from './soulblight/flavors'
import Spells from './spells'
import Units from './units'

const baseSubFaction: IItemDescription = {
  effects: pickEffects(BattleTraits, ['Core Legions']),
  mandatory: {
    command_abilities: [keyPicker(CommandAbilities, ['Endless Legions'])],
  },
  available: {
    battalions: [],
    command_abilities: [CommandAbilities],
    spells: [Spells],
    units: [
      Units,
      keyPicker(NighthauntUnits, [
        'Cairn Wraith',
        'Chainrasps',
        'Glaivewraith Stalkers',
        'Grimghast Reapers',
        'Guardian of Souls',
        'Hexwraiths',
        'Knight of Shrouds on Ethereal Steed',
        'Knight of Shrouds',
        'Lord Executioner',
        'Spirit Hosts',
        'Spirit Torment',
        'Tomb Banshee',
      ]),
    ],
  },
}

const subFactions = {
  'Grand Host of Nagash': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Grand Host of Nagash']),

    available: {
      ...baseSubFaction.available,
      artifacts: [GHoNArtifacts],
      command_traits: [GHoNCommandTraits],
      endless_spells: [NighthauntEndlessSpells],
    },
  },
  'Legion of Blood': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Blood']),
    available: {
      ...baseSubFaction.available,

      artifacts: [LegionOfBloodArtifacts],
      command_traits: [LegionOfBloodCommandTraits],
      endless_spells: [NighthauntEndlessSpells],
    },
  },
  'Legion of Night': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Night']),

    available: {
      ...baseSubFaction.available,

      artifacts: [LegionOfNightArtifacts],
      command_traits: [LegionOfNightCommandTraits],
      endless_spells: [NighthauntEndlessSpells],
    },
  },
  'Legion of Sacrament': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Sacrament']),
    available: {
      ...baseSubFaction.available,

      artifacts: [LegionOfSacramentArtifacts],
      command_traits: [LegionOfSacramentCommandTraits],
      endless_spells: [NighthauntEndlessSpells],
    },
  },
  Soulblight: {
    effects: pickEffects(BattleTraits, ['Soulblight']),
    available: {
      ...baseSubFaction.available,
      artifacts: [SoulblightArtifacts],
      command_traits: [SoulblightCommandTraits],
      flavors: [SoulblightFlavors],
    },
  },
}

export default subFactions
