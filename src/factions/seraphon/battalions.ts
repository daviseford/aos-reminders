import { keyPicker } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_TURN,
} from 'types/phases'
import { Units } from './units'

const RegularBattalions = {
  'Shadowstrike Temple-host': {
    effects: [
      {
        name: `The Trap is Sprung`,
        desc: `In your hero phase, pick 1 enemy unit that is visible to the STARPRIEST or PRIEST from this battalion. Until your next hero phase, add 1 to hit rolls for attacks made by units from this battalion that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shadowstrike Starhost': {
    effects: [
      {
        name: `Strike from the Stars`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and say that it is waiting in the stars as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Strike from the Stars`,
        desc: `At the end of any of your movement phases, you can set up any of those units on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Strike from the Stars`,
        desc: `Reserve units that are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [TURN_FOUR_START_OF_TURN],
      },
    ],
  },
  'Firelance Temple-host': {
    mandatory: { units: [keyPicker(Units, ['Saurus Knights'])] },
    effects: [
      {
        name: `Savage Hunters`,
        desc: `Add 3 to run and charge rolls for units from this battalion that are wholly within 18" of the SCAR-VETERAN from the same battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Firelance Starhost': {
    mandatory: { units: [keyPicker(Units, ['Saurus Knights'])] },
    effects: [
      {
        name: `Blazing Cohorts`,
        desc: `If the unmodified wound roll for an attack made with a Celestite weapon by a unit from this battalion is 6, that attacks inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sunclaw Temple-host': {
    mandatory: { units: [keyPicker(Units, ['Saurus Warriors'])] },
    effects: [
      {
        name: `Ferocity Unbound`,
        desc: `Improve the Rend characteristic of Jaws weapons used by units from this battalion by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sunclaw Starhost': {
    mandatory: { units: [keyPicker(Units, ['Saurus Warriors'])] },
    effects: [
      {
        name: `Star-charged Celestite`,
        desc: `Improve the Rend characteristic of Celestite weapons used by units from this battalion by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Thunderquake Temple-host': {
    effects: [
      {
        name: `Beastmasters`,
        desc: `In your hero phase, declare if this battalion will be swift or savage. If you choose for it to be swift, until your next hero phase, units from this battalion can run and still shoot and/or charge in the same turn. If you choose savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by units from this battalion.`,
        when: [HERO_PHASE],
      },
      {
        name: `Beastmasters (Swift)`,
        desc: `If you chose for this battalion to be swift, until your next hero phase, units from this battalion can run and still shoot and/or charge in the same turn. If you choose savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by units from this battalion.`,
        when: [SHOOTING_PHASE, CHARGE_PHASE],
      },
      {
        name: `Beastmasters (Savage)`,
        desc: `If you chose for this battalion to be savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by units from this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Thunderquake Starhost': {
    effects: [
      {
        name: `Celestial Surge`,
        desc: `In your hero phase, you can heal 1 wound allocated to each unit from this battalion. If the unit is wholly within 18" of a friendly SLANN, heal D3 wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Gul'Rok's Starhost": {
    effects: [
      {
        name: `Reform Ranks`,
        desc: `In each of your hero phases, a Starhost unit within 10" of their Scar-Veteran can reform. To do so, choose one model in the unit to be the lynchpin. Remove all other models in the unit from the battlefield and then set them up again within 5" of the lynchpin. The unit can move normally in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Venomblade Starhost': {
    effects: [
      {
        name: `Blessing of the Serpent`,
        desc: `When the STARPRIEST from this battalion uses its Serpent Staff ability, you can pick any number of units from the same battalion that are wholly within 18" of the STARPRIEST to be affected by the ability instead of 1 SERAPHON unit that is wholly within 12" of the STARPRIEST.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Eternal Starhost': {
    mandatory: {
      units: [keyPicker(Units, ['Saurus Guard', 'Saurus Eternity Warden'])],
      battalions: [
        keyPicker(RegularBattalions, [
          'Sunclaw Starhost',
          'Firelance Starhost',
          'Shadowstrike Starhost',
          'Thunderquake Starhost',
        ]),
      ],
    },
    effects: [
      {
        name: `Celestial Reinforcement`,
        desc: `At the start of your hero phase, you receive D3 celestial conjuration points if the SLANN, STARSEER or ORACLE from this battalion is on the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Eternal Temple-host': {
    mandatory: {
      units: [keyPicker(Units, ['Saurus Guard', 'Saurus Eternity Warden'])],
      battalions: [
        keyPicker(RegularBattalions, [
          'Sunclaw Temple-host',
          'Firelance Temple-host',
          'Shadowstrike Temple-host',
          'Thunderquake Temple-host',
        ]),
      ],
    },
    effects: [
      {
        name: `Primal Vistas`,
        desc: `If the SLANN, STARSEER or ORACLE from this battalion is on the battlefield, the Primeval Domain battle trait (pg 55) applies to all terrain features, not just those in your territory.`,
        when: [DURING_GAME],
      },
    ],
  },
}

// Battalions
export const Battalions = { ...RegularBattalions, ...SuperBattalions }
