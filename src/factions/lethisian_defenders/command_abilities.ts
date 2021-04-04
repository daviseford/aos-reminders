import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Onyx Shield Wall': {
    effects: [
      {
        name: `Onyx Shield Wall`,
        desc: `Use this command ability during the enemy's turn. Pick 1 friendly Lethisian Defender Liberator unit wholly within 12" of a Lethisian Defender Stormcast Eternal hero. Until the end of the phase, add 1 to the save rolls of the Liberator unit.`,
        when: [START_OF_COMBAT_PHASE],
      },

      {
        name: `Onyx Shield Wall`,
        desc: `If active, the buffed Liberator unit cannot pile-in before attacking.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
