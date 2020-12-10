import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Waaagh!': {
    effects: [
      {
        name: `Waaagh!`,
        desc: `You can use this command ability in the combat phase. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly Orruk units while they are wholly within 18" of a friendly model with this command ability. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
