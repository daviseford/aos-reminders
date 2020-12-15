import BeastsOfChaosBattalions from 'factions/beasts_of_chaos/battalions'
import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import SlavesToDarknessBattalions from 'factions/slaves_to_darkness/battalions'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import { KHORNE } from 'meta/factions'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Prayers from './prayers'
import Scenery from './scenery'
import Units from './units'

const subFactions = {
  [KHORNE]: {
    effects: pickEffects(BattleTraits, ['Boundless Might']),

    available: {
      artifacts: [Artifacts],
      battalions: [
        Battalions,
        keyPicker(SlavesToDarknessBattalions, ['Bloodmarked Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Brass Despoilers']),
      ],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      scenery: [Scenery],
      prayers: [Prayers],
      endless_spells: [EndlessSpells],
      units: [
        Units,
        keyOmitter(SlavesToDarknessUnits, [
          'Gaunt Summoner on Disc of Tzeentch',
          'Chaos Sorcerer Lord on Manticore',
          'Chaos Sorcerer Lord',
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
          'Dragon Ogors',
          'Ghorgon',
          'Gors',
          'Tuskgor Chariots',
        ]),
      ],
      flavors: [Flavors],
    },
  },
}

export default subFactions
