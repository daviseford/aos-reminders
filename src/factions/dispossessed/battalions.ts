import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, DURING_GAME } from 'types/phases'

const Battalions = {
  'Grudgebound War Throng': {
    effects: [
      {
        name: `Ancient Grudges`,
        desc: `You can reroll all hit rolls of 1 for models in a Grudgebound War Throng.`,
        when: [DURING_GAME],
      },
      {
        name: `Stubborn to the End`,
        desc: `If you roll a 1, 2 or a 3 when taking a battleshock test for a unit in a Grudgebound War Throng, that unit is treated as having passed the battleshock test irrespective of any penalties on their Bravery or the number of casualties they have suffered that turn.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(Battalions, 'battalion')
