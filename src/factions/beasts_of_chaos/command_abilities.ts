import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  "Slaughterer's Call": {
    effects: [
      {
        name: `Slaughterer's Call`,
        desc: `You can use this command ability at the start of the combat phase. This unit must issue the command and the unit that receives the command must be a friendly WARHERD unit within 12" of an enemy unit and more than 3" from all enemy units. If you do so, you must attempt a charge with that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')
