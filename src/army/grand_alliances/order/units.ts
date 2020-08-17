import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'
import { LegacyBretonnianUnits } from './legacy_factions/bretonnia'

export const APPRENTICE_RUNESMITH = {
  name: `Apprentice Runesmith`,
  effects: [
    {
      name: `Overworked`,
      desc: `Whilst within 5" of a Runelord on Anvil of Doom, this model's Forging Tongs have an Attacks characteristic of 3.`,
      when: [COMBAT_PHASE],
    },
    {
      name: `Enthusiastic Young Assistant`,
      desc: `This model can attempt to unbind one spell in each enemy hero phase as if he were a wizard.`,
      when: [HERO_PHASE],
    },
  ],
}

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
const BannerBearerEffect = {
  name: `Banner Bearer`,
  desc: `Models in this unit can be Banner Bearers. You can reroll battleshock tests for a unit that includes any Banner Bearers if it made a charge move in the same turn.`,
  when: [BATTLESHOCK_PHASE],
}
const TrumpeterEffect = {
  name: `Trumpeter`,
  desc: `Models in this unit can be Trumpeters. Roll 3D6 instead of 2D6 when you make a charge roll for a unit that includes any Trumpeters, and then pick two of the dice to determine the result of the roll.`,
  when: [CHARGE_PHASE],
}
const PendantLancesEffect = {
  name: `Pendant Lances`,
  desc: `Add 1 to the wound rolls and Damage characteristic of this unit's Pendant Lances and Blades if it made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const KnightsShieldEffect = {
  name: `Knight's Shield`,
  desc: `In the combat phase, reroll save rolls of 1 for this unit if it made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const BretonnianInfantryBaseEffects = [
  {
    name: `Trumpeter`,
    desc: `Models in this unit can be Trumpeters. Add 1 to run rolls for this unit if it includes any Trumpeters.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Standard Bearer`,
    desc: `Models in this unit can be Standard Bearers. You can reroll battleshock tests for this unit if it includes any Standard Bearers when the test is taken.`,
    when: [BATTLESHOCK_PHASE],
  },
]
const RelicWeaponEffect = {
  name: `Relic Weapon`,
  desc: `Add 1 to the Damage characteristic of the Relic Weapon if the target is a Daemon or Death unit.`,
  when: [COMBAT_PHASE],
}
const DrummerEffect = {
  name: `Drummer`,
  desc: `Models in this unit can be Drummers. Add 1 to charge rolls for this unit if it includes any Drummers.`,
  when: [CHARGE_PHASE],
}
const GallantEffect = {
  name: `Gallant`,
  desc: `The leader of this unit is a Gallant. Add 1 to the Attacks characteristic of the Gallant's Pendant Lance and Blade.`,
  when: [COMBAT_PHASE],
}
const FleetOfWingEffect = {
  name: `Fleet of Wing`,
  desc: `If this model runs, roll 2D6 instead of one and use the total when determining how much extra it can move.`,
  when: [MOVEMENT_PHASE],
}
const AelvenShieldEffects = [
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
]
const SwifthawkDiscipline = {
  name: `Swifthawk Discipline`,
  desc: `If you fail a battleshock test for this unit whilst a Swifthawk Agents Hero from your army is within 16", halve the number of models that flee (rounding fractions up).`,
  when: [BATTLESHOCK_PHASE],
}
const TalismanOfArcanePowerEffect = {
  name: `Talisman of Arcane Power`,
  desc: `You can add 1 to any unbinding rolls for an Archmage with a Talisman of Arcane Power.`,
  when: [HERO_PHASE],
}
const DragonfireEffect = {
  name: `Dragonfire`,
  desc: `A Dragon can unleash a blast of Dragonfire in your shooting phase. When it does so, pick a visible unit within 12" and roll a dice; on a 1 or 2 that unit suffers a mortal wound, on a 3 or 4 that unit suffers D3 mortal wounds, and on a 5 or 6 that unit suffers D6 mortal wounds.`,
  when: [SHOOTING_PHASE],
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
const RangeFindingOpticsEffect = {
  name: `Range-finding Optics`,
  desc: `You can re-roll hit rolls of 1 for this model in the shooting phase if they did not move in their preceding movement phase and there are no enemy models within 3" of them.`,
  when: [SHOOTING_PHASE],
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

const LegacySwifthawkAgentUnits: TUnits = [
  {
    name: `Chariots`,
    effects: [
      {
        name: `Graceful Charge`,
        desc: `You can reroll all failed wound rolls for a Chariot in the combat phase if it made a charge in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swift and Deadly`,
        desc: `If a Chariot runs there is no need to roll a dice, it can always move up to an extra 6".`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Swift and Deadly`,
        desc: `Chariots can pile in up to 6", instead of 3".`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  {
    name: `High Warden`,
    effects: [
      {
        name: `Predatory Leap`,
        desc: `When this model piles in it can move up to 6" and can move over enemy models. Furthermore, it does not have to move towards the closest enemy model, as long as it ends its move within 1/2" of an enemy unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Starwood Lance`,
        desc: `Add 1 to the wound rolls and Damage of a Starwood Lance if this model charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hurricane Charge`,
        desc: `If a High Warden uses this ability, then until your next hero phase you can reroll any dice when determining the charge distance for Swifthawk Agents from your army if they are within 16" of this model when they charge.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  {
    name: `Reavers`,
    effects: [
      {
        name: `Harbinger`,
        desc: `The leader of this unit is a Harbinger. A Harbinger wields a Starsteel Blade in place of a Starwood Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aelven Purebreeds`,
        desc: `In the shooting phase, before or after making attacks with this unit, you can roll two dice and move all of the models in this unit up to that many inches. Models cannot start or end this move within 3" of an enemy unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Swift Volleys`,
        desc: `Models in this unit make 3 attacks with their Reaver Cavalry Bows if the unit is not within 3" of an enemy unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Skycutters`,
    effects: [
      ...AelvenShieldEffects,
      {
        name: `Agents' Blades and Spears`,
        desc: `If a Skycutter is crewed by a trio of Agents, it makes 3 attacks with its Agents' Blades and Spears instead of 2.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fleet of Wing`,
        desc: `If this model runs, roll 2D6 instead of one and use the total when determining how much extra it can move.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Sky Chariot`,
        desc: `Skycutters can shoot even if they ran in their movement phase.`,
        when: [SHOOTING_PHASE],
      },
      SwifthawkDiscipline,
    ],
  },

  {
    name: `Skywarden`,
    effects: [
      {
        name: `Enchanted Shield`,
        desc: `You can reroll all failed save rolls for this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Swifthawk Pennant`,
        desc: `A Skywarden with a Swifthawk Pennant gains the Totem keyword.
        You can add 1 to all wound rolls for all Swifthawk Agents from your
        army if they are within 16" of this model when they attack.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Windrider`,
        desc: `A Skywarden has a Save of 4+ instead of 5+ in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      FleetOfWingEffect,
      {
        name: `Swoop and Attack!`,
        desc: `If a Skywarden uses this ability, Swifthawk Agents in your army that can fly can charge in your next charge phase even if they ran this turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  {
    name: `Spireguard`,
    effects: [
      {
        name: `Watch Master`,
        desc: `The leader of this unit is a Watch Master. A Watch Master makes 2 attacks rather than 1 with a Silverwood Spear.`,
        when: [COMBAT_PHASE],
      },
      InfantryHornblowerEffect,
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 to their Bravery instead if the unit is within 8" of another Swifthawk Agents unit from your army that includes a Standard Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      ...AelvenShieldEffects,
      {
        name: `Strength of the Spireguard`,
        desc: `You can reroll hit rolls of 1 for a Spireguard if its unit has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      SwifthawkDiscipline,
    ],
  },
]

const LegacyEldritchUnits: TUnits = [
  {
    name: `Swordmasters`,
    effects: [
      {
        name: `Bladelord`,
        desc: `The leader of this unit is a Bladelord. A Bladelord makes 3 attacks
        rather than 2.`,
        when: [COMBAT_PHASE],
      },
      InfantryHornblowerEffect,
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 to their Bravery instead if the unit is within 8" of another Eldritch Council unit from your army that includes a Standard Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `A Blur of Blades`,
        desc: `You can reroll hit rolls of 1 when attacking with a Swordmaster.`,
        when: [COMBAT_PHASE],
      },
      DeflectShotsEffect,
    ],
  },

  {
    name: `Archmage`,
    effects: [
      {
        name: `Aelven Steed`,
        desc: `An Archmage can ride an Aelven Steed. If he does so, his Move is increased to 14" and he gains the Swift Hooves attack.`,
        when: [MOVEMENT_PHASE],
      },
      TalismanOfArcanePowerEffect,
      {
        name: `Wizard`,
        desc: `An Archmage is a wizard. He can attempt to cast one spell in each of your own hero phases, and attempt to unbind one spell in each enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Elemental Shield spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Elemental Shield`,
        desc: `Casting value of 6. Until your next hero phase, you can roll a dice each time the Archmage, or a model in your army within 18" of him, suffers a wound or a mortal wound. On the roll of a 6 that hit is deflected by the magical barrier surrounding the Archmage and is ignored.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Archmage on Dragon`,
    effects: [
      TalismanOfArcanePowerEffect,
      DragonfireEffect,
      {
        name: `Wizard`,
        desc: `An Archmage on Dragon is a wizard. He can attempt to cast one spell in each of your own hero phases, and attempt to unbind two spells in each enemy hero phase. An Archmage with an Arcane Tome can attempt to cast two different spells in each of your hero phases instead of just one, and attempt to unbind two spells in each enemy hero phase. An Archmage on Dragon knows the Arcane Bolt, Mystic Shield and Drain Magic spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Drain Magic`,
        desc: `Casting value of 4. Select a visible unit within 18". Any spells that are affecting that unit immediately cease. Furthermore, if that unit is a Daemon unit, it suffers D3 mortal wounds as the magic sustaining their forms is ripped away and dissipated by the vortex. If that unit is an Endless Spell, it is dispelled.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Drakeseer`,
    effects: [
      {
        name: `Warrior Mage`,
        desc: `A Drakeseer makes 3 attacks with his Sunstaff instead of 1 if he charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      DragonfireEffect,
      {
        name: `Wizard`,
        desc: `A Drakeseer is a wizard. He can attempt to cast one spell in each of your own hero phases, and attempt to unbind one spell in each enemy hero phase. He knows the Arcane Bolt, Mystic Shield, and Flames of the Phoenix spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flames of the Phoenix`,
        desc: `Casting value of 7. Pick a visible enemy unit within 18". That unit suffers a mortal wound as it is set ablaze. 
        
        Then, roll another dice - if the result is a 3 or less the flames die out and this spell ends. 
        
        On a 4 or more, however, the unit suffers an additional 2 mortal wounds and continues to burn; roll another dice - if the result is a 3 or less the fire dies out, but on a 4 or more, the unit suffers an additional 3 mortal wounds and the conflagration continues. 
        
        Keep rolling extra dice in this way, inflicting 1 more mortal wound than last time you rolled, until either the flames die out or the unit does!`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Loremaster`,
    effects: [
      {
        name: `Deflect Shots`,
        desc: `You can reroll failed save rolls for this unit in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Wizard`,
        desc: `A Loremaster is a wizard. He can attempt to cast one spell in each of your hero phases, and attempt to unbind one spell in each enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Hand of Glory spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hand of Glory`,
        desc: `Casting value of 5. Pick a model within 18". Until your next hero phase you can reroll all failed hit rolls and wound rolls for that model.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
]

const LegacyDwarfUnits: TUnits = [
  {
    name: `Far-Ranger`,
    effects: [
      {
        name: `Veteran Ranger`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to
        one side in hiding.`,
        when: [DURING_SETUP],
      },
      {
        name: `Veteran Ranger`,
        desc: `At the end of your movement phase you may set this unit up anywhere on the battlefield that is more than 9" from any enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Heirloom Tankard`,
        desc: `Once per battle, in your hero phase, you may choose for this model to drink from this tankard to refresh and restore themselves. If you do so, heal D3 wounds that have been allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: `Gunmaster`,
    effects: [RangeFindingOpticsEffect],
  },

  {
    name: `Huntmarshal`,
    effects: [
      {
        name: `Monster Hunter`,
        desc: `Add 1 to hit rolls for this model's attacks that target a Monster.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Huntmarshal's Bow`,
        desc: `A Huntmarshal's Bow has a Damage characteristic of D6 instead of D3 for attacks that target a Monster.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Engineer on Mechanical Steed`,
    effects: [
      RangeFindingOpticsEffect,
      {
        name: `Clockwork Charge`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 4+ the unit being rolled for suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  {
    name: `Runelord on Anvil of Doom`,
    effects: [
      {
        name: `Anvil of Doom`,
        desc: `This model cannot make charge moves.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Anvil of Doom`,
        desc: `This model cannot run.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Master Runes of Spellbreaking`,
        desc: `This model can attempt to unbind two spells in each enemy hero phase as if it were a wizard. Add 2 to any unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Strike the Runes`,
        desc: `In your hero phase, you can declare that the Runelord will strike a rune of power. If you do so, pick one of the following runes and roll a dice. 
        
        On a 1 the rune is struck incorrectly and nothing happens. 
        On a roll of 2+ the rune is struck correctly and you may apply its effects. 

        If this model is within 4" of a friendly Apprentice Runesmith, then the Runelord can attempt to strike two different runes in your hero phase rather than one. 
        
        Rune of Hearth and Home: Re-roll failed hit rolls for this unit until your next hero phase. 
        Rune of Oath and Steel: Add 1 to save rolls for this unit until your next hero phase. 
        Rune of Wrath and Ruin: Pick an enemy unit that is visible to the Runelord and is within 24" of him. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

const LegacyOrderUnits: TUnits = [
  ...LegacyBretonnianUnits,
  ...LegacyDwarfUnits,
  ...LegacyEldritchUnits,
  ...LegacySwifthawkAgentUnits,

  {
    name: `Battlemage on Pegasus`,
    effects: [
      {
        name: `Amulet of Negation`,
        desc: `Add 1 to unbinding rolls for this model for each enemy Wizard within 18" of them.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `A Battlemage on Pegasus is a wizard. They can attempt to cast two different spells in each of your hero phases, and attempt to unbind two spells in each enemy hero phase. They know the Arcane Bolt, Mystic Shield and Searing Doom spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Searing Doom`,
        desc: `Casting value of 6. Pick an enemy unit that is visible to the caster and within 18" of them and roll 6 dice. 
        
        That unit suffers 1 mortal wound for each dice rolled that is equal to or higher than that unit's Save characteristic (for example, a unit with a save of 4+ would suffer a mortal wound for each dice result that was a 4 or more). 
        
        Units with a save of - cannot be affected by this spell.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

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
      DeflectShotsEffect,
      {
        name: `Hand of Glory`,
        desc: `Casting value of 5. Pick a model within 18". Until your next hero phase you can reroll all failed hit rolls and wound rolls for that model.`,
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
        desc: `You can reroll hit and wound rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack inflicts D6 mortal wounds on the target in addition to any normal damage.`,
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
