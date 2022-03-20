import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import { KHORNE } from 'meta/factions'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Prayers from './prayers'
import Scenery from './scenery'
import Units from './units'

const subFactions = {
  [KHORNE]: {
    effects: pickEffects(BattleTraits, ['Boundless Might', 'Hatred of Sorcery', 'Battle Tactics']),

    available: {
      artifacts: [Artifacts],
      battalions: [],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      grand_strategies: [GrandStrategies],
      prayers: [Prayers],
      scenery: [Scenery],
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
    },
  },
}

export default subFactions
