import { SOULBLIGHT_GRAVELORDS } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const BaseArmy = {
  artifacts: [Artifacts],
  battalions: [Battalions],
  command_abilities: [CommandAbilities],
  command_traits: [CommandTraits],
  endless_spells: [EndlessSpells],
  // flavors: [Flavors],
  mount_traits: [MountTraits],
  prayers: [Prayers],
  scenery: [Scenery],
  spells: [Spells],
  units: [Units],
}

const subFactions = {
  'Legion of Blood': {
    mandatory: {},
    effects: pickEffects(BattleTraits, [SOULBLIGHT_GRAVELORDS, 'Legion of Blood']),
    available: { ...BaseArmy, command_traits: [keyPicker(CommandTraits, ['Legion of Blood'])] },
  },

  'Legion of Night': {
    mandatory: {},
    effects: pickEffects(BattleTraits, [SOULBLIGHT_GRAVELORDS, 'Legion of Night']),
  },

  'Vyrkos Dynasty': {
    mandatory: {},
    effects: pickEffects(BattleTraits, [SOULBLIGHT_GRAVELORDS, 'Vyrkos Dynasty']),
  },

  'Kastelai Dynasty': {
    mandatory: {},
    effects: pickEffects(BattleTraits, [SOULBLIGHT_GRAVELORDS, 'Kastelai Dynasty']),
  },

  'Avengorii Dynasty': {
    mandatory: {},
    effects: pickEffects(BattleTraits, [SOULBLIGHT_GRAVELORDS, 'Avengorii Dynasty']),
  },
}

export default subFactions
