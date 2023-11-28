import { tagAs } from 'factions/metatagger'
import { KHARADRON_OVERLORDS } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  DURING_ANY_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  TURN_FIVE_START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_HERO_PHASE,
  TURN_THREE_START_OF_HERO_PHASE,
  TURN_TWO_START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  'Grundstok Expeditionary Force': {
    effects: [
      {
        name: `Only The Best`,
        desc: `Friendly GRUNDSTOK EXPEDITIONARY FORCE units that do not have the Leader battlefield role gain the Battleline battlefield role.`,
        when: [DURING_GAME],
        rule_sources: [
          meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },
      {
        name: `Grudgesettler Protocols`,
        desc: `In any phase, after a friendly Grundstok Expeditionary Force unit has shot or fought for the first time in that phase, you can roll a dice. On a 4+, that unit immediately shoots or fights for a second time in that phase. However, you must subtract 1 from hit rolls for attacks made in this way.

        Designer's Note: This ability can be used in your opponent's turn after a Grundstok Expeditionary Force unit shoots with the Unleash Hell command. The second time it shoots, those attacks are part of that Unleash Hell command and must target the same enemy unit. `,
        when: [DURING_ANY_PHASE],
        rule_sources: [
          meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },
      {
        name: `Rapid Redeployment`,
        desc: `Each time a friendly Grundstok Gunhauler makes a normal move or runs, you can say that it will transport a friendly unit. If you do so, before the move is made, you can pick up to 2 other friendly Grundstok Expeditionary Force units with a combined model count of 6 or less. Each unit must have a Wounds characteristic of 6 or less and must be within 3" of the Grundstok Gunhauler and more than 3" from all enemy units (you can pick a unit that has already moved in that phase). Remove that unit from the battlefield. Then, when the Grundstok Gunhauler finishes its move, set up the transported unit on the battlefield again, wholly within 3" of the Grundstok Gunhauler and more than 3" from all enemy units. Units transported in this manner cannot make a charge move in the same turn.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [
          meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },

      {
        name: `Battle Tactic - Blow Them Away`,
        desc: `You complete this battle tactic if an enemy unit was destroyed during this turn by an attack made using the Grudgesettler Protocols battle trait.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
      {
        name: `Battle Tactic - No Safe Haven`,
        desc: `Pick 1 objective on the battlefield that is controlled by your opponent. You complete this battle tactic if, at the end of this turn, you control that objective and a friendly unit that was set up this turn with the Rapid Redeployment battle trait is contesting that objective.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
      {
        name: `Battle Tactic - Thunderous Claim`,
        desc: `Pick 1 objective on the battlefield that you do not control. You complete this battle tactic if, at the end of this turn, you control that objective and that objective is contested by 2 different friendly GRUNDSTOK THUNDERERS units.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },

  [KHARADRON_OVERLORDS]: {
    effects: [
      {
        name: `Battle Tactic - Bombing Run`,
        desc: `Pick 1 enemy unit. You complete this battle tactic if that unit is destroyed during this turn by the Bomb Racks ability of a friendly unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Mobilise the Fleet`,
        desc: `You cannot pick this battle tactic in the first battle round. Pick 3 friendly units that are not embarked in SKYVESSELS. You complete this battle tactic at the end of the turn if those units are all embarked in SKYVESSELS.`,
        when: [
          TURN_TWO_START_OF_HERO_PHASE,
          TURN_THREE_START_OF_HERO_PHASE,
          TURN_FOUR_START_OF_HERO_PHASE,
          TURN_FIVE_START_OF_HERO_PHASE,
        ],
      },
      {
        name: `Battle Tactic - Boots on the Ground`,
        desc: `Pick 3 friendly units embarked in SKYVESSELS. You complete this battle tactic at the end of the turn if those units are not embarked and are wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Opening Salvo`,
        desc: `You can only pick this battle tactic if no units have been destroyed in the battle. You complete this battle tactic if an enemy unit is destroyed in your shooting phase this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Blast 'em to Smithereens`,
        desc: `Pick 1 objective on the battlefield within 12" of any enemy units. You complete this battle tactic if there are no enemy units within 12" of that objective at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Stake a Claim`,
        desc: `You can pick this tactic only if you control fewer objectives than your opponent. You complete this battle tactic if you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
