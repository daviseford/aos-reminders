import { TSubFaction, TSubFactions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import { Battalions } from './battalions'
import { SeraphonBattleTraits } from './battle_traits'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import { Units } from './units'

const baseSeraphonSubfaction: TSubFaction = {
  effects: [],

  units: {
    available: [Units],
    mandatory: [],
  },

  battalions: {
    available: [Battalions],
    mandatory: [],
  },

  command_traits: {
    available: [CommandTraits],
    mandatory: [],
  },

  spells: {
    available: [Spells],
    mandatory: [],
  },

  scenery: {
    available: [Scenery],
    mandatory: [],
  },

  endless_spells: {
    available: [EndlessSpells],
    mandatory: [],
  },

  artifacts: {
    available: [Artifacts],
    mandatory: [],
  },
}

const subFactions: TSubFactions = {
  COALESCED: {
    ...baseSeraphonSubfaction,

    effects: pickEffects(SeraphonBattleTraits, ['COALESCED', 'SERAPHON']),

    flavors: {
      available: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
      mandatory: [],
    },
  },

  // Starborne Constellation
  STARBORNE: {
    ...baseSeraphonSubfaction,

    effects: pickEffects(SeraphonBattleTraits, ['STARBORNE', 'SERAPHON']),

    flavors: {
      available: [keyPicker(Flavors, ["Dracothion's Tail", 'Fangs of Sotek'])],
      mandatory: [],
    },
  },
}

export default subFactions
