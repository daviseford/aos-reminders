import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  DURING_SETUP,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import prayers from './prayers'
import spells from './spells'

const EshinToxinsEffect = {
  name: `Eshin Toxins`,
  desc: `If the unmodified hit roll for an attack made by this unit is 6, the target suffers D3 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  shared: true,
}
const AltarOfTheHornedRatEffects = [
  {
    name: `Altar of the Horned Rat`,
    desc: `This unit has a ward of 5+.`,
    when: [WARDS_PHASE],
    shared: true,
  },
  {
    name: `Altar of the Horned Rat`,
    desc: `At the start of your hero phase, you can say that this unit will beseech the Horned Rat instead of attempting to cast spells in that phase. If you do so, in that phase, this unit is treated as having the Priest keyword instead of the Wizard keyword.`,
    when: [START_OF_HERO_PHASE],
    shared: true,
  },
]
const RunningDeathEffect = {
  name: `Running Death`,
  desc: `This unit can run and still shoot later in the turn.`,
  when: [MOVEMENT_PHASE, SHOOTING_PHASE],
  shared: true,
}
const RegeneratingMonstrosityEffect = {
  name: `Regenerating Monstrosity`,
  desc: `In your hero phase, you can heal up to D3 wounds allocated to this unit.`,
  when: [HERO_PHASE],
  shared: true,
}
const PushedIntoBattleEffect = {
  name: `Pushed into Battle`,
  desc: `This unit cannot move unless it starts the move within 6" of 10 or more other friendly SKAVEN models.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const ProtectionOfTheHornedRatEffect = {
  name: `Protection of the Horned Rat`,
  desc: `This unit has a ward of 5+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const PoisonousFumesEffect = {
  name: `Poisonous Fumes`,
  desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target this unit.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const FrenziedAssaultEffect = {
  name: `Frenzied Assault`,
  desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if it made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const CrackTheWhipEffect = {
  name: `Crack the Whip`,
  desc: `At the start of your movement phase, you can pick 1 friendly Clans Moulder Pack unit wholly within 13" of this unit. Until your next movement phase, you can add 3 to run rolls and charge rolls for that unit. In addition, until your next movement phase, add 1 to wound rolls for attacks made with melee weapons by that unit. The same unit cannot benefit from this ability more than once per turn.`,
  when: [START_OF_MOVEMENT_PHASE],
  shared: true,
}

const Units = {
  'Thanquol on Boneripper': {
    mandatory: {
      spells: [keyPicker(spells, ['Madness'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ProtectionOfTheHornedRatEffect,
      {
        name: `Power Behind the Throne`,
        desc: `Once per battle round, this unit can issue the same command up to 2 times in the same phase. If it does so, each command must be received by a friendly SKAVEN unit. No command point is spent the second time this unit issues that command in that phase.`,
        when: [DURING_ROUND],
      },
      {
        name: `Staff of the Horned Rat`,
        desc: `Add the Staff of the Horned Rat value shown on this unit's damage table to casting, unbinding and dispelling rolls for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warp-amulet`,
        desc: `At the end of the combat phase, you can heal D3 wounds allocated to this unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Warpfire Braziers`,
        desc: `The Attacks characteristic of Warpfire Braziers is equal to double the number of Warpfire Braziers with which this unit is armed.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpfire Projectors`,
        desc: `Do not use the attack sequence for an attack made with Warpfire Projectors. Instead, roll x dice for each model in the target unit that is within range, where x is equal to the number of Warpfire Projectors with which this unit is armed. For each 4+, the target suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Warpstone Addiction`,
        desc: `Once per turn, in your hero phase, when this unit attempts to cast a spell, you can say that it will first consume a warpstone token. If you do so, roll 3D6. This roll cannot be rerolled or modified.

        If the 3D6 roll is 13, the spell is successfully cast and cannot be unbound; however, after the effects of the spell have been resolved, this unit suffers D6 mortal wounds.

        If the 3D6 roll was not 13, remove 1 dice of your choice and use the remaining 2D6 as the casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lord Skreech Verminking': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['The Rat King'])],
      spells: [keyPicker(spells, ['The Dreaded Thirteenth Spell'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ProtectionOfTheHornedRatEffect,
      {
        name: `The Thirteen-headed One`,
        desc: `At the start of your hero phase, pick 1 of the following areas of knowledge for this unit to draw upon. The effect of that area of knowledge applies to this unit until your next hero phase. You cannot pick the same area of knowledge more than once per battle.

        Knowledge of the Arcane - Add 1 to casting, unbinding and dispelling rolls for this unit.

        Knowledge of Fleshcrafting - When you pick this area of knowledge, heal D3 wounds allocated to this unit.

        Knowledge of Plague-brewing - If the unmodified hit roll for an attack made with this unit's Plaguereaper is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.

        Knowledge of Shadowslinking - Subtract 1 from hit rolls for attacks that target this unit.
        
        Knowledge of Warp-tech - This unit's Doom Glaive has a Rend characteristic of -3 and a Damage characteristic of 3.

        Knowledge of the Warrior - Add 1 to wound rolls for attacks made by this unit. `,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Verminlord Warpseer': {
    mandatory: {
      spells: [keyPicker(spells, ['Dreaded Warpgale'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ProtectionOfTheHornedRatEffect,
      {
        name: `Forth-forth, Children of the Horned Rat!`,
        desc: `Friendly SKAVEN units wholly within 13" of this unit have a Bravery characteristic of 10.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Great Manipulators`,
        desc: `This unit counts as 2 MASTERCLAN HEROES for the purposes of the Always Three Clawsteps Ahead battle trait.`,
        when: [DURING_GAME],
      },
      {
        name: `Scry-orb`,
        desc: `Add 1 to save rolls for attacks that target this unit.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Scry-orb`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 13" of this unit and visible to them. That unit suffers D6 mortal wounds, but you cannot use this ability to add 1 to save rolls for attacks that target this unit for the rest of the battle.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Grey Seer': {
    mandatory: {
      spells: [keyPicker(spells, ['Wither'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Warpstone Tokens`,
        desc: `Once per turn, in your hero phase, when this unit attempts to cast a spell, you can say that it will first consume a warpstone token. If you do so, roll 3D6. This roll cannot be rerolled or modified. If the 3D6 roll is 13, the spell is successfully cast and cannot be unbound; however, after the effects of the spell have been resolved, this unit suffers D3 mortal wounds that cannot be negated. Ifthe 3D6 roll was not 13, remove 1 dice of your choice and use the remaining 2D6 as the casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Arch-Warlock': {
    mandatory: {
      spells: [keyPicker(spells, ['Warp Lightning Storm'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `More-more Stormcage!`,
        desc: `Before you make a hit roll for an attack made with a Stormcage Halberd, you can say that the engineer has overloaded its generator. If you do so, until the end of that phase, the Attacks characteristic of that weapon is D6 instead of D3. However, for each unmodified hit roll of 1 for an attack made with that weapon in that phase, this unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpfire Gauntlet`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 9" of this unit and visible to it, and roll a dice. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Warlock Engineer': {
    mandatory: {
      spells: [keyPicker(spells, ['Warp Lightning'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `More-more Warp-energy!`,
        desc: `Before you make a hit roll for an attack made with a Warp-energy Blade, you can say that the engineer has overloaded its generator. If you do so, until the end of that phase, the Attacks characteristic of that weapon is D6 instead of D3. However, for each unmodified hit roll of 1, this unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Warlock Bombardier': {
    mandatory: {
      spells: [keyPicker(spells, ['Warp Lightning'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `More-more Doomrocket!`,
        desc: `Before you make a hit roll for an attack made with a Doomrocket, you can say that the engineer has overloaded its warhead. If you do so, until the end of that phase, the Attacks characteristic of that weapon is D6 instead of D3. However, for each unmodified hit roll of 1, this unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Stormfiends: {
    effects: [
      GenericEffects.Elite,
      {
        name: `Doomflayer Gauntlets`,
        desc: `Add 1 to the Attacks characteristic of Doomflayer Gauntlets if the attacking model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grinderfist Tunnellers`,
        desc: `If this unit includes any models armed with Grinderfists, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up underground as a reserve unit.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Grinderfist Tunnellers`,
        desc: `At the end of your movement phase, you can set up this unit on the battlefield, more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Shock Gauntlets`,
        desc: `If the unmodified hit roll for an attack made with Shock Gauntlets is 6, that attack scores D6 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpfire Projectors`,
        desc: `Do not use the attack sequence for an attack made with Warpfire Projectors. Instead, roll a dice for each model in the target unit that is within range. For each 4+, the target suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Warpstone-laced Armour`,
        desc: `A model wearing Warpstone-laced Armour has a Wounds characteristic of 7 instead of 6.`,
        when: [DURING_GAME],
      },
      {
        name: `Windlaunchers`,
        desc: `The target of an attack made with Windlaunchers does not have to be visible to the attacking model. In addition, add 1 to wound rolls for attacks made with Windlaunchers if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Warp Lightning Cannon': {
    effects: [
      {
        name: `Warp Lightning Blast`,
        desc: `Do not use the attack sequence for an attack made with a Warp Lightning Blast. Instead, roll a dice to determine the power of that attack. Then roll 6 more dice. For each roll that is equal to or greater than the power of that attack, the target suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `More-more Warp Lightning!`,
        desc: `Before you roll the dice to determine the power of an attack made with a Warp Lightning Blast, if there is a friendly Warlock Engineer within 3" of this unit, you can say that the engineer will increase the weapon's power output. If you do so, roll 12 more dice instead of 6 more dice for that attack. However, for each unmodified roll of 1 on those 12 dice, this unit suffers D3 mortal wounds after the attack has been resolved. The same unit cannot benefit from this ability more than once per phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Skryre Acolytes': {
    effects: [
      {
        name: `Quick-quick Volley!`,
        desc: `This unit can run and still shoot later in the turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Gas Clouds`,
        desc: `Add 1 to wound rolls for attacks made with a Poisoned Wind Globe if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Doomwheel: {
    effects: [
      {
        name: `Rolling Doom`,
        desc: `When this unit moves, it can pass across models with a Wounds characteristic of 3 or less in the same manner as a unit that can fly. In addition, after this unit has moved, roll a dice for each unit that has any models it passed across and for each other unit within 1 " of this unit at the end of the move. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `More-more Speed!`,
        desc: `When you make a normal move with this unit, you can reroll the roll that determines its Move characteristic. However, if any of those dice are an unmodified 1, your opponent makes that normal move with this unit instead of you.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `More-more Warp Bolts!`,
        desc: `Before you determine the Attacks characteristic of Warp Bolts, you can say that the engineer is overcharging the warp lightning generator. If you do so, the Attacks characteristic for that attack is 2D6 instead of D6. However, if you roll a double, this unit suffers 2D6 mortal wounds after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Warplock Jezzails': {
    effects: [
      {
        name: `Warpstone Snipers`,
        desc: `If the unmodified hit roll for an attack made with a Warplock Jezzail is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Pavise`,
        desc: `You can add 1 to hit rolls for attacks made with Warplock Jezzails if this unit remains stationary in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Pavise`,
        desc: `Add 1 to save rolls for attacks made with missile weapons that target this unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Clanrats: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Clawleader. Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Clanrat Standard Bearer. This unit can retreat and still charge later in the turn if it includes any Clanrat Standard Bearers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Clanrat Bellringer. Add 2 to run rolls for this unit if it includes any Clanrat Bellringers.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Seething Swarm`,
        desc: `At the end of the battleshock phase, you can return D3 slain models to this unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  Stormvermin: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Fangleader. Add 1 to the Attacks characteristic of that model's Rusty Halberd.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Stormvermin Standard Bearer. This unit can retreat and still charge later in the turn if it includes any Stormvermin Standard Bearers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Stormvermin Drummer. Add 2 to run rolls for this unit if it includes any Stormvermin Drummers.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Elite Bodyguards`,
        desc: `If a friendly SKAVEN HERO is within 3" of this unit, before you allocate a wound or mortal wound to that HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, roll a dice. Add 2 to the roll if the HERO has the Clans Verminus keyword. On a 4+, that wound or mortal wound is allocated to this unit instead of that HERO and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "Spiteclaw's Swarm": {
    effects: [
      {
        name: `Aversion to Death`,
        desc: `After the first wound or mortal wound is allocated to this unit in any phase, this unit has a ward of 5+ until the end of that phase.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Champion`,
        desc: `The leader of this unit is Krrk the Almost-trusted. Do not take battleshock tests for this unit while it includes Krrk the Almost-trusted.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Champion`,
        desc: `The leader of this unit is Krrk the Almost-trusted. If Skritch Spiteclaw is slain, add 2 to the Attacks characteristic of Krrk's Rusty Spear for the rest of this battle.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Verminlord Warbringer': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Tyrant of Battle'])],
      spells: [keyPicker(spells, ['Dreaded Death Frenzy'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ProtectionOfTheHornedRatEffect,
      {
        name: `Amidst the Seething Tide`,
        desc: `You can reroll wound rolls for attacks made by this unit while it is within 13" of 3 or more friendly SKAVEN units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Fist of Verminus Supremacy`,
        desc: `If the unmodified hit roll for an attack made with a Spike-fist is 6, the Damage characteristic for that attack is 6 instead of 3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Clawlord: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Gnash-gnaw on their Bones!'])],
    },
    effects: [
      {
        name: `Cornered Fury`,
        desc: `Add the number of wounds allocated to this unit to the Attacks characteristic of this unit's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skritch Spiteclaw': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Gnash-gnaw on their Bones!'])],
    },
    effects: [
      {
        name: `There are Always More`,
        desc: `At the start of your hero phase, if this unit is within 13" of a friendly Spiteclaw's Swarm unit, you can return D3 slain models to that unit. You cannot return Krrk the Almost-trusted.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Slynk Skittershank': {
    effects: [
      EshinToxinsEffect,
      RunningDeathEffect,
      {
        name: `Misdirection`,
        desc: `If this unit is within 1" of a friendly Skittershank's Clawpack unit at the start of the combat phase, the strike-first effect applies to this unit in that combat phase. In addition, after this unit has fought for the first time in the combat phase, if this unit is within 1" of a friendly Skittershank's Clawpack unit, this unit can retreat.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "Skittershank's Clawpack": {
    effects: [
      EshinToxinsEffect,
      {
        name: `Kinwhisper's Ratlings`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is infiltrating the foe as a reserve unit. If you do so, when you would set up a friendly Slynk Skittershank during deployment, you can say that it will join this unit infiltrating the foe as a reserve unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Kinwhisper's Ratlings`,
        desc: `At the end of your first movement phase, you must set up this unit on the battlefield, wholly within 6" of a terrain feature and more than 6" from all enemy units. Then, if Slynk Skittershankj oined this unit in reserve, set up that unit within 1" of this unit and more than 6" from all enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      RunningDeathEffect,
    ],
  },
  'Doom-Flayer': {
    effects: [
      {
        name: `Whirling Death`,
        desc: `Add 1 to the Attacks characteristic of Whirling Blades if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `More-more Whirling Death!`,
        desc: `Before you determine the Attacks characteristic of Whirling Blades, you can say that the crew has kicked the generator into overdrive. If you do so, roll 2D6 to determine the Attacks characteristic for that attack instead of D6. However, if you roll either a double or a 7, this unit is destroyed after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hidden Weapon Team`,
        desc: `When you select this unit to be part of your army, you can pick 1 friendly Clanrats or Stormvermin unit that has 10 or more models and is already part of your army to be the unit in which this unit is hiding. Record this information on a separate piece of paper. Do not set up this unit until it is revealed as described next. You can hide up to 1 Doom-Flayer unit in a Clanrats or Stormvermin unit for every 10 models in that Clanratsor Stormvermin unit. Hidden Doom-Flayer units are destroyed if the unit in which they are hiding is destroyed before they are revealed.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Hidden Weapon Team`,
        desc: `At the end of your charge phase, you can reveal this hidden unit if the unit in which it was hiding made a charge move in that phase. If you do so, set up this unit wholly within 3" of the unit in which it was hiding (it can be set up within 3" of any enemy units and can fight in the following combat phase).`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Ratling Gun': {
    effects: [
      {
        name: `More-more Warplead!`,
        desc: `Before you determine the Attacks characteristic of a Ratling Gun, you can say that the crew are releasing its gimbal-limiter. If you do so, the Attacks characteristic for that attack is 4D6+3 instead of 2D6+3. However, if the roll includes any doubles, this unit is destroyed after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hidden Weapon Team`,
        desc: `When you select this unit to be part of your army, you can pick 1 friendly Clanrats or Stormvermin unit that has 10 or more models and is already part of your army to be the unit in which this unit is hiding. Record this information on a separate piece of paper. Do not set up this unit until it is revealed as described next. You can hide up to 1 Ratling Gun unit in a Clanrats or Stormvermin unit for every 10 models in that Clanrats or Stormvermin unit. Hidden Ratling Gun units are destroyed if the unit in which they are hiding is destroyed before they are revealed.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Hidden Weapon Team`,
        desc: `At the start of your shooting phase, you can reveal this hidden unit. If you do so, set up this unit wholly within 3" of the unit in which it was hiding and more than 3" from all enemy units. This unit can shoot in the phase in which it is revealed as long as the unit in which it was hiding did not run in the same turn (it could have retreated).`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Warpfire Thrower': {
    effects: [
      {
        name: `Warpfire`,
        desc: `Do not use the attack sequence for an attack made with a Warpfire Thrower. Instead, roll a dice for each model in the target unit that is within range. For each 4+, the target suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `More-more Warpfire!`,
        desc: `Before you pick the target for an attack made with a Warpfire Thrower, you can say that the crew are disabling the flow regulator. If you do so, increase the Range characteristic to 12" for that attack and add 1 to the roll that determines if an enemy model suffers 1 mortal wound. However, for each unmodified 1, this unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hidden Weapon Team`,
        desc: `When you select this unit to be part of your army, you can pick 1 friendly Clanrats or Stormvermin unit that has 10 or more models and is already part of your army to be the unit in which this unit is hiding. Record this information on a separate piece of paper. Do not set up this unit until it is revealed as described next. You can hide up to 1 Warpfire Thrower unit in a Clanrats or Stormvermin unit for every 10 models in that Clanrats or Stormvermin unit. Hidden Warpfire Thrower units are destroyed if the unit in which they are hiding is destroyed before they are revealed.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Hidden Weapon Team`,
        desc: `At the start of your shooting phase, you can reveal this hidden unit. If you do so, set up this unit wholly within 3" of the unit in which it was hiding and more than 3" from all enemy units. This unit can shoot in the phase in which it is revealed as long as the unit in which it was hiding did not run in the same turn (it could have retreated).`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Warp-Grinder': {
    effects: [
      {
        name: `Tunnel Skulkers`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up tunnelling as a reserve unit. If you do so, when you would set up another friendly SKAVEN unit that is not a MONSTER or a War Machine during deployment, you can say that it will join this unit tunnelling as a reserve unit. 1 unit can join this unit in this way.`,
        when: [DURING_SETUP],
      },
      {
        name: `Tunnel Skulkers`,
        desc: `At the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units. Then, if a friendly SKAVEN unit joined this unit in reserve, set up that unit on the battlefield, wholly within 13" of this unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  Plagueclaw: {
    effects: [
      {
        name: `Barrage of Disease`,
        desc: `The target of an attack made with a Plagueclaw Catapult does not have to be visible to the attacking model. In addition, if the target unit has 10 or more models, add 1 to hit rolls for attacks made with a Plagueclaw Catapult and increase the Damage characteristic to 2D6.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hideous Death`,
        desc: `Add 2 to battleshock rolls for units targeted by any friendly units with this ability during that turn.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Plague Monks': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Bringer-of-the-Word.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can bear an Icon of Entropy. If this unit includes any models bearing Icons of Entropy, each time a model from this unit is slain by an attack made with a melee weapon, before removing that model from play, roll a dice. On a 6, pick 1 enemy unit within 3" of the slain model. That unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Plague Harbinger. Add 1 to run rolls and charge rolls for this unit if it includes any Plague Harbingers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Foetid Weapons`,
        desc: `If the unmodified hit roll for an attack made with a
        melee weapon by this unit is 6, that attack has a Rend
        characteristic of -2 instead of '-'.`,
        when: [COMBAT_PHASE],
      },
      FrenziedAssaultEffect,
      {
        name: `Book of Woes`,
        desc: `In your hero phase, you can pick 1 enemy unit within 13" of this unit's Bringer-of-the-Word and roll a dice. On a 1-2, nothing happens. On a 3-4, that unit suffers 1 mortal wound. On a 5-6, that unit suffers D3 mortal wounds. This ability has no effect on Nurgle units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Plague Censer Bearers': {
    effects: [
      FrenziedAssaultEffect,
      {
        name: `Plague Disciples`,
        desc: `Add 1 to wound rolls for attacks made by this unit if it is wholly within 18" of any friendly Plague Monks units.`,
        when: [COMBAT_PHASE],
      },
      PoisonousFumesEffect,
    ],
  },
  'Plague Priest': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Pestilence-pestilence!'])],
    },
    effects: [FrenziedAssaultEffect, PoisonousFumesEffect],
  },
  'Plague Priest on Plague Furnace': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Pestilence-pestilence!'])],
    },
    effects: [
      PushedIntoBattleEffect,
      ...AltarOfTheHornedRatEffects,
      {
        name: `Great Plague Censer`,
        desc: `Do not use the attack sequence for an attack made with a Great Plague Censer. Instead, pick 1 enemy unit within range and roll a dice. On a 2+, that unit suffers a number of mortal wounds equal to the Great Plague Censer value shown on this unit's damage table.`,
        when: [COMBAT_PHASE],
      },
      PoisonousFumesEffect,
    ],
  },
  'Verminlord Corruptor': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of Pestilence'])],
      spells: [keyPicker(spells, ['Dreaded Plague'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ProtectionOfTheHornedRatEffect,
      {
        name: `Plaguereapers`,
        desc: `If the unmodified hit roll for an attack made with Plaguereapers is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plaguemaster`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this unit. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Grey Seer on Screaming Bell': {
    mandatory: {
      spells: [keyPicker(spells, ['Cracks Call'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ...AltarOfTheHornedRatEffects,
      {
        name: `Avalanche of Energy`,
        desc: `Add the Avalanche of Energy value on this unit's damage table to casting and chanting rolls for this unit.`,
        when: [HERO_PHASE],
      },
      PushedIntoBattleEffect,
      {
        name: `A Stirring Beyond the Veil`,
        desc: `Once per battle, at the start of your hero phase, if 7 or more wounds are allocated to this unit, you can say that the Grey Seer will shatter the Screaming Bell. If you do so, roll a dice. On a 1, this unit is destroyed. On any other roll, add the number of wounds allocated to this unit to the roll.

        Ifthe modified roll is 12 or less, the Screaming Bell is shattered see below). If the modified roll is 13 or more, the Screaming Bell is shattered and you can summon 1 Verminlord to the battlefield and add it to your army. The Verminlord must be set up wholly within 13" of this unit. It can be set up within 3" of an enemy unit if this unit is within 3" of that enemy unit, otherwise it must be set up more than 9" from all enemy units. If this unit's Screaming Bell is shattered, it can no longer attempt to cast Cracks Call and it can no longer use its Peal of Doom ability`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Peal of Doom`,
        desc: `At the start of your hero phase, you can say that this unit will ring its Screaming Bell. If you do so, roll a dice and look up the result below.

        1: Magical Backlash - This unit suffers D3 mortal wounds that cannot be negated.

        2: Unholy Clamour - Add 6" to this unit's Move characteristic until your next hero phase.

        3: Wall of Unholy Sound - Until your next hero phase, subtract 1 from hit rolls for attacks made by enemy units within 13" of any friendly Screaming Bells for which you rolled this result in this phase.

        4: Deafening Peals - Until your next hero phase, roll a dice each time an enemy model is picked to issue a command while it is within 13" of any friendly Screaming Bells for which you rolled this result in this phase. On a 5+, that command cannot be issued.
        
        5: Screaming Crescendo - Until your next hero phase, after this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that unit suffers D6 mortal wounds.
        
        6: Apocalyptic Doom - At the end of this hero phase, roll a dice for each enemy unit within 13" of any friendly Screaming Bells for which you rolled this result in this phase. On a 4+, that unit suffers D3 mortal wounds. `,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Hell Pit Abomination': {
    effects: [
      {
        name: `Avalanche of Flesh`,
        desc: `Do not use the attack sequence for an attack made with an Avalanche of Flesh. Instead, roll a number of dice equal to the number of models in the target unit that are within range. You can reroll any of the dice if this unit made a charge move in the same turn. For each roll that is equal to or greater than the Avalanche of Flesh value shown on this unit's damage table, the target suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      RegeneratingMonstrosityEffect,
      {
        name: `Warpstone Spikes`,
        desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Too Horrible to Die`,
        desc: `The first time this unit is destroyed, before removing it from the battlefield, roll a dice and look up the roll below.

        1: Dead - Remove this unit from play as normal.

        2-4: The Rats Emerge - All units within 3" of this unit suffer D3 mortal wounds. Then remove this unit from play.

        5-6: It's Alive! - This unit is not destroyed. Instead, heal D6 wounds allocated to it, and any wounds or mortal wounds that remain to be allocated to it are negated and have no effect. `,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Master Moulder': {
    mandatory: {
      command_abilities: keyPicker(command_abilities, ['Unleash More-more Beasts!']),
    },
    effects: [
      CrackTheWhipEffect,
      {
        name: `Master Moulder`,
        desc: `In your hero phase, you can pick 1 friendly Clans Moulder Pack unit within 3" of this unit. Heal D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Giant Rats': {
    effects: [
      {
        name: `Wave of Rats`,
        desc: `Improve the Rend characteristic of this unit's Vicious Teeth by 1 if it has 3-5 models. Improve the Rend characteristic of this unit's Vicious Teeth by 2 instead of 1 if it has 6 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Rat Swarms': {
    effects: [
      {
        name: `Endless Tide of Rats`,
        desc: `At the end of the battleshock phase, you can return 1 slain model to this unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Rat Ogors': {
    effects: [
      {
        name: `Rabid Fury`,
        desc: `If the unmodified hit roll for an attack made with Tearing Claws, Blades and Fangs is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Packmasters: {
    effects: [CrackTheWhipEffect],
  },
  'Verminlord Deceiver': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of Assassins'])],
      spells: [keyPicker(spells, ['Dreaded Skitterleap'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      ProtectionOfTheHornedRatEffect,
      {
        name: `Doomstar`,
        desc: `If the unmodified hit roll for an attack made by a Doomstar is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Shrouded In Darkness`,
        desc: `This unit cannot be picked as the target of a shooting attack unless the attacking model is within 9" of this unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Deathmaster: {
    effects: [
      {
        name: `Hidden Killer`,
        desc: `When you select this unit to be part of your army, you can pick 1 friendly Clanrats, Stormvermin or Night Runners unit that is already part of your army to be the unit in which this unit is hiding. Record this information on a separate piece of paper. Do not set up this unit until it is revealed as described next. You cannot hide more than 1 Deathmaster in the same unit.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Hidden Killer`,
        desc: `At the start of a combat phase, if this unit is hidden, you can reveal it. In addition, if the unit in which this unit is hidden is destroyed, you must reveal this unit before the last model in the unit in which it is hidden is removed from play. When you reveal this unit, set it up wholly within 3" of the unit in which it was hidden. If this unit was revealed because the unit in which it was hidden was destroyed, this unit suffers 1 mortal wound after it is set up.`,
        when: [START_OF_COMBAT_PHASE],
      },
      EshinToxinsEffect,
      RunningDeathEffect,
    ],
  },
  'Night Runners': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Nightleader. Add 1 to the Attacks characteristic of that model's Stabbing Blade.`,
        when: [COMBAT_PHASE],
      },
      RunningDeathEffect,
      {
        name: `Slinking Advance`,
        desc: `After deployment but before the first battle round begins, this unit can make a normal move of up to 2D6".`,
        when: [END_OF_SETUP],
      },
      EshinToxinsEffect,
    ],
  },
  'Gutter Runners': {
    effects: [
      GenericEffects.Elite,
      RunningDeathEffect,
      {
        name: `Sneaky Infiltrators`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is infiltrating the foe as a reserve unit. If you do so, at the end of your first movement phase, you must set up this unit wholly within 6" of a terrain feature and more than 9" from all enemy units.`,
        when: [START_OF_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      EshinToxinsEffect,
    ],
  },
}

export default tagAs(Units, 'unit')
