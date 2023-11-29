import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WARDS_PHASE,
} from 'types/phases'

const BattleTraits = {
  [OSSIARCH_BONEREAPERS]: {
    effects: [
      {
        name: `Deathless Warriors`,
        desc: `Friendly OSSIARCH BONEREAPERS units have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Ranks Unbroken By Dissent`,
        desc: `Do not take battleshock tests for friendly OSSIARCH BONEREAPERS units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Nadirite Weapons`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a friendly OSSIARCH BONEREAPERS unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit. This ability has no effect on attacks made by mounts, unless noted otherwise.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Relentless Discipline`,
        desc: `If you command an Ossiarch Bonereapers army, when you receive your starting command points, you receive extra command points as follows. These command points are cumulative.
        
        You receive 1 extra command point if there are 3 or more friendly OSSIARCH BONEREAPERS units on the battlefield.
        You receive 2 extra command points if there are 5 or more friendly OSSIARCH BONEREAPERS units on the battlefield.
        You receive 3 extra command points if there are 7 or more friendly OSSIARCH BONEREAPERS units on the battlefield. `,
        when: [START_OF_ROUND],
      },
      {
        name: `Ossiarch Commands`,
        desc: `If you command an Ossiarch Bonereapers army, you can use Ossiarch commands in addition to any other command abilities that you can use. Ossiarch commands are command abilities that either appear on the warscroll of a unit that has the OSSIARCH BONEREAPERS keyword or are included in the table below. Only OSSIARCH BONEREAPERS units can issue Ossiarch commands.

        In addition, the restriction that you cannot use the same command ability more than once in the same phase does not apply to Ossiarch commands.
        
        Designer's Note: You can use the same Ossiarch command more than once in the same phase as long as that command is issued by a model that has not already issued a command in that phase and it is received by a unit that has not already received a command in that phase.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Trample the Defiant`,
        desc: `Pick 1 friendly KAVALOS DEATHRIDERS unit that is more than 3" from all enemy units. You complete this tactic if that unit made a charge move in this turn and is within 3" of any enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unfeeling Recursion`,
        desc: `You complete this tactic if there are 3 or more friendly OSSIARCH BONEREAPERS units on the battlefield that had models returned to them in this turn using the Reknit Construct command ability and did not have any models slain in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Tithe Demands`,
        desc: `Pick 1 enemy HERO or MONSTER on the battlefield. You complete this tactic if that unit is destroyed during this turn by an attack made by a friendly GOTHIZZAR HARVESTER.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Sculptor's Entourage`,
        desc: `You complete this tactic at the end of this turn if a friendly IMMORTIS GUARD unit and a friendly MORTISAN are contesting the same objective wholly outside of your territory.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Remorseless Bombardment`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this tactic if that enemy unit is destroyed during this turn by attacks made by friendly MORTEK CRAWLER units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Edge of Obliteration`,
        desc: `You complete this tactic if 2 or more friendly NECROPOLIS STALKERS units are wholly within enemy territory and more than 9" from all enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
