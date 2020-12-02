import { TEffects } from 'types/data'
import { COMBAT_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const BattleTraits: TEffects[] = [
  {
    name: `Blackshard Armor`,
    desc: `The first wound that is allocated to each unit with this battle trait in each shooting phase and each combat phase is negated.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Burning Skies`,
    desc: `In the movement phase, if an enemy unit can fly and moves more than 6", roll a D6. On a 4+ the enemy unit suffers 1 mortal wound. On a 6+ it suffers D3 mortal wounds instead.`,
    when: [MOVEMENT_PHASE],
    command_ability: true,
  },
]

export default BattleTraits
