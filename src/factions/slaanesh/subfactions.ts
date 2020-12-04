import { keyOmitter, keyPicker, pickEffects } from 'factions/metatagger'
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

const baseSubfaction = {
  effects: pickEffects(BattleTraits, ['Thrilling Compulsions']),
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
    // keyPicker(SlavestoDarknessFaction.Units, SlaaneshS2DUnits),
    // keyPicker(BeastsofChaosFaction.Units, SlaaneshBoCUnits),
  },
}

const subFactions = {
  Invaders: {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', "The Despoiler's Art"]),

    available: {
      ...baseSubfaction.available,

      command_traits: [keyPicker(CommandTraits, ['Obessions of the Invader'])],
      artifacts: [keyPicker(Artifacts, ['Sacred Spoils of War'])],
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
      flavors: [keyPicker(Flavors, ['Lurid Haze'])],
    },
  },

  Pretenders: {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', 'Magnificence Made Flesh']),

    available: {
      ...baseSubfaction.available,

      command_traits: [keyPicker(CommandTraits, ['Aspects of the Perfect Liege'])],
      artifacts: [keyPicker(Artifacts, ['Regalia of the Rightful Heir'])],
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
      flavors: [keyPicker(Flavors, ['Faultless Blades'])],
    },
  },

  Godseekers: {
    effects: pickEffects(BattleTraits, ['Thrilling Compulsions', 'Blessings of the Gleeful Chase']),
    available: {
      ...baseSubfaction.available,

      command_traits: [keyPicker(CommandTraits, ['Traits of the Seeker Supreme'])],
      artifacts: [keyPicker(Artifacts, ['Treasures of the Hunt'])],
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
      flavors: [keyPicker(Flavors, ['Scarlet Cavalcade'])],
    },
  },

  "Syll'Esskan": {
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
