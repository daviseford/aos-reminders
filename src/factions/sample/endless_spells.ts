import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

// Add Endless spells here
const EndlessSpells = {
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

export default tagAs(EndlessSpells, 'endless_spell')
