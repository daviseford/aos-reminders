import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_GAME,
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

export const MonstrousArcanumOrder: TUnits = [
  {
    name: `Carmine Dragon`,
    effects: [
      {
        name: `Deathly Dark Scales`,
        desc: `Roll a D6 each time you allocate a mortal wound to this unit. On a 5+, that mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Soul-sheering Blast`,
        desc: `Do not use the attack sequence for an attack made with a Soul-sheering Blast. Instead roll a D6. On a 5+, the target unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spell Devourer`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+, ignore the effects of that spell on this model.`,
        when: [DURING_GAME],
      },
    ],
  },
]

const LegacyOrderUnits: TUnits = [
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
    name: `Loremaster`,
    effects: [
      {
        name: `Deflect Shots`,
        desc: `You can re-roll failed save rolls for this model in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hand of Glory`,
        desc: `Casting value of 5. Pick a model within 18". Until your next hero phase you can re-roll all failed hit rolls and wound rolls for that model.`,
        when: [HERO_PHASE],
        spell: true,
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
      {
        name: `Hornblower`,
        desc: `Re-roll dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
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
  {
    name: `Avatar of the Hunt`,
    effects: [
      {
        name: `Cloak of Leaves`,
        desc: `In your hero phase, you can heal 1 wound that has been allocated to this model. In addition, this model can attempt to unbind one spell in the enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Horn of the Wild Hunt`,
        desc: `You may re-roll the dice when determining the charge distance for this model and friendly Hunting Hounds units within 8" of it at the start of the charge phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Glade Lord on Great Eagle`,
    effects: [
      {
        name: `Death from the Skies`,
        desc: `Add 2 to the Attacks characteristic of the Great Eagle's Beak and Talons if this model made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glade Lord on Great Stag`,
    effects: [
      {
        name: `Impaling Charge`,
        desc: `Add 1 to the Damage characteristic of the Great Stag's Mighty Antlers if this model made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glade Lord on Forest Dragon`,
    effects: [
      {
        name: `Soporific Breath`,
        desc: `Enemy units within 3" of a Forest Dragon cannot be chosen to make attacks in the combat phase until all other units have made their attacks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Kindred Shield`,
        desc: `Re-roll failed save rolls for this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Starlight Strike`,
        desc: `Add 1 to the Damage characteristic of the Glade Lord's Starlight Spear if this model made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hunting Hounds`,
    effects: [
      {
        name: `Hounds of the Wild Hunt`,
        desc: `Add 1 to the Attacks characteristic of this unit's Savage Teeth while it is within 6" of any friendly Avatars of the Hunt.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wardancers`,
    effects: [
      {
        name: `Drummer`,
        desc: `You can re-roll the dice when determining how far this unit runs if it includes Drummers.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Bladesinger`,
        desc: `A Bladesinger fights with Weaving Blades and a War Stave.`,
        when: [COMBAT_PHASE],
      },
      ...getShadowdancerBaseEffects(1),
    ],
  },
  {
    name: `Waywatchers`,
    effects: [
      {
        name: `Waywatcher Sentinel`,
        desc: `Add 1 to the Attacks characteristic of the Waywatcher Sentinel's Longbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hawk-eyed Archers`,
        desc: `Each time this unit shoots its Longbows, you can declare that it will make either Fast Shots or Precise Shots:
        
        Fast Shots: Add 1 to the Attacks characteristic of this unit's Longbows until the end of this phase. In addition, for each hit roll of 6+, the attacking model can make one additional attack with its Longbow.

        Precise Shots: Add 1 to the Damage characteristic of this unit's Longbows until the end of this phase. In addition, for each wound roll of 6+, that attack is resolved with a Rend characteristic of -2 instead of '-'. `,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Invisible Hunter`,
        desc: `If this unit is in cover, subtract 1 from hit rolls that target it.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glade Riders`,
    effects: [
      {
        name: `Glade Knight`,
        desc: `Add 1 to the Attacks characteristic of the Glade Knight's Riding Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pennant Bearer`,
        desc: `While the unit includes any Pennant Bearers, add 1 to its Bravery characteristic. Add 2 to its Bravery characteristic instead if the unit is in cover.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `You can re-roll the dice when determining how far this unit can run while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Fire on the Move`,
        desc: `This unit can run and shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Shadowdancer`,
    effects: [
      ...getShadowdancerBaseEffects(2),
      {
        name: `Bridge of Shadows`,
        desc: `Casting value of 5. For the duration of your next Movement phase this model's Move characteristic is doubled and it can fly.`,
        when: [MOVEMENT_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Great Eagles`,
    effects: [
      {
        name: `Death from the Skies`,
        desc: `Add 2 to the Attacks characteristic of this unit's Beaks and Talons if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soar Away`,
        desc: `At the end of the combat phase you may declare that this unit will swoop out of combat and soar away as long as there are enemy models within 3" of it. If you do, roll 3D6; the result is how far you can immediately move this unit. The unit must end this move more than 3" from any enemy units - if they are unable to do so then they fail to escape and cannot swoop out of combat and soar away.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tree Kin`,
    effects: [
      {
        name: `Roused to War`,
        desc: `Add 1 to hit rolls for this unit's Bludgeoning Branches if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warhawk Riders`,
    effects: [
      {
        name: `Predator's Descent`,
        desc: `Add 1 to the Damage characteristic of this unit's Hunting Spears if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swift of Wing`,
        desc: `You always count as having rolled a 6 when making a run move for this unit - do not roll a D6.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Sweep Through Their Lines`,
        desc: `If, after this unit has made its attacks in the combat phase, there are no enemy models within 3", it can immediately pile in 6" and attack again.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Twilight Sisters on Forest Dragon`,
    effects: [
      SoporificBreathEffect,
      {
        name: `Impetuous Beast`,
        desc: `If this model is within 12" of any enemy model at the start of your charge phase, you must attempt to charge with it.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Dawnbow`,
        desc: `Add 1 to wound rolls for this model's Dawnbow when targeting a CHAOS unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Duskbow`,
        desc: `Add 1 to wound rolls for this model's Duskbow when targeting an ORDER unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Conjoined Destiny`,
        desc: `Roll a D6 for this unit in your hero phase. If the result is odd, nothing happens. If the result is even, you can heal a number of wounds that have been allocated to this model equal to the dice result.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glade Captain Battle Standard Bearer`,
    effects: [
      {
        name: `To Their Dying Breath`,
        desc: `If this model is slain in the combat phase, before you remove it you can immediately make a pile in move and then attack with it.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Banner of the Forests`,
        desc: `In your hero phase, you can declare that this model will plant his standard in the ground. If you do so, you may not move this model until your next hero phase. Roll a D6 for each enemy unit within 10". On a 4+, halve that unit's Move characteristic (rounding up) until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Available to ALL factions in this Grand Alliance
export const OrderUnits: TUnits = [
  {
    name: `Gotrek Gurnisson`,
    effects: [
      {
        name: `Avatar of Grimnir`,
        desc: `If any damage is inflicted by an attack, spell, or ability that targets Gotrek or affects Gotrek is greater than 1, change it to 1. If a spell or ability would slay Gotrek, instead deal 1 mortal wound.`,
        when: [DURING_GAME],
      },
      {
        name: `Avatar of Grimnir`,
        desc: `If this model is included in your army, it cannot be set up in reserve and you cannot use spells or abilities on this model that would allow you to set it up again after the battle has begun.`,
        when: [START_OF_GAME],
      },
      {
        name: `Krag Blackhammer's Master Rune`,
        desc: `You can re-roll hit and wound rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack inflicts D6 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unstoppable Battle Fury`,
        desc: `If this model is within 3" of an enemy unit, this model can fight a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Shoulder Plate of Edassa`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 3+, that wound or mortal wound is ignored.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
]

// Units available to this Grand Alliance allegiance
export const Units: TUnits = [...OrderUnits, ...MonstrousArcanumOrder, ...LegacyOrderUnits]
