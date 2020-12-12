import { tagAs } from 'factions/metatagger'
import { END_OF_COMBAT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Da Big Waaagh!!!': {
    effects: [
      {
        name: `Da Big Waaagh!!!`,
        desc: `The general can use Da Big Waaagh ability at start of combat phase. Add 1 to the attack characteristics to all ORRUK units in the Waaagh army.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Da Big Waaagh!!!`,
        desc: `After the combat phase roll a D6, on 1 you lose all your Waaagh points, on a 2-5 you halve your Waaagh points, on a 6 you keep everything.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
