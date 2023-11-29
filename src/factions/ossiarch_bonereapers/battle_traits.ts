import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_GAME, START_OF_ROUND, WARDS_PHASE } from 'types/phases'

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
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
