import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'

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

const LegacyBretonnianUnits: TUnits = [
  {
    name: `Bretonnian Lord`,
    effects: [
      {
        name: `Dragonbane`,
        desc: `Add 1 to hit rolls for the Ducal Sword and Dragonbane Lance if this model made a charge move in the same turn. In addition, reroll failed hit rolls for the Ducal Sword and Dragonbane Lance if the target is a Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ducal Shield`,
        desc: `In the combat phase, reroll save rolls of 1 for this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Realm`,
        desc: `If this model uses this ability, until your next hero phase reroll failed charge rolls for friendly Nobility units that are within 15" of this model when the charge roll is made.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  {
    name: `Damsel`,
    effects: [
      {
        name: `Soothing Aura`,
        desc: `In your hero phase, you can heal 1 wound allocated to a friendly Bretonnian model that is within 6" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `A Damsel is a wizard. She can attempt to cast one spell in each of your hero phases, and attempt to unbind one spell in each enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Divine Blessing spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Divine Blessing`,
        desc: `Casting value of 5. Pick a friendly Bretonnian unit that is within 16" of the caster. Until your next hero phase, roll a dice each time you allocate a wound or mortal wound to that unit. Add 1 to the dice roll if the unit has Nobility keyword. On a roll of 6+, the wound is negated and has no effect.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Battle Pilgrims`,
    effects: [
      {
        name: `Grail Reliquae`,
        desc: `A unit of Battle Pilgrims can have one Grail Reliquae. A Grail Reliquae has a Wounds characteristic of 3 instead of 1. Add 2 to the attacks characteristic of the Grail Reliquae's Reliquary Sword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inspired Fervour`,
        desc: `Add 1 to hit rolls for this unit if it includes a Grail Reliquae when the hit roll is made.`,
        when: [HERO_PHASE],
      },
      {
        name: `Inspired Fervour`,
        desc: `Add 1 to any wound rolls for this unit if it has 10 or more models when the wound roll is made.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Pilgrim Shields`,
        desc: `Reroll save rolls of 1 for this unit. Reroll save rolls of 1 or 2 instead if this unit includes a Grail Reliquae when the save roll is made.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Enchantress`,
    effects: [
      {
        name: `Chalice of Potions`,
        desc: `In your hero phase, you can reroll one failed casting roll for this model. If you do and the result of the reroll is a 2 before any modifiers are applied, then you cannot use this ability again for the rest of the battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Saintly Guardians`,
        desc: `In the combat phase, reroll failed hit rolls for friendly Grail Knights units while they are within 10" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spiteful Glance`,
        desc: `At the start of the combat phase, pick an enemy unit within 3" of this model and roll 2D6. The enemy unit suffers 1 mortal wound if the result of the roll is equal to or higher than its Bravery characteristic.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Blessed`,
        desc: `In your hero phase, heal D3 wounds that have been allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Divine Favour`,
        desc: `Casting value of 6. Pick a friendly Bretonnian unit that is visible to the caster and within 16" of them. Until your next hero phase, add 1 to hit rolls for that unit's melee weapons.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Wizard`,
        desc: `An Enchantress is a wizard. She can attempt to cast two spells in each of your own hero phases, and attempt to unbind two spells in each enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Divine Favour spells.`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: `Grail Knights`,
    effects: [
      BannerBearerEffect,
      TrumpeterEffect,
      {
        name: `Sacred Lances`,
        desc: `Add 1 to the Damage characteristic of this unit's Swords and Sacred Lances if the target of its attacks is a Daemon or Death unit. In addition, add 1 to wound rolls made for, and the Damage characteristic of, this unit's Swords and Sacred Lances if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      KnightsShieldEffect,
    ],
  },

  {
    name: `Field Trebuchet`,
    effects: [
      {
        name: `Heavy Artillery`,
        desc: `This model can only move if its Crew are within 1" of it at the start of the movement phase. If its Crew are within 1" of the Trebuchet in the shooting phase, they can fire the war machine. The war machine cannot make charge moves, does not need to take battleshock tests and is unaffected by any attack or ability that uses Bravery. The Crew are in cover while they are within 1" of their war machine.`,
        when: [DURING_GAME],
      },
      {
        name: `Arcing Shot`,
        desc: `This unit can shoot at enemy units that are not visible to it. If it does, subtract 1 from the hit roll for the unit's Rocks and Masonry attack.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Seismic Impact`,
        desc: `Roll a dice before making the hit roll for a Rocks and Masonry attack. If the roll is less than the number of models in the target unit, the attack scores a hit without needing the hit roll to be made.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `King on Hippogryph`,
    effects: [
      {
        name: `Regal Crown`,
        desc: `Do not take battleshock tests for friendly Bretonnian units while they are within 24" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Lion Shield`,
        desc: `This model can attempt to unbind 1 spell in each enemy hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lion Shield`,
        desc: `In the combat phase, reroll save rolls of 1 for this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sword of the King`,
        desc: `Reroll failed hit rolls for the Sword of the King if the target is a Hero or Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Champion of the People`,
        desc: `At the start of your hero phase, heal D3 wounds that have been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `King of the Realm`,
        desc: `If this model uses this ability, then in your next combat phase add 1 to hit rolls for friendly Nobility units within 24" of this model that made a charge move in the same turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  {
    name: `Knights Errant`,
    effects: [
      {
        name: `Cavalier`,
        desc: `The leader of this unit is a Cavalier. Add 1 to the Attacks characteristic of the Cavalier's Pendant Lance and Blade.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      TrumpeterEffect,
      {
        name: `Eager to Impress`,
        desc: `In the combat phase, reroll hit rolls of 1 for this unit if it was within 18" of a Damsel at the start of the phase.`,
        when: [COMBAT_PHASE],
      },
      PendantLancesEffect,
      KnightsShieldEffect,
    ],
  },

  {
    name: `Knights of The Realm`,
    effects: [
      GallantEffect,
      BannerBearerEffect,
      TrumpeterEffect,
      {
        name: `Massed Cavalry`,
        desc: `Reroll hit rolls of 1 for this unit if it contains 10 or more models when the hit roll is made.`,
        when: [COMBAT_PHASE],
      },
      PendantLancesEffect,
      KnightsShieldEffect,
    ],
  },

  {
    name: `Men-at-Arms`,
    effects: [
      {
        name: `Warden`,
        desc: `The leader of this unit is a Warden. Add 1 to the Attacks characteristic of a Warden's Polearm.`,
        when: [COMBAT_PHASE],
      },
      DrummerEffect,
      ...BretonnianInfantryBaseEffects,
      {
        name: `Rowdy Mob`,
        desc: `Add 1 to hit rolls for this unit if it has 20 models or more when the hit roll is made. Add 2 to hit rolls instead if it has 30 models or more when the hit roll is made.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tower Shields`,
        desc: `Add 1 to save rolls for this unit unless it made charge move in the same turn.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Mounted Yeomen`,
    effects: [
      {
        name: `Warden`,
        desc: `The leader of this unit is a Warden. Add 1 to the Attacks characteristic of the Warden's Hunting Spear.`,
        when: [COMBAT_PHASE],
      },
      ...BretonnianInfantryBaseEffects,
      {
        name: `Scouts`,
        desc: `After deployment but before the first battle round, this unit can make a move as if it were the movement phase (though it cannot run).`,
        when: [END_OF_SETUP],
      },
      {
        name: `Wooden Shields`,
        desc: `In the combat phase, reroll save rolls of 1 for this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  {
    name: `Noble Champion`,
    effects: [
      RelicWeaponEffect,
      {
        name: `Virtue of Empathy`,
        desc: `In the battleshock phase, friendly Peasantry units can use this model's Bravery characteristic when they take a battleshock test if they are within 6" of this model when the test is taken.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  {
    name: `Noble Standard Bearer`,
    effects: [
      RelicWeaponEffect,
      {
        name: `Valorous Banner`,
        desc: `In the battleshock phase, you can reroll battleshock tests for friendly Nobility units that were within 12" of this model when the test was taken.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  {
    name: `Peasant Bowmen`,
    effects: [
      ...BretonnianInfantryBaseEffects,
      DrummerEffect,
      {
        name: `Arrowstorm`,
        desc: `Once per battle, at the start of your shooting phase, you can declare that this unit will fire an Arrowstorm. If you do, add 2 to the Attacks characteristics of this unit's Longbows until the end of the phase. Add 3 to the Attacks characteristics instead if this unit has 20 or more models when the Arrowstorm is declared. A unit cannot use this ability if it is within 3" of any enemy units at the start of its shooting phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Stakes`,
        desc: `When you set this unit up, you can declare that it is protecting itself with a barricade of sharpened stakes (you can use the stake models provided with this unit as a reminder of this if you wish). An enemy unit that finishes a charge move within 3" of a unit protected by stakes suffers D3 mortal wounds. The protection of the stakes is lost for the rest of the battle if this unit moves or is attacked by an enemy unit in the combat phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Stakes`,
        desc: `An enemy unit that finishes a charge move within 3" of a unit protected by stakes suffers D3 mortal wounds. The protection of the stakes is lost for the rest of the battle if this unit moves or is attacked by an enemy unit in the combat phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Burning Braziers`,
        desc: `Reroll wound rolls of 1 for Longbows used by a unit with burning braziers. The benefit of the burning braziers is lost for the rest of the battle if this unit moves or is attacked by an enemy unit in the combat phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Pegasus Knights`,
    effects: [
      GallantEffect,
      BannerBearerEffect,
      TrumpeterEffect,
      {
        name: `Swooping Charge`,
        desc: `Add 1 to wound rolls and 1 to the Damage characteristic of this unit's Lances and Blades if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      KnightsShieldEffect,
    ],
  },

  {
    name: `Questing Knights`,
    effects: [
      {
        name: `Paragon`,
        desc: `The leader of this unit is a Paragon. Add 1 to the Attacks characteristic of the Paragon's Knightly Greatblade.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      {
        name: `Lutist`,
        desc: `Models in this unit can be Lutists. Roll 3D6 instead of 2D6 when you make a charge roll for a unit that includes any Lutists, and then pick two of the dice to determine the result of the roll.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `The Questing Vow`,
        desc: `Add 1 to the Damage characteristic of a Knightly Greatblade if the target has the Monster keyword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Questing Vow`,
        desc: `You can reroll charge rolls for this unit if there is an enemy unit with the Monster keyword within 12" of it when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
      KnightsShieldEffect,
    ],
  },

  {
    name: `Sacred Protector`,
    effects: [
      {
        name: `Ethereal`,
        desc: `When making save rolls for this unit, ignore the attacking weapon's Rend characteristic.`,
        when: [DURING_GAME],
      },
      {
        name: `Shield of the Ancient Forests`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a roll of 6+ that wound is negated and has no effect.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Summoned from the Mists`,
        desc: `Instead of setting up this model on the battlefield, you must place it to one side and say that it is set up in the mists.`,
        when: [DURING_SETUP],
      },
      {
        name: `Summoned from the Mists`,
        desc: `In each of your movement phases, roll a dice for this model. On a roll of 3 or less the model remains in the mists - you must roll again in your next movement phase. On a roll of 4+, set up this model anywhere on the battlefield, more than 9" from any enemy models. This counts as its move for that movement phase.`,
        when: [MOVEMENT_PHASE],
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
]

const LegacyOrderUnits: TUnits = [
  ...LegacyBretonnianUnits,
  ...LegacyDwarfUnits,
  ...LegacyEldritchUnits,
  ...LegacySwifthawkAgentUnits,

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
        desc: `Reroll failed save rolls for this model.`,
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
