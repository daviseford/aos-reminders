import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Trample the Defiant': {
    effects: [
      {
        name: `Trample the Defiant`,
        desc: `Pick 1 friendly KAVALOS DEATHRIDERS unit that is more than 3" from all enemy units. You complete this tactic if that unit made a charge move in this turn and is within 3" of any enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Unfeeling Recursion': {
    effects: [
      {
        name: `Unfeeling Recursion`,
        desc: `You complete this tactic if there are 3 or more friendly OSSIARCH BONEREAPERS units on the battlefield that had models returned to them in this turn using the Reknit Construct command ability and did not have any models slain in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Tithe Demands': {
    effects: [
      {
        name: `The Tithe Demands`,
        desc: `Pick 1 enemy HERO or MONSTER on the battlefield. You complete this tactic if that unit is destroyed during this turn by an attack made by a friendly GOTHIZZAR HARVESTER.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "The Sculptor's Entourage": {
    effects: [
      {
        name: `The Sculptor's Entourage`,
        desc: `You complete this tactic at the end of this turn if a friendly IMMORTIS GUARD unit and a friendly MORTISAN are contesting the same objective wholly outside of your territory.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Remorseless Bombardment': {
    effects: [
      {
        name: `Remorseless Bombardment`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this tactic if that enemy unit is destroyed during this turn by attacks made by friendly MORTEK CRAWLER units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Edge of Obliteration': {
    effects: [
      {
        name: `The Edge of Obliteration`,
        desc: `You complete this tactic if 2 or more friendly NECROPOLIS STALKERS units are wholly within enemy territory and more than 9" from all enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
