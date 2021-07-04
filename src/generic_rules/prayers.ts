// Prayers go here
import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { HERO_PHASE } from 'types/phases'

const GenericPrayers: TEntry[] = [
  // Core Prayers
  {
    name: `Bless`,
    effects: [
      {
        name: `Bless`,
        desc: `Bless is a prayer that has an answer value of 4 and a range of 12". If answered, pick 1 friendly unit wholly within range and visible to the chanter. Until the start of your next hero phase, that unit has a ward of 6+.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Smite`,
    effects: [
      {
        name: `Smite`,
        desc: `Smite is a prayer that has an answer value of 2 and a range of 48". If answered, pick 1 enemy Priest within range and visible to the chanter. That enemy Priest suffers 1 mortal wound. If the chanting roll was 6 or more, that enemy Priest suffers D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  {
    name: 'Guidance',
    effects: [
      {
        name: `Guidance`,
        desc: `Guidance is a prayer that has an answer value of 5. If answered, you receive 1 command point.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  {
    name: 'Heal',
    effects: [
      {
        name: `Heal`,
        desc: `Heal is a prayer that has an answer value of 3 and a range of 12". If answered, pick 1 friendly model within range and visible to the chanter. You can heal up to D3 wounds allocated to that model.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  {
    name: 'Curse',
    effects: [
      {
        name: `Curse`,
        desc: `Curse is a prayer that has an answer value of 4 and a range of 9". If answered, pick 1 enemy unit within range and visible to the chanter. Until your next hero phase, if the unmodified hit roll for an attack that targets that unit is 6, that unit suffers 1 mortal wound in addition to any normal damage.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
]

export default GenericPrayers
