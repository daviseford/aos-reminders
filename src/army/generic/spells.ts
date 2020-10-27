import { TSpells } from 'types/army'
import { HERO_PHASE, SAVES_PHASE } from 'types/phases'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  // Core Spells
  {
    name: `Arcane Bolt`,
    effects: [
      {
        name: `Arcane Bolt`,
        desc: `Casting value of 5. Pick an enemy unit within 18" of the caster that is visible to them. That unit suffers 1 mortal wound. If the casting roll was 10 or more, the unit suffers D3 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mystic Shield`,
    effects: [
      {
        name: `Mystic Shield`,
        desc: `Casting value of 6. Pick a friendly unit within 18" of the caster that is visible to them. Reroll save rolls of 1 for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mystic Shield`,
        desc: `If active, reroll save rolls of 1 for the chosen unit until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
]

export default Spells
