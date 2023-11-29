import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

// Store Command Abilities here. You can add them to units, abilities, flavors, and subfactions later.
const CommandAbilities = {
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
export default tagAs(CommandAbilities, 'command_ability')
