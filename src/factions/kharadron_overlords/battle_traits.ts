import { tagAs } from 'factions/metatagger'
import { KHARADRON_OVERLORDS } from 'meta/factions'
import {
  START_OF_HERO_PHASE,
  TURN_FIVE_START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_HERO_PHASE,
  TURN_THREE_START_OF_HERO_PHASE,
  TURN_TWO_START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  [KHARADRON_OVERLORDS]: {
    effects: [
      // Should I put Embark and Disembark in here?
      // Yes, if it's an army-wide rule that's always in effect
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Bombing Run`,
        desc: `Pick 1 enemy unit. You complete this battle tactic if that unit is destroyed during this turn by the Bomb Racks ability of a friendly unit.`,
        when: [START_OF_HERO_PHASE],
      },
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
      {
        name: `Boots on the Ground`,
        desc: `Pick 3 friendly units embarked in SKYVESSELS. You complete this battle tactic at the end of the turn if those units are not embarked and are wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Opening Salvo`,
        desc: `You can only pick this battle tactic if no units have been destroyed in the battle. You complete this battle tactic if an enemy unit is destroyed in your shooting phase this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Blast 'em to Smithereens`,
        desc: `Pick 1 objective on the battlefield within 12" of any enemy units. You complete this battle tactic if there are no enemy units within 12" of that objective at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Stake a Claim`,
        desc: `You can pick this tactic only if you control fewer objectives than your opponent. You complete this battle tactic if you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
