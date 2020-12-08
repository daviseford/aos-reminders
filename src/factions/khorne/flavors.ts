import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Reapers of Vengeance': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Skullshard Mantle'])],
      command_abilities: [keyPicker(CommandAbilities, ['Leave None Alive'])],
      command_traits: [keyPicker(CommandTraits, ['Mage Eater'])],
    },
    effects: [...pickEffects(BattleTraits, ['Devour the Craven'])],
  },

  'The Bloodlords': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Halo of Blood'])],
      command_abilities: [keyPicker(CommandAbilities, ['First in His Sight'])],
      command_traits: [keyPicker(CommandTraits, ['Slaughterer`s Thirst'])],
    },
    effects: [...pickEffects(BattleTraits, ['Slay the Mighty'])],
  },

  'The Goretide': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Thronebreaker`s Torc'])],
      command_abilities: [keyPicker(CommandAbilities, ['Ever Onwards'])],
      command_traits: [keyPicker(CommandTraits, ['Hew the Foe'])],
    },
    effects: [...pickEffects(BattleTraits, ['Tireless Conquerors'])],
  },

  'The Skullfiend Tribe': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Crowncleaver'])],
      command_abilities: [keyPicker(CommandAbilities, ['For the Brass Citadel'])],
      command_traits: [keyPicker(CommandTraits, ['Master Decapitator'])],
    },
    effects: [...pickEffects(BattleTraits, ['Skull Hunters'])],
  },

  'The Flayed': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['The Slaughterhelm'])],
      command_abilities: [keyPicker(CommandAbilities, ['Wrathspeaker'])],
      command_traits: [keyPicker(CommandTraits, ['Vessel of Butchery'])],
    },
    effects: [...pickEffects(BattleTraits, ['Blood-woken Runes'])],
  },

  'The Baleful Lords': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Black Brass Crown'])],
      command_abilities: [keyPicker(CommandAbilities, ['Frenzied Annihilator'])],
      command_traits: [keyPicker(CommandTraits, ['Thirst for Carnage'])],
    },
    effects: [...pickEffects(BattleTraits, ['Unbound Slaughter'])],
  },
}

export default Flavors
