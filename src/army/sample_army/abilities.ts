import { TAbilities } from 'types/army'
import { HERO_PHASE } from 'types/phases'
/*
General Allegiance Abilities (always active regardless of army composition)
Note some armies have the ability to take different allegiances (IE Stormkeeps).
Newer books will have names for these allegiances and they are generally mutally exclusive.
*/
const Abilities: TAbilities = [
  {
    name: `Name of allegiance here`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Abilities
