import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Crushing Assault': {
    effects: [
      {
        name: `Crushing Assault`,
        desc: `You can carry out this monstrous rampage with a friendly NAUTILAR LEVIADON instead of any other monstrous rampage you can carry out with that LEVIADON. If you do so, change the Rend characteristic of that LEVIADON'S Massive Scythed Fins and Crushing Jaws to -3 until the end of the next combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(MonstrousRampages, 'monstrous_rampage')
