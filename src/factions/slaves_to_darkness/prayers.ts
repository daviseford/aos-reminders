import { tagAs } from 'factions/metatagger'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH } from 'meta/alliances'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, SAVES_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  'Favour of the Ruinous Powers': {
    effects: [
      {
        name: `Favour of ${MARK_KHORNE}`,
        desc: `Favour of Khorne is a prayer with an answer value of 3 and a range of 18". If answered, pick 1 friendly SLAVES TO DARKNESS MORTAL unit wholly within range and visible to the chanter. You can reroll charge rolls for that unit until your next hero phase. In addition, if that unit has the KHORNE keyword, you can reroll hit rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SLAVES_TO_DARKNESS,
          rule_sources.ERRATA_SLAVES_TO_DARKNESS_JULY_2021,
        ],
      },
      {
        name: `Favour of ${MARK_TZEENTCH}`,
        desc: `Favour of Tzeentch is a prayer with an answer value of 3 and a range of 18". If answered, pick 1 friendly SLAVES TO DARKNESS MORTAL unit wholly within range and visible to the chanter. You can add 1 to save rolls for attacks that target that unit until your next hero phase. In addition, if that unit has the TZEENTCH keyword, until your next hero phase, you can roll a dice each time that unit is affected by a spell or the abilities of an endless spell. If you do so, on a 4+, ignore the effect of that spell or the abilities of that endless spell on that unit.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SLAVES_TO_DARKNESS,
          rule_sources.ERRATA_SLAVES_TO_DARKNESS_JULY_2021,
        ],
      },
      {
        name: `Favour of ${MARK_NURGLE}`,
        desc: `Favour of Nurgle is a prayer with an answer value of 3 and a range of 18". If answered, pick 1 friendly SLAVES TO DARKNESS MORTAL unit wholly within range and visible to the chanter. You can reroll wound rolls for attacks made with melee weapons by that unit until your next hero phase. In addition, if that unit has the NURGLE keyword, add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SLAVES_TO_DARKNESS,
          rule_sources.ERRATA_SLAVES_TO_DARKNESS_JULY_2021,
        ],
      },
      {
        name: `Favour of ${MARK_SLAANESH}`,
        desc: `Favour of Slaanesh is a prayer with an answer value of 3 and a range of 18". If answered, pick 1 friendly SLAVES TO DARKNESS MORTAL unit wholly within range and visible to the chanter. You can reroll charge rolls for that unit until your next hero phase. In addition, if that unit has the SLAANESH keyword, do not take battleshock tests for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SLAVES_TO_DARKNESS,
          rule_sources.ERRATA_SLAVES_TO_DARKNESS_JULY_2021,
        ],
      },
      {
        name: `Favour of Chaos`,
        desc: `Favour of Chaos is a prayer with an answer value of 3 and a range of 18". If answered, pick 1 friendly SLAVES TO DARKNESS MORTAL unit wholly within range and visible to the chanter. You can reroll hit and wound rolls for attacks made by that unit until your next hero phase. In addition, if that unit has the UNDIVIDED keyword, you can reroll charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SLAVES_TO_DARKNESS,
          rule_sources.ERRATA_SLAVES_TO_DARKNESS_JULY_2021,
        ],
      },
    ],
  },
  // Idolators
  'Idolators Prayers': {
    effects: [
      {
        name: `Idolators Prayers`,
        desc: `This model may chant a prayer by rolling a D6 on a friendly Idolators target within 12". On a 3+ the prayer is answered.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blessings of Khorne': {
    effects: [
      {
        name: `Blessings of Khorne`,
        desc: `If answered, targeted Khorne unit can reroll melee attack hit rolls until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessings of Tzeentch': {
    effects: [
      {
        name: `Blessings of Tzeentch`,
        desc: `If answered, targeted Tzeentch unit can reroll save rolls until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Blessings of Nurgle': {
    effects: [
      {
        name: `Blessings of Nurgle`,
        desc: `If answered, targeted Nurgle unit can reroll melee attack wound rolls until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessings of Slaanesh': {
    effects: [
      {
        name: `Blessings of Slaanesh`,
        desc: `If answered, targeted Slaanesh unit can reroll charge rolls until your next hero phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Blessings of Chaos Undivided': {
    effects: [
      {
        name: `Blessings of Chaos Undivided`,
        desc: `If answered, you can heal D3 wounds allocated to targeted Idolators model.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
