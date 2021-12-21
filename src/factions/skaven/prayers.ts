import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  // Unit prayers
  'Disease-disease!': {
    effects: [
      {
        name: `Disease-disease!`,
        desc: `Disease-disease! is a prayer with an answer value of 3 and a range of 13". If answered, pick 1 enemy unit within range and is visible to the chanter. Roll 1 dice for each model in that unit. For each 6, that unit suffers 1 mortal wound. This prayer has no effect on CLANS PESTILENS units.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Pestilence-pestilence!': {
    effects: [
      {
        name: `Pestilence-pestilence!`,
        desc: `Pestilence-pestilence! is a prayer with an answer value of 3 and a range of 13". If answered, pick a point on the battlefield within range and visible to the chanter. Roll a dice for each unit within 3" of that point. On a 4+, that unit suffers D3 mortal wounds. This prayer has no effect on CLANS PESTILENS units.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Filth-filth!': {
    effects: [
      {
        name: `Filth-filth!`,
        desc: `Filth-filth! is a prayer with an answer value of 3 and a range of 13". If answered, pick 1 friendly CLANS PESTILENS unit wholly within range and visible to the chanter. Add 1 to wound rolls for attack made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Rabid-rabid!': {
    effects: [
      {
        name: `Rabid-rabid!`,
        desc: `Rabid-rabid! is a prayer with an answer value of 3 and a range of 13". If answered, pick 1 friendly CLANS PESTILENS unit wholly within range and visible to the chanter. Add 1 to the Attacks characteristic of melee weapons used by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
