import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const GenericMonstrousRampages: TEntry[] = [
  {
    name: 'Roar',
    effects: [
      {
        name: `Roar`,
        desc: `Pick 1 enemy unit within 3" of this model and roll a dice. On a 3+, that unit cannot issue or receive commands in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Stomp`,
    effects: [
      {
        name: `Stomp`,
        desc: `Pick 1 enemy unit within 3" of this model that is not a MONSTER and roll a dice. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Titanic Duel`,
    effects: [
      {
        name: `Titanic Duel`,
        desc: `Pick 1 enemy MONSTER within 3" of this model. Add 1 to hit rolls for attacks made by this model that target that enemy MONSTER until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Smash To Rubble`,
    effects: [
      {
        name: `Smash To Rubble`,
        desc: `Pick 1 faction terrain feature or defensible terrain feature within 3" of this model and roll a dice. On a 3+, the terrain feature is demolished if it was defensible (see 17.2.3), and the scenery rules on its warscroll cannot be used for the rest of the battle if it was a faction terrain feature.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
]
export default GenericMonstrousRampages
