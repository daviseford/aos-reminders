import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from 'factions/metatagger'
import CitiesOfSigmarUnits from '../cities_of_sigmar/units'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MonstrousRampages from './monstrous_rampages'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const baseSubFaction = {
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    monstrous_rampages: [MonstrousRampages],
    mount_traits: [MountTraits],
    prayers: [Prayers],
    spells: [Spells],
    units: [Units],
  },
  effects: [],
} satisfies IItemDescription

const subFactions = {
  'Scions of the Storm': {
    effects: pickEffects(BattleTraits, ['Scions of the Storm']),
    available: {
      ...baseSubFaction.available,
      command_traits: [
        keyPicker(CommandTraits, [
          'Shock and Awe',
          'Envoy of the Heavens',
          'Master of the Celestial Menagerie',
        ]),
      ],
    },
  },
  Stormkeep: {
    effects: pickEffects(BattleTraits, ['Stormkeep']),
    available: {
      ...baseSubFaction.available,
      allied_units: [CitiesOfSigmarUnits],
      command_traits: [
        keyPicker(CommandTraits, [
          'Staunch Defender',
          'Envoy of the Heavens',
          'Master of the Celestial Menagerie',
        ]),
      ],
    },
  },

  'Draconith Skywing': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Draconith Skywing']),
  },
} satisfies TItemDescriptions

export default subFactions
