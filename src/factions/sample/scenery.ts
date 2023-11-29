import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

const Scenery = {
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

export default tagAs(Scenery, 'scenery')
