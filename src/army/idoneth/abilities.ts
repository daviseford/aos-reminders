import { DURING_GAME, DURING_ROUND } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Forgotten Nightmares',
    desc: 'Missile weapons can only be used to target an IDONETH DEEPKIN unit with this battle trait if it is the closest visible enemy unit.',
    when: DURING_GAME,
  },
  {
    name: 'Tides of Death',
    desc: 'IDONETH DEEPKIN units with this battle trait have a different Tides of Death ability each battle round.',
    when: DURING_ROUND,
  },
]

export default Abilities
