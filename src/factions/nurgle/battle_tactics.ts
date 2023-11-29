import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Feed the Maggots': {
    effects: [
      {
        name: `Feed the Maggots`,
        desc: `You complete this tactic if at least 7 enemy models are slain by disease rolls during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Nurture the Gnarlmaw': {
    effects: [
      {
        name: `Nurture the Gnarlmaw`,
        desc: `Pick 1 Feculent Gnarlmaw in your army that is within 12" of any enemy units. You complete this tactic if that Feculent Gnarlmaw is more than 12" from all enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Gifts of Nurgle': {
    effects: [
      {
        name: `Gifts of Nurgle`,
        desc: `You complete this tactic if 3 or more friendly MAGGOTKIN OF NURGLE units are within 3" of the same enemy unit at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NURGLE, rule_sources.ERRATA_JANUARY_2022],
      },
    ],
  },
  'Glory to the Grandfather!': {
    effects: [
      {
        name: `Glory to the Grandfather!`,
        desc: `You complete this tactic at the end of this turn if more enemy units than friendly units are destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Droning': {
    effects: [
      {
        name: `The Droning`,
        desc: `You complete this tactic if there is a different friendly unit with a Rot Fly mount in each quarter of the battlefield at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sudden Domination': {
    effects: [
      {
        name: `Sudden Domination`,
        desc: `You complete this tactic if you summon a GREAT UNCLEAN ONE to the battlefield during this turn and it is within 3" of an objective that you control in your opponent's territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Don't Squabble, Children": {
    effects: [
      {
        name: `Don't Squabble, Children`,
        desc: `Pick an objective wholly outside your territory. You complete this battle tactic at the end of the turn if you control that objective and any friendly Rotbringers units and any friendly Nurgle Daemon units contest that objective.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
