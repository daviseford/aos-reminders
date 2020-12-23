import BeastsOfChaosBattalions from 'factions/beasts_of_chaos/battalions'
import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import { TItemDescription } from 'factions/factionTypes'
import SkavenUnits from 'factions/skaventide/units'
import SlavesToDarknessBattalions from 'factions/slaves_to_darkness/battalions'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import { NURGLE } from 'meta/factions'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubFaction: TItemDescription = {
  effects: pickEffects(BattleTraits, ['Nurgle']),

  available: {
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
      keyPicker(SkavenUnits, [
        'Plague Censer Bearers',
        'Plague Monks',
        'Plague Priest on Plague Furnace',
        'Plague Priest',
        'Plagueclaw',
        'Verminlord Corruptor',
      ]),
    ],
    flavors: [Flavors],
  },
}

const subFactions = {
  [NURGLE]: {
    effects: pickEffects(BattleTraits, ['Nurgle', "Tamurkhan's Horde"]),

    available: {
      ...baseSubFaction.available,
      artifacts: [keyOmitter(Artifacts, ['Daemon Flask'])],
      battalions: [
        keyOmitter(Battalions, ['Sons of the Maggot Lord', 'Leaping Pox']),
        keyPicker(SlavesToDarknessBattalions, ['Plaguetouched Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Pestilent Throng']),
      ],
      command_abilities: [keyOmitter(CommandAbilities, ['Shout of Command'])],
      command_traits: [keyOmitter(CommandTraits, ['Unrelenting Conqueror'])],
    },
  },

  "Tamurkhan's Horde": {
    effects: pickEffects(BattleTraits, ['Nurgle']),

    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Daemon Flask'])],
      command_abilities: [keyPicker(CommandAbilities, ['Shout of Command'])],
      command_traits: [keyPicker(CommandTraits, ['Unrelenting Conqueror'])],
    },

    available: {
      ...baseSubFaction.available,
      artifacts: [Artifacts],
      battalions: [
        Battalions,
        keyPicker(SlavesToDarknessBattalions, ['Plaguetouched Warband']),
        keyPicker(BeastsOfChaosBattalions, ['Pestilent Throng']),
      ],
      command_abilities: [CommandAbilities],
    },
  },
}

export default subFactions
