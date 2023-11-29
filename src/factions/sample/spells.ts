import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

const Spells = {
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
} satisfies TItemDescriptions

export default tagAs(Spells, 'spell')
