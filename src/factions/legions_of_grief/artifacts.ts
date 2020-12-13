import { tagAs } from 'factions/metatagger'
import { END_OF_COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'Grave-Sand Gem': {
    effects: [
      {
        name: `Grave-sand Gem`,
        desc: `In your hero phase, you can either inflict 1 mortal wound on 1 enemy HERO within 6" of the bearer, or you can heal 1 wound that has been allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gothizzari Mortuary Candle': {
    effects: [
      {
        name: `Gothizzari Mortuary Candle`,
        desc: `Subtract 1 from hit rolls for attacks with missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Souldrain Pendant': {
    effects: [
      {
        name: `Souldrain Pendant`,
        desc: `At the end of the combat phase, roll a D6 for each enemy unit within 3" of the bearer. On a 4+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
