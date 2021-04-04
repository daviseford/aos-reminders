import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Hagg Nar': {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Devoted Disciple'])],
      command_abilities: [keyPicker(CommandAbilities, ['Send Forth the Cauldrons'])],
      artifacts: [keyPicker(Artifacts, ['The Ulfuri'])],
    },
    effects: [...pickEffects(BattleTraits, ['Daughters of the First Temple'])],
  },
  'Draichi Ganeth': {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ["Victor of Yaith'ril"])],
      command_abilities: [keyPicker(CommandAbilities, ['A Thousand Bladeforms'])],
      artifacts: [keyPicker(Artifacts, ["Death's Kiss"])],
    },
    effects: [...pickEffects(BattleTraits, ['Bladed Killers'])],
  },
  'The Kraith': {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Bathe in Their Blood'])],
      command_abilities: [keyPicker(CommandAbilities, ['Inspired by Carnage'])],
      artifacts: [keyPicker(Artifacts, ['Venom of Nagendra'])],
    },
    effects: [...pickEffects(BattleTraits, ['Disciples of Slaughter'])],
  },
  Khailebron: {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['Mistress of Illusion'])],
      command_abilities: [keyPicker(CommandAbilities, ['Masters of the Shadowpaths'])],
      artifacts: [keyPicker(Artifacts, ['Whisperdeath'])],
    },
    effects: [...pickEffects(BattleTraits, ['Concealment and Stealth'])],
  },
  'Khelt Nar': {
    mandatory: {
      command_traits: [keyPicker(CommandTraits, ['The Circling Flock'])],
      command_abilities: [keyPicker(CommandAbilities, ['Bleed the Mind'])],
      artifacts: [keyPicker(Artifacts, ["Gaisa's Falx"])],
    },
    effects: [...pickEffects(BattleTraits, ['Strike and Fade'])],
  },
  'Zainthar Kai': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Power in the Blood'])],
      command_traits: [keyPicker(CommandTraits, ['Curse of the Bloody-Handed'])],
      artifacts: [keyPicker(Artifacts, ['Crimson Talisman'])],
    },
    effects: [...pickEffects(BattleTraits, ["Khaine's Essence"])],
  },
}

export default Flavors
