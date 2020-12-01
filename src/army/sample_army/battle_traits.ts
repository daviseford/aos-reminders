import { TEffects } from 'types/data'
import { HERO_PHASE } from 'types/phases'

// General abilities for a subfaction (always active regardless of army composition)
const BattleTraits: TEffects[] = [
  {
    name: ``,
    desc: ``,
    when: [HERO_PHASE],
  },
]

export default BattleTraits
