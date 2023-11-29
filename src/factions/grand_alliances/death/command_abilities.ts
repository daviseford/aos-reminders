import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'

const DeathCommandAbilities = {
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
} satisfies TItemDescriptions

export default tagAs(DeathCommandAbilities, 'command_ability')
