import { tagAs } from 'factions/metatagger'
import { END_OF_MOVEMENT_PHASE } from 'types/phases'

const CommandAbilities = {
  Blightkrieg: {
    effects: [
      {
        name: `Blightkrieg`,
        desc: `You can use this command ability at the end of the enemy movement phase if this unit is within 12" of an enemy unit. The command must be issued by this unit and must be received by another friendly Maggotkin of Nurgle unit that is within 12" of an enemy unit. This unit and then the unit that received the command can attempt a charge.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
