import { TAllegiances } from 'types/army'
import {
  DURING_SETUP,
  TURN_ONE_START_OF_HERO_PHASE,
  START_OF_HERO_PHASE,
  END_OF_SHOOTING_PHASE,
  END_OF_COMBAT_PHASE,
  BATTLESHOCK_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
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
  {
    name: `Greywater Fastness`,
    effects: [
      {
        name: `Rune Lore`,
        desc: `In your hero phase, 1 friendly GREYWATER FASTNESS RUNELORD can chant the following prayer in addition to any prayer on their warscroll. If they do so, make a prayer roll by rolling a dice. On a 1, the prayer is not answered. On a 2+, the prayer is answered. 
        
        Rune of Unfaltering Aim: If this prayer is answered, pick 1 friendly IRONWELD ARSENAL WAR MACHINE unit within 3" of this model. Until the start of your next hero phase, add 1 to hit rolls for attacks made with missile weapons by that unit.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Home of the Great Ironweld Guilds`,
        desc: `Increase the Range characteristic of missile weapons used by friendly GREYWATER FASTNESS IRONWELD ARSENAL units by 3" (this does not affect the weapon's minimum range, if it has one).`,
        when: [SHOOTING_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Salvo Fire`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 friendly GREYWATER FASTNESS FREEGUILD HANDGUNNERS unit or 1 friendly GREYWATER FASTNESS IRONDRAKES unit wholly within 12" of a friendly GREYWATER FASTNESS HERO. Add 1 to hit rolls for attacks made with missile weapons by that unit until the end of that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

export default Allegiances
