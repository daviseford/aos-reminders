import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  START_OF_HERO_PHASE,
  TURN_FIVE_START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_HERO_PHASE,
  TURN_THREE_START_OF_HERO_PHASE,
  TURN_TWO_START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTactics = {
  'Blow Them Away': {
    effects: [
      {
        name: `Blow Them Away`,
        desc: `You complete this battle tactic if an enemy unit was destroyed during this turn by an attack made using the Grudgesettler Protocols battle trait.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'No Safe Haven': {
    effects: [
      {
        name: `No Safe Haven`,
        desc: `Pick 1 objective on the battlefield that is controlled by your opponent. You complete this battle tactic if, at the end of this turn, you control that objective and a friendly unit that was set up this turn with the Rapid Redeployment battle trait is contesting that objective.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Thunderous Claim': {
    effects: [
      {
        name: `Thunderous Claim`,
        desc: `Pick 1 objective on the battlefield that you do not control. You complete this battle tactic if, at the end of this turn, you control that objective and that objective is contested by 2 different friendly GRUNDSTOK THUNDERERS units.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Bombing Run': {
    effects: [
      {
        name: `Bombing Run`,
        desc: `Pick 1 enemy unit. You complete this battle tactic if that unit is destroyed during this turn by the Bomb Racks ability of a friendly unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mobilise the Fleet': {
    effects: [
      {
        name: `Mobilise the Fleet`,
        desc: `You cannot pick this battle tactic in the first battle round. Pick 3 friendly units that are not embarked in SKYVESSELS. You complete this battle tactic at the end of the turn if those units are all embarked in SKYVESSELS.`,
        when: [
          TURN_TWO_START_OF_HERO_PHASE,
          TURN_THREE_START_OF_HERO_PHASE,
          TURN_FOUR_START_OF_HERO_PHASE,
          TURN_FIVE_START_OF_HERO_PHASE,
        ],
      },
    ],
  },
  'Boots on the Ground': {
    effects: [
      {
        name: `Boots on the Ground`,
        desc: `Pick 3 friendly units embarked in SKYVESSELS. You complete this battle tactic at the end of the turn if those units are not embarked and are wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Opening Salvo': {
    effects: [
      {
        name: `Opening Salvo`,
        desc: `You can only pick this battle tactic if no units have been destroyed in the battle. You complete this battle tactic if an enemy unit is destroyed in your shooting phase this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Blast 'em to Smithereens": {
    effects: [
      {
        name: `Blast 'em to Smithereens`,
        desc: `Pick 1 objective on the battlefield within 12" of any enemy units. You complete this battle tactic if there are no enemy units within 12" of that objective at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Stake a Claim': {
    effects: [
      {
        name: `Stake a Claim`,
        desc: `You can pick this tactic only if you control fewer objectives than your opponent. You complete this battle tactic if you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')
