import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_FOUR_START_OF_MOVEMENT_PHASE,
  TURN_FOUR_START_OF_ROUND,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  TURN_THREE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Thanquol on Boneripper`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Staff of the Horned Rat`,
        desc: `Add the Staff of the Horned Rat modifier shown on the damage table above to casting rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warp-amulet`,
        desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warpfire Braziers`,
        desc: `The Attacks characteristic for this model's Warpfire Braziers is equal to double the number of Warpfire Braziers that Boneripper is armed with.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpfire Projectors`,
        desc: `Do not use the attack sequence for an attack made with Warpfire Projectors. Instead, roll X dice for each model in the target unit that is within 8" of this model, where X is equal to the number of Warpfire Projectors this model is armed with. For each 4+ the target unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Warpstone Addiction`,
        desc: `Once in each of your hero phases, when this model attempts to cast a spell, you can say it will consume a warpstone token before you make the casting roll. If you do so, roll 3D6. This roll cannot be re-rolled or modified. If the 3D6 roll is 13, the spell is cast and cannot be unbound, and after the effects of the spell have been resolved this model suffers D6 mortal wounds. If the 3D6 roll was not 13, remove 1 dice of your choice, and then use the remaining 2D6 as the casting roll.`,
        when: [HERO_PHASE],
      },
      {
        name: `Power Behind the Throne`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, until your next hero phase, one friendly SKAVEN HERO other than this model can use the At the Double command ability without a command point being spent; another friendly SKAVEN HERO other than this model can use the Forward to Victory command ability without a command point being spent; and a third friendly SKAVEN HERO other than this model can use the Inspiring Presence command ability without a command point being spent.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Lord Skreech Verminking`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Thirteen-headed One`,
        desc: `At the start of your hero phase, pick 1 of the areas of knowledge for this model to draw upon. The rule for that area of knowledge applies to this model until your next hero phase. You cannot pick the same area of knowledge more than once per battle.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Rat King`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, in that phase you can re-roll wound rolls of 1 for attacks made by friendly SKAVENTIDE units while they are wholly within 13" of a friendly model with this command ability.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Verminlord Warpseer`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Great Manipulators`,
        desc: `If this model is on the battlefield at the start of your hero phase, roll a D6. On a 3+, you receive 1 extra command point. On a 6 you receive D3 extra command points instead of 1.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Scry-orb`,
        desc: `You can re-roll save rolls for attacks that target this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Scry-orb`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 13" of this model and visible to them. That unit suffers D6 mortal wounds, but you cannot use this ability to re-roll save rolls for this model for the rest of the battle.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Forth-forth, Children of the Horned Rat!`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly model with this command ability. Do not take battleshock tests for friendly SKAVEN units while they are wholly within 26" of that model in that phase.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Grey Seer`,
    effects: [
      {
        name: `Warpstone Tokens`,
        desc: `Once in each of your hero phases, when this model attempts to cast a spell, you can say it will consume a warpstone token before you make the casting roll. If you do so, roll 3D6. This roll cannot be re-rolled or modified. If the 3D6 roll is 13, the spell is cast and cannot be unbound, and after the effects of the spell have been resolved this model is slain. If the 3D6 roll was not 13, remove 1 dice of your choice, and then use the remaining 2D6 as the casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arch-Warlock`,
    effects: [
      {
        name: `More-more Stormcage!`,
        desc: `Before you make a hit roll for an attack with a Stormcage Halberd, you can say that the engineer has overloaded its generator. If you do so, the Damage characteristic for that attack is D6 instead of D3. However, if you do so and the unmodified hit roll is 1, that attack fails and this model suffers D6 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpfire Gauntlet`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 8" of this model and visible to them, and roll a D6. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warlock Engineer`,
    effects: [
      {
        name: `More-more Warp-energy!`,
        desc: `Before you make a hit roll for an attack with a Warp-energy Blade, you can say that the engineer has overloaded its generator. If you do so, the Damage characteristic for that attack is D6 instead of D3. However, if you do so and the unmodified hit roll is 1, that attack fails and this model suffers D6 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warlock Bombardier`,
    effects: [
      {
        name: `More-more Doomrocket!`,
        desc: `Before you make a hit roll for an attack with a Doomrocket, you can say that the engineer has overloaded its warhead. If you do so, the Damage characteristic for that attack is 2D6 instead of D6. However, if you do so and the unmodified hit roll is 1, that attack fails and this model suffers 2D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Stormfiends`,
    effects: [
      {
        name: `Doomflayer Gauntlets`,
        desc: `Add 1 to hit rolls for attacks made with Doomflayer Gauntlets if the attacking model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grinderfist Tunnellers`,
        desc: `If a unit includes any models equipped with Grinderfists, instead of setting up that unit on the battlefield, you can place it to one side and say that it is set up underground as a reserve unit.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Grinderfist Tunnellers`,
        desc: `At the end of each of your movement phases, roll a D6 for each underground reserve unit. On a 1 or 2, that unit remains underground in reserve (roll for it again in your next movement phase). On a 3+ set up that unit on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Grinderfist Tunnellers`,
        desc: `Any underground reserve units that are still underground and which fail to arrive at the end of your third movement phase suffer D6 mortal wounds. Any surviving models are then set up on the battlefield more than 9" from any enemy units.`,
        when: [TURN_THREE_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Shock Gauntlets`,
        desc: `If the unmodified hit roll for an attack made with Shock Gauntlets is 6, that attack inflicts D6 hits on that target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpfire Projectors`,
        desc: `Do not use the attack sequence for an attack made with Warpfire Projectors. Instead, roll a D6 for each model in the target unit that is within 8" of the attacking model. For each 4+ the target unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Warpstone-laced Armour`,
        desc: `A model wearing Warpstone-laced Armour has a Wounds characteristic of 7 instead of 6.`,
        when: [DURING_GAME],
      },
      {
        name: `Windlaunchers`,
        desc: `Add 1 to hit rolls for attacks made with Windlaunchers if the target has 10 or more models. In addition, Windlaunchers can target enemy units that are not visible to the attacking model.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warp Lightning Cannon`,
    effects: [
      {
        name: `Warp Lightning Blast`,
        desc: `Do not use the attack sequence for an attack made with a Warp Lightning Blast. Instead roll a D6; that roll determines the power of that attack. Then roll 6 more dice. The target suffers 1 mortal wound for each of those rolls that is equal to or greater than the power of that attack.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `More-more Warp Lightning!`,
        desc: `Before you roll the dice that determines the power of a Warp Lightning Blast for this model, if there is a friendly WARLOCK ENGINEER within 3" of this model you can say that the engineer will increase the weapon's power output. If you do so, roll 12 more dice instead of 6 more dice for that attack. However, after the attack has been resolved, this model suffers D3 mortal wounds for each unmodified roll of 1 on those 12 dice. A single WARLOCK ENGINEER cannot be used to increase the power output of more than one Warp Lightning Blast in the same phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Skryre Acolytes`,
    effects: [
      {
        name: `Quick-quick Volley!`,
        desc: `This unit can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Gas Clouds`,
        desc: `Add 1 to hit rolls for attacks made with a Poisoned Wind Globe if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Doomwheel`,
    effects: [
      {
        name: `Rolling Doom`,
        desc: `When this model makes a normal move, it can pass across models with a Wounds characteristic of 3 or less in the same manner as a model that can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Rolling Doom`,
        desc: `After this model has made a normal move or a charge move, roll a D6 for each unit that has any models it passed across, and each other unit that is within 1" of this model at the end of the move. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `More-more Speed!`,
        desc: `When this model makes a normal move, you can re-roll the 4D6 roll that determines its Move characteristic. However, if you do so and the new roll includes any dice with an unmodified roll of 1, then your opponent carries out that normal move for that model instead of you.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `More-more Warp Bolts!`,
        desc: `Before you determine the Attacks characteristic for this model's Warp Bolts attack, you can say that the engineer is overcharging the warp lightning generator. If you do so, the Attacks characteristic for that attack is 2D6 instead of D6. However, if you do so and you roll a double, this model suffers 2D6 mortal wounds after all of the attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warplock Jezzails`,
    effects: [
      {
        name: `Warpstone Snipers`,
        desc: `If the unmodified hit roll for an attack made with a Warplock Jezzail is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Pavise`,
        desc: `You can re-roll hit rolls for attacks made with this unit's Warplock Jezzails if this unit has not made a move in the same turn. In addition, add 2 to save rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Clanrats`,
    effects: [
      {
        name: `Clanshields`,
        desc: `Add 1 to save rolls for attacks that target a unit that carries Clanshields while it has 10 or more models.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Brood Horror`,
    effects: [
      {
        name: `Renegerating Monstrosity`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skaven Clawlord on Brood Horror`,
    effects: [
      {
        name: `Renegerating Monstrosity`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mighty Warlord`,
        desc: `Add 1 to the Bravery characteristic of friendly Clans Verminus units while they are wholly within 13" of any friendly models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Gnash-gnaw on their Bones`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Clans Verminus unit wholly within 13" of a friendly model with this command ability. Add 1 to the Attacks characteristic of melee weapons used by that unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skaven Wolf Rats`,
    effects: [
      {
        name: `Blood-crazed`,
        desc: `Do not take battleshock tests for this unit while it is within 3" of an enemy unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Snapping Jaws`,
        desc: `Add 1 to wound rolls for attacks made by this unit if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warpgnaw Verminlord`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Realm Guide`,
        desc: `Instead of setting up this model on the battlefield, you can place this model to one side and say that it is moving through the cracks in reality as a reserve unit.
        
        Any units moving through the cracks in reality that are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [START_OF_SETUP, TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Realm Guide`,
        desc: `If this unit is placed in reserve, at the end of your movement phase, set up this model wholly within 6" of a Gnawhole and more than 9" from any enemy models. This counts as this model's move for that movement phase.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Stormvermin`,
    effects: [
      {
        name: `Clanshields`,
        desc: `Add 1 to save rolls for attacks that target a unit that carries Clanshields while it has 10 or more models.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spiteclaw's Swarm`,
    effects: [
      {
        name: `Aversion to Death`,
        desc: `After the first wound or mortal wound is allocated to this unit in any phase, you can roll a D6 each time you allocate a further wound or mortal wound to this unit in that phase. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Krrk the Almost-trusted`,
        desc: `The leader of this unit is Krrk the Almost-trusted. Do not take battleshock tests for this unit while it includes Krrk the Almost-trusted. In addition, if Skritch Spiteclaw is slain, add 2 to the Attacks characteristic of Krrk's Rusty Spear for the rest of this battle.`,
        when: [BATTLESHOCK_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminlord Warbringer`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Amidst the Seething Tide`,
        desc: `You can re-roll wound rolls for attacks made by this model while it is within 13" of 13 or more friendly SKAVEN models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Fist of Verminus Supremacy`,
        desc: `If the unmodified wound roll for an attack made with this model's Spike-fist is 6, add 4 to the damage inflicted by that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tyrant of Battle`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can re- roll hit and wound rolls of 1 for friendly CLANS VERMINUS units while they are wholly within 13" of that model.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Clawlord`,
    effects: [
      {
        name: `Cornered Fury`,
        desc: `Add the number of wounds allocated to this model to the Attacks characteristic of this model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gnash-gnaw on their Bones!`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly CLANS VERMINUS unit wholly within 13" of a friendly model with this command ability. Add 1 to the Attacks characteristic of melee weapons used by that unit in that phase. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skritch Spiteclaw`,
    effects: [
      {
        name: `There are Always More`,
        desc: `At the start of your hero phase, if this model is within 13" of a friendly SPITECLAW'S SWARM , you can return D3 slain models to that unit (you cannot return Krrk the Almost-trusted). Set up the returning models one at a time within 1" of a model from that unit (this can be a model you returned to the unit earlier in the same phase). Returning models can only be set up within 3" of an enemy unit if one or more models from the same unit are already within 3" of that enemy unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Gnash-gnaw on their Bones!`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly CLANS VERMINUS unit wholly within 13" of a friendly model with this command ability. Add 1 to the Attacks characteristic of melee weapons used by that unit in that phase. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Doom-Flayer`,
    effects: [
      {
        name: `Whirling Death`,
        desc: `Add 1 to hit rolls for attacks made with this model's Whirling Blades if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `More-more Whirling Death!`,
        desc: `Before you determine the Attacks characteristic for this model's Whirling Blades, you can say that the crew have kicked its generator into overdrive. If you do so, roll 2D6 to determine the Attacks characteristic for that attack instead of D6. However, if you do so and the roll that determines the Attacks characteristic is either a double or a roll of 7, this model is slain after all of the attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ratling Gun`,
    effects: [
      {
        name: `More-more Warplead!`,
        desc: `Before you determine the Attacks characteristic for this model's Ratling Gun, you can say that the crew are releasing its gimbal-limiter. If you do so, double the Attacks characteristic for that attack. However, if you do so and the roll that determines the Attacks characteristic is a double, this model is slain after all of the attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warpfire Thrower`,
    effects: [
      {
        name: `Warpfire`,
        desc: `Do not use the attack sequence for an attack made with a Warpfire Thrower. Instead, roll a D6 for each model in the target unit that is within 8" of the attacking model. For each 4+ the target unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `More-more Warpfire!`,
        desc: `Before you pick the target for this model's Warpfire Thrower, you can say that the crew are disabling the flow regulator. If you do so, roll 2 dice for each enemy model within 8" of this model instead of 1 dice. However, if you do so, you must roll a D6 after the dice have been rolled to see if the Warpfire Thrower inflicts any mortal wounds, and on a 1 or 2 this model is slain.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warp-Grinder`,
    effects: [
      {
        name: `Tunnel Skulkers`,
        desc: `Instead of setting up this model on the battlefield, you can place this model to one side and say that it is set up tunnelling as a reserve unit. If you do so, when you would set up another friendly SKAVENTIDE unit that is not a MONSTER or a WAR MACHINE, instead of setting up that unit on the battlefield, you can say that it is joining this model tunnelling as a reserve unit. Only 1 unit can join this model in this way.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Tunnel Skulkers`,
        desc: `At the end of any of your movement phases, if this model is tunnelling, it can arrive on the battlefield. If it does so, set up this model anywhere on the battlefield more than 9" from any enemy models, and then set up any unit that joined this model wholly within 13" of this model and more than 9" from any enemy models. Then roll a D6 for this model and any unit that joined it. On a 1 or 2, that unit suffers D6 mortal wounds.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Tunnel Skulkers`,
        desc: `Any tunnelling reserve units that fail to arrive on the battlefield before the start of your fourth movement phase are destroyed.`,
        when: [TURN_FOUR_START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Plagueclaw`,
    effects: [
      {
        name: `Barrage of Disease`,
        desc: `A Plagueclaw Catapult can target enemy units that are not visible to the attacking model. In addition, add 1 to hit rolls and increase the Damage characteristic to 2D6 for attacks made with a Plagueclaw Catapult if the target has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hideous Death`,
        desc: `Subtract 1 from the Bravery characteristic of a unit targeted by any Plagueclaw Catapults until the end of the turn.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Plague Monks`,
    effects: [
      {
        name: `Pair of Foetid Blades`,
        desc: `You can re-roll hit rolls for attacks made with a pair of Foetid Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frenzied Assault`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Book of Woes`,
        desc: `In your hero phase, you can pick 1 enemy unit within 13" of this unit's Bringer-of-the-Word and roll a D6. On a 4+ that unit suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds instead of 1. This ability has no effect on CLANS PESTILENS units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plague Censer Bearers`,
    effects: [
      {
        name: `Frenzied Assault`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plague Disciples`,
        desc: `You can re-roll hit rolls for attacks made by this ABILITIES unit while it is wholly within 18" of any friendly PLAGUE MONKS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plague Disciples`,
        desc: `You can re-roll battleshock tests for this unit while it is wholly within 18" of any friendly PLAGUE MONKS units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Poisonous Fumes`,
        desc: `At the end of the combat phase, roll 1 dice for each unit within 3" of any units with this ability. On a 4+ the unit being rolled for suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds instead of 1. This ability has no effect on CLANS PESTILENS units.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Plague Priest`,
    effects: [
      {
        name: `Plague Prayers`,
        desc: `In your hero phase, this model can chant one of the following prayers. If it does so, pick 1 of the prayers and then make a prayer roll by rolling a dice. On a 1, this model suffers 1 mortal wound and the prayer is not answered. On a 2, the prayer is not answered. On a 3+ the prayer is answered.
        
        Disease-disease!: If this prayer is answered, pick 1 enemy unit within 13" of this model, and roll 1 dice for each model in that unit. For each 6, that unit suffers 1 mortal wound. This prayer has no effect on CLANS PESTILENS units.
        
        Pestilence-pestilence!: If this prayer is answered, pick a point on the battlefield that is within 13" of this model. Roll a D6 for each unit within 3" of that point. On 4+ that unit suffers D3 mortal wounds. This prayer has no effect on CLANS PESTILENS units.`,
        when: [HERO_PHASE],
      },
      {
        name: `Frenzied Assault`,
        desc: `Add 1 to the Attacks characteristic of this model's melee weapons if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Poisonous Fumes`,
        desc: `At the end of the combat phase, roll 1 dice for each unit within 3" of any units with this ability. On a 4+ the unit being rolled for suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds instead of 1. This ability has no effect on CLANS PESTILENS units.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Plague Priest on Plague Furnace`,
    effects: [
      {
        name: `Altar of the Horned Rat`,
        desc: `Do not take battleshock tests for friendly SKAVENTIDE units while they are wholly within 13" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Great Plague Censer`,
        desc: `Do not use the attack sequence for an attack made with this model's Great Plague Censer. Instead pick 1 enemy unit within 3" of this model and roll a D6. On a 2+ that unit suffers a number of mortal wounds equal to the Great Plague Censer value shown on the damage table above.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Noxious Prayers`,
        desc: `In your hero phase, this model can chant one of the following prayers. If it does so, pick 1 of the prayers and then make a prayer roll by rolling a dice. On a 1, this model suffers 1 mortal wound and the prayer is not answered. On a 2, the prayer is not answered. On a 3+ the prayer is answered.
        
        Filth-filth!: If this prayer is answered, pick 1 friendly CLANS PESTILENS unit wholly within 13" of this model. You can re-roll wound rolls for attacks made by that unit until your next hero phase.
        
        Rabid-rabid!: If this prayer is answered, pick 1 friendly CLANS PESTILENS unit wholly within 13" of this model. Add 1 to the Attacks characteristic of melee weapons used by that unit until your next hero phase. You cannot pick the same unit to be affected by this prayer more than once per hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Poisonous Fumes`,
        desc: `At the end of the combat phase, roll 1 dice for each unit within 3" of any units with this ability. On a 4+ the unit being rolled for suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds instead of 1. This ability has no effect on CLANS PESTILENS units.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Pushed into Battle`,
        desc: `This model cannot move unless it starts the move within 6" of 10 or more friendly SKAVENTIDE models. In addition, this model's Rusty Spikes have an Attacks characteristic of 2D6 instead of D6 if this model made a charge move in the same turn.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminlord Corruptor`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Plaguereapers`,
        desc: `If the unmodified hit roll for an attack made with this model's Plaguereapers is 6, that attack inflicts 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plaguemaster`,
        desc: `At the end of the combat phase, roll 1 dice for each enemy unit within 1" of this model. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Lord of Pestilence`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can re-roll hit rolls for friendly CLANS PESTILENS units while they are wholly within 13" of that model.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Grey Seer on Screaming Bell`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Altar of the Horned Rat`,
        desc: `Do not take battleshock tests for friendly SKAVENTIDE units while they are wholly within 13" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Pushed into Battle`,
        desc: `This model cannot move unless it starts the move within 6" of 10 or more friendly SKAVENTIDE models. In addition, this model's Rusty Spikes have an Attacks characteristic of 2D6 instead of D6 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Peal of Doom`,
        desc: `At the start of your hero phase, roll 2D6 for this model and look up the result on the warscroll.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Hell Pit Abomination`,
    effects: [
      {
        name: `Avalanche of Flesh`,
        desc: `Do not use the attack sequence for an attack made with an Avalanche of Flesh. Instead, roll a number of dice equal to the number of models from the target unit within 3" of the attacking model. You can re-roll any of the dice if this model made a charge move in the same turn. The target unit suffers 1 mortal wound for each roll that is equal to or greater than the Avalanche of Flesh value shown on this model's damage table.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Regenerating Monstrosity`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Warpstone Spikes`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+ ignore the effects of that spell on this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Too Horrible to Die`,
        desc: `The first time this model is slain, before removing it from the battlefield, roll a D6 and look up the roll on warscroll.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Master Moulder`,
    effects: [
      {
        name: `Crack the Whip`,
        desc: `dd 1 to hit rolls for attacks made with melee weapons by friendly CLANS MOULDER PACK units while they are wholly within 12" of any models with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crack the Whip`,
        desc: `Double the Bravery characteristic of friendly CLANS MOULDER PACK units while they are wholly within 12" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Master Moulder`,
        desc: `In your hero phase, you can pick 1 friendly CLANS MOULDER PACK model within 3" of this model. Heal D3 wounds allocated to that model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unleash More-more Beasts!`,
        desc: `You can use this command ability when a friendly CLANS MOULDER PACK unit is destroyed if a friendly model with this command ability is on the battlefield. If you do so, roll a D6. On a 5+ a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within your territory and wholly within 6" of the edge of the battlefield, more than 9" from any enemy units. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Giant Rats`,
    effects: [
      {
        name: `Wave of Rats`,
        desc: `While a unit of Giant Rats has 10 or more models, the Range characteristic of its Vicious Teeth is 2" instead of 1". While a unit of Giant Rats has 20 or more models, the Range characteristic of its Vicious Teeth is 3" instead of 1".`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rat Swarms`,
    effects: [
      {
        name: `Endless Tide of Rats`,
        desc: `In your hero phase you can return 1 slain model to this unit. Set up the returning model within 1" of this unit. The returning model can only be set up within 3" of an enemy unit if this unit is already within 3" of that enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Rat Ogors`,
    effects: [
      {
        name: `Rabid Fury`,
        desc: `If the unmodified hit roll for an attack made with Tearing Claws, Blades and Fangs is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Packmasters`,
    effects: [
      {
        name: `Crack the Whip`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly CLANS MOULDER PACK units while they are wholly within 12" of any models with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crack the Whip`,
        desc: `Double the Bravery characteristic of friendly CLANS MOULDER PACK units while they are wholly within 12" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Verminlord Deceiver`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Terrifying`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Doomstar`,
        desc: `A Doomstar has a Damage characteristic of D6 instead of D3 if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Shrouded In Darkness`,
        desc: `Subtract 2 from hit rolls for attacks made with missile weapons that target this model.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lord of Assassins`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can re-roll wound rolls for friendly CLANS ESHIN units while they are wholly within 13" of that model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Deathmaster`,
    effects: [
      {
        name: `Hidden Killer`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in hiding as a reserve unit. If you do so, at the start of a combat phase, you can set up this model within 1" of a friendly SKAVENTIDE unit that has 5 or more models and a Wounds characteristic of 1. If this model is not set up on the battlefield before the start of the fourth battle round, it is slain.`,
        when: [START_OF_SETUP, START_OF_COMBAT_PHASE, TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Running Death`,
        desc: `This model can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Throwing Stars`,
        desc: `If the unmodified hit roll for an attack made with Eshin Throwing Stars is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Night Runners`,
    effects: [
      {
        name: `Running Death`,
        desc: `This unit can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Throwing Weapons`,
        desc: `If the unmodified hit roll for an attack made with Eshin Throwing Weapons is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Slinking Advance`,
        desc: `After armies are set up, but before the first battle round begins, you can move this unit up to 2D6".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Gutter Runners`,
    effects: [
      {
        name: `Throwing Stars`,
        desc: `If the unmodified hit roll for an attack made with Eshin Throwing Stars is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Running Death`,
        desc: `This unit can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Sneaky Infiltrators`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is infiltrating in reserve. If you do so, at the end of your first movement phase, you must set up this unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [START_OF_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Fleshmeld Menagerie`,
    effects: [
      {
        name: `More-more-more Beasts!`,
        desc: `When the Master Moulder from this battalion uses the Unleash More- more Beasts! command ability for a unit from the same battalion that has been destroyed, a new unit is added to your army on a roll of 4+ instead of 5+.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Claw-horde`,
    effects: [
      {
        name: `Claw-picked`,
        desc: `When the CLAWLORD from this battalion use the Gnash-gnaw on their Bones! command ability, instead of picking 1 unit wholly within 13" of the CLAWLORD, you can pick all of the units from the same battalion that are wholly within 13" of the CLAWLORD.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Slinktalon`,
    effects: [
      {
        name: `Murder-slay, Now-now!`,
        desc: `If the DEATHMASTER from this battalion is set up in hiding as a reserve unit, in the combat phase in which it is set up on the battlefield you can re-roll hit rolls for attacks made by units from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Virulent Procession`,
    effects: [
      {
        name: `Verminous Infestation`,
        desc: `At the start of your hero phase, pick 1 terrain feature within 13" of this battalion's VERMINLORD CORRUPTOR. Roll a D6 for each enemy unit within 3" of that terrain feature. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpcog Convocation`,
    effects: [
      {
        name: `Arkhspark Voltik`,
        desc: `In your shooting phase, you can pick 1 WARP LIGHTNING CANNON from this enginecoven that is within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion. If you do so, subtract 1 from the power of that WARP LIGHTNING CANNON's Warp Lightning Blast in that shooting phase (to a minimum power of 1).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gascloud Chokelung`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by this enginecoven's SKRYRE ACOLYTES and STORMFIENDS armed with Windlaunchers while they are wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gautfyre Skorch`,
        desc: `Up to 2 units can join each WARP- GRINDER from this enginecoven instead of only 1, as long as both of the units come from the same enginecoven as the WARP-GRINDER that they join tunnelling.`,
        when: [DURING_GAME],
      },
      {
        name: `Rattlegauge Warplock`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by this enginecoven's WARPLOCK JEZZAILS and RATLING GUNS while they are wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Whyrlblade Threshik`,
        desc: `You can move a unit from this enginecoven an extra 3" when it starts the move wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Congregation of Filth`,
    effects: [
      {
        name: `Plague Altar`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a PLAGUE MONKS unit from this battalion while it is wholly within 18" of the same battalion's PLAGUE PRIEST. On a 6 that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Foulrain Congregation`,
    effects: [
      {
        name: `Foetid Blessings`,
        desc: `Add 1 to wound rolls for attacks made with missile weapons by units in this battalion while they are within 13" of the same battalion's PLAGUE PRIEST.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Plaguesmog Congregation`,
    effects: [
      {
        name: `Poisonous Miasma`,
        desc: `You can re-roll the dice that determines if an enemy unit suffers any mortal wounds when you use the Poisonous Fumes ability if that enemy unit is within 3" of a unit from this battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
