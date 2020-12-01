import { TEntry } from 'types/data'
import { MOVEMENT_PHASE } from 'types/phases'

const CommandTraits: TEntry[] = [
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
