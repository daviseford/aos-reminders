import { TSubFactions } from 'factions/factionTypes'
import { keyOmitter, keyPicker } from 'factions/metatagger'
import { Artifacts } from './artifacts'
import { Battalions } from './battalions'
import { BattleTraits } from './battle_traits'
import { CommandTraits } from './command_traits'
import { EndlessSpells } from './endless_spells'
import Flavors from './flavors'
import { Scenery } from './scenery'
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

const subFactions: TSubFactions = {
  INVADERS: {
    // Battle Traits
    battle_traits: {
      available: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'The Despoiler`s Art'])],
      mandatory: [],
    },

    // Command Traits
    command_traits: {
      available: [keyPicker(CommandTraits, ['Obessions of the Invader'])],
      mandatory: [],
    },

    // Artifacts
    artifacts: {
      available: [keyPicker(Artifacts, ['Sacred Spoils of War'])],
      mandatory: [],
    },

    // Spells
    spells: {
      available: [Spells],
      mandatory: [],
    },

    // Endless Spells
    endless_spells: {
      available: [EndlessSpells],
      mandatory: [],
    },

    // Scenery
    scenery: {
      available: [Scenery],
      mandatory: [],
    },

    // Units
    units: {
      available: [
        Units,
        // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
        // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
      ],
      mandatory: [],
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
      mandatory: [],
    },

    // Flavors
    flavors: {
      available: [keyPicker(Flavors, ['Lurid Haze'])],
      mandatory: [],
    },
  },

  PRETENDERS: {
    // Battle Traits
    battle_traits: {
      available: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Magnificence Made Flesh'])],
      mandatory: [],
    },

    // Command Traits
    command_traits: {
      available: [keyPicker(CommandTraits, ['Aspects of the Perfect Liege'])],
      mandatory: [],
    },

    // Artifacts
    artifacts: {
      available: [keyPicker(Artifacts, ['Regalia of the Rightful Heir'])],
      mandatory: [],
    },

    // Spells
    spells: {
      available: [Spells],
      mandatory: [],
    },

    // Endless Spells
    endless_spells: {
      available: [EndlessSpells],
      mandatory: [],
    },

    // Scenery
    scenery: {
      available: [Scenery],
      mandatory: [],
    },

    // Units
    units: {
      available: [
        Units,
        // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
        // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
      ],
      mandatory: [],
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
      mandatory: [],
    },
    // Flavors
    flavors: {
      available: [keyPicker(Flavors, ['Faultless Blades'])],
      mandatory: [],
    },
  },

  GODSEEKERS: {
    // Battle Traits
    battle_traits: {
      available: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Blessings of the Gleeful Chase'])],
      mandatory: [],
    },

    // Command Traits
    command_traits: {
      available: [keyPicker(CommandTraits, ['Traits of the Seeker Supreme'])],
      mandatory: [],
    },

    // Artifacts
    artifacts: {
      available: [keyPicker(Artifacts, ['Treasures of the Hunt'])],
      mandatory: [],
    },

    // Spells
    spells: {
      available: [Spells],
      mandatory: [],
    },

    // Endless Spells
    endless_spells: {
      available: [EndlessSpells],
      mandatory: [],
    },

    // Scenery
    scenery: {
      available: [Scenery],
      mandatory: [],
    },

    // Units
    units: {
      available: [
        Units,
        // SlaaneshS2DUnits.forEach(element => keyPicker(SlavestoDarknessFaction.Units, element)),
        // SlaaneshBoCUnits.forEach(element => keyPicker(BeastsofChaosFaction.Units, element)),
      ],
      mandatory: [],
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
      mandatory: [],
    },
    // Flavors
    flavors: {
      available: [keyPicker(Flavors, ['Scarlet Cavalcade'])],
      mandatory: [],
    },
  },

  SYLLESSKAN: {
    // Battle Traits
    battle_traits: {
      available: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Vengeance Unleashed'])],
      mandatory: [],
    },

    // Command Traits
    //command_traits:

    // Artifacts
    //artifacts:

    // Spells
    spells: {
      available: [Spells],
      mandatory: [],
    },

    // Endless Spells
    endless_spells: {
      available: [EndlessSpells],
      mandatory: [],
    },

    // Scenery
    scenery: {
      available: [Scenery],
      mandatory: [],
    },

    // Units
    units: {
      available: [
        Units,
        // SlaaneshS2DUnits.forEach(element => keyPicker(SlavestoDarknessFaction.Units, element)),
        // SlaaneshBoCUnits.forEach(element => keyPicker(BeastsofChaosFaction.Units, element)),
      ],
      mandatory: [],
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
      mandatory: [],
    },
    // Flavors
    //flavors:
  },
}

export default subFactions
