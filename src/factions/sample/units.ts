import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

const Units = {
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

export default tagAs(Units, 'unit')
