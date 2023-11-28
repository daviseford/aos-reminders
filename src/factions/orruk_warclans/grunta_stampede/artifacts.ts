import { tagAs } from 'factions/metatagger'
import { DURING_GAME } from 'types/phases'

const Artifacts = {
  'Da Boom Skull': {
    effects: [
      {
        name: `Da Boom Skull`,
        desc: `The bearer can issue commands to any friendly unit on the battlefield. In addition, each time the bearer issues a command, you can pick 1 enemy unit within 3" of them and roll a dice. On a 3+, that unit suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
