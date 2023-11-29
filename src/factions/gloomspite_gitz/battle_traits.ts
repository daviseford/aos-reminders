import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SAVES_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const BattleTraits = {
  'The Bad Moon': {
    effects: [
      {
        name: `The Bad Moon Setup`,
        desc: `If any of the armies in a battle are Gloomspite Gitz armies, in the first battle round, after players have received their starting command points but before the start of the first turn, the player commanding the Gloomspite Gitz army picks 1 large quarter of the battlefield (core rules 28.2.8) as the Bad Moon's starting location. If more than 1 player in the battle is commanding a Gloomspite Gitz army, then those players roll off and the winner picks which large quarter is the Bad Moon's starting location.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Bad Moon Movement`,
        desc: `During the battle, the Bad Moon will move and its location will change. The Bad Moon starts in a large quarter of the battlefield. The first time it moves, it moves to the centre of the battlefield. Then it moves to the large quarter diagonally opposite the large quarter in which it started. Finally, it moves off the battlefield.

        At the start of the second and each subsequent battle round, before the priority roll, the player commanding the Gloomspite Gitz army rolls a dice. If more than 1 player in the battle is commanding a Gloomspite Gitz army, then those players roll off and the winner rolls the dice. On a 1-3, the Bad Moon does not move and instead stays at its current location. On a 4+, it moves to the next location. When the Bad Moon moves off the battlefield, it has no further effect on the battle.
        
        The location of the Bad Moon determines which GLOOMSPITE GITZ units are affected by the Light of the Bad Moon. While the Bad Moon is located in a large quarter of the battlefield, all GLOOMSPITE GITZ units wholly within the same large quarter are affected. While it is located in the centre of the battlefield, all GLOOMSPITE GITZ units on the battlefield are affected.`,
        when: [START_OF_ROUND],
      },
    ],
  },

  [GLOOMSPITE_GITZ]: {
    effects: [
      {
        name: `Lunar Squigs`,
        desc: `While GLOOMSPITE GITZ SQUIG units are affected by the Light of the Bad Moon they can attempt a charge even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Frothing Zealots`,
        desc: `If a friendly MOONCLAN unit receives the rally command while it is affected by the Light of the Bad Moon, you can return 1 slain model to the unit that receives the command for each 4+ instead of each 6.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Spiderfang Venom`,
        desc: `While SPIDERFANG units are affected by the Light of the Bad Moon, their Spider Venom ability causes mortal wounds on an unmodified roll of 5+ instead of a 6.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Moonlit Hide`,
        desc: `Add 1 to save rolls for attacks that target GLOOMSPITE GITZ TROGGOTH units while they are affected by the Light of the Bad Moon.`,
        when: [SAVES_PHASE],
      },

      // Heroic Actions
      {
        name: `Heroic Action - Beckon the Loonatic Hordes`,
        desc: `Only a MOONCLAN HERO affected by the Light of the Bad Moon can carry out this heroic action. This HERO can immediately issue the Rally command up to 3 times without any command points being spent. Each unit that receives the command must be a different friendly MOONCLAN unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action - Wade and Smash`,
        desc: `Only a DANKHOLD TROGGBOSS within 3" of any enemy units can carry out this heroic action. This DANKHOLD TROGGBOSS can make a 6" move but must finish the move within 3" of any enemy units. At the end of that move, roll a dice for each enemy unit within 1" of this DANKHOLD TROGGBOSS. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  "Trugg's Troggherd": {
    effects: [
      {
        name: `Moonlit Hide`,
        desc: `Add 1 to save rolls for attacks that target friendly TRUGG'S TROGGHERD units while they are affected by the Light of the Bad Moon.`,
        when: [SAVES_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
      {
        name: `Aura of Haywire Magic`,
        desc: `At the start of your hero phase, if you use a friendly TRUGG'S Malfunctioning Leystone ability, the effect you pick applies to all other friendly TRUGG'S TROGGHERD units until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
      {
        name: `The King's Wreckerz`,
        desc: `Friendly TRUGG'S TROGGHERD units that do not have the HERO keyword gain the Battleline battlefield role.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
