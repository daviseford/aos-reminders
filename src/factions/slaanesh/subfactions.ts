import { TSubFaction } from 'factions/factionTypes'
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

const subFactions: TSubFaction = {
  INVADERS: {
    // Battle Traits
    battle_traits: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Invaders Host'])],

    // Command Traits
    command_traits: [
      keyPicker(CommandTraits, [
        'Best of the Best',
        'Glory Hog',
        'Hurler of Obscenities',
        'Territorial',
        'Skin-taker',
        'Delusions of Infallibility',
      ]),
    ],

    // Artifacts
    artifacts: [
      keyPicker(Artifacts, [
        'The Rod of Misrule',
        'Rapier of Ecstatic Conquest',
        'Whip of Subversion',
        'Icon of Infinite Excess',
        'Fallacious Gift',
        'The Beguiling Gem',
      ]),
    ],

    // Spells
    spells: [Spells],

    // Endless Spells
    endless_spells: [EndlessSpells],

    // Scenery
    scenery: [Scenery],

    // Units
    units: [
      Units,
      // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
      // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
    ],

    // Battalions
    battalions: [
      keyOmitter(Battalions, [
        'The Vengeful Alliance',
        'Devout Supplicants',
        'Vengeful Throng',
        'Daemonsteel Contingent',
      ]),
      // keyPicker(SlavestoDarknessFaction.Battalions, ['Pleasurebound Warband']),
      // keyPicker(BeastsofChaosFaction.Battalions, ['Depraved Drove']),
    ],

    // Flavors
    flavors: [keyPicker(Flavors, ['Lurid Haze'])],
  },

  PRETENDERS: {
    // Battle Traits
    battle_traits: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Pretenders Host'])],

    // Command Traits
    command_traits: [
      keyPicker(CommandTraits, [
        'Strength of Godhood',
        'Monarch of Lies',
        'True Child of Slaanesh',
        'Strongest Alone',
        'Hunter of Godbeasts',
        'Inspirer',
      ]),
    ],

    // Artifacts
    artifacts: [
      keyPicker(Artifacts, [
        'The Crown of Dark Secrets',
        'Pendant of Slaanesh',
        'Sliverslash',
        'Sceptre of Domination',
        'Breathtaker',
        'Mask of Spiteful Beauty',
      ]),
    ],

    // Spells
    spells: [Spells],

    // Endless Spells
    endless_spells: [EndlessSpells],

    // Scenery
    scenery: [Scenery],

    // Units
    units: [
      Units,
      // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
      // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
    ],

    // Battalions
    battalions: [
      keyOmitter(Battalions, [
        'The Vengeful Alliance',
        'Devout Supplicants',
        'Vengeful Throng',
        'Daemonsteel Contingent',
      ]),
      // keyPicker(SlavestoDarknessFaction.Battalions, ['Pleasurebound Warband']),
      // keyPicker(BeastsofChaosFaction.Battalions, ['Depraved Drove']),
    ],
    // Flavors
    flavors: [keyPicker(Flavors, ['Faultless Blades'])],
  },

  GODSEEKERS: {
    // Battle Traits
    battle_traits: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Godseekers Host'])],

    // Command Traits
    command_traits: [
      keyPicker(CommandTraits, [
        'Hunter Supreme',
        'Thrill-seeker',
        'Into the Fray',
        'Trail-sniffer',
        'Symphoniac',
        'Speed-chaser',
      ]),
    ],

    // Artifacts
    artifacts: [
      keyPicker(Artifacts, [
        'Cameo of the Dark Prince',
        'Girdle of the Realm-racer',
        'Threnody Voicebox',
        'Lash of Despair',
        'Enrapturing Circlet',
        'Bindings of Slaanesh',
      ]),
    ],

    // Spells
    spells: [Spells],

    // Endless Spells
    endless_spells: [EndlessSpells],

    // Scenery
    scenery: [Scenery],

    // Units
    units: [
      Units,
      // SlaaneshS2DUnits.forEach(element => keyPicker(SlavestoDarknessFaction.Units, element)),
      // SlaaneshBoCUnits.forEach(element => keyPicker(BeastsofChaosFaction.Units, element)),
    ],

    // Battalions
    battalions: [
      keyOmitter(Battalions, [
        'The Vengeful Alliance',
        'Devout Supplicants',
        'Vengeful Throng',
        'Daemonsteel Contingent',
      ]),
      // keyPicker(SlavestoDarknessFaction.Battalions, 'Pleasurebound Warband'),
      // keyPicker(BeastsofChaosFaction.Battalions, 'Depraved Drove'),
    ],
    // Flavors
    flavors: [keyPicker(Flavors, ['Scarlet Cavalcade'])],
  },

  SYLLESSKAN: {
    // Battle Traits
    battle_traits: [keyPicker(BattleTraits, ['Thrilling Compulsions', 'Syll`Esskan Host'])],

    // Command Traits
    //command_traits:

    // Artifacts
    //artifacts:

    // Spells
    spells: [Spells],

    // Endless Spells
    endless_spells: [EndlessSpells],

    // Scenery
    scenery: [Scenery],

    // Units
    units: [
      Units,
      // SlaaneshS2DUnits.forEach(element => keyPicker(SlavestoDarknessFaction.Units, element)),
      // SlaaneshBoCUnits.forEach(element => keyPicker(BeastsofChaosFaction.Units, element)),
    ],

    // Battalions
    battalions: [
      keyPicker(Battalions, [
        'The Vengeful Alliance',
        'Devout Supplicants',
        'Vengeful Throng',
        'Daemonsteel Contingent',
      ]),
    ],
    // Flavors
    //flavors:
  },
}

export default subFactions
