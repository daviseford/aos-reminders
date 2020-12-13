import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import NighthauntEndlessSpells from '../nighthaunt/endless_spells'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import GHoNArtifacts from './grand_host_of_nagash/artifacts'
import GHoNBattalions from './grand_host_of_nagash/battalions'
import GHoNCommandTraits from './grand_host_of_nagash/command_traits'
import LegionOfBloodArtifacts from './legion_of_blood/artifacts'
import LegionOfBloodBattalions from './legion_of_blood/battalions'
import LegionOfBloodCommandTraits from './legion_of_blood/command_traits'
import LegionOfNightArtifacts from './legion_of_night/artifacts'
import LegionOfNightBattalions from './legion_of_night/battalions'
import LegionOfNightCommandTraits from './legion_of_night/command_traits'
import LegionOfSacramentArtifacts from './legion_of_sacrament/artifacts'
import LegionOfSacramentBattalions from './legion_of_sacrament/battalions'
import LegionOfSacramentCommandTraits from './legion_of_sacrament/command_traits'
import SoulblightArtifacts from './soulblight/artifacts'
import SoulblightBattalions from './soulblight/battalions'
import SoulblightCommandTraits from './soulblight/command_traits'
import SoulblightFlavors from './soulblight/flavors'
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
    endless_spells: [NighthauntEndlessSpells],
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
      battalions: [
        keyPicker(Battalions, ['Deathmarch', 'Castellans of the Crimson Keep']),
        LegionOfBloodBattalions,
      ],
      artifacts: [LegionOfBloodArtifacts],
      command_traits: [LegionOfBloodCommandTraits],
    },
  },
  'Legion of Night': {
    ...baseLegion,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Night']),

    available: {
      ...baseLegion.available,
      battalions: [
        keyPicker(Battalions, ['Deathmarch', 'Castellans of the Crimson Keep']),
        LegionOfNightBattalions,
      ],
      artifacts: [LegionOfNightArtifacts],
      command_traits: [LegionOfNightCommandTraits],
    },
  },
  'Legion of Sacrament': {
    ...baseLegion,
    effects: pickEffects(BattleTraits, ['Core Legions', 'Legion of Sacrament']),
    available: {
      ...baseLegion.available,
      battalions: [
        keyPicker(Battalions, ['Deathmarch', 'Castellans of the Crimson Keep']),
        LegionOfSacramentBattalions,
      ],
      artifacts: [LegionOfSacramentArtifacts],
      command_traits: [LegionOfSacramentCommandTraits],
    },
  },
  Soulblight: {
    effects: pickEffects(BattleTraits, ['Soulblight']),
    available: {
      ...baseLegion.available,
      battalions: [
        keyPicker(Battalions, ['Court of Nulahmia', 'Castellans of the Crimson Keep']),
        SoulblightBattalions,
      ],
      artifacts: [SoulblightArtifacts],
      command_traits: [SoulblightCommandTraits],
      flavors: [SoulblightFlavors],
    },
  },
}

export default subFactions
