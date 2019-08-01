import { TCommandTraits } from 'types/army'
import { MOVEMENT_PHASE } from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Unrelenting Conqueror`,
    effects: [
      {
        name: `Unrelenting Conqueror`,
        desc: `Add 1 to run rolls for friendly Tamurkhan's Horde units while they are wholly within 14" of this general.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
    ],
  },
]

export default CommandTraits
