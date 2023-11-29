import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Take Dat, Ya Suckers!': {
    effects: [
      {
        name: `Take Dat, Ya Suckers!`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the KRULEBOYZ keyword. You complete this tactic if the following 2 criteria are met:

        - At least 10 wounds or mortal wounds in any combination that were caused by friendly units are allocated to enemy models this turn.

        - Fewer than 10 wounds or mortal wounds in any combination that were caused by enemy units are allocated to friendly models this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
