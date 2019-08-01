import { HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  {
    name: `Arcane Bolt`,
    effects: [
      {
        name: `Arcane Bolt`,
        desc: `Casting value of 5. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. That unit suffers 1 mortal wound. If the casting roll was 10 or more, the unit suffers D3 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mystic Shield`,
    effects: [
      {
        name: `Mystic Shield`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 18" of the caster that is visible to them. Re-roll save rolls of 1 for that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]

export default Spells
