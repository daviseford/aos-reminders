import { BATTLESHOCK_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Bad Moon Loonshrine',
    desc: 'GLOOMSPITE GITZ units wholly within 12" of the Bad Moon Loonshrine do not take battleshock tests.',
    when: BATTLESHOCK_PHASE,
  },
]

export default Abilities
