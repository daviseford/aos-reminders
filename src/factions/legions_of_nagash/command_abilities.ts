import { tagAs } from 'factions/metatagger'
import { END_OF_MOVEMENT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Endless Legions': {
    effects: [
      {
        name: `Endless Legions`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a gravesite that is within 9" of your general, and then pick a friendly Summonable unit that has been destroyed. Set up that unit wholly within 9" of that gravesite and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
