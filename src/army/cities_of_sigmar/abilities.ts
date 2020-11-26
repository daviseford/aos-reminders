import { TAbilities } from 'types/army'
import { HERO_PHASE, START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Amplified Sorceries`,
    desc: `If a CITIES OF SIGMAR WIZARD casts an endless spell that is empowered by being cast in a specific realm, that spell is counted as empowered regardless of the realm in which the battle is taking place.`,
    when: [HERO_PHASE],
  },
  {
    name: `Loyal Shields`,
    desc: `If your general is within 3" of their retinue, roll a D6 before allocating a wound or mw to the general. On a 4+ allocate the wound or mortal wound to the retinue.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Wise Council`,
    desc: `If your general is within 3" of their adjutant, roll a D6. On a 4+ receive 1 extra command point.`,
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities
