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
  },

  battalions: {
    available: [Battalions],
  },

  command_traits: {
    available: [CommandTraits],
  },

  spells: {
    available: [Spells],
  },

  scenery: {
    available: [Scenery],
  },

  endless_spells: {
    available: [EndlessSpells],
  },

  artifacts: {
    available: [Artifacts],
  },
}

const subFactions: TSubFactions = {
  COALESCED: {
    ...baseSeraphonSubfaction,

    effects: pickEffects(SeraphonBattleTraits, ['COALESCED', 'SERAPHON']),

    battalions: {
      available: [
        keyPicker(Battalions, [
          'Eternal Temple-host',
          'Sunclaw Temple-host',
          'Firelance Temple-host',
          'Shadowstrike Temple-host',
          'Thunderquake Temple-host',
        ]),
      ],
    },

    flavors: {
      available: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
    },
  },

  // Starborne Constellation
  STARBORNE: {
    ...baseSeraphonSubfaction,

    effects: pickEffects(SeraphonBattleTraits, ['STARBORNE', 'SERAPHON']),

    battalions: {
      available: [
        keyPicker(Battalions, [
          'Eternal Starhost',
          'Sunclaw Starhost',
          'Firelance Starhost',
          'Shadowstrike Starhost',
          'Thunderquake Starhost',
          "Gul'Rok's Starhost",
          'Venomblade Starhost',
        ]),
      ],
    },

    flavors: {
      available: [keyPicker(Flavors, ["Dracothion's Tail", 'Fangs of Sotek'])],
    },
  },
}

export default subFactions
