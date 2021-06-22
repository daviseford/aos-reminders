import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_HERO_PHASE,
  END_OF_ROUND,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_TURN,
} from 'types/phases'

export const OneDropDeploymentEffect = {
  name: `26.2.1 - One Drop Deployment`,
  desc: `If a core battalion has the Unified icon, then after you set up a unit from the battalion, you must set up all of the other units from the battalion, one after the other, and you are not allowed to set up units that are not part of the battalion until all of the units in the battalion have been set up. In addition, if the set-up instructions for a battle say that the players must alternate setting up units one at a time, then after you set up a unit from the battalion, you must set up all of the other units from the battalion, one after the other, before your opponent is allowed to set up another unit.`,
  when: [DURING_SETUP],
}

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
    name: 'Predatory Endless Spells',
    effects: [
      {
        name: `19.5 - Predatory Endless Spells`,
        desc: `Predatory endless spells are moved at the end of the hero phase. If either player has any abilities that can be used at the end of the hero phase, they must be used after all predatory endless spells have been moved.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `19.5.1 - Predatory Endless Spell Control`,
        desc: `Before moving predatory endless spells, you must first determine which are controlled and which are wild. A predatory endless spell within 30" of the model that summoned it is controlled by that model. A WIZARD can control 1 predatory endless spell per hero phase. If there is more than 1 predatory endless spell that a friendly WIZARD could control, you must pick which they will control. Predatory endless spells that are not controlled are wild.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `19.5.2 - Moving Predatory Endless Spells`,
        desc: `After determining control of predatory endless spells, the player whose turn is taking place moves all of the predatory endless spells controlled by friendly WIZARDS. Their opponent then does the same. Once all controlled predatory endless spells have been moved, the players alternate picking 1 wild predatory endless spell to move, starting with the player whose turn is taking place, until all of the wild predatory endless spells have been moved. A player must pick a wild predatory endless spell to move if any are eligible to do so and cannot pick a wild predatory endless spell that has already moved in that phase.
  
      When a player picks a predatory endless spell to move, they are considered to be the commanding player of that predatory endless spell until the start of the next hero phase. All other endless spells are under the command of the player that summoned them.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },

  {
    name: 'Endless Spells',
    effects: [
      {
        name: `19.3.1 - Summoning Endless Spells`,
        desc: `In your hero phase, you can attempt to summon 1 endless spell with each friendly WIZARD. When the spell used to summon an endless spell is successfully cast and not unbound, the endless spell is set up on the battlefield as described on its warscroll. If any restrictions make it impossible to set up the endless spell, the casting attempt is unsuccessful.`,
        when: [HERO_PHASE],
      },
      {
        name: `19.3.2 - Dispelling Endless Spells`,
        desc: `At the start of the hero phase, each player can attempt to dispel 1 endless spell with each friendly WIZARD and friendly PRIEST. The player whose turn is taking place makes all of their dispelling attempts first. If a WIZARD attempts to dispel an endless spell, they can attempt to cast or unbind 1 fewer spell in that hero phase. If a PRIEST attempts to dispel an endless spell, they can chant 1 fewer prayer in that hero phase. The same player cannot attempt to dispel the same endless spell more than once per phase.

        To attempt to dispel an endless spell, pick 1 endless spell that is within 30" of a friendly WIZARD or friendly PRIEST and that is visible to them. Then make a dispelling roll by rolling 2D6. If the roll is greater than the casting value of that endless spell, it is dispelled and removed from play. An endless spell cannot be summoned again in the turn that it is removed from play.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `19.3.3 - Removing Endless Spells`,
        desc: `An endless spell remains in play until it is removed from play. An endless spell is removed from play if:

        a) The endless spell is dispelled.
        b) The endless spell touches the edge of the battlefield after it is moved.
        c) A method on the endless spell's warscroll is used to remove it from play.`,
        when: [DURING_GAME],
      },
    ],
  },

  {
    name: 'Priests and Prayers',
    effects: [
      {
        name: `20.0 - Priests`,
        desc: `A unit with the PRIEST keyword on its warscroll is a PRIEST. Each friendly PRIEST can chant 1 prayer that they know in your hero phase. All PRIESTS know the Bless and Smite prayers. In addition, a PRIEST knows all prayers on their warscroll and on the warscrolls of invocations (see 20.3) in the same army as them.`,
        when: [HERO_PHASE],
      },
      {
        name: `20.1 - Chanting Prayers`,
        desc: `In your hero phase, you can chant prayers with friendly PRIESTS. You cannot chant the same prayer more than once in the same hero phase, even with a different PRIEST. In order to chant a prayer, pick a friendly PRIEST, say which of the prayers that they know will be chanted, and then make a chanting roll by rolling a dice. If the chanting roll is equal to or greater than the answer value of the prayer, the prayer is answered.`,
        when: [HERO_PHASE],
      },
      {
        name: `20.1.1 - Divine Wrath`,
        desc: `On an unmodified chanting roll of 1, the chanting PRIEST suffers divine wrath. The prayer is not answered and the chanting PRIEST suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: 'Invocations',
    effects: [
      {
        name: `20.3 - Invocations`,
        desc: `An invocation is a divine entity that is summoned to the battlefield by chanting the prayer on its invocation warscroll (see 24.0). Unless noted otherwise, an invocation cannot be attacked or be affected by abilities. You can move models across or through an invocation as if it were not there, but you cannot finish a model's move on an invocation. Invocations are under the command of the player who summoned them.`,
        when: [HERO_PHASE],
      },
      {
        name: `20.3.1 - Summoning Invocations`,
        desc: `In your hero phase, you can attempt to summon 1 invocation with each friendly PRIEST. When the prayer used to summon the invocation is answered, the invocation is set up on the battlefield as described on its warscroll. If any restrictions make it impossible to set up the invocation, then the prayer is not answered.`,
        when: [HERO_PHASE],
      },
      {
        name: `20.3.2 - Banishing Invocations`,
        desc: `At the start of your hero phase, you can attempt to banish 1 invocation with each friendly PRIEST instead of chanting a prayer with that PRIEST in that hero phase. The same player cannot attempt to banish the same invocation more than once per phase.

        To attempt to banish an invocation, pick 1 invocation within 48" of a friendly PRIEST that is visible to them. Then make a banishment roll by rolling a dice. If the roll is greater than the answer value of that invocation, it is banished and removed from play. An invocation cannot be summoned again in the turn that it is removed from play.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `20.3.3 - Removing Invocations`,
        desc: `An invocation remains in play until it is removed from play. An invocation is removed from play if:

        a) The invocation is banished.
        b) The invocation touches the edge of the battlefield after it is moved.
        c) A method on the invocation's warscroll or in an allegiance ability is used to remove it from play`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: 'Miscasts',
    effects: [
      {
        name: `19.1.1 - Miscasts`,
        desc: `On an unmodified casting roll of 2, the spell is miscast. The spell is not successfully cast, the caster suffers D3 mortal wounds, and the caster cannot attempt to cast any more spells in that hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: 'Priority Roll',
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
    name: 'Hero Phase',
    effects: [
      {
        name: `7.0 - Hero Phase`,
        desc: `At the start of the hero phase, starting with the player whose turn is taking place, each player can pick 1 HERO to perform a heroic action (see 7.1), and each player receives 1 command point if their general is on the battlefield (see 6.0).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `7.0 - Hero Phase`,
        desc: `In your hero phase, you can use friendly WIZARDS to attempt to cast spells (see 19.0), friendly PRIESTS to chant prayers and attempt to banish invocations (see 20.0), and both to attempt to dispel endless spells (19.3). In the enemy hero phase you can use friendly WIZARDS to attempt to unbind spells (see 19.2).`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: 'Heroic Actions',
    effects: [
      {
        name: `7.1 - Heroes and Heroic Actions`,
        desc: `A unit with the HERO keyword on its warscroll is a HERO. At the start of the hero phase, you can carry out 1 heroic action with 1 friendly HERO. The effect of the heroic action is treated in the same way as the effect of an ability for rules purposes (see 1.6).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Leadership`,
        desc: `Pick 1 friendly HERO and roll a dice. Add 2 to the roll if your general has been slain. On a 4+, you receive 1 command point that can only be spent during that turn to allow that HERO to issue a command.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Willpower`,
        desc: `Pick 1 friendly HERO that is not a WIZARD. If it is the enemy hero phase, that HERO can attempt to unbind 1 spell in that phase as if they were a WIZARD. If it is your hero phase, that HERO can attempt to dispel 1 endless spell in that phase as if they were a WIZARD (you can still only attempt to unbind or dispel the same spell or endless spell once in the same phase).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Their Finest Hour`,
        desc: `Pick 1 friendly HERO. Add 1 to wound rolls for attacks made by that HERO until the end of that turn, and add 1 to save rolls for attacks that target that HERO until the end of that turn. You cannot carry out this heroic action with the same HERO more than once in the same battle.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Recovery`,
        desc: `Pick 1 friendly HERO and make a heroic recovery roll by rolling 2D6. If the roll is less than that Hero's Bravery characteristic, you can heal up to D3 wounds allocated to that HERO. If the roll is equal to that Hero's Bravery characteristic, you can heal 1 wound allocated to that HERO.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  {
    name: 'Monstrous Rampages',
    effects: [
      {
        name: `21.1 - Monstrous Rampages`,
        desc: `At the end of the charge phase, each player can carry out 1 monstrous rampage with each friendly MONSTER. The player whose turn is taking place carries out all of their monstrous rampages first. The same player cannot carry out the same monstrous rampage more than once per phase. The effect of the monstrous rampage is treated in the same way as the effect of an ability for rules purposes (see 1.6).`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Roar`,
        desc: `Pick 1 enemy unit within 3" of this model and roll a dice. On a 3+, that unit cannot issue or receive commands in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Stomp`,
        desc: `Pick 1 enemy unit within 3" of this model that is not a MONSTER and roll a dice. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Titanic Duel`,
        desc: `Pick 1 enemy MONSTER within 3" of this model. Add 1 to hit rolls for attacks made by this model that target that enemy MONSTER until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Smash To Rubble`,
        desc: `Pick 1 faction terrain feature or defensible terrain feature within 3" of this model and roll a dice. On a 3+, the terrain feature is demolished if it was defensible (see 17.2.3), and the scenery rules on its warscroll cannot be used for the rest of the battle if it was a faction terrain feature.`,
        when: [END_OF_CHARGE_PHASE],
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

  {
    name: 'One Drop Deployment',
    effects: [OneDropDeploymentEffect],
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
