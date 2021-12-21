import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, HERO_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  // Blood Blessings
  'Bronzed Flesh': {
    effects: [
      {
        name: `Bronzed Flesh`,
        desc: `Bronzed Flesh has an answer value of 4 and a range of 16". If answered, pick 1 friendly KHORNE unit wholly within range of the chanter that is visible to them. Add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Bronzed Flesh`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Blood Sacrifice': {
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `Blood Sacrifice has an answer value of 4 and a range of 8". If answered, pick 1 friendly KHORNE unit wholly within range of the chanter that is visible to them. That unit suffers D3 mortal wounds and you receive 1 Blood Tithe point.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  Resanguination: {
    effects: [
      {
        name: `Resanguination`,
        desc: `Resanguination has an answer value of 4 and a range of 16". If answered, pick 1 friendly KHORNE unit wholly within range of the chanter that is visible to them. You can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Brazen Fury': {
    effects: [
      {
        name: `Brazen Fury`,
        desc: `Brazen Fury has an answer value of 4 and a range of 16". If answered, pick 1 friendly KHORNE unit wholly within range of the chanter that is visible to them. Do not take battleshock tests for that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Brazen Fury`,
        desc: `If active, do not take battleshock tests for that unit until the start of your next hero phase.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Killing Frenzy': {
    effects: [
      {
        name: `Killing Frenzy`,
        desc: `Killing Frenzy has an answer value of 4 and a range of 16". If answered, pick 1 friendly KHORNE unit wholly within range of the chanter that is visible to them. Add 1 to hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Killing Frenzy`,
        desc: `If active, add 1 to hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Spellbane Hex': {
    effects: [
      {
        name: `Spellbane Hex`,
        desc: `Spellbane Hex has an answer value of 4 and a range of 16". If answered, you can pick 1 endless spell within range of the chanter. That endless spell is dispelled.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Blood Boil': {
    effects: [
      {
        name: `Blood Boil`,
        desc: `Answer value of 4 and a range of 16". If answered, pick 1 enemy unit within range of the chanter that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Blood Bind': {
    effects: [
      {
        name: `Blood Bind`,
        desc: `Answer value of 4 and a range of 16". If answered, pick 1 enemy unit within range of the chanter that is visible to them and more than 3" from all friendly units. Your opponent must move that unit a number of inches equal to the chanting roll. The first model to be moved from that unit must finish the move as close as possible to the closest unit in your army (it can finish the move within 3" of units in your army). Any remaining models in that unit must finish their move in unit coherency and as close as possible to the closest unit from your army.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
