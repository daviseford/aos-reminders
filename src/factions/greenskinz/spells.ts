import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Gaze of Mork': {
    effects: [
      {
        name: `Gaze of Mork`,
        desc: `Casting value of 6. Select up to 3 visible enemy units within 20". Roll a D6 for each unit chosen; on a 2-5 it suffers 1 mortal wound, and on a 6 it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
