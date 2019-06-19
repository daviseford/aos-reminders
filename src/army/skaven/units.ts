import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  START_OF_HERO_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  MOVEMENT_PHASE,
  COMBAT_PHASE,
  BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Thanquol on Boneripper`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
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
        desc: `The Attacks characteristic for this model’s Warpfire Braziers is equal to double the number of Warpfire Braziers that Boneripper is armed with.`,
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
        name: `Command Ability: Power Behind the Throne`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, until your next hero phase, one friendly SKAVEN HERO other than this model can use the At the Double command ability without a command point being spent; another friendly SKAVEN HERO other than this model can use the Forward to Victory command ability without a command point being spent; and a third friendly SKAVEN HERO other than this model can use the Inspiring Presence command ability without a command point being spent.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord Skreech Verminking`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
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
        name: `Command Ability: The Rat King`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, in that phase you can re-roll wound rolls of 1 for attacks made by friendly SKAVENTIDE units while they are wholly within 13" of a friendly model with this command ability.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Clanrats`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stormvermin`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spiteclaw's Swarm`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Verminlord Warbringer`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Clawlord`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skaven Clawlord on Brood Horror`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skritch Spiteclaw`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Doomwheel`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warp Lightning Cannon`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Doom-Flayer`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ratling Gun`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpfire Thrower`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warp-Grinder`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Poisoned Wind Mortar Weapon Team`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skryre Acolytes`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warplock Jezzails`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stormfiends`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warlock Engineer`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warlock Bombardier`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arch-Warlock`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plagueclaw`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plague Monks`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plague Censer Bearers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plague Priest`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plague Priest on Plague Furnace`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Verminlord Corruptor`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brood Horror`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hell Pit Abomination`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Master Moulder`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wolf Rats`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Giant Rats`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Rat Swarms`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Rat Ogors`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Packmasters`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: `Skaven Chieftain With Battle Standard`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skavenslaves`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Deathrunner`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Verminlord Deceiver`,
    effects: [
      {
        name: `Protection of the Horned Rat`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+ that wound or mortal wound is negated.`,
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
        name: `Command Ability: Lord of Assassins`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can re-roll wound rolls for friendly CLANS ESHIN units while they are wholly within 13" of that model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Deathmaster`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Night Runners`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gutter Runners`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
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
        desc: `At the start of your hero phase, pick 1 terrain feature within 13" of this battalion’s VERMINLORD CORRUPTOR. Roll a dice for each enemy unit within 3" of that terrain feature. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpcog Convocation`,
    effects: [
      {
        name: `Arkhspark Voltik`,
        desc: `In your shooting phase, you can pick 1 WARP LIGHTNING CANNON from this enginecoven that is within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH- WARLOCK from the same battalion. If you do so, subtract 1 from the power of that WARP LIGHTNING CANNON’s Warp Lightning Blast in that shooting phase (to a minimum power of 1).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gascloud Chokelung`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by this enginecoven’s SKRYRE ACOLYTES and STORMFIENDS armed with Windlaunchers while they are wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH- WARLOCK from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gautfyre Skorch`,
        desc: `Up to 2 units can join each WARP- GRINDER from this enginecoven instead of only 1, as long as both of the units come from the same enginecoven as the WARP-GRINDER that they join tunnelling.`,
        when: [DURING_GAME],
      },
      {
        name: `Rattlegauge Warplock`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by this enginecoven’s WARPLOCK JEZZAILS and RATLING GUNS while they are wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH- WARLOCK from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Whyrlblade Threshik`,
        desc: `You can move a unit from this enginecoven an extra 3" when it starts the move wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH- WARLOCK from the same battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Congregation of Filth`,
    effects: [
      {
        name: `Plague Altar`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a PLAGUE MONKS unit from this battalion while it is wholly within 18" of the same battalion’s PLAGUE PRIEST. On a 6 that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Foulrain Congregation`,
    effects: [
      {
        name: `Foetid Blessings`,
        desc: `Add 1 to wound rolls for attacks made with missile weapons by units in this battalion while they are within 13" of the same battalion’s PLAGUE PRIEST.`,
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
