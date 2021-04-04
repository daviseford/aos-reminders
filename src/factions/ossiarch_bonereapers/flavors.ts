import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Mortis Praetorians': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ["Artificer's Blade"])],
      command_traits: [keyPicker(CommandTraits, ["Katakros' Chosen"])],
      command_abilities: [keyPicker(CommandAbilities, ['Counter-strike'])],
    },
    effects: [...pickEffects(BattleTraits, ['Mortis Praetorians'])],
  },
  'Petrifex Elite': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Godbone Armour'])],
      command_traits: [keyPicker(CommandTraits, ['Mighty Archaeossian'])],
      command_abilities: [keyPicker(CommandAbilities, ['Bludgeon'])],
    },
    effects: [...pickEffects(BattleTraits, ['Petrifex Elite'])],
  },
  'Stalliarch Lords': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Nadir-bound Mount'])],
      command_traits: [keyPicker(CommandTraits, ['Twisted Challenge'])],
      command_abilities: [keyPicker(CommandAbilities, ['Rally Back'])],
    },
    effects: [...pickEffects(BattleTraits, ['Stalliarch Lords'])],
  },
  'Ivory Host': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Beastbone Blade'])],
      command_traits: [keyPicker(CommandTraits, ['Scrimshawed Savage'])],
      command_abilities: [keyPicker(CommandAbilities, ['Temper Fury'])],
    },
    effects: [...pickEffects(BattleTraits, ['Ivory Host'])],
  },
  'Null Myriad': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Baleful Blade'])],
      command_traits: [keyPicker(CommandTraits, ['Unsettling and Sinister'])],
      command_abilities: [keyPicker(CommandAbilities, ['Holdfast'])],
    },
    effects: [...pickEffects(BattleTraits, ['Null Myriad'])],
  },
  Crematorians: {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Searing Blade'])],
      command_traits: [keyPicker(CommandTraits, ['Wrathful Avenger'])],
      command_abilities: [keyPicker(CommandAbilities, ['Levellers of Cities'])],
    },
    effects: [...pickEffects(BattleTraits, ['Crematorians'])],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
