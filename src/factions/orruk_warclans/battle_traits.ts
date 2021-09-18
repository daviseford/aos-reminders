import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const OrrukWarclansBattleTraits = {
  'Battle Tactics': {
    effects: [
      {
        name: `Time to Get Stuck In!`,
        desc: `You can pick this battle tactic only in your first or second turn. You complete this tactic if the model picked to be your general and all of the models in your army that are on the battlefield are within 12" of an enemy unit at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Wait For It, Ladz...`,
        desc: `You can pick this battle tactic only if your army has at least 24 Waaagh! points (pg 88). You complete this tactic if your army has at least 30 Waaagh! points at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Squish Da Puny Gitz`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the IRONJAWZ keyword and there is at least 1 enemy Battleline unit on the battlefield. You complete this tactic if there are no enemy Battleline units on the battlefield at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Kill Da Big 'Un!`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the BONESPLITTERZ keyword. Pick 1 enemy MONSTER. You complete this tactic if that MONSTER was slain by attacks made by a friendly BONESPLITTERZ unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Take Dat, Ya Suckers!`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the KRULEBOYZ keyword. You complete this tactic if the following 2 criteria are met:

        - At least 10 wounds or mortal wounds in any combination that were caused by friendly units are allocated to enemy models this turn.

        - Fewer than 10 wounds or mortal wounds in any combination that were caused by enemy units are allocated to friendly models this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Destroyer of Empires`,
        desc: `You can pick this battle tactic only if a friendly KRAGNOS is on the battlefield. Pick 1 faction terrain feature on the battlefield that was set up by your opponent and that has not been demolished. You complete this tactic if that faction terrain feature is demolished this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(OrrukWarclansBattleTraits, 'battle_trait')
