import { tagAs } from 'factions/metatagger'
import { CITIES_OF_SIGMAR } from 'meta/factions'
import {
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_ROUND,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTraits = {
  [CITIES_OF_SIGMAR]: {
    effects: [
      {
        name: `Orders`,
        desc: `If you command a Cities of Sigmar army, you can give orders to friendly HEROES. Orders are represented by order tokens. Each order token has 2 sides. One side shows the Cities of Sigmar faction icon; the other side shows an icon that corresponds to one of the orders below.

        At the start of the battle round, after the priority roll has been made, you can give 1 order to each friendly CITIES OF SIGMAR HERO on the battlefield. To do so, pick 1 of the orders below and place a corresponding order token, with the Cities of Sigmar icon face up, beside the HERO that has been given the order. No more than 3 friendly HEROES can have the same order at the same time.
        
        Orders marked 'Cities of Sigmar Order' can be given to any CITIES OF SIGMAR HERO; those marked 'Human Order' can only be given to HUMAN HEROES; those marked 'Duardin Order' can only be given to DUARDIN HEROES; and those marked 'Aelf Order' can only be given to AELF HEROES.
        
        Orders remain secret until they are revealed. Each order will state when it can be revealed and how it is resolved. A friendly unit cannot be affected by the same order more than once in the same phase.
        
        At the end of the battle round, all orders are removed from play (including those that were not revealed).
        
        Designer's Note: An order is not a command. Therefore, a HERO that has been given an order, or a unit that is affected by an order, is not prevented from issuing and receiving commands.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Orders`,
        desc: `At the end of the battle round, all orders are removed from play (including those that were not revealed).`,
        when: [END_OF_ROUND],
      },
      {
        name: `Order: Advance in Formation`,
        desc: `You can reveal this order at the start of your movement phase. If you do so, until the end of the phase, add 3" to the Move characteristic of friendly CITIES OF SIGMAR units that start a normal move within 3" of the HERO with this order. In addition, at the end of the phase, friendly CASTELITE units with the Fortified Position ability can establish a fortified position even if they made a normal move in this phase if they are within 3" of the HERO with this order.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Order: Counter-charge`,
        desc: `You can reveal this order at the end of the enemy charge phase. If you do so, pick 1 friendly CITIES OF SIGMAR unit that is more than 3" from all enemy units and is within 3" of the HERO with this order. You can attempt a charge with that unit. In addition, if that unit makes a charge move in this phase, improve the Rend characteristic of that unit's melee weapons by 1 until the end of the turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Order: Return Fire`,
        desc: `You can reveal this order when a friendly unit within 3" of the HERO with this order is targeted by a shooting attack. If you do so, after all of that enemy unit's shooting attacks have been resolved, pick 1 friendly CITIES OF SIGMAR HUMAN unit that is more than 3" from all enemy units and within 3" of the HERO with this order. That unit can immediately shoot.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Order: Suppressing Fire`,
        desc: `You can reveal this order at the start of your shooting phase. If you do so, pick 1 friendly CITIES OF SIGMAR HUMAN unit within 3" of the HERO with this order. After that unit shoots, if all of its attacks targeted the same enemy unit, roll 2D6 and add the number of models slain by those attacks to the result. If the result exceeds the Bravery characteristic of that enemy unit, it is suppressed until the end of the turn. The strike-last effect applies to a unit that is suppressed.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Order: Engage the Foe`,
        desc: `You can reveal this order at the start of your charge phase. When this order is revealed, pick 1 friendly CITIES OF SIGMAR HUMAN unit that is more than 3" from all enemy units, that has not yet fought in this battle, and is within 3" of the HERO with this order. If that unit makes a charge move in this phase, add 1 to the Attacks characteristic of that unit's melee weapons until the end of the following combat phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Order: Form Shieldwall`,
        desc: `You can reveal this order at the start of the enemy combat phase. If you do so, you can pick 1 friendly CITIES OF SIGMAR DUARDIN unit that has 5 or more models and is within 3" of the HERO with this order. That unit forms into a shieldwall until the end of the phase. While a unit is formed into a shieldwall, the strike-last effect applies to that unit but it has a ward of 5+.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Order: Grim Last Stand`,
        desc: `You can reveal this order at the start of your combat phase. If you do so, you can pick 1 friendly CITIES OF SIGMAR DUARDIN unit that is within 3" of the HERO with this order. Until the end of that phase, each time a model from that unit is slain by an attack made with a melee weapon, you can pick 1 enemy unit within 3" of that model's unit and roll a dice. On a 5+, that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Order: Strike Them Down`,
        desc: `You can reveal this order at the start of the charge phase. If you do so, you can pick 1 friendly CITIES OF SIGMAR AELF unit that is within 3" of the HERO with this order. If that unit makes a charge move this turn, the strike-first effect applies to that unit until the end of the turn.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Order: Swift Disengage`,
        desc: `You can reveal this order at the end of the combat phase. If you do so, pick 1 friendly CITIES OF SIGMAR AELF unit that is within 3" of the HERO with this order and is within 3" of any enemy units. That unit can immediately retreat.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
