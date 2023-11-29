import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Squish Da Puny Gitz': {
    effects: [
      {
        name: `Squish Da Puny Gitz`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the IRONJAWZ keyword and there is at least 1 enemy Battleline unit on the battlefield. You complete this tactic if there are no enemy Battleline units on the battlefield at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')
