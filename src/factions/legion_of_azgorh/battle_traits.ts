import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

const BattleTraits = {
  LegionOfAzgorh: {
    effects: [
      {
        name: `Blackshard Armor`,
        desc: `The first wound that is allocated to each unit with this battle trait in each shooting phase and each combat phase is negated.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
