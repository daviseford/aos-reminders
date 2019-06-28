import { HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Lords of Space and Time`,
    desc: `In your hero phase, you can pick 1 friendly SERAPHON unit anywhere on the battlefield to be transported through space and time. If you do so, remove that unit from the battlefield, then set it up on the battlefield anywhere that is more than 9" from any enemy unit. This counts as that unit's move for the following movement phase.`,
    when: [HERO_PHASE],
  },
]

export default Abilities
