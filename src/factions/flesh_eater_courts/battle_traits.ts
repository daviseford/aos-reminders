import { tagAs } from 'factions/metatagger'
import { FLESH_EATER_COURTS } from 'meta/factions'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTraits = {
  [FLESH_EATER_COURTS]: {
    effects: [
      {
        name: `Deathless Courtiers`,
        desc: `Friendly FLESH-EATER COURTS units have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Courts of Delusion`,
        desc: `In the first battle round, after the players have received their starting command points but before the start of the first turn, you can pick 1 of the following delusions to apply during the battle:
        
        The Royal Hunt: Add 1 to wound rolls for attacks made by friendly FLESH-EATER COURTS units that target a MONSTER.
        Crusading Army: Add 1 to run rolls and charge rolls for friendly FLESH-EATER COURTS units.
        Defenders of the Realm: Add 1 to save rolls for friendly FLESH-EATER COURTS units while they are contesting an objective that you control.
        The Grand Tournament: Add 1 to hit rolls for attacks made by friendly FLESH-EATER COURTS HEROES that are not a general if they made a charge move in the same turn.
        The Feast Day: The Feeding Frenzy ability applies to friendly FLESH-EATER COURTS units while they are wholly within 12" of any friendly HEROES that have 4 or more noble deeds points instead of 6 noble deeds points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Muster Guard`,
        desc: `At the end of your movement phase, each friendly COURTIER can spend 1 of their noble deeds points to return 1 slain model to a friendly SERFS unit that is within 10" of them, or 2 of their noble deeds points to return 1 slain model to a friendly KNIGHTS unit that is within 10" of them. You can use this ability multiple times each turn as long as the required noble deeds points are available.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Feeding Frenzy`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly FLESH-EATER COURTS units while they are wholly within 12" of any friendly HEROES that have 6 noble deeds points.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Noble Deeds`,
        desc: `Each time a friendly FLESH-EATER COURTS HERO successfully casts a spell that is not unbound, give 1 noble deeds point to that HERO.`,
        when: [HERO_PHASE],
      },
      {
        name: `Noble Deeds`,
        desc: `Each time a prayer chanted by a friendly FLESHEATER COURTS HERO is answered, give 1 noble deeds point to that Hero.`,
        when: [HERO_PHASE],
      },
      {
        name: `Noble Deeds`,
        desc: `Each time a friendly FLESH-EATER COURTS HERO fights, after all of its attacks have been resolved, give that HERO a number of noble deeds points equal to the number of wounds and/or mortal wounds caused by that HERO in that phase that were allocated to enemy units. Do not count wounds and/or mortal wounds caused by that HERO's mount. Each time a friendly ABHORRANT fights, if that unit is mounted, any wounds caused by attacks made by the rider must be allocated first, followed by wounds allocated by attacks made by its mount.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Noble Deeds`,
        desc: `Each FLESH-EATER COURTS HERO can have a maximum of 6 noble deeds points at any one time (it cannot be given any more until the number of noble deeds points it has is reduced to less than 6).`,
        when: [DURING_GAME],
      },
      {
        name: `Summon Loyal Subjects`,
        desc: `At the end of your movement phase, each friendly ABHORRANT can spend 6 of their noble deeds points to summon loyal subjects. If they do so, pick 1 friendly SERFS or KNIGHTS unit that has been destroyed and add a new replacement unit identical to that unit to your army with half of the models from the unit that was destroyed (rounding up). Replacement units must be set up wholly within 6" of the edge of the battlefield and more than 9" from all enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves Ee replaced. Remaining models which are not set up as part of the replacement unit count as having been slain and can be returned to the replacement unit using, for example, the Muster Guard ability or Rally command ability.`,
        when: [END_OF_MOVEMENT_PHASE],
      },

      {
        name: `Heroic Action: Rousing Oration`,
        desc: `Pick 1 friendly FLESH-EATER COURTS HERO and roll a dice for each other friendly FLESH-EATER COURTS unit wholly within 12" of that HERO. For each 5+, give 1 noble deeds point to that HERO.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: Scent of Blood`,
        desc: `Pick 1 friendly FLESH-EATER COURTS HERO and roll a dice. On a 3+, you can make a D6" move with that HERO, but it must finish that move more than 3" from all enemy units and closer to an enemy unit that has any wounds allocated to it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
