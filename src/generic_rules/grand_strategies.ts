import rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { END_OF_GAME } from 'types/phases'

// General grand strategies available from GHB 2021
const GenericGrandStrategies: TEntry[] = [
  {
    name: `Sever the Head`,
    effects: [
      {
        name: `Sever the Head`,
        desc: `When the battle ends, you complete this grand strategy if there are no HEROES from your opponent's starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Hold the Line`,
    effects: [
      {
        name: `Hold the Line`,
        desc: `When the battle ends, you complete this grand strategy if there are any Battleline units from your starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Vendetta`,
    effects: [
      {
        name: `Vendetta`,
        desc: `When the battle ends, you complete this grand strategy if the model chosen to be your opponent's general has been slain and the model chosen to be your general has not been slain.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Dominating Presence`,
    effects: [
      {
        name: `Dominating Presence`,
        desc: `When the battle ends, you complete this grand strategy if there are more units from your starting army on the battlefield than there are units from your opponent's starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Beast Master`,
    effects: [
      {
        name: `Beast Master`,
        desc: `When the battle ends, you complete this grand strategy if there are any MONSTERS from your starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Prized Sorcery`,
    effects: [
      {
        name: `Prized Sorcery`,
        desc: `When the battle ends, you complete this grand strategy if there are any WIZARDS from your starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Pillars of Belief`,
    effects: [
      {
        name: `Pillars of Belief`,
        desc: `When the battle ends, you complete this grand strategy if there are any PRIESTS from your starting army on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: `Predator's Domain`,
    effects: [
      {
        name: `Predator's Domain`,
        desc: `When the battle ends, you complete this grand strategy if you control more terrain features than your opponent.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
]

export default GenericGrandStrategies
