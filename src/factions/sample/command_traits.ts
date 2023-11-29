import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

// Store Command Traits here. You can add them to units, abilities, flavors, and subfactions later.
const CommandTraits = {
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
export default tagAs(CommandTraits, 'command_trait')
