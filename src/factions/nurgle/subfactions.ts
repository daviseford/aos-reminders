import { IItemDescription } from 'factions/factionTypes'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubFaction: IItemDescription = {
  effects: [],

  available: {
    scenery: [Scenery],
    spells: [Spells],
    units: [
      Units,
      // keyOmitter(SlavesToDarknessUnits, [
      //   'Gaunt Summoner on Disc of Tzeentch',
      //   'Theddra Skull-Scryer',
      //   'Godsworn Hunt',
      //   'Darkoath Warqueen',
      //   'Darkoath Chieftain',
      //   'Sayl the Faithless',
      //   'Nightmaw',
      //   'Slambo',
      //   "Curs'd Ettin",
      //   'Furies',
      //   'Raptoryx',
      //   'Splintered Fang',
      //   'Corvus Cabal',
      //   'The Unmade',
      //   'Cypher Lords',
      //   'Iron Golems',
      //   'Untamed Beasts',
      //   'Spire Tyrants',
      //   'Scions of the Flame',
      //   "Be'Lakor",
      //   'Mutalith Vortex Beast',
      //   'Fomoroid Crusher',
      //   'Mindstealer Sphiranx',
      // ]),
      // keyPicker(BeastsOfChaosUnits, [
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
      // ]),
      // keyPicker(SkavenUnits, [
      //   'Plague Censer Bearers',
      //   'Plague Monks',
      //   'Plague Priest on Plague Furnace',
      //   'Plague Priest',
      //   'Plagueclaw',
      //   'Verminlord Corruptor',
      // ]),
    ],
    flavors: [Flavors],
  },
}

const subFactions = {
  Nurgle: {
    effects: [pickEffects(BattleTraits, ['Nurgle', 'Battle Tactics'])],

    available: {
      ...baseSubFaction.available,
      battalions: [Battalions],
      grand_strategies: [GrandStrategies],
      artifacts: [keyOmitter(Artifacts, ['Daemon Flask'])],
      command_abilities: [keyOmitter(CommandAbilities, ['Shout of Command'])],
      command_traits: [keyOmitter(CommandTraits, ['Unrelenting Conqueror'])],
    },
  },

  "Tamurkhan's Horde": {
    effects: pickEffects(BattleTraits, ["Tamurkhan's Horde"]),

    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Daemon Flask'])],
      command_abilities: [keyPicker(CommandAbilities, ['Shout of Command'])],
      command_traits: [keyPicker(CommandTraits, ['Unrelenting Conqueror'])],
    },

    available: {
      ...baseSubFaction.available,
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
    },
  },
}

export default subFactions
