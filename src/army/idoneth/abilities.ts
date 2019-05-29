import { DURING_GAME, START_OF_SETUP, START_OF_HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Forgotten Nightmares',
    desc:
      'Missile weapons can only be used to target an IDONETH DEEPKIN unit with this battle trait if it is the closest visible enemy unit.',
    when: [DURING_GAME],
  },
  {
    name: 'Etheric Vortex',
    desc:
      'After all other terrain features are set up, but before players choose territories or set up their armies, you can set up a maximum of two Etheric Vortex terrain features anywhere on the battlefield so that each is more than 1" from any other terrain features.',
    when: [START_OF_SETUP],
  },
  {
    name: 'Guardians of the Deep',
    desc:
      'Roll a dice each time a wound or mortal wound is allocated to an IDONETH DEEPKIN unit wholly within 6" of this terrain feature. On a 6+ the wound is negated.',
    when: [DURING_GAME],
  },
  {
    name: 'Predators of the Ethersea',
    desc:
      'At the start of your hero phase, roll a dice for each unit within 3" of this terrain feature. Do not roll for IDONETH DEEPKIN units. On a 4+ the unit suffers 1 mortal wound. On a 6+ the unit suffers D3 mortal wounds instead.',
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities
