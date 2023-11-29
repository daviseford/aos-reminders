import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

const Battalions = {
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
} satisfies TItemDescriptions

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
