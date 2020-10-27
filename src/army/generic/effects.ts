import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// This file is useful when storing effects for units that we'd like to re-use
// E.G. all Gargants share the "Timber!" effect, so we'll store it here.

const GenericEffects = {
  Gargant: [
    {
      name: `Timber!`,
      desc: `If this model is slain, before removing the model from the battlefield the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds. This model is then removed from the battlefield.`,
      when: [WOUND_ALLOCATION_PHASE],
    },
  ],
  Terrorgheist: [
    {
      name: `Death Shriek`,
      desc: `Do not use the attack sequence for an attack made with this model's Death Shriek. Instead roll a D6 and add the Death Shriek value shown on this model's damage table. If the total is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the total.`,
      when: [SHOOTING_PHASE],
    },
    {
      name: `Gaping Maw`,
      desc: `If the unmodified hit roll for an attack made with this model's Fanged Maw is 6, that attack inflicts 6 mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll)`,
      when: [COMBAT_PHASE],
    },
    {
      name: `Infested`,
      desc: `If this model is slain, before this model is removed from play each unit within 3" of this model suffers D3 mortal wounds.`,
      when: [WOUND_ALLOCATION_PHASE],
    },
  ],
  ZombieDragon: [
    {
      name: `Pestilential Breath`,
      desc: `When you attack with this model's Pestilential Breath, roll a D6 before making the hit roll for the attack. If the roll is less than or equal to the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
      when: [SHOOTING_PHASE],
    },
  ],
  CrewedWarMachine: (name: 'Duardin Artillery' | 'Crewed Artillery' | 'Crewed War Machine') => [
    {
      name,
      desc: `This unit can only move if its Crew are within 1" of the war machine at the start of the movement phase.`,
      when: [START_OF_MOVEMENT_PHASE],
    },
    {
      name,
      desc: `If this war machine's Crew are within 1" of the war machine in the shooting phase, they can fire the war machine.`,
      when: [SHOOTING_PHASE],
    },
    {
      name,
      desc: `The war machine cannot make charge moves.`,
      when: [CHARGE_PHASE],
    },
    {
      name,
      desc: `The war machine does not need to take battleshock tests and is unaffected by any attack or ability that uses Bravery.`,
      when: [BATTLESHOCK_PHASE],
    },
    {
      name,
      desc: `The Crew are in cover while they are within 1" of their war machine.`,
      when: [COMBAT_PHASE, SHOOTING_PHASE],
    },
  ],
  AelvenShield: [
    {
      name: `Aelven Shield`,
      desc: `You can reroll save rolls of 1 for a unit with Aelven Shields.`,
      when: [COMBAT_PHASE],
    },
    {
      name: `Aelven Shield`,
      desc: `You can reroll failed save rolls of 1 or 2 for this unit in the shooting phase.`,
      when: [SHOOTING_PHASE],
    },
  ],
  Dragonfire: {
    name: `Dragonfire`,
    desc: `A Dragon can unleash a blast of Dragonfire in your shooting phase. When it does so, pick a visible unit within 12" and roll a dice; on a 1 or 2 that unit suffers a mortal wound, on a 3 or 4 that unit suffers D3 mortal wounds, and on a 5 or 6 that unit suffers D6 mortal wounds.`,
    when: [SHOOTING_PHASE],
  },
}

export default GenericEffects
