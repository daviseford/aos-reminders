import { TAllegiances } from 'types/army'
import {
  TURN_ONE_START_OF_HERO_PHASE,
  START_OF_HERO_PHASE,
  END_OF_COMBAT_PHASE,
  BATTLESHOCK_PHASE,
} from 'types/phases'

// This is where we store sub-allegiances such as
// Grand Courts, Hosts, Clans, Glades, Lodges, etc
const Allegiances: TAllegiances = [
  {
    name: `Hammerhal`,
    effects: [
      {
        name: `Banners Held High`,
        desc: `At the start of your hero phase, roll a dice for each friendly HAMMERHAL unit that includes any Standard Bearers. For each 6, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `The Magister of Hammerhal`,
        desc: `If your army includes AVENTIS FIRESTRIKE and he is your general, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `The Pride of Hammerhal`,
        desc: `Do not take battleshock tests for HAMMERHAL units that are wholly within your territory.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Righteous Purpose`,
        desc: `Pick 1 friendly HAMMERHAL unit that is wholly within enemy territory, wholly within 12" of a friendly HAMMERHAL HERO, and within 3" of an enemy unit. That friendly unit can fight. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
]

export default Allegiances
