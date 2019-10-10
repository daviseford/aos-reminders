import { TAllegiances } from 'types/army'
import {
  DURING_SETUP,
  TURN_ONE_START_OF_HERO_PHASE,
  START_OF_HERO_PHASE,
  END_OF_SHOOTING_PHASE,
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
  {
    name: `The Living City`,
    effects: [
      {
        name: `Hunters of the Hidden Paths`,
        desc: `You can set up 1 reserve unit on the hidden paths for each LIVING CITY unit you have set up on the battlefield.
        At the end of your movement phase, you can setup 1 or more of these units on the battlefield, wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Any reserve units on the hidden paths that are not set up on the battlefield before the start of the fourth battleround are destroyed.`,
        when: [DURING_SETUP],
        allegiance_ability: true,
      },
      {
        name: `Attuned to Nature`,
        desc: `You can heal 1 wound allocated to each friendly LIVING CITY unit.`,
        when: [START_OF_HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Strike then Melt Away`,
        desc: `Pick 1 friendly LIVING CITY unit that shot in that phase, is more than 9" from any enemy units and is wholly within 18" of af riendly LIVING CITY HERO. That unit can make a normal move (it cannot run). A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_SHOOTING_PHASE],
        command_ability: true,
      },
    ],
  },
]

export default Allegiances
