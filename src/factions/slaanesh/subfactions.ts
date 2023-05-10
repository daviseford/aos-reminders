import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import { IItemDescription } from 'factions/factionTypes'
import { keyOmitter, keyPicker } from 'factions/metatagger'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import Artifacts from './artifacts'
import Battalions from './battalions'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import GrandStrategies from './grand_strategies'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  START_OF_GAME,
} from 'types/phases'
import rule_sources from './rule_sources'

const baseSubfaction: IItemDescription = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
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
    ...baseSubfaction,
    effects: [
      {
        name: `Figureheads of the Dark Prince`,
        desc: `Your army can have up to 3 generals instead of 1. Only 1 of your generals can have a command trait, but all 3 are considered to be a general for the purposes of using command abilities. However, none of your generals can use a command trait or command ability while they are within 12" of any of your other generals. In addition, each time 1 of your generals is slain for the first time, you receive 1 command point. You receive the command point for having a general on the battlefield at the start of the hero phase if 1 or more of these generals are on the battlefield (you still only receive 1 command point if you have 2 or more generals on the battlefield). You receive the +2 modifier to the Heroic Leadership heroic action only if all of the generals have been slain.`,
        when: [DURING_GAME],
      },
      {
        name: `Escalating Havoc`,
        desc: `This is a heroic action that you can carry out with 1 friendly INVADERS HERO instead of picking 1 from the table in the core rules. If you do so, pick 1 eligible command trait from the list below that that INVADERS HERO does not already have. That HERO is considered to have that command trait until the end of the turn. The same command trait cannot be picked with this ability more than once in the same turn. Unique units cannot benefit from this ability.`,
        when: [END_OF_BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_APRIL_2023],
      },
    ],
  },

  'Pretenders Host': {
    ...baseSubfaction,
    effects: [
      {
        name: `Heir to the Throne`,
        desc: `If the general of a PRETENDERS army is a HERO, they have 2 different command traits instead of 1. In addition, you can reroll hit rolls of 1 for attacks made with melee weapons by friendly PRETENDERS units that have 10 or more models while your general is on the battlefield.`,
        when: [DURING_GAME],
      },
      {
        name: `Warlord Supreme`,
        desc: `At the end of your battleshock phase, you receive 1 depravity point if your general is within 3" of an enemy unit. At the end of your battleshock phase, you receive D3 depravity points instead of 1 if your general is within 3" of 2 or more enemy units.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },

  'Godseekers Host': {
    ...baseSubfaction,
    effects: [
      {
        name: `Thundering Cavalcade`,
        desc: `Add 1 to charge rolls for friendly GODSEEKERS units.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Maniacal Hunters`,
        desc: `At the end of your charge phase, you receive D3 depravity points if your general made a charge move in the same turn. Add 1 to the roll if any other friendly GODSEEKERS units made a charge move in that turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },

  "Syll'Esskan Host": {
    ...baseSubfaction,
    effects: [
      {
        name: `Common Purpose`,
        desc: `At the start of the battle, if the number of MORTAL units in a Syll'Esskan Host army is exactly equal to the number of DAEMON units, you receive D3 extra command points. If the total number of units in the army is more than 12, and the number of MORTAL units in a Syll'Esskan Host army is exactly equal to the number of DAEMON units, you receive D6 extra command points instead of D3 extra points. Syll'Esske counts as 2 units, 1 MORTAL and 1 DAEMON, for the purposes of this rule.`,
        when: [START_OF_GAME],
      },
      {
        name: `Deadly Symbiosis`,
        desc: `Add 1 to the number of depravity points you receive in the battleshock phase if a friendly SYLL'ESSKE is on the battlefield and is within 6" of at least 1 other friendly SYLL'ESSKAN HOST DAEMON unit and at least 1 friendly SYLL'ESSKAN HOST MORTAL unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default subFactions
