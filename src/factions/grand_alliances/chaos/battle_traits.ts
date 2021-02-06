import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE } from 'types/phases'

const BattleTraits = {
  Chaos: {
    effects: [
      {
        name: `Unbridled Malice`,
        desc: `When a friendly CHAOS unit is picked to fight, roll a dice if it is within 12" of your general or 3" of a friendly HERO. On a 6+, add 1 to hit rolls for the unit for that fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
