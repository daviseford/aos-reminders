import GenericEffects from 'army/generic/effects'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_DURING_TURN,
  TURN_TWO_DURING_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { StabEmGoodEffect } from './traits'

const LoonbossEffects = [
  {
    name: `Dead Tricksy`,
    desc: `Subtract 1 from hit rolls for attacks that target this model.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  StabEmGoodEffect,
]
const GrotBaseEffects = [
  {
    name: `Gong Basher`,
    desc: `Add 2 to run rolls for a unit that includes any Gong Bashers.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Moonclan Flag Bearers`,
    desc: `Add 1 to the Bravery characteristic of a unit that includes any Moonclan Flag Bearers.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Bad Moon Icon Bearers`,
    desc: `Add 1 to save rolls for attacks made with missile weapons that target a unit that includes any Bad Moon Icon Bearers.`,
    when: [SHOOTING_PHASE],
  },
  {
    name: `Backstabbing Mob`,
    desc: `Add 1 to wound rolls for attacks made with melee weapons by this unit while it has at least 15 models. Add 2 to the wound rolls made with melee weapons by this unit instead while it has at least 30 models.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Netters`,
    desc: `Subtract 1 from hit rolls for attacks made by enemy models while they are within 2" of any friendly models with a Barbed Net.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
]
const FanaticsBaseEffects = [
  {
    name: `Whirling Death`,
    desc: `This unit fights at the start of the combat phase, before the players pick any other units to fight in that combat phase. This unit cannot fight again in the combat phase unless an ability or spell allows it to fight more than once.`,
    when: [START_OF_CHARGE_PHASE],
  },
  {
    name: `Splat!`,
    desc: `If the charge roll for this unit is a double, after the charge move (or after the charge fails), this unit suffers 1 mortal wound and each other unit within 1" of this unit suffers D3 mortal wounds.`,
    when: [CHARGE_PHASE],
  },
]
const HallucinogenicFungusBrewsEffects = [
  {
    name: `Hallucinogenic Fungus Brews`,
    desc: `Add 2 to save rolls for attacks that target this model.`,
    when: [TURN_ONE_DURING_TURN],
  },
  {
    name: `Hallucinogenic Fungus Brews`,
    desc: `Add 1 to save rolls for attacks that target this model.`,
    when: [TURN_TWO_DURING_TURN],
  },
]
const RedcapMushroomsEffect = {
  name: `Redcap Mushrooms`,
  desc: `Once per battle, in your hero phase, you can say that this model is eating a redcap mushroom. If you do so, you can reroll hit and wound rolls for this model's Moon-cutta or Moonclan Stabba until your next hero phase.`,
  when: [HERO_PHASE],
}
const WatchOutEffect = {
  name: `Watch Out!`,
  desc: `If a Mangler Squig is slain, before the model is removed from play roll a D6 for each unit within 6" of this model. On a 4+ that unit suffers D3 mortal wounds.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const KersplatEffect = {
  name: `Ker-splat!`,
  desc: `Add 1 to hit rolls for attacks made with Mangler Squigs Balls and Chains if this model made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const SquigsGoWildEffect = {
  name: `Squigs Go Wild`,
  desc: `Roll a D6 each time a Cave Squig model from this unit flees, before the model is removed from play. On a 4+ the nearest other unit within 6" of the fleeing model suffers 1 mortal wound. If two or more such units are equally close, you can pick which suffers the mortal wound.`,
  when: [BATTLESHOCK_PHASE],
}
const SlipperyGitEffect = {
  name: `Slippery Git`,
  desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this model while it is within 3" of a friendly MOONCLAN unit with 3 or more models.`,
  when: [SHOOTING_PHASE],
}
const getSpiderVenomEffect = (attack: `'s Fangs` | ``, mw: `1` | `D3`) => {
  const plural = mw === `1` ? `` : `s`
  return {
    name: `Spider Venom`,
    desc: `If the unmodified hit roll for an attack made by this model${attack} is 6, that attack inflicts ${mw} mortal wound${plural} on the target and the attack sequence ends (do not make a wound or save roll).`,
    when: [COMBAT_PHASE],
  }
}
const TerribleStenchEffect = {
  name: `Terrible Stench`,
  desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this unit.`,
  when: [COMBAT_PHASE],
}
const RegenerationEffect = {
  name: `Regeneration`,
  desc: `In your hero phase, you can roll a D6 for this unit. If you do so, on a 4+ heal up to D3 wounds allocated to this unit.`,
  when: [HERO_PHASE],
}
const MagicalResistanceEffect = {
  name: `Magical Resistance`,
  desc: `Each time this unit is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+, ignore the effects of that spell or endless spell on this model.`,
  when: [HERO_PHASE],
}
const ReassuringPresenceEffect = {
  name: `Reassuring Presence`,
  desc: `Add 1 to the Bravery characteristic of friendly GLOOMSPITE GITZ units that are wholly within 18" of any friendly models with this ability.`,
  when: [BATTLESHOCK_PHASE],
}
const SquigglyBeastFollowersEffect = {
  name: `Squiggly-beast Followers`,
  desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of any friendly models with this ability. If the roll is equal to or greater than the number of models in that enemy unit, that enemy unit suffers 1 mortal wound.`,
  when: [START_OF_COMBAT_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Skragrott, The Loonking`,
    effects: [
      {
        name: `Babbling Wand`,
        desc: `If Skragrott is your general and is on the battlefield at the start of your hero phase, roll a D6. On a 4+ you receive D3 extra command points.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Da Moon Onna Stikk`,
        desc: `If any wounds inflicted by Da Moon Onna Stikk are allocated to an enemy model and not negated, that enemy model suffers 1 mortal wound at the end of each battle round (even if the wounds inflicted by Da Moon Onna Stikk are subsequently healed).`,
        when: [END_OF_ROUND],
      },
      {
        name: `Loonking's Crown`,
        desc: `Add 1 to casting and unbinding rolls for Skragrott.`,
        when: [HERO_PHASE],
      },
      {
        name: `Loonking's Crown`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to this model. On a 4+ that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Nikkit! Nikkit!`,
        desc: `Casting value of 8. Pick 1 enemy model within 18" of the caster that is visible to them. The unit that model belongs to suffers D3 mortal wounds. In addition, if that model has an artefact of power and the casting roll was 10+, that model's artefact of power can no longer be used (if it was used to enhance a weapon, that weapon reverts to its normal form)`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `The Loonking's Entreaty`,
        desc: `You can use this command ability once per battle if this model is your general and on the battlefield, before you roll the dice to determine how far the Bad Moon moves that battle round. If you do so, you can choose for the Bad Moon to either not move that battle round, or to make 1 move or 2 moves that battle round (do not roll the dice to determine how far it moves).`,
        when: [START_OF_ROUND],
        command_ability: true,
      },
    ],
  },
  {
    name: `Loonboss`,
    effects: [...LoonbossEffects],
  },
  {
    name: `Loonboss on Mangler Squigs`,
    effects: [
      RedcapMushroomsEffect,
      WatchOutEffect,
      {
        name: `Bite Da Moon!`,
        desc: `You can use this command ability at the start of a combat phase. If you do so, pick 1 friendly model with this command ability. In that combat phase you can add 1 to wound rolls for friendly SQUIG units while they are wholly within 18" of that model.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      KersplatEffect,
    ],
  },
  {
    name: `Loonboss on Giant Cave Squig`,
    effects: [
      RedcapMushroomsEffect,
      {
        name: `Let's Get Bouncing!`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, pick 1 friendly model with this command ability. All friendly SQUIG units wholly within 12" of that model at the start of that phase can move an extra 3" if they make a move in that phase. A unit cannot benefit from this command ability more than once per movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Loonboss with Giant Cave Squig`,
    effects: [...LoonbossEffects],
  },
  {
    name: `Madcap Shaman`,
    effects: [
      {
        name: `Madcap Mushrooms`,
        desc: `Once per battle, in your hero phase, you can attempt to cast one additional spell with a Madcap Shaman. If you do so, and the casting roll is a double, this model suffers D3 mortal wounds after the effects of the spell (if any) have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Night Shroud`,
        desc: `Casting value of 5. Pick 1 friendly unit wholly within 12" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made with missile weapons that target that unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Fungoid Cave-Shaman`,
    effects: [
      {
        name: `Mouthpiece of Mork`,
        desc: `If the Fungoid Cave-Shaman is on the battlefield at the start of your hero phase, roll a D6. On a 4+ you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deffcap Mushroom`,
        desc: `Once per battle, a Fungoid Cave-Shaman can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spore Squig`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a Fungoid Cave-Shaman. On a 4+ the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Spore Maws`,
        desc: `Casting value of 7. Each enemy unit within D6" of this model suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Zarbag`,
    effects: [
      {
        name: `Sniffer Spite`,
        desc: `Once per battle, before you attempt to cast a spell with Zarbag, you can roll a D6. On a 2+ add 2 to the casting roll.`,
        when: [HERO_PHASE],
      },
      {
        name: `Face of Da Bad Moon`,
        desc: `Casting value of 5. Pick 1 enemy unit within 3" of the caster that is visible to them. That unit must make a normal move, and must retreat. If it is impossible for the unit to make the move for any reason, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Stabbas`,
    effects: [
      ...GrotBaseEffects,
      {
        name: `Moon Shields`,
        desc: `Add 1 to save rolls for attacks that target this unit while it has at least 10 models with Moon Shields.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shootas`,
    effects: [
      ...GrotBaseEffects,
      {
        name: `Moon Bows`,
        desc: `Add 1 to hit rolls for attacks made with missile weapons by this unit while it has at least 15 models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Loonsmasha Fanatics`,
    effects: [
      {
        name: `Release the Fanatics!`,
        desc: `At the start of a charge phase, you can release this unit. If you do so, set up this unit wholly within 3" of the unit it was with, and more than 3" from any enemy units.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Release the Fanatics!`,
        desc: `If this unit was released in your charge phase, it can attempt to make a charge move in that phase unless the unit it was with has any restrictions that would stop it from attempting to charge (if it ran, for example); if it was released in the enemy charge phase, it cannot attempt to make a charge move. This unit is destroyed if the unit it is with is destroyed before this unit is released.`,
        when: [CHARGE_PHASE],
      },
      ...FanaticsBaseEffects,
    ],
  },
  {
    name: `Sporesplatta Fanatics`,
    effects: [
      {
        name: `Puffshroom Frenzy`,
        desc: `At the start of your hero phase, friendly MOONCLAN GROTS units wholly within 12" of any friendly units with this ability become frenzied until your next hero phase. Add 1 to the Attacks characteristic of melee weapons used by frenzied units.`,
        when: [START_OF_HERO_PHASE],
      },
      ...FanaticsBaseEffects,
    ],
  },
  {
    name: `Squig Hoppers`,
    effects: [
      {
        name: `Boing! Boing! Boing!`,
        desc: `After a unit of Squig Hoppers has made a normal move, pick 1 enemy unit and roll a D6 for each model in this unit that passed across a model from that unit. For each 4+ that unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Boingrot Bounderz`,
    effects: [
      {
        name: `Boing! Smash!`,
        desc: `After a unit of Boingrot Bounderz has made a charge move, pick 1 enemy unit within 1" of this unit and roll a D6 for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Lances of the Bounderz`,
        desc: `Add 1 to wound rolls for attacks made with Boingrot Bounderz Pokin' Lances if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Zarbag's Gitz`,
    effects: [SquigsGoWildEffect],
  },
  {
    name: `Scaremonger`,
    effects: [
      ...HallucinogenicFungusBrewsEffects,
      SlipperyGitEffect,
      {
        name: `Bogeyman`,
        desc: `You can make a Gobbapalooza Know-wotz roll for a Scaremonger. If you do so, roll a D6. On a 3+ pick 1 friendly MOONCLAN GROT unit wholly within 18" of this model that is visible to them. You can reroll charge rolls and run rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brewgit`,
    effects: [
      ...HallucinogenicFungusBrewsEffects,
      SlipperyGitEffect,
      {
        name: `Loonshine Potion`,
        desc: `You can make a Gobbapalooza Know-wotz roll for a Brewgit. If you do so, roll a D6. On a 3+ pick 1 friendly MOONCLAN GROT HERO within 18" of this model that is visible to them. You can reroll hit rolls for that HERO until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spiker`,
    effects: [
      ...HallucinogenicFungusBrewsEffects,
      SlipperyGitEffect,
      {
        name: `Poison Brewer`,
        desc: `You can make a Gobbapalooza Know-wotz roll for a Spiker. If you do so, roll a D6. On a 3+ pick 1 friendly MOONCLAN GROT unit wholly within 18" of this model that is visible to them. You can reroll wound rolls of 1 for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Boggleye`,
    effects: [...HallucinogenicFungusBrewsEffects, SlipperyGitEffect],
  },
  {
    name: `Shroomancer`,
    effects: [...HallucinogenicFungusBrewsEffects, SlipperyGitEffect],
  },
  {
    name: `Sneaky Snufflers`,
    effects: [
      {
        name: `Looncap Mushrooms`,
        desc: `At the start of your movement phase, you can say that this unit of Sneaky Snufflers is harvesting looncap mushrooms. If you do so, it cannot move in that movement phase, but you can roll a D6. If the roll is less than or equal to the number of models in this unit, pick 1 friendly MOONCLAN unit wholly within 12" of this unit. Add 1 to the Attacks characteristic of melee weapons used by that unit until your next movement phase. If you pick the same unit to be affected by this ability more than once in the same turn, it suffers 2D6 mortal wounds each time you pick it an additional time.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Squig Herd`,
    effects: [
      {
        name: `Go Dat Way!`,
        desc: `You can reroll run and charge rolls for this unit while it includes any Squig Herders.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      SquigsGoWildEffect,
    ],
  },
  {
    name: `Mangler Squigs`,
    effects: [KersplatEffect, WatchOutEffect],
  },
  {
    name: `Colossal Squig`,
    effects: [
      {
        name: `Crazed Charge`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 6, that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Fungoid Squig Explosion`,
        desc: `If this model is slain, before removing the model from the battlefield, roll a D6 for each enemy unit within 3" of it. On a 2+, that unit suffers D3 mortal wounds. After allocating all of the mortal wounds to all of the units affected by this ability, you can add 1 Squig Herd unit of up to 5 models to your army. Set up the Squig Herd unit wholly within 9" of this model and more than 3" from any enemy models. This model is then removed from the battlefield.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Puff Spores`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swallowed Whole`,
        desc: `If the unmodified hit roll for an attack made with this model's Enormous Jaws is 6, that attack inflicts D3 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Squig Gobba`,
    effects: [
      {
        name: `Arcing Spit`,
        desc: `This model's Spit-squigs can target enemy units that are not visible to attacking model. In addition, add 1 to hit rolls for attacks made with Spit-squigs if the target has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Webspinner Shaman on Arachnarok Spider`,
    effects: [
      getSpiderVenomEffect(`'s Fangs`, `D3`),
      {
        name: `Catchweb Spidershrine`,
        desc: `Add 1 to casting and unbinding rolls for friendly SPIDERFANG WIZARDS while they are within 12" of any friendly models with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Prophet of the Spider God`,
        desc: `If the Webspinner Shaman on Arachnarok Spider is the general of your army, you can add 2 to the Bravery characteristic of friendly SPIDERFANG units wholly within 24" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Venom of the Spider God`,
        desc: `Casting value of 6. Pick 1 friendly Spiderfang unit wholly within 16" of the caster and visible to them. Until your next hero phase, double the number of mortal wounds inflicted by that unit's Spider Venom ability. If the casting roll is 10 or more, pick up to D3 different friendly Spiderfang units instead of 1.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Scuttleboss on Gigantic Spider`,
    effects: [
      getSpiderVenomEffect(``, `1`),
      {
        name: `Ride Em All Down`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly SPIDERFANG GROT unit wholly within 18" of a friendly model with this command ability. You can reroll charge rolls for that unit in that charge phase. In addition, you can reroll hit rolls for attacks made with that unit's Crooked Spears in the following combat phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Webspinner Shaman`,
    effects: [
      {
        name: `Touched by the Spider God`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a Webspinner Shaman. On a 5+ that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Speed of the Spider God`,
        desc: `Casting value of 4. Pick 1 friendly Spiderfang unit wholly within 24" of the caster and visible to them. Until your next hero phase, that unit can run and still shoot later in the same turn. If the casting roll is 8 or more, pick up to D3 friendly Spiderfang units instead of 1.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Spider Riders`,
    effects: [getSpiderVenomEffect(`'s Fangs`, `1`)],
  },
  {
    name: `Arachnarok Spider with Flinger`,
    effects: [getSpiderVenomEffect(`'s Fangs`, `D3`)],
  },
  {
    name: `Arachnarok Spider with Spiderfang Warparty`,
    effects: [
      getSpiderVenomEffect(`'s Fangs`, `D3`),
      {
        name: `Voracious Predator`,
        desc: `You can reroll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Voracious Predator`,
        desc: `You can reroll charge rolls for this model. In addition, roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Skitterstrand Arachnarok`,
    effects: [
      getSpiderVenomEffect(`'s Fangs`, `D3`),
      {
        name: `Ambush From Beyond`,
        desc: `Instead of setting up the Skitterstrand Arachnarok on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Ambush From Beyond`,
        desc: `At the end of your movement phase, you can set up one or more of the reserve units that are in ambush on the battlefield more than 9" from any enemy units. Any reserve units that are in ambush that are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Troggoth Hag`,
    effects: [
      {
        name: `Hag Regeneration`,
        desc: `In your hero phase, you can heal up to D6 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spell-spite`,
        desc: `Each time this model successfully unbinds a spell, you can roll a D6; on a 4+ the Wizard that cast that spell suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      TerribleStenchEffect,
    ],
  },
  {
    name: `Dankhold Troggboss`,
    effects: [
      ReassuringPresenceEffect,
      RegenerationEffect,
      SquigglyBeastFollowersEffect,
      MagicalResistanceEffect,
      {
        name: `Crushing Grip`,
        desc: `Do not use the attack sequence for an attack made with a Crushing Grip. Instead, pick 1 enemy model that is in range of the attack and roll a D6. If the roll is equal to or greater than the Wounds characteristic of that model, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Instinctive Leader`,
        desc: `Use this command ability at the start of the combat phase. If you do so, pick 1 friendly DANKHOLD TROGGOTH HERO with this command ability. Until the end of that phase, you can reroll hit rolls of 1 for attacks made by friendly TROGGOTH units wholly within 18" of that model when they attack.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Mollog`,
    effects: [
      {
        name: `Jabbertoad`,
        desc: `If any wounds inflicted by a Jabbertoad are allocated to an enemy model and not negated, subtract 1 from hit rolls for attacks made by that model for the rest of that battle round (even if the wounds inflicted by the Jabbertoad are subsequently healed).`,
        when: [SHOOTING_PHASE],
      },
      MagicalResistanceEffect,
      ReassuringPresenceEffect,
      RegenerationEffect,
      {
        name: `Minion Abilities: Batsquig`,
        desc: `At the start of your shooting phase, you can pick 1 enemy unit within 18" of this Mollog and roll a D6. On a 5+ that enemy unit suffers 1 mortal wound. This ability cannot be used if the Bat Squig minion has been removed.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Minion Abilities: Spiteshroom`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 3" of this Mollog and roll a D6. On a 5+ subtract 1 from hit rolls for attacks made by that unit in that combat phase. This ability cannot be used if the Spiteshroom minion has been removed before the start of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Minion Abilities: Stalagsquig`,
        desc: `If you choose to remove this minion when you use the Loyal to the End ability, roll a D6. On a 5+ this minion is not removed, but the wound or mortal wound is still negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Minion Abilities: Loyal to the End`,
        desc: `Each time a wound or mortal wound is allocated to this model and not negated, you can choose to remove 1 minion. If you do so, the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Fellwater Troggoths`,
    effects: [RegenerationEffect, TerribleStenchEffect],
  },
  {
    name: `Sourbreath Troggoths`,
    effects: [
      // This Regeneration rule is not like the others, since it's a per-model basis
      {
        name: `Regeneration`,
        desc: `Roll a D6 for each Sourbreath Troggoth in each of your hero phases. On a 2+ that model heals D3 wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Too Dumb to Die`,
        desc: `Roll a D6 each time a Sourbreath Troggoth suffers a wound or mortal wound that would slay it. On a 4+ that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Rockgut Troggoths`,
    effects: [
      RegenerationEffect,
      {
        name: `Stony Skin`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to Rockgut Troggoths. On a 5+ that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Throwin' Boulders`,
        desc: `In your shooting phase, pick 1 enemy unit within 12" of Rockgut Troggoths and visible to it, and roll a D6. If the roll is equal to or less than the number of models in this unit, that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Dankhold Troggoths`,
    effects: [
      // Differs from ReassuringPresenceEffect because it's only 12"
      {
        name: `Reassuring Presence`,
        desc: `Add 1 to the Bravery characteristic of friendly GLOOMSPITE GITZ units that are wholly within 12" of any friendly models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      RegenerationEffect,
      SquigglyBeastFollowersEffect,
      MagicalResistanceEffect,
    ],
  },
  {
    name: `Aleguzzler Gargant`,
    effects: [
      {
        name: `Drunken Stagger`,
        desc: `If a charge roll for an Aleguzzler Gargant is a double, this model cannot make a charge move that phase. In addition, the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Stuff Em In Me Bag`,
        desc: `After an Aleguzzler Gargant piles in, you can pick 1 enemy model within 3" of this model and roll a D6. If the roll is equal to or greater than double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      ...GenericEffects.Gargant,
    ],
  },
  {
    name: `Bonegrinder Gargant`,
    effects: [
      {
        name: `I'll Bite Your Head Off!`,
        desc: `At the start of the combat phase, you can pick 1 enemy model that has a Wounds characteristic of 4 or less and that is within 3" of this model, and roll a D6. On a 6, that model is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Jump Up and Down`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this model. If you do so, roll a D6. If the dice roll is equal to or less than the number of models in that unit, that unit suffers D6 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Longshanks`,
        desc: `This model is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
      ...GenericEffects.Gargant,
    ],
  },
  {
    name: `Rippa's Snarlfangs`,
    effects: [
      {
        name: `Smell Weakness`,
        desc: `Add 1 to the hits rolls for this unit's Snarlfang's Jaws that target a unit with 1 or more wounds allocated to it.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ferocious Pounce`,
        desc: `This unit is eligible to fight in the combat phase if it is within 6" instead of 3" of an enemy unit. It can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Arachnarok Spider Cluster`,
    effects: [
      {
        name: `Hunting Brood`,
        desc: `You can reroll hit rolls of 1 for attacks made by a model from the Arachnarok Spider Cluster battalion while it is within 6" of another model from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gobbapalooza`,
    effects: [
      {
        name: `Brew-fuelled Madness`,
        desc: `Add 1 to casting and Gobbapalooza Know-wotz rolls for a model from the Gobbapalooza battalion while that model is within 8" of any other models from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Moonclan Skrap`,
    effects: [
      {
        name: `Spreading Loonacy`,
        desc: `Do not take battleshock tests for units from the Moonclan Skrap battalion while they are affected by the light of the Bad Moon.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Skitterstrand Nest`,
    effects: [
      {
        name: `Burst from Beyond`,
        desc: `Add 1 to charge rolls for models from the Skitterstrand Nest battalion for each model from this battalion that was set up in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Skulkmob Horde`,
    effects: [
      {
        name: `Endless Hordes`,
        desc: `Once per battle, when you use a Bad Moon Loonshrine's Moonclan Lair ability to successfully replace a destroyed unit from the Endless Hordes battalion, the replacement unit has all of the models from the destroyed unit instead of half.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spiderfang Stalk Tribe`,
    effects: [
      {
        name: `Power of the Spider God`,
        desc: `You can reroll save rolls of 1 for attacks that target a unit from a Spiderfang Stalk Tribe battalion while the target unit is wholly within 24" of a SPIDERFANG WIZARD from the same battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Spider Rider Skitterswarm`,
    effects: [
      {
        name: `Outriders of the Spider God`,
        desc: `Add 2" to the Move characteristic of units from this battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Squigalanche`,
    effects: [
      {
        name: `Over Da Moon`,
        desc: `If the light of the Bad Moon affects a unit from the Squigalanche battalion at the start of a combat phase, that unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and can move an extra 3" when it piles in.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Squig Rider Stampede`,
    effects: [
      {
        name: `Madcap Momentum`,
        desc: `You can reroll the roll that determines the Move characteristic of units from the Squig Rider Stampede battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Troggherd`,
    effects: [
      {
        name: `Eat on the Move`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon used by a model from the Troggherd battalion is 6, add 1 to the Damage characteristic for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Moon-Jumper Stampede`,
    effects: [
      {
        name: `Crushing Gobs`,
        desc: `Add 1 to the Damage characteristic of Fang-filled Gob, Massive Fang-filled Gob and Huge Fang-filled Gobs weapons used by units from this battalion if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Moon-Biter Squigalanche`,
    effects: [
      {
        name: `Overbounding Loonatics`,
        desc: `After armies have been set up but before the first battle round begins, up to D3 units from this battalion can move up to 6". If both players can move units after armies have been set up, the players must roll off, and the winner chooses who moves their units first.`,
        when: [END_OF_SETUP],
      },
    ],
  },
]
