import { tagAs } from 'factions/metatagger'
import { END_OF_BATTLESHOCK_PHASE } from 'types/phases'

const CommandAbilities = {
  // Legion of the First Prince Flavor
  'The Shadow Legion': {
    effects: [
      {
        name: `The Shadow Legion`,
        desc: `Once per turn you can use this ability if Be'lakor is your general an on the battlefield. Roll a D6 for each friendly Legion of the First Prince Bloodletters, Plaguebearers, Daemonettes, and Horrors of Tzeentch unit on the battlefield. On a 3+ you can return D3 slain models to that unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
