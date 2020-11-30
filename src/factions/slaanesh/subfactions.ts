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

  // Spells
  spells: {
    available: [Spells],
  },

  // Endless Spells
  endless_spells: {
    available: [EndlessSpells],
  },

  // Scenery
  scenery: {
    available: [Scenery],
  },
}

const subFactions: TSubFactions = {
  INVADERS: {
    ...baseSubfaction,

    // Effects
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', "The Despoiler's Art"]),

    // Command Traits
    command_traits: {
      available: [keyPicker(CommandTraits, ['Obessions of the Invader'])],
    },

    // Artifacts
    artifacts: {
      available: [keyPicker(Artifacts, ['Sacred Spoils of War'])],
    },

    // Units
    units: {
      available: [
        Units,
        // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
        // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
      ],
    },

    // Battalions
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

    // Flavors
    flavors: {
      available: [keyPicker(Flavors, ['Lurid Haze'])],
    },
  },

  PRETENDERS: {
    ...baseSubfaction,
    // Effects
    effects: [...pickEffects(BattleTraits, ['Thrilling Compulsions', 'Magnificence Made Flesh'])],

    // Command Traits
    command_traits: {
      available: [keyPicker(CommandTraits, ['Aspects of the Perfect Liege'])],
    },

    // Artifacts
    artifacts: {
      available: [keyPicker(Artifacts, ['Regalia of the Rightful Heir'])],
    },

    // Units
    units: {
      available: [
        Units,
        // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
        // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
      ],
    },

    // Battalions
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
    // Flavors
    flavors: {
      available: [keyPicker(Flavors, ['Faultless Blades'])],
    },
  },

  GODSEEKERS: {
    ...baseSubfaction,
    // Rules that are applied automatically when you select this subfaction
    effects: [...pickEffects(BattleTraits, ['Thrilling Compulsions', 'Blessings of the Gleeful Chase'])],

    // Command Traits
    command_traits: {
      available: [keyPicker(CommandTraits, ['Traits of the Seeker Supreme'])],
    },

    // Artifacts
    artifacts: {
      available: [keyPicker(Artifacts, ['Treasures of the Hunt'])],
    },

    // Units
    units: {
      available: [
        Units,
        // SlaaneshS2DUnits.forEach(element => keyPicker(SlavestoDarknessFaction.Units, element)),
        // SlaaneshBoCUnits.forEach(element => keyPicker(BeastsofChaosFaction.Units, element)),
      ],
    },

    // Battalions
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
    // Flavors
    flavors: {
      available: [keyPicker(Flavors, ['Scarlet Cavalcade'])],
    },
  },

  SYLLESSKAN: {
    ...baseSubfaction,
    // Rules that are applied automatically when you select this subfaction
    effects: [...pickEffects(BattleTraits, ['Thrilling Compulsions', 'Vengeance Unleashed'])],

    // Command Traits
    //command_traits:

    // Artifacts
    //artifacts:

    // Units
    units: {
      available: [
        Units,
        // SlaaneshS2DUnits.forEach(element => keyPicker(SlavestoDarknessFaction.Units, element)),
        // SlaaneshBoCUnits.forEach(element => keyPicker(BeastsofChaosFaction.Units, element)),
      ],
    },

    // Battalions
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
    // Flavors
    //flavors:
  },
}

export default subFactions
