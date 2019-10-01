import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import { TCommands } from 'types/army'

// General command abilities from Core Rules and GHB 2019
const GenericCommands: TCommands = [
  {
    name: `At the Double`,
    effects: [
      {
        name: `At the Double`,
        desc: `After you make a run roll for a friendly unit within 6" of a friendly hero (12" of a friendly general), you can use this ability to make the run roll a 6.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Forward to Victory`,
    effects: [
      {
        name: `Forward to Victory`,
        desc: `After you make a charge roll for a friendly unit within 6" of a friendly hero (12" of a friendly general), you can use this ability to re-roll the charge.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Inspiring Presence`,
    effects: [
      {
        name: `Inspiring Presence`,
        desc: `Target unit within 6" of a friendly hero (12" of a friendly general) does not have to take a battleshock test if this ability is used.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `All-out Attack`,
    effects: [
      {
        name: `All-out Attack`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly hero (18" of a friendly general). You can re-roll hit rolls of 1 for the target.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `All-out Defence`,
    effects: [
      {
        name: `All-out Defence`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly hero (18" of a friendly general). You can re-roll save rolls of 1 for the target.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Volley Fire`,
    effects: [
      {
        name: `Volley Fire`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly hero (18" of a friendly general). You can re-roll hit rolls of 1 for the target.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
]
export default GenericCommands
