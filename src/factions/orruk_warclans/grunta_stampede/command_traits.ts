import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE } from 'types/phases'

const CommandTraits = {
  'Monsta Hunta': {
    effects: [
      {
        name: `Monsta Hunta`,
        desc: `Improve the Rend characteristic of this general's Pig-hacka by 1 for attacks that target an enemy MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
