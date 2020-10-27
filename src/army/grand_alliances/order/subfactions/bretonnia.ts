import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

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

export const LegacyBretonnianUnits: TUnits = [
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
        when: [WOUND_ALLOCATION_PHASE],
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
