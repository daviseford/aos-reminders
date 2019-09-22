import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spell Lores of Legions of Azgorh
const Spells: TSpells = [
  {
    name: `Fireball`,
    effects: [
      {
        name: `Fireball`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit within 18" and visible to the caster. If the enemy unit consists of one model it suffers 1 mortal wound, if it has 2 to 9 models it suffers D3 mortal wounds, and if it has 10 or more models it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
