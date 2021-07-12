import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// This file is useful when storing abilities for units that we'd like to re-use
const GenericEffects = {
  // e.g. all mercenaries share the "Disruptive Presence" effect, so we'll store it here.
  DisruptivePresence: {
    name: `Disruptive Presence`,
    desc: `If your army includes any MERCENARY units, at the start of your hero phase in the first battle round, you do not receive 1 command point for your general being on the battlefield.`,
    when: [TURN_ONE_START_OF_HERO_PHASE],
    shared: true,
  },
  // We re-use this Timber! a lot as well, so we stuck it here!
  Gargant: [
    {
      name: `Timber!`,
      desc: `If this model is slain, before removing the model from the battlefield the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds. This model is then removed from the battlefield.`,
      when: [WOUND_ALLOCATION_PHASE],
      shared: true,
    },
  ],
  // You get the point
  Terrorgheist: [
    {
      name: `Death Shriek`,
      desc: `Do not use the attack sequence for an attack made with this model's Death Shriek. Instead roll a D6 and add the Death Shriek value shown on this model's damage table. If the total is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the total.`,
      when: [SHOOTING_PHASE],
      shared: true,
    },
    {
      name: `Gaping Maw`,
      desc: `If the unmodified hit roll for an attack made with this model's Fanged Maw is 6, that attack inflicts 6 mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll)`,
      when: [COMBAT_PHASE],
      shared: true,
    },
    {
      name: `Infested`,
      desc: `If this model is slain, before this model is removed from play each unit within 3" of this model suffers D3 mortal wounds.`,
      when: [WOUND_ALLOCATION_PHASE],
      shared: true,
    },
  ],
  ZombieDragon: [
    {
      name: `Pestilential Breath`,
      desc: `When you attack with this model's Pestilential Breath, roll a D6 before making the hit roll for the attack. If the roll is less than or equal to the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
      when: [SHOOTING_PHASE],
      shared: true,
    },
  ],
  CrewedWarMachine: (name: 'Duardin Artillery' | 'Crewed Artillery' | 'Crewed War Machine') => [
    {
      name,
      desc: `This unit can only move if its Crew are within 1" of the war machine at the start of the movement phase.`,
      when: [START_OF_MOVEMENT_PHASE],
      shared: true,
    },
    {
      name,
      desc: `If this war machine's Crew are within 1" of the war machine in the shooting phase, they can fire the war machine.`,
      when: [SHOOTING_PHASE],
      shared: true,
    },
    {
      name,
      desc: `The war machine cannot make charge moves.`,
      when: [CHARGE_PHASE],
      shared: true,
    },
    {
      name,
      desc: `The war machine does not need to take battleshock tests and is unaffected by any attack or ability that uses Bravery.`,
      when: [BATTLESHOCK_PHASE],
      shared: true,
    },
    {
      name,
      desc: `The Crew are in cover while they are within 1" of their war machine.`,
      when: [COMBAT_PHASE, SHOOTING_PHASE],
      shared: true,
    },
  ],
  AelvenShield: {
    name: `Aelven Shield`,
    desc: `You can reroll save rolls of 1 for a unit with Aelven Shields. You can reroll failed save rolls of 1 or 2 for this unit in the shooting phase.`,
    when: [SAVES_PHASE],
    shared: true,
  },
  Dragonfire: {
    name: `Dragonfire`,
    desc: `A Dragon can unleash a blast of Dragonfire in your shooting phase. When it does so, pick a visible unit within 12" and roll a D6; on a 1 or 2 that unit suffers a mortal wound, on a 3 or 4 that unit suffers D3 mortal wounds, and on a 5 or 6 that unit suffers D6 mortal wounds.`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
  Terror: {
    name: `Terror`,
    desc: `Subtract 1 from the Bravery characteristic of enemy units if they are within 3" of any friendly units with this ability.`,
    when: [BATTLESHOCK_PHASE],
    shared: true,
  },
  Impassable: {
    name: `Impassable`,
    desc: `You cannot move a model over this terrain feature unless it can fly, and you cannot move a model onto this terrain feature or set up a model on this terrain feature (even if it can fly).`,
    when: [DURING_GAME],
    shared: true,
  },
  Defensible: {
    name: `Defensible`,
    desc: `This terrain feature is a defensible terrain feature that can be garrisoned by 1 HERO with a Wounds characteristic of 8 or less.`,
    when: [DURING_GAME],
    shared: true,
  },
  FactionTerrainSetup: {
    name: `Setup`,
    desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
    when: [START_OF_SETUP],
    shared: true,
  },
  Predatory: {
    Eight_Inches: {
      name: `Predatory`,
      desc: `This endless spell is a predatory endless spell. It can be moved up to 8" and can fly.`,
      when: [END_OF_HERO_PHASE],
      shared: true,
    },
    Nine_Inches: {
      name: `Predatory`,
      desc: `This endless spell is a predatory endless spell. It can be moved up to 9" and can fly.`,
      when: [END_OF_HERO_PHASE],
      shared: true,
    },
    Twelve_Inches: {
      name: `Predatory`,
      desc: `This endless spell is a predatory endless spell. It can be moved up to 12" and can fly.`,
      when: [END_OF_HERO_PHASE],
      shared: true,
    },
  },
  Elite: {
    name: `Elite`,
    desc: `Models in this unit can issue commands to their own unit.`,
    when: [DURING_GAME],
    shared: true,
  },
  Bonded: [
    {
      name: `Bonded`,
      desc: `This endless spell is bonded to the model that summoned it. A bonded endless spell is always controlled by the model to which it is bonded. A model cannot be bonded to more than one endless spell at the same time and cannot attempt to summon other endless spells while it is bonded. If the model that summoned this endless spell is removed from play, then this endless spell is removed from play.`,
      when: [DURING_GAME],
      shared: true,
    },
    {
      name: `Bonded`,
      desc: `If the model that summoned this endless spell is removed from play, then this endless spell is removed from play.`,
      when: [WOUND_ALLOCATION_PHASE],
      shared: true,
    },
  ],
  InfantryHornblowerEffect: {
    name: `Hornblower`,
    desc: `Reroll dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    shared: true,
  },
  ClanBannerEffect: {
    name: `Clan Banner`,
    desc: `If you fail a battleshock test for a unit that has any Clan Banners, halve the number of models that flee (rounding up).`,
    when: [BATTLESHOCK_PHASE],
    shared: true,
  },
  ArcaniteShieldEffect: {
    name: `Arcanite Shield`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to a unit that has any models armed with Arcanite Shields. On a 6, that wound or mortal wound is negated. When you allocate wounds or mortal wounds to this unit, you must allocate them to a model armed with an Arcanite Shield if it is possible to do so.`,
    when: [WOUND_ALLOCATION_PHASE],
    shared: true,
  },
}

export default GenericEffects
