import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import spells from './spells'

const SigmariteThundershield = {
  name: `Sigmarite Thundershield`,
  desc: `Reroll save rolls of 1 for this model. If the rerolled save is successful, each enemy unit within 3" of this model suffers 1 mortal wound.`,
  when: [SAVES_PHASE],
}
const CometTrailEffect = {
  name: `Comet Trail`,
  desc: `At the end of your movement phase, you can pick 1 enemy unit that has any models that this model passed across. You can add 1 to hit rolls for friendly STORMCAST ETERNAL units' missile attacks that target that unit in the same turn.`,
  when: [END_OF_MOVEMENT_PHASE],
}
const PrimeElectridsEffect = {
  name: `Prime Electrids`,
  desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
  when: [HERO_PHASE],
}
const SupernaturalRoarEffect = {
  name: `Supernatural Roar`,
  desc: `Subtract 1 from the Bravery of enemy units while they are within 3" of one or more friendly DRACOLINES.`,
  when: [BATTLESHOCK_PHASE],
}
const SpiritFlaskEffect = {
  name: `Spirit Flask`,
  desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
  when: [START_OF_COMBAT_PHASE],
}
const AetherealStrikeEffect = {
  name: `Aethereal Strike`,
  desc: `Unmodified hit rolls of 6 for this Gryph-charger's Razor Beak and Claws inflict 1 mortal wound instead of the normal damage.`,
  when: [COMBAT_PHASE],
}
const StormBlastEffect = {
  name: `Storm Blast`,
  desc: `Hits inflict D3 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
  when: [SHOOTING_PHASE],
}
const AstralCompassEffect = {
  name: `Astral Compass`,
  desc: `If you set up a unit that includes any models with an Astral Compass in the Celestial Realm using the Scions of the Storm battle trait, when you set it up on the battlefield for the first time, instead of setting it up more than 9" from the enemy, you can set it up wholly within 6" of any edge of the battlefield, more than 7" from the enemy.`,
  when: [END_OF_MOVEMENT_PHASE],
}
const RideTheWindsAethericEffect = {
  name: `Ride the Winds Aetheric`,
  desc: `In your movement phase, this model can Ride the Winds Aetheric instead of moving normally. If it does so, choose the direction in which it will move, and roll 6D6. This model can move up to a number of inches equal to the result in the direction chosen, moving over terrain and other models as if it could fly. It must end the move more than 3" from enemy models - if this is impossible, it cannot move at all. This model cannot charge in a turn in which it Rides the Winds Aetheric.`,
  when: [MOVEMENT_PHASE],
}
const CycleOfTheStormEffect = {
  name: `Cycle of the Storm`,
  desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const SigmariteShieldsEffect = {
  name: `Sigmarite Shields`,
  desc: `You can reroll save rolls of 1 for attacks that target this unit if any models from this unit are carrying Sigmarite Shields.`,
  when: [SAVES_PHASE],
}
const CelestialLightningArcEffects = [
  {
    name: `Celestial Lightning Arc`,
    desc: `After this unit has been picked to fight for the first time in a phase, after all of its attacks have been resolved, you can pick 1 enemy unit within 3" of this unit. If you do so, roll 2 dice for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Celestial Lightning Arc`,
    desc: `You can reroll save rolls of 1 for missile attacks that target this unit.`,
    when: [SAVES_PHASE],
  },
]
const IntolerableDamageEffect = {
  name: `Intolerable Damage`,
  desc: `If the unmodified wound roll for an attack made with a Dracoth's Claws and Fangs is 6, that attack has a Damage of D6 instead of 1.`,
  when: [COMBAT_PHASE],
}
const StarsoulMacesEffect = {
  name: `Starsoul Maces`,
  desc: `Roll a D6. On a 1, nothing happens. On a 2-5, the target unit suffers D3 mortal wounds. On a 6+, the target unit suffers D3+1 mortal wounds.`,
  when: [COMBAT_PHASE],
}
const ThunderousPounceEffect = {
  name: `Thunderous Pounce`,
  desc: `You can reroll charge rolls for this model. In addition, the Damage for this model's Monstrous Claws is D3 instead of 1 if this model made a charge move in the same turn.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
}
const WindriderEffect = {
  name: `Windrider`,
  desc: `When a friendly STORMCAST ETERNAL unit within 9" of this model uses their Ride the Winds Aetheric ability, this model can follow in their wake if it has not already made a move in that movement phase. If it does so, immediately move this model up to the distance moved by the unit they are following. This model must end that move within 9" of the unit it is following and more than 3" from any enemy models. If this model uses this ability, it cannot move in that movement phase, and cannot make a charge move later in the same turn.`,
  when: [MOVEMENT_PHASE],
}
const TirelessHuntersEffect = {
  name: `Tireless Hunters`,
  desc: `This unit can run and still shoot in the same turn.`,
  when: [SHOOTING_PHASE],
}

const Units = {
  'Celestant-Prime': {
    effects: [
      {
        name: `Cometstrike Sceptre`,
        desc: `Pick a point on the battlefield within 24" of this model that is visible to them. Each unit within D6" of that point suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in the Heavens as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Strike from the Heavens`,
        desc: `Declare whether this model will remain in reserve or strike from the Heavens. If this model strikes from the Heavens, set this model up on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Strike from the Heavens`,
        desc: `For every round this model remains in reserve, add 2 to the Attacks of Ghal Maraz until the end of the battle.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `If this model was setup via Strike from the Heavens, until your next hero phase subtract 2 from the Bravery of enemy units while they are within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bearer of the Warhammer`,
        desc: `Add 1 to the Bravery of friendly ORDER units while they are wholly within 18" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Orrery of Celestial Fates`,
        desc: `Once per turn, you can change one of the following dice rolls to a roll of your choice. Apply any modifiers to the new roll: hit roll, wound roll, save roll, run roll, charge roll, roll that determines the range or number of mortal wounds for this model's Cometstrike Sceptre.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Aventis Firestrike': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Fiery Orator'])],
      spells: [keyPicker(spells, ['Pyroelectric Blast'])],
    },
    effects: [
      CometTrailEffect,
      CycleOfTheStormEffect,
      {
        name: `Meteoric Strike`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+ that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Righteous Indignation`,
        desc: `Each time a wound inflicted by a melee weapon is allocated to this model, roll a D6. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thunderhead Crown`,
        desc: `In your hero phase, heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      SpiritFlaskEffect,
      PrimeElectridsEffect,
    ],
  },
  'Astreia Solbright': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Soul Energy of the First Host'])],
      spells: [keyPicker(spells, ['Lightning Pulse'])],
    },
    effects: [
      CycleOfTheStormEffect,
      SpiritFlaskEffect,
      SupernaturalRoarEffect,
      ThunderousPounceEffect,
      PrimeElectridsEffect,
    ],
  },
  'Vandus Hammerhand': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Vengeful Determination'])],
    },
    effects: [
      {
        name: `Heldensen`,
        desc: `Add D3 to the Attacks of Heldensen if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      IntolerableDamageEffect,
      {
        name: `Storm Breath`,
        desc: `Pick a point on the battlefield within 12" of this model that is visible to them. Roll a D6 for each enemy unit within 2" of that point. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lord of the Hammerhands`,
        desc: `Friendly HAMMERS OF SIGMAR units wholly within 24" of this model at the start of the battleshock phase do not take battleshock tests.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Neave Blacktalon': {
    effects: [
      {
        name: `Lightning Fast Strikes`,
        desc: `Add 1 to the Attacks of this model's Whirlwind Axes if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      TirelessHuntersEffect,
      {
        name: `Nemesis`,
        desc: `Add 1 to the Damage of this model's weapons if the target is a HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      WindriderEffect,
    ],
  },
  'Gavriel Sureheart': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Once More, For Sigmar, Charge!'])],
    },
    effects: [
      {
        name: `Inescapable Vengeance`,
        desc: `Add 1 to the Attacks of this model's Starbound Blade if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      SigmariteThundershield,
    ],
  },
  "Steelheart's Champions": {
    effects: [
      {
        name: `Heroic Guard`,
        desc: `If one or more enemy units finishes a charge move within 1/2" of this unit, this unit can take a heroic guard. If it does so, for the rest of the turn, add 1 to save rolls for attacks that target this unit, but this unit does not receive the benefit of cover for the rest of the turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Heroic Guard`,
        desc: `If active, add 1 to save rolls for attacks that target this unit, but this unit does not receive the benefit of cover for the rest of the turn.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Lay Low the Tyrants`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy unit with a Wounds characteristic of 5 or more.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Shields`,
        desc: `You can reroll save rolls of 1 for attacks that target this unit while it includes Angharad Brightshield.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'The Farstriders': {
    effects: [
      AstralCompassEffect,
      TirelessHuntersEffect,
      {
        name: `Star Falcon`,
        desc: `Pick 1 enemy unit within 18" of Sanson Farstrider and roll a D6. On a 4+, that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Lord-Arcanum': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Aetheric Manipulation'])],
      spells: [keyPicker(spells, ['Thunderclap'])],
    },
    effects: [CycleOfTheStormEffect, SpiritFlaskEffect, PrimeElectridsEffect],
  },
  'Lord-Arcanum on Tauralon': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Swift of Wing'])],
      spells: [keyPicker(spells, ['Lightning Orb'])],
    },
    effects: [
      CometTrailEffect,
      CycleOfTheStormEffect,
      {
        name: `Meteoric Strike`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+ that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      SpiritFlaskEffect,
      PrimeElectridsEffect,
    ],
  },
  'Lord-Arcanum on Celestial Dracoline': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Pack Alpha'])],
      spells: [keyPicker(spells, ['Storm Lance'])],
    },
    effects: [
      CycleOfTheStormEffect,
      SpiritFlaskEffect,
      PrimeElectridsEffect,
      ThunderousPounceEffect,
      SupernaturalRoarEffect,
    ],
  },
  'Lord-Arcanum on Gryph-Charger': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Soul Energy of the First Host'])],
      spells: [keyPicker(spells, ['Healing Light'])],
    },
    effects: [
      AetherealStrikeEffect,
      RideTheWindsAethericEffect,
      CycleOfTheStormEffect,
      SpiritFlaskEffect,
      PrimeElectridsEffect,
    ],
  },
  'Lord-Aquilor': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of the Azyrite Hurricane'])],
    },
    effects: [AstralCompassEffect, AetherealStrikeEffect, RideTheWindsAethericEffect],
  },
  'Lord-Celestant on Dracoth': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of the Host'])],
    },
    effects: [
      {
        name: `Lightning Hammer`,
        desc: `If the unmodified hit roll for an attack made with a Lightning Hammer is 6, that attack inflicts 2 mortal wounds on the target in addition to its normal damage. If a unit suffers any mortal wounds in this way, it cannot pile in later that phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Storm Breath`,
        desc: `Pick a point on the battlefield within 12" of this model that is visible to them. Roll a D6 for each enemy unit within 2" of that point. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      SigmariteThundershield,
      IntolerableDamageEffect,
      {
        name: `Stormstrike Glaive`,
        desc: `Add 2 to the Damage of this model's Stormstrike Glaive if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tempestos Hammer`,
        desc: `Add D3 to the Attacks of this model's Tempestos Hammer if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thunderaxe`,
        desc: `Add 1 to the Attacks of this model's Thunderaxe for each other friendly STORMCAST ETERNAL unit wholly within 9" of this model when the attack is made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord-Celestant on Stardrake': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of the Celestial Host'])],
    },
    effects: [
      {
        name: `Arcane Lineage`,
        desc: `Add 1 to casting rolls for friendly WIZARDS while they are within 18" of this model. In addition, subtract 1 from casting rolls for enemy WIZARDS while they are within 18" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cavernous Jaws`,
        desc: `After this model makes a pile-in move, this model's Stardrake can bite one or more enemy models with its cavernous jaws. The number of bites it can make is shown on the damage table above. For each bite, pick one enemy model within 3" of this model and roll a D6. If the roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inescapable Vengeance`,
        desc: `Add D3 to the Attacks of this model's Celestine Hammer or Stormbound Blade if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      SigmariteThundershield,
      {
        name: `Lord of the Heavens`,
        desc: `This model can either breathe a Roiling Thunderhead or call down a Rain of Stars. If it breathes a Roiling Thunderhead, pick 1 enemy unit within 18" of this model that is visible to it. Roll a D6 for each model in that unit that is within 18" of this model. For each 6+ that unit suffers 1 mortal wound.If it calls down a Rain of Stars, pick up to D6 enemy units on the battlefield. Roll a D6 for each unit you pick. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sweeping Tail`,
        desc: `Each time this model attacks, roll a D6 for each enemy unit within 3" of this model after all of this model's attacks have been resolved. If the roll is less than the number of models in that enemy unit, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stormbound Blade`,
        desc: `If the unmodified hit roll for an attack made with a Stormbound Blade is 6, that attack inflicts 3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord-Celestant': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Furious Retribution'])],
    },
    effects: [
      {
        name: `Inescapable Vengeance`,
        desc: `Add 1 to the Attacks of this model's weapons if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Warcloak`,
        desc: `This model can make D6 storm magic strikes. For each strike, pick 1 enemy unit within 16" of this model that is visible to them and roll a D6. On a 4+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Lord-Castellant': {
    effects: [
      {
        name: `Faithful Gryph-Hound`,
        desc: `The first time this model is set up on the battlefield you can call a GRYPH-HOUND unit consisting of a single model to the battlefield and add it to your army. Set up the GRYPH-HOUND wholly within 3" of this model, and more than 9" from the enemy.`,
        when: [DURING_SETUP],
      },
      {
        name: `Warding Lantern`,
        desc: `Pick either a STORMCAST ETERNAL unit or a CHAOS unit wholly within 18". The same unit cannot be the target of Warding Lantern more than once per hero phase. If a CHAOS unit is picked, it suffers 1 mortal wound. CHAOS DAEMON units suffer D3 mortal wounds instead. If a STORMCAST ETERNAL unit is picked, add 1 to save rolls for attacks that target that unit until your next hero phase. In addition, each time you make a save roll of 7 for an attack that targets that unit, you can heal 1 wound allocated to a model from that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warding Lantern`,
        desc: `If active (and the target unit is STORMCAST ETERNAL), add 1 to save rolls for attacks that target that unit until your next hero phase. In addition, each time you make a save roll of 7 for an attack that targets that unit, you can heal 1 wound allocated to a model from that unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Gryph-Hounds': {
    effects: [
      {
        name: `Warning Cry`,
        desc: `If a reserve enemy unit is set up on the battlefield for the first time within 10" of this unit, friendly STORMCAST ETERNAL units wholly within 9" of this unit can attack that reserve unit with all of the missile weapons they are armed with. A unit that uses this ability to attack a reserve unit cannot use this ability to attack another reserve unit in the same phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Darting Attacks`,
        desc: `Each time this unit attacks, it can make a 6" retreat move after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pack Leader Alpha`,
        desc: `If a unit of GRYPH-HOUNDS has 3 or more models, one Gryph-hound can be a Gryph-hound Alpha. Add 1 to the Attacks of a Gryph-hound Alpha's Beak and Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Loyal Companion`,
        desc: `Add 2 to the Attacks of this unit's Beak and Claws while this unit is wholly within 6" of a friendly LORD-CASTELLANT or LORD-VERITANT.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord-Relictor': {
    effects: [
      {
        name: `Healing Storm`,
        desc: `Pick a friendly model with the STORMCAST ETERNAL keyword that is within 12" of this model and roll a D6. On a roll of 3 or more you can heal up to D3 wounds that have been suffered by the model that you picked. A Lord-Relictor cannot pray for a healing storm and a lightning storm in the same turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lightning Storm`,
        desc: `Pick an enemy unit that is within 12" of this model and roll a D6. On a roll of 3 or more, the unit you picked suffers D3 mortal wounds, and your opponent must subtract 1 from all hit rolls for the unit until your next hero phase. A Lord-Relictor cannot pray for a lightning storm and a healing storm in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lord-Exorcist': {
    mandatory: {
      spells: [keyPicker(spells, ['Purifying Blast'])],
    },
    effects: [
      {
        name: `Redemptor Casket`,
        desc: `Roll a D6 for each DAEMON or NIGHTHAUNT unit within 6" of this model. On a 4+ that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Lord-Ordinator': {
    effects: [
      {
        name: `Arcane Engineer`,
        desc: `Add 1 to hit rolls for friendly ORDER WAR MACHINES while wholly within 9" of any friendly LORD-ORDINATORS.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Meteoric Slam`,
        desc: `If you roll 2 or more unmodified hit rolls of 6 for this model's Astral Hammers, then after its attacks have been resolved that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Comet Strike`,
        desc: `If the unmodified hit roll for an attack made with an Astral Grandhammer is 6, that attack inflicts 2 mortal wounds and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Solemn Duty`,
        desc: `Until the end of that phase, you do not have to take battleshock tests for friendly STORMCAST ETERNAL units that are wholly within 18" of that model.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Lord-Veritant': {
    effects: [
      {
        name: `Faithful Gryph-Hound`,
        desc: `The first time this model is set up on the battlefield you can call a GRYPH-HOUND unit consisting of a single model to the battlefield and add it to your army. Set up the GRYPH-HOUND wholly within 3" of this model, and more than 9" from the enemy.`,
        when: [DURING_SETUP],
      },
      {
        name: `Lantern of Abjuration`,
        desc: `This model can unbind one spell in each enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sanction`,
        desc: `Pick 1 enemy WIZARD within 7" of this model and roll a D6. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bound in Service`,
        desc: `Add 3 to the unbinding roll for this model's Lantern of Abjuration if there is a friendly GRYPH-HOUND model within 6" of the enemy WIZARD attempting to cast the spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Knight-Azyros': {
    effects: [
      {
        name: `Illuminator of the Lost`,
        desc: `You can reroll hit rolls of 1 for attacks made by friendly units that target enemy units while the enemy unit is within 10" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `The Light of Sigmar`,
        desc: `Once per battle, each enemy unit within 8" of this model suffers D3 mortal wounds. CHAOS units within 8" suffer D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Knight-Venator': {
    effects: [
      {
        name: `Celestial Strike`,
        desc: `If the unmodified wound roll for an attack made with a Star-eagle's Celestial Beak and Talons is 6, that attack has a Rend of -3 instead of '-'.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Star-fated Arrow`,
        desc: `Once per battle, this model can shoot a Star-fated Arrow. If it does so, until the end of that phase, the Attacks of this model's Realmhunter's Bow is reduced to 1, but it has a Damage of D3+3 instead of 1. If the target is a HERO or MONSTER, this weapon has a Damage of D6+3 until the end of that phase instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Knight-Incantor': {
    mandatory: {
      spells: [keyPicker(spells, ['Spirit Storm'])],
    },
    effects: [
      {
        name: `Voidstorm`,
        desc: `Once per battle, you can declare an enemy spell is automatically unbound (do not roll the dice).`,
        when: [HERO_PHASE],
      },
      SpiritFlaskEffect,
    ],
  },
  'Knight-Heraldor': {
    effects: [
      {
        name: `Onwards to Glory`,
        desc: `Pick a friendly STORMCAST ETERNAL unit wholly within 12" of this model. That unit can retreat and/or run in that movement phase and still charge later in the same turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Thunderblast`,
        desc: `Pick a terrain feature wholly within 18" of this model. Each enemy unit within 3" of that terrain feature suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Errant-Questor': {
    effects: [
      {
        name: `Implacable Determination`,
        desc: `When you make save rolls for this model, ignore the enemy's Rend characteristic.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Oathsworn`,
        desc: `After setup, you must declare an oath for each Errant-Questor in your army to fulfil:

        Sworn Protector: Pick a HERO in your army for the Errant-Questor to protect. Whilst this model is within 3" of the HERO you picked, you can choose to allocate any unsanved or mortal wound inflicted upon that model to the Errant-Questor instead.

        Blood Feud: Pick a HERO in the enemy army. You can reroll all failed hit and wound rolls when attacking that HERO with this model. If you have more than one Errant-Questor in your army that chooses this oath, you must pick a different enemy HERO to be the target of each blood feud.

        Fueled by Vengeance: Keep track of how many unsaved wounds this model inflicts upon enemy models in battle. Add 1 to the Attacks characteristic of this model's Rune-etched Greatblade for every 10 wounds he inflicts during the battle.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Relentless Purpose`,
        desc: `You can reroll failed charge rolls for an Errant-Questor.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Knight-Questor': {
    effects: [
      {
        name: `Heroic Challenge`,
        desc: `If this model is within 6" of an enemy HERO when it makes a pile-in move, it can pile in an extra 3", but must end that pile-in move within 1" of an enemy HERO. In addition you can reroll failed hit rolls for attacks made by this model against a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thundercharged Strike`,
        desc: `If the unmodified wound roll for an attack made with a Questor Warblade is 6, that attack has a Damage of 2 instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Shield`,
        desc: `Reroll failed save rolls for attacks that target this model.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Knight-Questor Larissa Shadowstalker': {
    effects: [
      {
        name: `Deathstrike`,
        desc: `If the unmodified hit roll for an attack made with this model's Stormstrike Glaive that targets a MONSTER is 6, that attack has a Damage characteristic of D6 instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Malleus Occulum`,
        desc: `If your battle is taking place in Ulgu, the Realm of Shadow, you can reroll charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Protector Discipline`,
        desc: `Add 1 to save rolls for attacks made with missile weapons that target this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `The Shadowstalker's Quarry`,
        desc: `If this model is within 6" of an enemy MONSTER in the combat phase, it is eligible to fight and can move an extra 3" when it piles in, but must end that pile-in move within 1" of an enemy MONSTER. In addition, you can reroll hit rolls for attacks made by this model if the target of the attack is a MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Knight-Vexillor': {
    effects: [
      {
        name: `Icon of War`,
        desc: `You can reroll charge rolls for friendly STORMCAST ETERNAL units that are wholly within 18" of this model when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Meteoric Standard`,
        desc: `Once per battle, pick a point on the battlefield within 24" of this model. Each unit within 2D6" of that point suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pennant of the Stormbringer`,
        desc: `Once per battle, pick a friendly STORMCAST ETERNAL unit on the battlefield. Remove that unit from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Knight-Zephyros': {
    effects: [
      {
        name: `Lightning Fast Strikes`,
        desc: `Add 1 to the Attacks of this model's Whirlwind Axes if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      TirelessHuntersEffect,
      WindriderEffect,
    ],
  },
  'Drakesworn Templar': {
    effects: [
      {
        name: `Arc Hammer`,
        desc: `If the unmodified hit roll for an attack made with an Arc Hammer is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skybolt Bow`,
        desc: `If you score one or more hits on an enemy unit with this model's Skybolt Bow, add 1 to hit rolls for attacks made by friendly DRACOTHIAN GUARD units that target that enemy unit until the end of that turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Stormlance`,
        desc: `If the unmodified hit roll for an attack made with a Stormlance that targets a MONSTER is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tempest Axe`,
        desc: `Subtract 2" from the distance enemy units can pile in when they start that pile-in move within 3" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Arcane Lineage`,
        desc: `Add 1 to casting rolls for friendly WIZARDS while they are within 18" of this model. In addition, subtract 1 from casting rolls for enemy WIZARDS while they are within 18" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cavernous Jaws`,
        desc: `After this model makes a pile-in move, this model's Stardrake can bite one or more enemy models with its cavernous jaws. The number of bites it can make is shown on the damage table above. For each bite, pick one enemy model within 3" of this model and roll a D6. If the roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Heavens`,
        desc: `This model can either breathe a Roiling Thunderhead or call down a Rain of Stars. If it breathes a Roiling Thunderhead, pick 1 enemy unit within 18" of this model that is visible to it. Roll a D6 for each model in that unit that is within 18" of this model. For each 6+ that unit suffers 1 mortal wound.If it calls down a Rain of Stars, pick up to D6 enemy units on the battlefield. Roll a D6 for each unit you pick. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sweeping Tail`,
        desc: `Each time this model attacks, roll a D6 for each enemy unit within 3" of this model after all of this model's attacks have been resolved. If the roll is less than the number of models in that enemy unit, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Concussors: {
    effects: [
      IntolerableDamageEffect,
      SigmariteShieldsEffect,
      StormBlastEffect,
      {
        name: `Blast to Ashes`,
        desc: `If the unmodified hit roll for an attack made with a Lightning Hammer is 6, that attack inflicts 1 mortal wound on the target in addition to its normal damage. If a unit suffers any mortal wounds in this way, it cannot pile in later that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Fulminators: {
    effects: [
      IntolerableDamageEffect,
      SigmariteShieldsEffect,
      StormBlastEffect,
      {
        name: `Impaling Strikes`,
        desc: `Add 2 to the Damage of this unit's Stormstrike Glaives if the unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Glaivewall`,
        desc: `Add 1 to save rolls for attacks made with missiles weapons that target this unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Desolators: {
    effects: [
      IntolerableDamageEffect,
      SigmariteShieldsEffect,
      StormBlastEffect,
      {
        name: `Fury of the Storm`,
        desc: `While this unit has 4 or more models, add 1 to the Attacks of this unit's Thunderaxes. While this unit has 6 or more models, add 2 to the Attacks instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Tempestors: {
    effects: [
      IntolerableDamageEffect,
      SigmariteShieldsEffect,
      StormBlastEffect,
      {
        name: `Disruptive Fire`,
        desc: `Subtract 1 from hit rolls for missile attacks used by enemy units while they are within 12" of one or more friendly TEMPESTORS.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Protectors: {
    effects: [
      StarsoulMacesEffect,
      {
        name: `Deathstrike`,
        desc: `If the unmodified hit roll for an attack made with a Stormstrike Glaive that targets a MONSTER is 6, that attack has a Damage of D6 instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stormshield`,
        desc: `Subtract 1 from hit rolls for missile attacks target this unit. In addition, if another friendly unit wholly within 6" of this unit is targeted by an enemy model's missile weapon, that friendly unit receives the benefit of cover if the attacking model is closer to this unit than it is to the target unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Protector-Prime`,
        desc: `1 Extra attack with Stormstrike Glaive.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Decimators: {
    effects: [
      StarsoulMacesEffect,
      {
        name: `Cleaving Blow`,
        desc: `The Attacks of a Thunderaxe is equal to the number of enemy models within 2" of the attacking model when the number of attacks made with the weapon is determined.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grim Harvesters`,
        desc: `Subtract 2 from the Bravery of enemy units while they are within 6" of one or more friendly units of DECIMATORS in the battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decimator-Prime`,
        desc: `+1 to wound rolls.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Liberators: {
    effects: [
      {
        name: `Lay Low the Tyrants`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy unit with a Wounds characteristic of 5 or more.`,
        when: [COMBAT_PHASE],
      },
      SigmariteShieldsEffect,
      {
        name: `Paired Weapons`,
        desc: `Each unmodified hit roll of 6 made for a model armed with either a pair of warhammers or a pair of warblades inflicts 2 hits on the target unit instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Liberator-Prime`,
        desc: `Add 1 to melee attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Retributors: {
    effects: [
      StarsoulMacesEffect,
      {
        name: `Blast to Ashes`,
        desc: `If the unmodified hit roll for an attack made with a Lightning Hammer is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Retributor-Prime`,
        desc: `+1 hammer attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Prosecutors with Stormcall Javelins': {
    effects: [
      {
        name: `Prosecutor-Prime`,
        desc: `+1 Missile Weapon attacks.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Stormcall Javelins`,
        desc: `+1 to Stormcall Javelin damage if target is more than 9" from the attacking model.`,
        when: [SHOOTING_PHASE],
      },
      SigmariteShieldsEffect,
      {
        name: `Heralds of Righteousness`,
        desc: `Can attempt charges within 18". Roll 3D6 for the charge roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Prosecutors with Celestial Hammers': {
    effects: [
      {
        name: `Prosecutor-Prime`,
        desc: `+1 Celestial Hammers attacks (melee)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Cleaving Blow`,
        desc: `The Attacks of a Grandaxe is equal to the number of enemy models within 1" of the attacking model when the number of attacks made by the model is determined.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Paired Celestial Hammers`,
        desc: `Reroll hits of 1.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      SigmariteShieldsEffect,
      {
        name: `Heralds of Righteousness`,
        desc: `Can attempt charges within 18". Roll 3D6 for the charge roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Judicators: {
    effects: [
      {
        name: `Judicator-Prime`,
        desc: `+1 to hit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Chained Lightning`,
        desc: `If the hit roll for an attack made with a Shockbolt Bow scores a hit, that attack inflicts D6 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rapid Fire`,
        desc: `Add 1 to the Attacks of this unit's Boltstorm Crossbows if this unit did not move in the movement phase of the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Eternal Judgement`,
        desc: `Reroll hit rolls of 1 for attacks made with this unit's missile weapons that target a CHAOS unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Thunderbolt Crossbow`,
        desc: `Do not use the attack sequence for an attack made with a Thunderbolt Crossbow. Instead, roll a D6. Subtract 1 from the roll if the target is a MONSTER. If the result is equal to or less than the number of models in the target unit, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Vanguard-Raptors with Hurricane Crossbows': {
    effects: [
      {
        name: `Raptor-Prime`,
        desc: `The leader of this unit is a Raptor-Prime. Add 1 to hit rolls for attacks made with a Raptor-Prime's Hurricane Crossbow and Heavy Stock.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Rapid Fire`,
        desc: `Add 3 to the Attacks of this unit's Hurricane Crossbows if this unit did not move in the movement phase of the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Suppressing Fire`,
        desc: `Subtract 1 from charge rolls for enemy units while they are within 12" of one or more friendly VANGUARD-RAPTOR units armed with Hurricane Crossbows.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Vanguard-Raptors with Longstrike Crossbows': {
    effects: [
      {
        name: `Headshot`,
        desc: `If the unmodified hit roll for an attack made with a Longstrike Crossbow is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hunting Call`,
        desc: `If an enemy unit finishes a charge move within 1" of a friendly unit that includes a Raptor-Prime, roll a D6 for each model in that Raptor-Prime's unit. For each 6+, the charging unit suffers 2 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Longshot`,
        desc: `Add 6" to the Range of this unit's Longstrike Crossbows if this unit did not move in the movement phase of the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Vanguard-Hunters': {
    effects: [
      AstralCompassEffect,
      TirelessHuntersEffect,
      {
        name: `Hunter-Prime`,
        desc: `+1 attack.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Vanguard-Palladors': {
    effects: [
      {
        name: `Lunar Blade`,
        desc: `Each time a model armed with a Lunar Blade attacks, after all of that model's attacks have been resolved, you can pick 1 enemy unit within 1" of that model and roll a D6. On a 2+ the unit you picked suffers 1 mortal wound.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      AetherealStrikeEffect,
      RideTheWindsAethericEffect,
    ],
  },
  Aetherwings: {
    effects: [
      {
        name: `Swooping Hunters`,
        desc: `This unit can retreat and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Watchful Guardians`,
        desc: `At the start of the enemy charge phase, if this unit is wholly within 18" of a friendly unit of VANGUARD-RAPTORS, this unit can move up to 2D6". They must finish the move wholly within 18" of the same unit of VANGUARD-RAPTORS.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Celestar Ballista': {
    effects: [
      {
        name: `Bastions of Death`,
        desc: `If this unit is in cover, add 2 to its save rolls for being in cover instead of 1.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Chained Lightning`,
        desc: `Each time you roll a hit for an attack made with this unit's Stormbolts, that attack inflicts D6 hits on the target instead of 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Castigators: {
    effects: [
      {
        name: `Castigator-Prime`,
        desc: `Add 1 to hit rolls for attacks made with a Castigator-Prime's Thunderhead Greatbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Castigator Aetheric Channelling`,
        desc: `Say if this unit will increase the accuracy or the power of their Thunderhead Greatbows. If you choose accuracy, reroll hit rolls of 1 for attacks made by this unit in that shooting phase. If you choose power, this unit's Thunderhead Greatbows have a Rend of -2 instead of -1 in that shooting phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Burst of Celestial Energy`,
        desc: `If the unmodified hit roll for an attack made with a Thunderhead Greatbow that targets a DAEMON or NIGHTHAUNT unit is 6, that attack inflicts D3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Sequitors: {
    effects: [
      {
        name: `Sequitor-Prime`,
        desc: `Add 1 to the Attacks of a Sequitor-Prime's melee weapon.`,
        when: [HERO_PHASE],
      },
      {
        name: `Greatmace Blast`,
        desc: `If the unmodified hit roll for an attack made with a Stormsmite Greatmace that targets a DAEMON or NIGHTHAUNT unit is 6, that attack inflicts D3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Redemption Cache`,
        desc: `Pick a CHAOS or DEATH unit within 6" of a Sequitor-Prime with a Redemption Cache and roll a D6. On a 4+, that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Sequitor Aetheric Channelling`,
        desc: `Say if this unit will channel aetheric power into its weapons or its shields. If you choose its weapons, you can reroll failed hit rolls for attacks made by this unit in that combat phase. If you choose its shields, you can reroll failed save rolls for attacks that target this unit in that combat phase (instead of only rerolling save rolls of 1).`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Soulshields`,
        desc: `You can reroll save rolls of 1 for attacks that target this unit if any models from this unit are carrying a Soulshield.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Evocators: {
    mandatory: {
      spells: [keyPicker(spells, ['Empower'])],
    },
    effects: [
      ...CelestialLightningArcEffects,
      {
        name: `Evocator-Prime`,
        desc: `+1 Attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This unit is a WIZARD while it has 2 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Evocators on Celestial Dracolines': {
    mandatory: {
      spells: [keyPicker(spells, ['Empower'])],
    },
    effects: [
      {
        name: `Evocator-Prime`,
        desc: `+1 Attack.`,
        when: [COMBAT_PHASE],
      },
      ...CelestialLightningArcEffects,
      {
        name: `Magic`,
        desc: `This unit is a WIZARD while it has 2 or more models.`,
        when: [HERO_PHASE],
      },
      SupernaturalRoarEffect,
      ThunderousPounceEffect,
    ],
  },
  'Lynus Ghalmorian on Gryph Charger': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Sombre Exemplar'])],
      spells: [keyPicker(spells, ['Amethyst Gale'])],
    },
    effects: [
      AetherealStrikeEffect,
      RideTheWindsAethericEffect,
      CycleOfTheStormEffect,
      SpiritFlaskEffect,
      {
        name: `Shield of the Pale Knight`,
        desc: `You can reroll save rolls of 1 for attacks made with missile weapons that target this model or any friendly ANVILS OF HELDENHAMMER units wholly within 12" of this model.`,
        when: [SAVES_PHASE],
      },
      PrimeElectridsEffect,
    ],
  },
  'Averon Stormsire': {
    mandatory: {
      spells: [keyPicker(spells, ['Stormsire'])],
    },
    effects: [
      SpiritFlaskEffect,
      {
        name: `Voidstorm Scroll`,
        desc: `Once per battle, when this model attempts to unbind a spell, instead of making an unbinding roll you can say this model is using its Voidstorm Scroll. If you do so, the spell is automatically unbound (do not roll the dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Stormsire's Cursebreakers": {
    mandatory: {
      spells: [keyPicker(spells, ['Empower'])],
    },
    effects: [
      {
        name: `Blessed Banishment`,
        desc: `You can reroll hit rolls of 1 for attacks made by this unit that target Chaos or Death units.`,
        when: [COMBAT_PHASE],
      },
      ...CelestialLightningArcEffects,
    ],
  },
}

export default tagAs(Units, 'unit')
