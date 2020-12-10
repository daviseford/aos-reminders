import { tagAs } from 'factions/metatagger'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
