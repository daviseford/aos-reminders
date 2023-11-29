import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import meta_rule_sources from 'meta/rule_sources'

const BattleTactics = {
  'Out of Control': {
    effects: [
      {
        name: `Out of Control`,
        desc: `You complete this battle tactic if you carry out Greedy Gobble, Charge Down and 2 other monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Da Boss Leads Da Way': {
    effects: [
      {
        name: `Da Boss Leads Da Way`,
        desc: `You complete this battle tactic if, during this turn, your general calls a Grunta Waaagh! and any enemy units are destroyed by attacks made by your general or abilities used by your general this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Full-speed Stampede': {
    effects: [
      {
        name: `Full-speed Stampede`,
        desc: `You complete this battle tactic if, at the end of the turn, there are 3 or more friendly MAW-GRUNTA units on the battlefield that each have a momentum score of 5+.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')
