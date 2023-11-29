import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  "I'm Da Boss, Now Stab 'Em Good!": {
    effects: [
      {
        name: `I'm Da Boss, Now Stab 'Em Good!`,
        desc: `When this unit issues the All-out Attack command to a friendly Moonclan unit in the combat phase, until the end of that phase, if the unmodified wound roll for an attack made by that Moonclan unit is 6, the attack causes 1 mortal wound to the target in addition to any damage it inflicts.

        Designer's Note: This effect is in addition to the normal effect of All-out Attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')
