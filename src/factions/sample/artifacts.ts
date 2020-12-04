import { tagAs } from 'factions/metatagger'
import { END_OF_SETUP, WOUND_ALLOCATION_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  // The name that you enter here is how it'll appear on the UI
  'Artifact 1': {
    effects: [
      {
        name: `Artifact 1`,
        desc: `lorem ipsum`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Another Artifact': {
    effects: [
      {
        name: `Another Artifact`,
        desc: `lorem ipsum`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
