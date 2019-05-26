import { DURING_GAME } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Forgotten Nightmares',
    desc:
      'Missile weapons can only be used to target an IDONETH DEEPKIN unit with this battle trait if it is the closest visible enemy unit.',
    when: [DURING_GAME],
  },
]

export default Abilities
