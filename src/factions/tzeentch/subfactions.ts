import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import { TZEENTCH } from 'meta/factions'
import { keyOmitter, keyPicker } from '../metatagger'
import Artifacts from './artifacts'
import TzeentchBattalions from './battalions'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [TZEENTCH]: {
    effects: [],

    available: {
      artifacts: [Artifacts],
      battalions: [TzeentchBattalions],
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
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
    },
  },
}

export default subFactions
