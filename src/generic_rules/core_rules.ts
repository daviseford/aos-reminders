import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  END_OF_ROUND,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_TURN,
} from 'types/phases'

const CoreRules: TEntry[] = [
  {
    name: 'Unit Coherency',
    effects: [
      {
        name: `1.3.3 - Unit Coherency`,
        desc: `Units must be set up and finish every move as a single coherent group. A unit with 2 to 5 models is coherent if each model in the unit is w7ithin 1" horizontally and 6" vertically of at least 1 other model in the unit. A unit with more than 5 models is coherent if each model in the unit is within 1" horizontally and 6" vertically of at least 2 other models in the unit. If a friendly unit is not coherent at the end of a turn or after you set it up, you must remove models in the unit from play, one at a time, until it is coherent.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'The Priority Roll',
    effects: [
      {
        name: `4.1 - The Priority Roll`,
        desc: `At the start of each battle round, the players must roll off. This is called the priority roll. The winner has priority in that battle round and must decide who will take the first turn and who will take the second turn. In the event of a tied priority roll, do not roll off again. Instead, if it is the first battle round, the player who finished deploying their army first has priority. Otherwise, the player who went first in the previous battle round has priority.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: 'Simultaneous Effects',
    effects: [
      {
        name: `1.6.2 - Simultaneous Effects`,
        desc: `If the effects of two or more abilities would be applied at the same time in a turn, the player whose turn is taking place applies the effects of their abilities first, one at a time, in the order they desire. Their opponent then does the same. If the effects of two or more abilities would be applied at the same time other than during a turn, the players roll off and the winner applies the effects of their abilities first, one at a time, in the order they desire. Their opponent then does the same.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Dice Roll Modifiers',
    effects: [
      {
        name: `1.5.5 - Dice Roll Modifiers`,
        desc: `Sometimes a modifier will apply to a dice roll. Modifiers are applied after rerolls. Rules that refer to an unmodified roll are referring to the dice roll after rerolls have been made but before modifiers are applied. If a rule instructs you to pick or change a roll, do so after rerolls are made but before modifiers are applied.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Command Points',
    effects: [
      {
        name: `4.1.1 - Starting Command Points`,
        desc: `After determining who will take which turn, the player who will take the first turn receives 1 command point (see 6.0) and the player who will take the second turn receives 2 command points.`,
        when: [TURN_ONE_START_OF_TURN],
      },
      {
        name: `6.0 - Command Points`,
        desc: `Command points allow you to use command abilities. You receive command points at the start of the battle round after priority is determined (see 4.1). In addition, if your general is on the battlefield at the start of the hero phase, you receive 1 command point. At the end of the battle round (see 16.0), any command points that have not been used are lost.`,
        when: [START_OF_ROUND],
      },
      {
        name: `6.0 - Command Points`,
        desc: `If your general is on the battlefield at the start of the hero phase, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `6.0 - Command Points`,
        desc: `At the end of the battle round (see 16.0), any command points that have not been used are lost.`,
        when: [END_OF_ROUND],
      },
      {
        name: `6.1 - Using Command Abilities`,
        desc: `To use a command ability, you must spend 1 command point, pick 1 friendly model to issue the command, and pick 1 friendly unit to receive the command. Unless noted otherwise, the models that can issue commands and the units they can issue them to are as follows:

        - Unit champions can issue commands to their own unit (see 22.3.2).
        - Heroes can issue commands to units that are wholly within 12" of them.
        - Generals can issue commands to units that are wholly within 18" of them.
        - Totems can issue commands to units that are wholly within 18" of them.

        Each command ability will say when it can be used and what effect it has on the unit that receives it.
        
        A model cannot issue more than 1 command in the same phase and a unit cannot receive more than 1 command in the same phase. In addition, you cannot use the same command ability more than once in the same phase (even for different units).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'HERO Phase',
    effects: [
      {
        name: `7.0 - HERO Phase`,
        desc: `At the start of the hero phase, starting with the player whose turn is taking place, each player can pick 1 HERO to perform a heroic action (see 7.1), and each player receives 1 command point if their general is on the battlefield (see 6.0).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `7.0 - HERO Phase`,
        desc: `In your hero phase, you can use friendly WIZARDS to attempt to cast spells (see 19.0), friendly PRIESTS to chant prayers and attempt to banish invocations (see 20.0), and both to attempt to dispel endless spells (19.3). In the enemy hero phase you can use friendly WIZARDS to attempt to unbind spells (see 19.2).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: 'Heroes and Heroic Actions',
    effects: [
      {
        name: `7.1 - Heroes and Heroic Actions`,
        desc: `A unit with the HERO keyword on its warscroll is a HERO. At the start of the hero phase, you can carry out 1 heroic action with 1 friendly HERO. The effect of the heroic action is treated in the same way as the effect of an ability for rules purposes (see 1.6).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: 'Look Out, Sir!',
    effects: [
      {
        name: `10.1.2 - Look Out, Sir!`,
        desc: `You must subtract 1 from the hit roll (see 13.3) for an attack made with a missile weapon if the target is an enemy HERO within 3" of an enemy unit that has 3 or more models. The Look Out, Sir! rule does not apply if the enemy HERO has a Wounds characteristic of 10 or more.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: 'Strike-First and Strike-Last Effects',
    effects: [
      {
        name: `12.4 - Strike-First and Strike-Last Effects`,
        desc: `Some abilities have an effect that allows a unit to fight at either the start or the end of the combat phase. These effects are called strike- first effects and strike-last effects respectively. The rules in sections 1.6.1-1.6.3 do not apply to these effects: use the rules here instead.
        
        If a strike-first effect applies to any units, those units fight before all other units fight. If a strike-last effect applies to any units, those units fight after all other units fight.
        
        If a strike-first effect applies to units from both players' armies, the players alternate fighting with those units, starting with the player whose turn it is. Similarly, if a strike-last effect applies to units from both players' armies, the players alternate fighting with those units, starting with the player whose turn it is. If a strike-first effect and a strike-last effect apply to the same unit at the same time, then they cancel each other out and neither effect applies to that unit.`,
        when: [DURING_GAME],
      },
      {
        name: `12.5 - Strike-First and Strike-Last Sequencing`,
        desc: `1. Start of combat phase abilities are used
        2. Units with strike-first effects attack
        3. Units without strike-first/strike-last effects attack 
        4. Units with strike-last effects attack
        5. End of combat phase abilities are used`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Battleshock Tests',
    effects: [
      {
        name: `15.1 - Battleshock Tests`,
        desc: `You must make a battleshock roll for each friendly unit that has to take a battleshock test. To make a battleshock roll, roll a dice and add the number of models in the unit that were slain in that turn to the roll. If the battleshock roll is greater than the unit's Bravery characteristic, the battleshock test has been failed. If the test is failed, for each point by which the battleshock roll exceeds the unit's Bravery characteristic, 1 model in that unit must flee. You decide which models flee. A model that flees is removed from play.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  // {
  //   name: 'PLACEHOLDER',
  //   effects: [
  //     {
  //       name: `PLACEHOLDER`,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
]

export default CoreRules
