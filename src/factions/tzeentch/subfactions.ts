import BeastsOfChaosBattalions from 'factions/beasts_of_chaos/battalions'
import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import { TItemDescriptions } from 'factions/factionTypes'
import SlavesToDarknessBattalions from 'factions/slaves_to_darkness/battalions'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import { TZEENTCH } from 'meta/factions'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [TZEENTCH]: {
    effects: pickEffects(BattleTraits, ['The Flow of Change']),

    available: {
      artifacts: [Artifacts],
      battalions: [
        Battalions,
        keyPicker(SlavesToDarknessBattalions, ['Fatesworn Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Phantasmagoria of Fate']),
      ],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      spells: [Spells],
      endless_spells: [EndlessSpells],
      units: [
        Units,
        keyOmitter(SlavesToDarknessUnits, [
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
          'Tzaangors',
          `Tzaangor Enlightened`,
          `Tzaangor Skyfires`,
          `Tzaangor Shaman`,
          'Ungor Raiders',
          'Ungors',
        ]),
      ],
      flavors: [Flavors],
    },
  },
}

export default subFactions
