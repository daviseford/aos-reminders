import { HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Bad Moon Loonshrine',
    desc:
      'In your hero phase, you can pick a friendly SERAPHON unit anywhere on the battlefield to be transported through space and time.',
    when: HERO_PHASE,
  },
]

export default Abilities
