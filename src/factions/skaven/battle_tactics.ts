import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

import { TItemDescriptions } from 'factions/factionTypes'
import meta_rule_sources from 'meta/rule_sources'

const BattleTactics = {
  'Restore the Beast': {
    effects: [
      {
        name: `Restore the Beast`,
        desc: `Pick 1 friendly RAT OGOR unit on the battlefield that has 3 or more wounds allocated to it. You complete this tactic if that RAT OGOR unit has 0 wounds allocated to it at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Deathmark: {
    effects: [
      {
        name: `Deathmark`,
        desc: `Pick 1 enemy HERO on the battlefield that has a Wounds characteristic of 10 or more and that has 0 wounds allocated to it. You complete this tactic if that HERO is slain in this turn by attacks made by friendly CLANS ESHIN units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Fire-fire! More-more!': {
    effects: [
      {
        name: `Fire-fire! More-more!`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this tactic if that unit is destroyed in this turn by attacks made with missile weapons by friendly CLANS SKRVRE units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Crescendo of the Diseased Choir': {
    effects: [
      {
        name: `Crescendo of the Diseased Choir`,
        desc: `You complete this tactic if 3 or more prayers chanted by different friendly CLANS PESTILENS PRIESTS are answered in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Flee-flee!': {
    effects: [
      {
        name: `Flee-flee!`,
        desc: `You complete this battle tactic at the end of the turn if any friendly Skaven Battleline units retreated this turn and any friendly Skaven Heroes retreated this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
