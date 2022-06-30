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
        name: `Destroyer of Empires`,
        desc: `You can pick this battle tactic only if a friendly KRAGNOS is on the battlefield. Pick 1 faction terrain feature on the battlefield that was set up by your opponent and that has not been demolished. You complete this tactic if that faction terrain feature is demolished this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(OrrukWarclansBattleTraits, 'battle_trait')
