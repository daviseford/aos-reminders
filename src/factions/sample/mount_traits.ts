import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const MountTraits = {
  'A Generic Mount Trait': {
    effects: [
      {
        name: `A Generic Mount Trait`,
        desc: `GODZILLA SMASH!`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Another Mount Trait': {
    effects: [
      {
        name: `Another Mount Trait`,
        desc: `Magical pony horns.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')
