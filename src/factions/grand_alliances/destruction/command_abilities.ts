import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const DestructionCommandAbilities = {
  'Born to Lead': {
    effects: [
      {
        name: `Born to Lead`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly model with this command ability. You can reroll charge rolls for friendly Fimir units while they are wholly within 12" of that model in that charge phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(DestructionCommandAbilities, 'command_ability')
