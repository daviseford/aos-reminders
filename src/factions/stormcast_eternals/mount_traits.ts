import { tagAs } from 'factions/metatagger'

// Store Mount Traits here. You can add them to units, abilties, flavors, and subfactions later.
const MountTraits = {
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
export default tagAs(MountTraits, 'mount_trait')
