import { tagAs } from 'factions/metatagger'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const BigWaaaghCommandTraits = {
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
export default tagAs(BigWaaaghCommandTraits, 'command_trait')
