import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  Fireball: {
    effects: [
      {
        name: `Fireball`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" and visible to the caster. If the enemy unit consists of one model it suffers 1 mortal wound, if it has 2 to 9 models it suffers D3 mortal wounds, and if it has 10 or more models it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ash Storm': {
    effects: [
      {
        name: `Ash Storm`,
        desc: `Casting value of 6. Pick 1 enemy unit within 36" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit, and that unit cannot run.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
