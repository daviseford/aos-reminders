import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  "Kill Da Big 'Un!": {
    effects: [
      {
        name: `Kill Da Big 'Un!`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the BONESPLITTERZ keyword. Pick 1 enemy MONSTER. You complete this tactic if that MONSTER was slain by attacks made by a friendly BONESPLITTERZ unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')
