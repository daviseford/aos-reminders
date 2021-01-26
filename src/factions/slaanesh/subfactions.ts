import BeastsOfChaosBattalions from 'factions/beasts_of_chaos/battalions'
import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import { IItemDescription } from 'factions/factionTypes'
import { keyOmitter, keyPicker, pickEffects } from 'factions/metatagger'
import SlavesToDarknessBattalions from 'factions/slaves_to_darkness/battalions'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubfaction: IItemDescription = {
  effects: pickEffects(BattleTraits, ['Thrilling Compulsions']),
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    scenery: [Scenery],
    spells: [Spells],
    units: [
      Units,
      keyOmitter(SlavesToDarknessUnits, [
        'Gaunt Summoner on Disc of Tzeentch',
        'Theddra Skull-Scryer',
        'Godsworn Hunt',
        'Darkoath Warqueen',
        'Darkoath Chieftain',
        'Sayl the Faithless',
        'Nightmaw',
        'Slambo',
        "Curs'd Ettin",
        'Furies',
        'Raptoryx',
        'Splintered Fang',
        'Corvus Cabal',
        'The Unmade',
        'Cypher Lords',
        'Iron Golems',
        'Untamed Beasts',
        'Spire Tyrants',
        'Scions of the Flame',
        "Be'Lakor",
        'Mutalith Vortex Beast',
        'Fomoroid Crusher',
        'Mindstealer Sphiranx',
      ]),
      keyPicker(BeastsOfChaosUnits, [
        'Beastlord',
        'Bestigors',
        'Bullgors',
        'Centigors',
        'Cygor',
        'Doombull',
        'Dragon Ogor Shaggoth',
        'Dragon Ogors',
        'Ghorgon',
        'Gors',
        'Great Bray-Shaman',
        'Tuskgor Chariots',
        'Ungor Raiders',
        'Ungors',
      ]),
    ],
  },
}

const subFactions = {
  'Invaders Host': {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', "The Despoiler's Art"]),
    available: {
      ...baseSubfaction.available,
      flavors: [keyPicker(Flavors, ['Lurid Haze'])],
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
      battalions: [
        keyOmitter(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
        keyPicker(SlavesToDarknessBattalions, ['Pleasurebound Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Depraved Drove']),
      ],
    },
  },

  'Pretenders Host': {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', 'Magnificence Made Flesh']),
    available: {
      ...baseSubfaction.available,
      flavors: [keyPicker(Flavors, ['Faultless Blades'])],
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
      battalions: [
        keyOmitter(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
        keyPicker(SlavesToDarknessBattalions, ['Pleasurebound Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Depraved Drove']),
      ],
    },
  },

  'Godseekers Host': {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', 'Blessings of the Gleeful Chase']),
    available: {
      ...baseSubfaction.available,
      flavors: [keyPicker(Flavors, ['Scarlet Cavalcade'])],
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
      artifacts: [
        keyPicker(Artifacts, [
          'Cameo of the Dark Prince',
          'Girdle of the Realm-race',
          'Threnody Voicebox',
          'Lash of Despair',
          'Enrapturing Circlet',
          'Bindings of Slaanesh',
        ]),
      ],
      battalions: [
        keyOmitter(Battalions, [
          'The Vengeful Alliance',
          'Devout Supplicants',
          'Vengeful Throng',
          'Daemonsteel Contingent',
        ]),
        keyPicker(SlavesToDarknessBattalions, ['Pleasurebound Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Depraved Drove']),
      ],
    },
  },

  "Syll'Esskan Host": {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', 'Vengeance Unleashed']),
    available: {
      ...baseSubfaction.available,
      battalions: [
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
