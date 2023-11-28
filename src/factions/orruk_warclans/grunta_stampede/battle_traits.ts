import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { DURING_GAME, START_OF_CHARGE_PHASE, START_OF_HERO_PHASE, TURN_ONE_DURING_ROUND } from 'types/phases'

const GruntaStampedeBattleTraits = {
  'Grunta Waaagh!': {
    effects: [
      {
        name: `Grunta Waaagh!`,
        desc: `Once per battle, at the start of your charge phase, you can pick 1 friendly MAW-GRUNTA general on the battlefield and say that they are calling a Grunta Waaagh!. If you do so, until the end of that phase, each time a friendly MAW-GRUNTA unit finishes a charge move, roll a dice for each enemy unit within 1" of any models in that MAW-GRUNTA unit. On a 3+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Hogs of War': {
    effects: [
      {
        name: `Hogs of War`,
        desc: `Friendly GORE-GRUNTAS units gain the Battleline battlefield role.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  "'Ere We Come!": {
    effects: [
      {
        name: `'Ere We Come!`,
        desc: `During the first battle round, do not subtract 1 from the momentum score of friendly MAW-GRUNTA units at the end of each turn.`,
        when: [TURN_ONE_DURING_ROUND],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Battle Tactics': {
    effects: [
      {
        name: `Battle Tactics - Out of Control`,
        desc: `You complete this battle tactic if you carry out Greedy Gobble, Charge Down and 2 other monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
      {
        name: `Battle Tactics - Da Boss Leads Da Way`,
        desc: `You complete this battle tactic if, during this turn, your general calls a Grunta Waaagh! and any enemy units are destroyed by attacks made by your general or abilities used by your general this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
      {
        name: `Battle Tactics - Full-speed Stampede`,
        desc: `You complete this battle tactic if, at the end of the turn, there are 3 or more friendly MAW-GRUNTA units on the battlefield that each have a momentum score of 5+.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
}

export default tagAs(GruntaStampedeBattleTraits, 'battle_trait')
