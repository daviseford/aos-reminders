import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const BattleTraits = {
  Destruction: {
    effects: [
      {
        name: `Rampaging Destroyers`,
        desc: `In your hero phase, roll a dice for your general and each friendly DESTRUCTION HERO on the battlefield. Add 2 to the roll for the general. On a 6+, pick a friendly DESTRUCTION unit within 6" of the general or HERO being rolled for. That unit can immediately move 6" if it is more than 12" from the enemy, can immediately pile in if it is within 3" of the enemy, or can immediately declare a charge in any other circumstances. It cannot run when it makes the move, but can move, charge or pile in again later in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
