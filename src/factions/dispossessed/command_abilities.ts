import { tagAs } from 'factions/metatagger'
import { DURING_GAME } from 'types/phases'

const CommandAbilities = {
  'Ancestral Grudge': {
    effects: [
      {
        name: `Ancestral Grudge`,
        desc: `If a Warden King uses this ability, pick one enemy unit within 16". Until your next hero phase, you can add 1 to wound rolls for all attacks made by DISPOSSESSED models that target that unit.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
