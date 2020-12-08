import { tagAs } from 'factions/metatagger'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
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
}

// Always export using tagAs
export default tagAs(DeathCommandAbilities, 'command_ability')
