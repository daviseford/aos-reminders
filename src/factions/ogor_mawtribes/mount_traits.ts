import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const MountTraits = {
  'Fleet of Hoof': {
    effects: [
      {
        name: `Fleet of Hoof`,
        desc: 'You can reroll one or both of the dice when making charge rolls for this model.',
        when: [CHARGE_PHASE],
      },
    ],
  },
  Fleshgreed: {
    effects: [
      {
        name: `Fleshgreed`,
        desc: `At the start of each hero phase, if this model is eating, you can heal 1 wound allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rimefrost Hide': {
    effects: [
      {
        name: `Rimefrost Hide`,
        desc: `Worsen the Rend characteristic of melee weapons that target this model by 1 (to a minimum of '-').`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Gvarnak: {
    effects: [
      {
        name: `Gvarnak`,
        desc: "Add 1 to this model's Wounds characteristic.",
        when: [DURING_GAME],
      },
    ],
  },
  Matriarch: {
    effects: [
      {
        name: `Matriarch`,
        desc: `Add 1 to charge rolls for friendly THUNDERTUSKS while they are wholly within 12" of this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Alvagr Ancient': {
    effects: [
      {
        name: `Alvagr Ancient`,
        desc: `If this model has not made a charge move in the same turn, enemy units that are within 3" of this model at the start of the combat phase fight at the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Black Clatterhorn': {
    effects: [
      {
        name: `Black Clatterhorn`,
        desc: "Add 1 to hit rolls for attacks made with this model's Rock-hard Horns.",
        when: [COMBAT_PHASE],
      },
    ],
  },
  Metalcruncher: {
    effects: [
      {
        name: `Metalcruncher`,
        desc: `At the start of the combat phase, pick 1 enemy WAR MACHINE, or 1 enemy unit with a Save characteristic of 4+, 3+ or 2+, that is within 3" of this model. That enemy unit immediately suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Belligerent Charger': {
    effects: [
      {
        name: `Belligerent Charger`,
        desc: `When determining the number of dice to roll for the Trampling Charge battle trait, treat charge rolls made for this model of less than 7 as 7.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Frosthoof Bull': {
    effects: [
      {
        name: `Frosthoof Bull`,
        desc: "Improve the Rend characteristic of this model's Crushing Hooves by 1.",
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Rockmane Elder': {
    effects: [
      { name: `Rockmane Elder`, desc: `Add 1 to this model's Wounds characteristic.`, when: [DURING_GAME] },
    ],
  },
  'Old Granitetooth': {
    effects: [
      {
        name: `Old Granitetooth`,
        desc: `Add 1 to charge rolls for friendly STONEHORNS and MOURNFANG PACK units while they are wholly within 12" of this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')
