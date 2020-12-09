import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Eternal Conflagration': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Shroud of Warpflame'])],
      command_abilities: [keyPicker(CommandAbilities, ['Infernos of Mutation'])],
      command_traits: [keyPicker(CommandTraits, ['Coruscating Flames'])],
    },
    effects: [...pickEffects(BattleTraits, ['Twisters of Materiality'])],
  },

  'Hosts Duplicitous': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Brand of the Split Daemon'])],
      command_abilities: [keyPicker(CommandAbilities, ['Impossible to Anticipate'])],
      command_traits: [keyPicker(CommandTraits, ['Will of the Phantom Lord'])],
    },
    effects: [...pickEffects(BattleTraits, ['Ranks of Mischievous Mirages'])],
  },

  'Hosts Arcanum': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['The Fanged Circlet'])],
      command_abilities: [keyPicker(CommandAbilities, ['Entourage of Sky-Sharks'])],
      command_traits: [keyPicker(CommandTraits, ['Spell Hunters'])],
    },
    effects: [...pickEffects(BattleTraits, ['Thieves of All Things Arcane'])],
  },

  'Cult of the Transient Form': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Chaotica Amulet'])],
      command_abilities: [keyPicker(CommandAbilities, ['Fate of Transmutation'])],
      command_traits: [keyPicker(CommandTraits, ['Defiant in their Pursuit'])],
    },
    effects: [...pickEffects(BattleTraits, ['The Change-gift'])],
  },

  'Pyrofane Cult': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Chainfire Amulet'])],
      command_abilities: [keyPicker(CommandAbilities, ['Immolate'])],
      command_traits: [keyPicker(CommandTraits, ['Shrouded in Unnatural Flame'])],
    },
    effects: [...pickEffects(BattleTraits, ['Arrows of Tzeentch'])],
  },

  'Guild of Summoners': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Brimstone Familiar'])],
      command_abilities: [keyPicker(CommandAbilities, ['Will of the Arcane Lords'])],
      command_traits: [keyPicker(CommandTraits, ['Prophet of the Ostensible'])],
    },
    effects: [...pickEffects(BattleTraits, ['Scions of the Exiled'])],
  },

  'Unbound Flux': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['The Enlightener'])],
      command_abilities: [keyPicker(CommandAbilities, ['Fuelled by Mayhem'])],
      command_traits: [keyPicker(CommandTraits, ['Aegis of Insanity'])],
    },
    effects: [...pickEffects(BattleTraits, ['Maddening Cascade'])],
  },

  'Cult of a Thousand Eyes': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Crown of Whispers'])],
      command_abilities: [keyPicker(CommandAbilities, ['Eyes Everywhere'])],
      command_traits: [keyPicker(CommandTraits, ['Tzeentch is Pleased'])],
    },
    effects: [...pickEffects(BattleTraits, ['Marked for Death'])],
  },
}

export default Flavors
