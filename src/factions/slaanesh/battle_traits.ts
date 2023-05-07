import { tagAs } from 'factions/metatagger'
import { SLAANESH } from 'meta/factions'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  [SLAANESH]: {
    effects: [
      {
        name: `Revel in Pain`,
        desc: `During battle, a Hedonites of Slaanesh army gains the following abilities based on their current number of unspent depravity points (DP). These abilities are cumulative:
        
              6+ DP: If a friendly HEDONITES OF SLAANESH unit receives the Rally command (core rules, 7.2), you can return 1 slain model to the unit for each 5+ instead of each 6.

              12+ DP: Add 2" to the Move characteristic of friendly HEDONITES OF SLAANESH units.

              18+ DP: Friendly HEDONITES OF SLAANESH units have a ward of 5+.`,
        when: [DURING_GAME],
      },
      {
        name: `Feast of Depravities`,
        desc: `At the end of the battleshock phase, you receive 1 depravity point for each unit on the battlefield that had a wound or mortal wound that was not negated allocated to it in that turn, or has fewer models than it had at the start of that turn.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Feast of Depravities`,
        desc: `If you have any depravity points at the end of your movement phase, you can summon 1 unit from the list below to the battlefield and add it to your army. Each unit you summon costs a number of depravity points as shown on the list, and you can only summon a unit if you have enough depravity points to do so. Summoned units must be set up wholly within 12" of a friendly SLAANESH HERO and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Feast of Depravities`,
        desc: `Summoning Costs:
             1 Soulfeaster Keeper of Secrets -             12 DP
             1 Keeper of Secrets                           12 DP
             30 Daemonettes -                              12 DP
             3 Seeker Chariots -                           10 DP
             20 Daemonettes -                              10 DP
             1 Contorted Epitome -                          9 DP
             1 Bladebringer, Herald on Exalted Chariot -    9 DP
             3 Fiends -                                     8 DP
             1 Bladebringer, Herald on Hellflayer -         8 DP
             1 Exalted Chariot -                            7 DP
             1 Infernal Enrapturess -                       7 DP
             1 Bladebringer, Herald on Seeker Chariot -     7 DP
             1 Hellflayer -                                 7 DP
             1 Viceleader -                                 6 DP
             1 Seeker Chariot -                             6 DP
             5 Seekers -                                    6 DP
             10 Daemonettes -                               6 DP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Locus of Diversion`,
        desc: `At the end of the charge phase, each friendly HEDONITE DAEMON HERO within 1" of an enemy unit can create a locus of diversion. If they do so, pick 1 enemy unit that is within 1" of that HERO and roll a dice, adding 1 if that HERO is a GREATER DAEMON. On a 4+, that unit cannot make a pile-in move before it attacks in the following combat phase. You cannot pick the same unit as the target for this ability more than once in the same phase (whether the roll is successful or not).`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Euphoric Killers`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a HEDONITE model is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit. If the attacking model's unit has 20 or more models, its attacks inflict 3 hits on an unmodified hit roll of 6 instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: 'Death by a Thousand Cuts',
        desc: `Pick 1 enemy unit. You complete this tactic if wounds caused by attacks made by 3 or more different friendly units are allocated to that unit in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `An Enrapturing Blur`,
        desc: `Pick 1 enemy HERO that has no wounds allocated to them. You complete this tactic if that unit is destroyed in the combat phase of this turn before it is picked to fight.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Grand Feast`,
        desc: `You complete this tactic if you receive 12 or more depravity points this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
