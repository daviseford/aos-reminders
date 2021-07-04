import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  'Pulverising Hailstorm': {
    effects: [
      {
        name: `Pulverising Hailstorm`,
        desc: `Pulversing Hailstorm is a prayer that has an answer value of 4 and a range of 18". If answered, pick a point on the battlefield within range and visible to the chanter. Roll 1 dice for each unit within 3" of that point. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
    ],
  },
  'Keening Gale': {
    effects: [
      {
        name: `Keening Gale`,
        desc: `Keening Gale is a prayer that has an answer value of 4 and a range of 18". If answered, pick 1 friendly MONSTER or MOURNFANG PACK wholly within range and visible to the chanter. Add 3" to that unit's Move characteristic until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
    ],
  },
  'Call of the Blizzard': {
    effects: [
      {
        name: `Call of the Blizzard`,
        desc: `Call of the Blizzard is a prayer that has an answer value of 4 and a range of 18". If answered, pick 1 friendly ICEFALL YHETEES unit wholly within range and visible to the chanter. You can return 1 slain model to that unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
    ],
  },

  // Unit Prayers
  "Winter's Endurance": {
    effects: [
      {
        name: `Winter's Endurance`,
        desc: `This prayer has an answer value of 4 and a range of 18". If answered, pick 1 friendly BEASTCLAW RAIDERS unit wholly within range and visible to the chanter. You can heal D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
    ],
  },
  "Winter's Strength": {
    effects: [
      {
        name: `Winter's Strength`,
        desc: `This prayer has an answer value of 4 and a range of 18". If answered, pick 1 friendly BEASTCLAW RAIDERS unit wholly within range and visible to the chanter. Add 1 to wound rolls for attacks made with melee weapons by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
