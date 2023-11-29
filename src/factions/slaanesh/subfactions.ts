import BeastsOfChaosUnits from 'factions/beasts_of_chaos/units'
import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyOmitter, keyPicker } from 'factions/metatagger'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'
import rule_sources from './rule_sources'

const baseSubfaction = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
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
} satisfies IItemDescription

const subFactions = {
  'Invaders Host': {
    ...baseSubfaction,
    effects: [
      {
        name: `Figureheads of the Dark Prince`,
        desc: `All friendly INVADERS HEROES are treated as generals even if they are not the model picked to be your general. In addition, roll a dice each time you pick a friendly INVADERS HERO to carry out a heroic action. On a 2+, you can pick 1 other eligible INVADERS HERO on the battlefield to also carry out that heroic action.`,
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
        desc: `If the model picked to be your general is a PRETENDERS HERO, you receive 3 command points instead of 1 if they are on the battlefield at the start of the hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Warlord Supreme`,
        desc: `If the model picked to be your general is a PRETENDERS HERO. they can issue the same command up to 3 times in the same phase. If it does so, each command must be received by a friendly PRETENDERS unit. No command points are spent the second and third times your general issues that command in that phase.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Godseekers Host': {
    ...baseSubfaction,
    effects: [
      {
        name: `Thundering Cavalcade`,
        desc: `You can reroll charge rolls for friendly GODSEEKERS units while they are wholly within 12" of a friendly GODSEEKERS HERO.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Maniacal Hunters`,
        desc: `At the start of each battle round, before the players receive their starting command points, you can move up to friendly GODSEEKERS units that are more than 3" from all enemy units up to D6" (roll separately for each unit). Those units must finish the move more than 3" from all enemy units.`,
        when: [START_OF_ROUND],
      },
    ],
  },
} satisfies TItemDescriptions

export default subFactions
