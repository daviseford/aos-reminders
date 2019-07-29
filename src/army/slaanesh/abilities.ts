import { IEffects } from 'types/data'
import { HERO_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: ``,
    desc: ``,
    when: [HERO_PHASE],
    allegiance_ability: true,
  },
]

export default Abilities
