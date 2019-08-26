import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Lore of Sorrows
const Spells: TSpells = [
  {
    name: `Dread Withering`,
    effects: [
      {
        name: `Dread Withering`,
        desc: `Casting value 5. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wail of Doom`,
    effects: [
      {
        name: `Wail of Doom`,
        desc: `Casting value 8. Roll a D6 for each enemy unit within 6" of the caster. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shroud of Terror`,
    effects: [
      {
        name: `Shroud of Terror`,
        desc: `Casting value 8. Pick 1 enemy unit within 12" of the caster that is visible to them. Subtract D3 from the Bravery characteristic of that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
