import { TURN_ONE_HERO_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Disruptive Presence`,
    desc: `If your army includes any MERCENARY units, at the start of your hero phase in the first battle round, you do not receive 1 command point.`,
    when: [TURN_ONE_HERO_PHASE],
  },
]

export default Abilities
