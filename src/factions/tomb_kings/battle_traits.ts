import { tagAs } from 'factions/metatagger'
import { WOUND_ALLOCATION_PHASE } from 'types/phases'

const BattleTraits = {
  'Deathless Minions': {
    effects: [
      {
        name: `Deathless Minions`,
        desc: `Each time you allocate a wound or mortal wound to a friendly DEATH model within 6" of your general or a friendly DEATH HERO, roll a D6. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
