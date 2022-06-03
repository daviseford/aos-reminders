import { tagAs } from 'factions/metatagger'

// Store Mount Traits here. You can add them to units, abilities, flavors, and subfactions later.
const MountTraits = {
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
}

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')
