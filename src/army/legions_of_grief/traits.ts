import { TTraits } from 'types/army'
import { BATTLESHOCK_PHASE, DURING_GAME, HERO_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Amathyst Glow`,
    effects: [
      {
        name: `Amathyst Glow`,
        desc: `This general is a WIZARD. They can attempt to cast one spell in you hero phase, and attempt to unbind one spell in the enemy hero phase. They know the arcane bolt and mystic shield spells.\n\nIf this general is already a WIZARD, they know one extra spell from the Lore of Sorrows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vassal of the Craven King`,
    effects: [
      {
        name: `Vassal of the Craven King`,
        desc: `If this general is on the battlefield, each time you spend a command point, roll a D6. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Tragic Emanations`,
    effects: [
      {
        name: `Tragic Emanations`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits
