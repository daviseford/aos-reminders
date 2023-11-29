import { tagAs } from 'factions/metatagger'
import { BEASTS_OF_CHAOS } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_SETUP,
  START_OF_HERO_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  TURN_TWO_END_OF_MOVEMENT_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const BattleTraits = {
  [BEASTS_OF_CHAOS]: {
    effects: [
      {
        name: `Beastherd Ambush`,
        desc: `During deployment, instead of setting up a BEASTS OF CHAOS unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Brayherd Ambush`,
        desc: `At the end of your first and second movement phases, you can set up any friendly reserve units that are in ambush on the battlefield. wholly within 9" of the battlefield edge and more than 9" from all enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE, TURN_TWO_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Brayherd Ambush`,
        desc: `Add 1 to charge rolls for friendly BEASTS OF CHAOS units that are set up on the battlefield in the same turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `MASTERS OF THE WILDERNESS`,
        desc: `In your hero phase, if the model picked to be your general is in reserve at the start of that phase, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Rituals of Ruin`,
        desc: `In your hero phase, you can carry out 1 of the heroic actions from the table below with each friendly BEASTS OF CHAOS HERO that is on the battlefield in addition to any other heroic actions you can carry out with those HEROES. If you do so, before resolving the effect of that heroic action, you must allocate D3 mortal wounds that cannot be negated to that HERO or to another friendly BEASTS OF CHAOS unit within 3" of that HERO. If those mortal wounds slay that HERO, the heroic action has no effect. In addition, in your hero phase, you can carry out 1 of the heroic actions from the table below with 1 friendly BEASTS OF CHAOS HERO that is in reserve. If the heroic action instructs you to pick an enemy unit, you must also pick 1 point on the battlefield edge. That point is considered to be the HERO carrying out that heroic action for the purposes of measuring range and visibility. If the heroic action instructs you to pick a friendly unit, you must pick the HERO carrying out that heroic action. The same heroic action from the table below cannot be carried out more than once per phase.
          
          Warping Curse: Pick 1 enemy unit within 12" of the BEASTS OF CHAOS HERO carrying out this heroic action and visible to them. That unit suffers D6 mortal wounds.
          Blood Taunt: Pick 1 enemy unit within 12" of the BEASTS OF CHAOS HERO carrying out this heroic action that is more than 3" from all friendly units and is visible to that HERO. Your opponent must make a 2D6" move with that unit. All of the models in that unit must finish that move as close as possible to the BEASTS OF CHAOS HERO carrying out this heroic action and more than 3" from all other units in your army.
          Brand of Wild Fury: Pick 1 friendly BEASTS OF CHAOS HERO wholly within 12" of The BEASTS OF CHAOS HERO carrying out this heroic action and visible to them. Until the end of this turn, friendly BEASTS OF CHAOS units have a ward of 6+ while they are wholly within 12" of the HERO you picked.
          Alphabeast Instinct: Pick 1 friendly BEASTS OF CHAOS unit wholly within 12" of the BEASTS OF CHAOS HERO Carrying out this heroic action and visible to them. Do not take battleshock tests for that unit this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Brand of Wild Fury`,
        desc: `When active, friendly BEASTS OF CHAOS units have a ward of 6+ while they are wholly within 12" of the HERO you picked.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Alphabeast Instinct`,
        desc: `When active, the picked unit does not battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
