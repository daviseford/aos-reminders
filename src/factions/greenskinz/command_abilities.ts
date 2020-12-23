import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE } from 'types/phases'

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

export default tagAs(CommandAbilities, 'command_ability')
