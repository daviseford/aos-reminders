import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'

const getShadowdancerBaseEffects = (attacks: 1 | 2) => [
  {
    name: `Shadow Dance`,
    desc: `At the start of your hero phase, you may declare that this unit will perform a shadow dance. Choose one of the dances from the list below. The dance lasts until the start of your next hero phase. The same dance cannot be performed by the same unit in consecutive battle rounds.

    Whirling Death: Add 1 to wound rolls for this unit's Weaving Blades and change their Rend characteristic to -1.

    Storm of Blades: Add ${attacks} to the Attacks characteristic of this unit's Weaving Blades.
    
    The Shadow's Coil: Add 2 to this unit's save rolls.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Talismanic Tattoos`,
    desc: `Roll a D6 each time a wound or mortal is allocated to this unit. On a 6 the wound or mortal wound is negated.`,
    when: [WOUND_ALLOCATION],
  },
]
const SoporificBreathEffect = {
  name: `Soporific Breath`,
  desc: `Enemy units within 3" of this model cannot be chosen to make attacks in the combat phase until all other units have made their attacks.`,
  when: [COMBAT_PHASE],
}
const InfantryHornblowerEffect = {
  name: `Hornblower`,
  desc: `Reroll dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const DeflectShotsEffect = {
  name: `Deflect Shots`,
  desc: `You can reroll failed save rolls for this unit in the shooting phase.`,
  when: [SHOOTING_PHASE],
}
const KindredShieldEffect = {
  name: `Kindred Shield`,
  desc: `Reroll failed save rolls for this model.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
}

export const LegacyHighElvesUnits: TUnits = [
  {
    name: `Highborn Repeater Bolt Thrower`,
    effects: [
      {
        name: `Crewed War Machine`,
        desc: `This unit can only move if its Crew are within 1" at the start of the movement phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Crewed War Machine`,
        desc: `If its Crew are within 1" of the Highborn Repeater Bolt Thrower in the shooting phase, they can fire the war machine.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Crewed War Machine`,
        desc: `This unit cannot make charge moves.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Crewed War Machine`,
        desc: `This unit does not need to take battleshock tests and is unaffected by any attack or ability that uses Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Crewed War Machine`,
        desc: `The Crew are in cover while they are within 1" of their war machine.`,
        when: [DURING_GAME],
      },
      {
        name: `Bolt Selection`,
        desc: `Each time a Highborn Repeater Bolt Thrower is fired in the shooting phase, the crew can load and fire either Ithilmar Bolts or volleys of Repeating Bolts. They cannot load and fire both in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Highborn Archers`,
    effects: [
      {
        name: `Hawkeye`,
        desc: `The leader of this unit is a Hawkeye. Add 1 to hit rolls for a Hawkeye in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of the unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      InfantryHornblowerEffect,
      {
        name: `Aelven Archery`,
        desc: `Add 1 to hit rolls for this unit in the shooting phase while it has 20 or more models and there are no enemy models within 3" of it.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Storm of Arrows`,
        desc: `Once per battle, you can declare that this unit will fire a Storm of Arrows in their shooting phase; when you do so, add 1 to the Attacks characteristic of their Silverwood Longbows. This unit cannot fire a Storm of Arrows if there are any enemy models within 3" of it.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]
