import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, MOVEMENT_PHASE, WARDS_PHASE } from 'types/phases'

const DeathUnits = {
  "Jerrion's Delegation": {
    effects: [
      {
        name: `Urgent Missive`,
        desc: `Units in this regiment of renown can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Deathless Courtiers`,
        desc: `Units in this regiment of renown have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
}

export default tagAs(DeathUnits, 'unit')
