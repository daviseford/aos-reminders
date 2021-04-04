import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Prayers = {
  // Blood Blessings
  'Bronzed Flesh': {
    effects: [
      {
        name: `Bronzed Flesh`,
        desc: `If this prayer is answered, pick 1 friendly KHORNE unit wholly within 16" of the model chanting this prayer and visible to them. Add 1 to save rolls for that unit until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bronzed Flesh`,
        desc: `If active, add 1 to the save rolls of the blessed unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Blood Sacrifice': {
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `If this prayer is answered, pick a friendly KHORNE unit wholly within 8" of the model chanting this prayer. That unit suffers D3 mortal wounds and you receive 1 Blood Tithe point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Resanguination: {
    effects: [
      {
        name: `Resanguination`,
        desc: `If this prayer is answered, pick a friendly KHORNE HERO wholly within 16" of the model chanting this prayer and visible to them. You can heal up to D3 wounds allocated to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Brazen Fury': {
    effects: [
      {
        name: `Brazen Fury`,
        desc: `If this prayer is answered, pick a friendly KHORNE unit wholly within 16" of the model chanting this prayer and visible to them. Do not take battleshock tests for that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Brazen Fury`,
        desc: `If active, do not take battleshock tests for on the blessed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Killing Frenzy': {
    effects: [
      {
        name: `Killing Frenzy`,
        desc: `If this prayer is answered, pick a friendly KHORNE unit wholly within 16" of the model chanting this prayer. Add 1 to hit rolls for attacks made by that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Killing Frenzy`,
        desc: `If active, add 1 to the hit rolls for attacks made by that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Spellbane Hex': {
    effects: [
      {
        name: `Spellbane Hex`,
        desc: `If this prayer is answered, you can dispel 1 endless spell within 16" of the model chanting this prayer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blood Boil': {
    effects: [
      {
        name: `Blood Boil`,
        desc: `If this prayer is answered, pick 1 enemy unit within 16" of this model. The target suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Bind': {
    effects: [
      {
        name: `Blood Bind`,
        desc: `If this prayer is answered, pick 1 enemy unit within 16" of this model and not within 3" of any friendly units. Your opponent must move the target unit a number of inches equal to the prayer roll. The first model to be moved must finish its move as close as possible to the closest unit from the chanting model's army. Any remaining models in the unit must maintain cohesion.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
