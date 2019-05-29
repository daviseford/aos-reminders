import { TBattalions, TUnits } from 'types/army'
import {
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  END_OF_MOVEMENT_PHASE,
  CHARGE_PHASE,
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  END_OF_SHOOTING_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_GAME,
  DURING_SETUP,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_HERO_PHASE,
  DURING_GAME,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: '',
    effects: [
      {
        name: '',
        desc: ``,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: '',
    effects: [
      {
        name: '',
        desc: ``,
        when: [DURING_GAME],
      },
    ],
  },
]
