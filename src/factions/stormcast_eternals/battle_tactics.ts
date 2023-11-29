import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'
import meta_rule_sources from 'meta/rule_sources'

const BattleTactics = {
  'Concentrated Force': {
    effects: [
      {
        name: `Concentrated Force`,
        desc: `You complete this tactic if the same enemy unit was targeted by attacks made with melee weapons by 3 or more friendly DRACONITH SKY WING units in the combat phase of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  'Focused Destruction': {
    effects: [
      {
        name: `Focused Destruction`,
        desc: `You complete this tactic if the same enemy unit was picked as the target of 3 different monstrous rampages carried out by friendly DRACONITH SKY WING units in this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  'Cleansing Strike': {
    effects: [
      {
        name: `Cleansing Strike`,
        desc: `Pick 2 objectives that are contested by enemy units. You complete this tactic if there are no enemy units contesting either objective at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  'Pioneers of the Realms': {
    effects: [
      {
        name: `Pioneers of the Realms`,
        desc: `You complete this tactic if all of the objectives wholly within your opponent's territory are contested by friendly CITIES OF SIGMAR units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'No Challenge Too Great': {
    effects: [
      {
        name: `No Challenge Too Great`,
        desc: `You complete this tactic if an enemy HERO is slain by wounds caused by an attack made with a melee weapon by a friendly REDEEMER unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Hammerstrike Assault': {
    effects: [
      {
        name: `Hammerstrike Assault`,
        desc: `Pick 1 HERO in your opponent's starting army that is on the battlefield, that has a Wounds characteristic of 10 or more and that has 0 wounds allocated to it. You complete this tactic if that HERO is slain during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lightning-shattered Morale': {
    effects: [
      {
        name: `Lightning-shattered Morale`,
        desc: `Pick 1 unit in your opponent's starting army that is on the battlefield and that has a Bravery characteristic of 10 or more. You complete this tactic if any models in that unit flee during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Draconith Destruction': {
    effects: [
      {
        name: `Draconith Destruction`,
        desc: `Pick 1 unit in your opponent's starting army that is on the battlefield and that has 10 or more models. You complete this tactic if that unit is destroyed by wounds caused by attacks made by friendly DRACONITH, STARDRAKE or DRACOTH units during this turm.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'A Matter of Honour': {
    effects: [
      {
        name: `A Matter of Honour`,
        desc: `Pick 1 MONSTER in your opponent's starting army that is on the battlefield. You complete this tactic if that unit is destroyed by wounds caused by attacks made by friendly DRACONITH or STARDRAKE units during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Secure the Battlefield': {
    effects: [
      {
        name: `Secure the Battlefield`,
        desc: `You complete this battle tactic at the end of your turn if there are any friendly Stormcast Eternals units wholly within each large quarter of the battlefield and more than 6" from all enemy units.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
