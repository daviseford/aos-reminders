import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  {
    name: `Arcane Bolt`,
    effects: [
      {
        name: `Arcane Bolt`,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mystic Shield`,
    effects: [
      {
        name: `Mystic Shield`,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
