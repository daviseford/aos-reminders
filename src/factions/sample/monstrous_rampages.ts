import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

const MonstrousRampages = {
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
export default tagAs(MonstrousRampages, 'monstrous_rampage')
