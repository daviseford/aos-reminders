import { tagAs } from 'factions/metatagger'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
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
export default tagAs(CommandTraits, 'command_trait')
