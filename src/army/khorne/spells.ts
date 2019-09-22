import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'

// Blood Blessings of Khorne - Prayers.
const Spells: TSpells = [
  {
    name: `Bronzed Flesh (Blood Blessing)`,
    effects: [
      {
        name: `Bronzed Flesh (Prayer)`,
        desc: `Pick 1 friendly Khorne unit wholly within 16" and visible to the priest. Add 1 to the save rolls of the target.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bronzed Flesh`,
        desc: `If active, add 1 to the save rolls of the blessed unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Blood Sacrifice (Blood Blessing)`,
    effects: [
      {
        name: `Blood Sacrifice (Prayer)`,
        desc: `Pick a friendly Khorne unit wholly within 8" of the priest. That unit suffers D3 mortal wounds and your receive 1 Blood Tithe point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Resanguination (Blood Blessing)`,
    effects: [
      {
        name: `Resanguination (Prayer)`,
        desc: `Pick a friendly Khorne unit wholly within 16" and visible to the priest. You can heal up to D3 wounds allocated to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Brazen Fury (Blood Blessing)`,
    effects: [
      {
        name: `Brazen Fury (Prayer)`,
        desc: `Pick a friendly Khorne unit wholly within 16" and visible to the priest. Do not take battleshock tests for that unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Brazen Fury`,
        desc: `If active, do not take battleshock tests for on the blessed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Killing Frenzy (Blood Blessing)`,
    effects: [
      {
        name: `Killing Frenzy (Prayer)`,
        desc: `Pick a friendly Khorne unit wholly within 16" of the priest. Add 1 to the hit rolls for attacks made by that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Killing Frenzy`,
        desc: `If active, add 1 to the hit rolls for attacks made by that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spellbane Hex (Blood Blessing)`,
    effects: [
      {
        name: `Spellbane Hex (Prayer)`,
        desc: `You can dispel 1 endless spell within 16" of the priest chanting this prayer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Spells
