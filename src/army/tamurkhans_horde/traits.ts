import { TTraits } from 'types/army'
import { MOVEMENT_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Unrelenting Conqueror`,
    effects: [
      {
        name: `Unrelenting Conqueror`,
        desc: `Add 1 to run rolls for friendly Tamurkhan's Horde units while they are wholly within 14" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default CommandTraits
