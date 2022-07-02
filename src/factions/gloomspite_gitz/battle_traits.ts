import { tagAs } from 'factions/metatagger'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const BattleTraits = {
  [GLOOMSPITE_GITZ]: {
    effects: [
      {
        name: `The Bad Moon Setup`,
        desc: `At the start of the first battle round, before determining who has the first turn, the player commanding the Gloomspite Gitz army must pick one corner of the battlefield as the starting location of the Bad Moon. If both players have Gloomspite Gitz armies, then they must roll off and the winner picks the starting location. The Bad Moon is located at the edge of the battlefield in that corner.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Bad Moon Movement`,
        desc: `Starting from the second battle round, before determining who has the first turn, the player commanding the Gloomspite Gitz army must roll a D6. On a 1 the Bad Moon does not move. On a 2-5 it makes 1 move. On a 6 it makes 2 moves.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Light of the Bad Moon - Fangz of the Bad Moon`,
        desc: `If your army is a Gloomspite Gitz army, at the start of your hero phase you can pick 1 enemy unit and roll a dice. If the roll is equal to or less than the number of models in that unit affected by the light of the Bad Moon, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Light of the Bad Moon - Bad Moon Magic`,
        desc: `Add 1 to casting rolls for WIZARDS affected by the light of the Bad Moon if they have the GLOOMSPITE GITZ keyword, and subtract 1 from casting rolls for WIZARDS affected by the light of the Bad Moon that do not have the GLOOMSPITE GITZ keyword.`,
        when: [HERO_PHASE],
      },
      {
        name: `Light of the Bad Moon - Loonatic Inspiration`,
        desc: `If your general has the GLOOMSPITE GITZ keyword and is affected by the light of the Bad Moon at the start of your hero phase, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Light of the Bad Moon - Lunar Squigs`,
        desc: `If all of the models in a friendly SQUIG unit are affected by the light of the Bad Moon at the start of your charge phase, that unit can attempt to charge even if it ran in the same turn.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Light of the Bad Moon - Moonclan Frothing Zealots`,
        desc: `If a friendly MOONCLAN unit receives the Rally command while it is affected by the light of the Bad Moon, you can return 1 slain model to that unit for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.ERRATA_BATTLESCROLL_JUNE_2022],
      },
      {
        name: `Light of the Bad Moon - Spiderfang Venom`,
        desc: `While a SPIDERFANG model is affected by the light of the Bad Moon, its Spider Venom ability causes mortal wounds on an unmodified hit roll of 5+ instead of 6.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Light of the Bad Moon - Moonlit Hide`,
        desc: `Add 1 to save rolls for friendly GLOOMSPITE GITZ TROGGOTH units while they are affected by the light of the Bad Moon.`,
        when: [SAVES_PHASE],
        rule_sources: [meta_rule_sources.ERRATA_BATTLESCROLL_JUNE_2022],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
