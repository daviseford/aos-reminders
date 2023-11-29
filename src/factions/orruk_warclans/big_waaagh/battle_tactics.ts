import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Wait For It, Ladz...': {
    effects: [
      {
        name: `Wait For It, Ladz...`,
        desc: `You can pick this battle tactic only if your army has at least 24 Waaagh! points (pg 88). You complete this tactic if your army has at least 30 Waaagh! points at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
