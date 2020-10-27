import { TTraits } from 'types/army'
import { BATTLESHOCK_PHASE, DURING_GAME, HERO_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Raven Priest`,
    effects: [
      {
        name: `Raven Priest`,
        desc: `This general gains the Priest keyword. If the model is already a priest, it knows two Prayers of Morrda instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Solemn Soul`,
    effects: [
      {
        name: `Solemn Soul`,
        desc: `Do not take battleshock tests for friendly Lethisian Defender units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Sinister Aura`,
    effects: [
      {
        name: `Sinister Aura`,
        desc: `Add 1 to the general's wounds characteristic. Subtract 1 from the bravery characteristic of enemy units within 6" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default CommandTraits
