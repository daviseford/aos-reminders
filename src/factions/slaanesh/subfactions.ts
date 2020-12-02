import { TSubFaction, TSubFactions } from 'factions/factionTypes'
import { keyOmitter, keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import { Battalions } from './battalions'
import { BattleTraits } from './battle_traits'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Scenery from './scenery'
import { Spells } from './spells'
import { Units } from './units'

// import BeastsofChaosFaction from 'army/beasts_of_chaos/'
// import SlavestoDarknessFaction from 'army/slaves_to_darkness/'
// const SlaaneshS2DUnits = getChaosSlaves(MARK_SLAANESH).map(x => x.name) // Change this to return a list of string names.
// const SlaaneshBoCUnits = [
//   'Beastlord',
//   'Bestigors',
//   'Bullgors',
//   'Centigors',
//   'Cygor',
//   'Doombull',
//   'Dragon Ogor Shaggoth',
//   'Dragon Ogors',
//   'Ghorgon',
//   'Gors',
//   'Great Bray-Shaman',
//   'Tuskgor Chariots',
//   'Ungor Raiders',
//   'Ungors',
// ]

const baseSubfaction: TSubFaction = {
  effects: [],

  spells: {
    available: [Spells],
  },

  endless_spells: {
    available: [EndlessSpells],
  },

  scenery: {
    available: [Scenery],
  },

  units: {
    available: [
      Units,
      // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
      // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
    ],
  },
}

const subFactions: TSubFactions = {
  Invaders: {
    ...baseSubfaction,

    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', "The Despoiler's Art"]),

    command_traits: {
      available: [keyPicker(CommandTraits, ['Obessions of the Invader'])],
    },

    artifacts: {
      available: [keyPicker(Artifacts, ['Sacred Spoils of War'])],
    },

    battalions: {
      available: [
        keyOmitter(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
        // keyPicker(SlavestoDarknessFaction.Battalions, ['Pleasurebound Warband']),
        // keyPicker(BeastsofChaosFaction.Battalions, ['Depraved Drove']),
      ],
    },

    flavors: {
      available: [keyPicker(Flavors, ['Lurid Haze'])],
    },
  },

  Pretenders: {
    ...baseSubfaction,

    effects: [...pickEffects(BattleTraits, ['Thrilling Compulsions', 'Magnificence Made Flesh'])],

    command_traits: {
      available: [keyPicker(CommandTraits, ['Aspects of the Perfect Liege'])],
    },

    artifacts: {
      available: [keyPicker(Artifacts, ['Regalia of the Rightful Heir'])],
    },

    battalions: {
      available: [
        keyOmitter(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
        // keyPicker(SlavestoDarknessFaction.Battalions, ['Pleasurebound Warband']),
        // keyPicker(BeastsofChaosFaction.Battalions, ['Depraved Drove']),
      ],
    },

    flavors: {
      available: [keyPicker(Flavors, ['Faultless Blades'])],
    },
  },

  Godseekers: {
    ...baseSubfaction,

    effects: [...pickEffects(BattleTraits, ['Thrilling Compulsions', 'Blessings of the Gleeful Chase'])],

    command_traits: {
      available: [keyPicker(CommandTraits, ['Traits of the Seeker Supreme'])],
    },

    artifacts: {
      available: [keyPicker(Artifacts, ['Treasures of the Hunt'])],
    },

    battalions: {
      available: [
        keyOmitter(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
        // keyPicker(SlavestoDarknessFaction.Battalions, 'Pleasurebound Warband'),
        // keyPicker(BeastsofChaosFaction.Battalions, 'Depraved Drove'),
      ],
    },

    flavors: {
      available: [keyPicker(Flavors, ['Scarlet Cavalcade'])],
    },
  },

  "Syll'Esskan": {
    ...baseSubfaction,

    effects: [...pickEffects(BattleTraits, ['Thrilling Compulsions', 'Vengeance Unleashed'])],

    battalions: {
      available: [
        keyPicker(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
      ],
    },
  },
}

export default subFactions
