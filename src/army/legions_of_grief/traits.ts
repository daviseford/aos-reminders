import { TTraits } from 'types/army'
import { BATTLESHOCK_PHASE, DURING_GAME, HERO_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Amathyst Glow (Legion of Grief)`,
    effects: [
      {
        name: `Amathyst Glow (Legion of Grief)`,
        desc: `This general is a WIZARD. They can attempt to cast one spell in you hero phase, and attempt to unbind one spell in the enemy hero phase. They know the arcane bolt and mystic shield spells.\n\nIf this general is already a WIZARD, they know one extra spell from the Lore of Sorrows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vassal of the Craven King (Legion of Grief)`,
    effects: [
      {
        name: `Vassal of the Craven King (Legion of Grief)`,
        desc: `If this general is on the battlefield, each time you spend a command point, roll a dice. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Tragic Emanations (Legion of Grief)`,
    effects: [
      {
        name: `Tragic Emanations (Legion of Grief)`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits
