import { tagAs } from 'factions/metatagger'
import { START_OF_COMBAT_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const BonesplitterzCommandAbilities = {
  'Bonesplitterz Waaagh!': {
    effects: [
      {
        name: `Bonesplitterz Waaagh!`,
        desc: `You can use this command ability once per battle at the start of your combat phase if your general is still alive. Roll a D6 and add the number of friendly Bonesplitterz units wholly within 18" of your general to the roll. On an 11 or lower all friendly Bonesplitterz units wholly within range of the general get +1 to their attacks, if the roll is 12 or more then add +2 to their attacks instead.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BonesplitterzCommandAbilities, 'command_ability')
