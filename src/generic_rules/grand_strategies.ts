import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { END_OF_GAME } from 'types/phases'

// General grand strategies
const GenericGrandStrategies: TEntry[] = [
  // {
  //   name: `Sever the Head`,
  //   effects: [
  //     {
  //       name: `Sever the Head`,
  //       desc: `When the battle ends, you complete this grand strategy if there are no HEROES from your opponent's starting army on the battlefield.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Hold the Line`,
  //   effects: [
  //     {
  //       name: `Hold the Line`,
  //       desc: `When the battle ends, you complete this grand strategy if there are any Battleline units from your starting army on the battlefield.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Vendetta`,
  //   effects: [
  //     {
  //       name: `Vendetta`,
  //       desc: `When the battle ends, you complete this grand strategy if the model chosen to be your opponent's general has been slain and the model chosen to be your general has not been slain.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Dominating Presence`,
  //   effects: [
  //     {
  //       name: `Dominating Presence`,
  //       desc: `When the battle ends, you complete this grand strategy if there are more units from your starting army on the battlefield than there are units from your opponent's starting army on the battlefield.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Beast Master`,
  //   effects: [
  //     {
  //       name: `Beast Master`,
  //       desc: `When the battle ends, you complete this grand strategy if there are any MONSTERS from your starting army on the battlefield.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Prized Sorcery`,
  //   effects: [
  //     {
  //       name: `Prized Sorcery`,
  //       desc: `When the battle ends, you complete this grand strategy if there are any WIZARDS from your starting army on the battlefield.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Pillars of Belief`,
  //   effects: [
  //     {
  //       name: `Pillars of Belief`,
  //       desc: `When the battle ends, you complete this grand strategy if there are any PRIESTS from your starting army on the battlefield.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },
  // {
  //   name: `Predator's Domain`,
  //   effects: [
  //     {
  //       name: `Predator's Domain`,
  //       desc: `When the battle ends, you complete this grand strategy if you control more terrain features than your opponent.`,
  //       when: [END_OF_GAME],
  //       rule_sources: [meta_rule_sources.GHB_2021],
  //     },
  //   ],
  // },

  // GHB 2022 Grand Strategies
  {
    name: `No Place for the Weak`,
    effects: [
      {
        name: `No Place for the Weak`,
        desc: `When the battle ends, you complete this grand strategy if there are no Battleline units from your opponent's starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
  {
    name: `Tame the Land`,
    effects: [
      {
        name: `Tame the Land`,
        desc: `When the battle ends, you complete this grand strategy if you control all of the objectives on the battlefield that are wholly outside your territory.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
  {
    name: `Defend What's Ours`,
    effects: [
      {
        name: `Defend What's Ours`,
        desc: `When the battle ends, you complete this grand strategy if there are no enemy units wholly within your territory.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
  {
    name: `Take What's Theirs`,
    effects: [
      {
        name: `Take What's Theirs`,
        desc: `When the battle ends, you complete this grand strategy if there are more friendly units than enemy units wholly within your opponent's territory.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
  {
    name: `Demonstration of Strength`,
    effects: [
      {
        name: `Demonstration of Strength`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more GALLETIAN VETERANS units from your starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
  {
    name: `Show of Dominance`,
    effects: [
      {
        name: `Show of Dominance`,
        desc: `When the battle ends, you complete this grand strategy if there are any friendly GALLETIAN VETERANS units in each quarter of the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
]

export default GenericGrandStrategies
