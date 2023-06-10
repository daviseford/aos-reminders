import { tagAs } from 'factions/metatagger'
import { SLAANESH } from 'meta/factions'
import {
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const BattleTraits = {
  [SLAANESH]: {
    effects: [
      {
        name: `Temptations of Slaanesh`,
        desc: `At the start of each battle round, after determining who will take the first turn, you gain a pool of 6 dice. These are your Temptation Dice. Each time your opponent makes a failed hit roll, a failed wound roll or a failed save roll, you can offer them a Temptation Dice. If they accept your offer, that roll is replaced with a 6. Rolls replaced in this way cannot be rerolled or modified.

        Designer's Note: Remember that the success or failure of a hit roll, wound roll or save roll is determined after rerolls and modifiers.

        Each time your opponent accepts your offer of a Temptation Dice, you gain D6 depravity points. Each time your opponent rejects your offer of a Temptation Dice, the unit for which the roll was made suffers D3 mortal wounds after all of the attacks have been resolved. You cannot offer your opponent a Temptation Dice for the same enemy unit mote than once per phase. At the end of the battle round, any Temptation Dice that have not been offered are lost.`,
        when: [DURING_GAME],
      },
      {
        name: `Temptations of Slaanesh`,
        desc: `At the start of each battle round, after determining who will take the first turn, you gain a pool of 6 dice. These are your Temptation Dice.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Temptations of Slaanesh`,
        desc: `At the end of the battle round, any Temptation Dice that have not been offered are lost.`,
        when: [END_OF_ROUND],
      },
      {
        name: `Euphoric Killers`,
        desc: `Once per turn, at the start of your combat phase, you can pick 1 friendly HEDONITES OF SLAANESH unit and 1 enemy unit within 1" of that unit. If you do so, until the end of that phase, you gain 1 depravity point for each wound and mortal wound caused by attacks made by that friendly unit that are allocated to that enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Revel in Depravity`,
        desc: `Friendly HEDONITES OF SLAANESH units gain abilities based on the number of depravity points (DP) you have. These abilities are cumulative.

        12+ DP - Tantalising Torment: Subtract 1 from hit rolls for attacks that target friendly HEDONITES OF SLAANESH units.

        24+ DP - Sadistic Spite: If the unmodified hit roll for an attack made with a melee weapon by a friendly HEDONITES OF SLAANESH unit is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.

        36+ DP - Oblivious Indulgence: Friendly HEDONITES OF SLAANESH units have a ward of 5+.`,
        when: [DURING_GAME],
      },
      {
        name: `Summon Slaanesh Demons`,
        desc: `You can summon HEDONITES OF SLAANESH DAEMON units to the battlefield if you collect enough depravity points (DP). If you have any depravity points at the end of your movement phase, you can summon 1 unit from the list below to the battlefield and add it to your army. Each unit you summon costs the number of depravity points shown on the list, and you can only summon it if you have enough depravity points to do so. Units must be set up more than 9" from all enemy units and wholly within 12" of a friendly HEDONITES OF SLAANESH HERO.
        
        36 DP - 1 Keeper of Secrets
        30 DP - 1 Fiends unit with 3 models
        30 DP - 1 BLADEBRINGER
        24 DP - 1 Contorted Epitome
        24 DP - 1 Seekers unit with 3 models
        24 DP - 1 CHARIOT OF SLAANESH
        18 DP - 1 Infernal Enrapturess, Herald of Slaanesh
        18 DP - 1 Viceleader, Herald of Slaanesh
        18 DP - 1 Daemonettes unit with 10 models`,
        when: [END_OF_MOVEMENT_PHASE],
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
      {
        name: `Excessive Carnage`,
        desc: `Pick 1 enemy unit that is contesting an objective. You complete this tactic if you pick that unit using the Euphoric Killers battle trait (pg 79) and that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Realm-racers`,
        desc: `You complete this tactic if 3 or more different friendly HEDONITES OF SLAANESH units make a charge move of 7" or more during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Depraved Unity`,
        desc: `Pick 1 objective that you do not control. You complete this tactic if you control that objective at the end of this turn and at least 1 friendly HEDONITES OF SLAANESH MORTAL unit and 1 friendly HEDONITES OF SLAANESH DAEMON unit are contesting that objective.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
