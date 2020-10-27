import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
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
    when: [WOUND_ALLOCATION_PHASE],
  },
]
const SoporificBreathEffect = {
  name: `Soporific Breath`,
  desc: `Enemy units within 3" of this model cannot be chosen to make attacks in the combat phase until all other units have made their attacks.`,
  when: [COMBAT_PHASE],
}
const KindredShieldEffect = {
  name: `Kindred Shield`,
  desc: `Reroll failed save rolls for this model.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
}
const LionCloakEffect = {
  name: `Lion Cloak`,
  desc: `You can reroll save rolls of 1 for this unit in the shooting phase.`,
  when: [SHOOTING_PHASE],
}

export const LegacyWoodElvesUnits: TUnits = [
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
        desc: `You may reroll the dice when determining the charge distance for this model and friendly Hunting Hounds units within 8" of it at the start of the charge phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Glade Lord on Purebred Steed`,
    effects: [
      {
        name: `Hunter's Strike`,
        desc: `Increase the Damage characteristic of the Glade Lord's Starlight Hunting Spear to D3 if this model made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
      KindredShieldEffect,
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
      KindredShieldEffect,
      {
        name: `Starlight Strike`,
        desc: `Add 1 to the Damage characteristic of the Glade Lord's Starlight Spear if this model made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wardancers`,
    effects: [
      {
        name: `Drummer`,
        desc: `You can reroll the dice when determining how far this unit runs if it includes Drummers.`,
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
        desc: `You can reroll the dice when determining how far this unit can run while it includes any Hornblowers.`,
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
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Banner of the Forests`,
        desc: `In your hero phase, you can declare that this model will plant his standard in the ground. If you do so, you may not move this model until your next hero phase. Roll a D6 for each enemy unit within 10". On a 4+, halve that unit's Move characteristic (rounding up) until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `White Lion Chariots`,
    effects: [
      LionCloakEffect,
      {
        name: `Unbridled Ferocity`,
        desc: `A White Lion Chariot's War Lions make 8 attacks with their Fangs and Claws instead of 4 if this model charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `White Lions`,
    effects: [
      {
        name: `Guardian`,
        desc: `The leader of this unit is a Guardian. A Guardian makes 3 attacks rather than 2.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Models in this unit may be Hornblowers. You can reroll any dice rolls of 1 when determining how far this unit can run or charge if it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 to their Bravery instead if the unit is within 8" of another Lion Rangers unit from your army that includes a Standard Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      LionCloakEffect,
      {
        name: `Unflinching Courage`,
        desc: `Roll a dice each time a White Lion flees; on a 4 or more that model's courage stirs up within him and he returns to the battle - he does not flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]
