import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  END_OF_CHARGE_PHASE,
  SHOOTING_PHASE,
  END_OF_COMBAT_PHASE,
  START_OF_COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  BATTLESHOCK_PHASE,
  DURING_GAME,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Celestant-Prime`,
    effects: [
      {
        name: `Cometstrike Sceptre`,
        desc: `In your shooting phase, you can pick a point on the battlefield within 24" of this model that is visible to them. Each unit within D6" of that point suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in the Heavens as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Strike from the Heavens`,
        desc: `At the end of your movement phase you must declare whether this model will remain in reserve or strike from the Heavens. If this model strikes from the Heavens, set this model up on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Strike from the Heavens`,
        desc: `For every round this model remains in reserve, add 2 to the Attacks characteristic of Ghal Maraz until the end of the battle.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `If this model was setup via Strike from the Heavens, until your next hero phase subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bearer of the Warhammer`,
        desc: `Add 1 to the Bravery characteristic of friendly ORDER units while they are wholly within 18" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Orrery of Celestial Fates`,
        desc: `Once per turn, you can change one of the following dice rolls to a roll of your choice. Apply any modifiers to the new roll: hit roll, wound roll, save roll, run roll, charge roll, roll that determines the range or number of mortal wounds for this model's Cometstrike Sceptre.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aventis Firestrike`,
    effects: [
      {
        name: `Comet Trail`,
        desc: `At the end of your movement phase, you can pick 1 enemy unit that has any models that this model passed across. You can add 1 to hit rolls for attacks made with missile weapons used by friendly STORMCAST ETERNAL units that target that unit in the same turn.`,
        when: [END_OF_MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Meteoric Strike`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+ that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Righteous Indignation`,
        desc: `Each time a wound inflicted by a melee weapon is allocated to this model, roll a dice. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fiery Orator`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly HAMMERS OF SIGMAR unit wholly within 12" of a friendly model with this command ability. Add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Astreia Solbright`,
    effects: [
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Supernatural Roar`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of one or more friendly DRACOLINES.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Thunderous Pounce`,
        desc: `You can re-roll charge rolls for this model. In addition, the Damage characteristic for this model's Monstrous Claws is D3 instead of 1 if this model made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in your shooting phase, pick a friendly unit of HAMMERS OF SIGMAR CASTIGATORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the accuracy and power of that unit's Thunderhead Greatbows in that shooting phase instead of choosing only one of those options.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in your hero phase, pick a friendly unit of HAMMERS OF SIGMAR EVOCATORS wholly within 12" of a friendly model with this command ability. That unit can automatically cast Empower in that hero phase (no casting roll is required, and the spell cannot be unbound).`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in the combat phase, pick a friendly unit of HAMMERS OF SIGMAR SEQUITORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the power of the unit's weapons and shields in that combat phase instead of choosing only one of those options.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Vandus Hammerhand`,
    effects: [
      {
        name: `Heldensen`,
        desc: `Add D3 to the Attacks characteristic of Heldensen if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Intolerable Damage`,
        desc: `If the unmodified wound roll for an attack made with a Dracoth’s Claws and Fangs is 6, that attack has a Damage characteristic of D6 instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Storm Breath`,
        desc: `In your shooting phase, you can pick a point on the battlefield within 12" of this model that is visible to them. Roll a dice for each enemy unit within 2" of that point. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lord of the Hammerhands`,
        desc: `Friendly HAMMERS OF SIGMAR units wholly within 24" of this model at the start of the battleshock phase do not take battleshock tests.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Vengeful Determination`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly HAMMERS OF SIGMAR units while they are wholly within 12" of a friendly model with this command ability`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Neave Blacktalon`,
    effects: [
      {
        name: `Lightning Fast Strikes`,
        desc: `Add 1 to the Attacks characteristic of this model’s Whirlwind Axes if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tireless Hunter`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Nemesis`,
        desc: `Add 1 to the Damage characteristic of this model’s weapons if the target is a HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Windrider`,
        desc: `When a friendly STORMCAST ETERNAL unit within 9" of this model uses their Ride the Winds Aetheric ability, this model can follow in their wake if it has not already made a move in that movement phase. If it does so, immediately move this model up to the distance moved by the unit they are following. This model must end that move within 9" of the unit it is following and more than 3" from any enemy models. If this model uses this ability, it cannot move in that movement phase, and cannot make a charge move later in the same turn`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Gavriel Sureheart`,
    effects: [
      {
        name: `Inescapable Vengeance`,
        desc: `In the combat phase, add 1 to the Attacks characteristic of this model’s Starbound Blade if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Thundershield`,
        desc: `Re-roll save rolls of 1 for this model. If the re-rolled save is successful, each enemy unit within 3" of this model suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Once More, For Sigmar, Charge!`,
        desc: `If you use this command ability, then until your next hero phase add 3 to charge rolls for friendly STORMCAST ETERNAL units that are within 9" of this model at the start of the charge phase`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Steelheart's Champions`,
    effects: [
      {
        name: `Heroic Guard`,
        desc: `If one or more enemy units finishes a charge move within ½" of this unit, this unit can take a heroic guard. If it does so, for the rest of the turn, add 1 to save rolls for attacks that target this unit, but this unit does not receive the benefit of cover for the rest of the turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Lay Low the Tyrants`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy unit with a Wounds characteristic of 5 or more.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Shields`,
        desc: `You can re‑roll save rolls of 1 for attacks that target this unit while it includes Angharad Brightshield`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      }
    ],
  },
  {
    name: `The Farstriders`,
    effects: [
      {
        name: `Astral Compass`,
        desc: `If you set up a unit that includes any models with an Astral Compass in the Celestial Realm using the Scions of the Storm battle trait, when you set it up on the battlefield for the first time, instead of setting it up more than 9" from the enemy, you can set it up wholly within 6" of any edge of the battlefield, more than 7" from the enemy.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Tireless Hunters`,
        desc: `This unit can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Star Falcon`,
        desc: `At the start of your shooting phase, you can pick 1 enemy unit within 18" of Sanson Farstrider and roll a dice. On a 4+, that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      }
    ],
  },
  {
    name: `Lord-Arcanum`,
    effects: [
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
        when: [DURING_GAME],
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aetheric Manipulation`,
        desc: `You can use this command ability before an endless spell is moved. If you do so, pick a predatory Endless Spell model within 12" of a friendly model with this command ability. Add D6" to the distance that endless spell can move until the end of the battle round.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Lord-Arcanum on Tauralon`,
    effects: [
      {
        name: `Comet Trail`,
        desc: `At the end of your movement phase, you can pick 1 enemy unit that has any models that this model passed across. You can add 1 to hit rolls for attacks made with missile weapons used by friendly STORMCAST ETERNAL units that target that unit in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Meteoric Strike`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+ that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will 
        shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected`,
        when: [DURING_GAME],
      },
      {
        name: `Swift of Wing`,
        desc: `You can use this command ability at the start of the movement phase. If you do so, pick a friendly model with this command ability. Add 2 to run rolls for friendly SACROSANCT units that were wholly within 18" of that model at the start of that phase`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord-Arcanum on Celestial Dracoline`,
    effects: [
      {
        name: `Pack Alpha`,
        desc: `You can use this command ability in the combat phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of the Monstrous Claws of friendly EVOCATORS with DRACOLINE mounts while they are wholly within 18" of that model`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will 
        shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected`,
        when: [DURING_GAME],
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Thunderous Pounce`,
        desc: `You can re-roll charge rolls for this model. In addition, the Damage characteristic for this model’s Monstrous Claws is D3 instead of 1 if this model made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Supernatural Roar`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of one or more friendly DRACOLINES.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Lord-Arcanum on Gryph Charger`,
    effects: [
      {
        name: `Aethereal Strike`,
        desc: `Each time you make a hit roll of 6+ for this Gryph-charger’s Razor Beak and Claws, that attack inflicts 1 mortal wound instead of the normal damage`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in your shooting phase, pick a friendly unit of HAMMERS OF SIGMAR CASTIGATORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the accuracy and power of that unit's Thunderhead Greatbows in that shooting phase instead of choosing only one of those options.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in your hero phase, pick a friendly unit of HAMMERS OF SIGMAR EVOCATORS wholly within 12" of a friendly model with this command ability. That unit can automatically cast Empower in that hero phase (no casting roll is required, and the spell cannot be unbound).`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in the combat phase, pick a friendly unit of HAMMERS OF SIGMAR SEQUITORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the power of the unit's weapons and shields in that combat phase instead of choosing only one of those options.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Ride the Winds Aetheric`,
        desc: `In your movement phase, this model can Ride the Winds Aetheric instead of moving normally. If it does so, choose the direction in which it will move, and roll 6D6. This model can move up to a number of inches equal to the result in the direction chosen, moving over terrain and other models as if it could fly. It must end the move more than 3" from enemy models – if this is impossible, it cannot move at all. This model cannot charge in a turn in which it Rides the Winds Aetheric.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will 
        shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected`,
        when: [DURING_GAME],
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord-Aquilor`,
    effects: [
      {
        name: `Lord of the Azyrite Hurricane`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model with this command ability. Remove that model, and/or one friendly unit of VANGUARD-HUNTERS,VANGUARD-PALLADORS, VANGUARD-RAPTORS or AETHERWINGS wholly within 24" of that model, from the battlefield and set them up wholly within 6" of any edge of the battlefield, more than 7" from any enemy units.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Astral Compass`,
        desc: `If you set up a unit that includes any models with an Astral Compass in the Celestial Realm using the Scions of the Storm battle trait, when you set it up on the battlefield for the first time, instead of setting it up more than 9" from the enemy, you can set it up wholly within 6" of any edge of the battlefield, more than 7" from the enemy.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Aethereal Strike`,
        desc: `Each time you make a hit roll of 6+ for this Gryph-charger’s Razor Beak and Claws, that attack inflicts 1 mortal wound instead of the normal damage`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ride the Winds Aetheric`,
        desc: `In your movement phase, this model can Ride the Winds Aetheric instead of moving normally. If it does so, choose the direction in which it will move, and roll 6D6. This model can move up to a number of inches equal to the result in the direction chosen, moving over terrain and other models as if it could fly. It must end the move more than 3" from enemy models – if this is impossible, it cannot move at all. This model cannot charge in a turn in which it Rides the Winds Aetheric.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Lord-Celestant on Dracoth`,
    effects: [
      {
        name: `Lightning Hammer`,
        desc: `If the unmodified hit roll for an attack made with a Lightning Hammer is 6, that attack inflicts 2 mortal wounds on the target in addition to its normal damage. If a unit suffers any mortal wounds in this way, it cannot pile in later that phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Storm Breath`,
        desc: `In your shooting phase, you can pick a point on the battlefield within 12" of this model that is visible to them. Roll a dice for each enemy unit within 2" of that point. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sigmarite Thundershield`,
        desc: `Re-roll save rolls of 1 for this model. If the re-rolled save is successful, each enemy unit within 3" of this model suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Intolerable Damage`,
        desc: `If the unmodified wound roll for an attack made with a Dracoth’s Claws and Fangs is 6, that attack has a Damage characteristic of D6 instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stormstrike Glaive`,
        desc: `Add 2 to the Damage characteristic of this model’s Stormstrike Glaive if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Host`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, you do not have to take battleshock tests for friendly STORMCAST ETERNAL units that are wholly within 24" of that model.`,
        when: [BATTLESHOCK_PHASE],
        command_ability: true,
      },
      {
        name: `Tempestos Hammer`,
        desc: `Add D3 to the Attacks characteristic of this model’s Tempestos Hammer if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thunderaxe`,
        desc: `Add 1 to the Attacks characteristic of this model’s Thunderaxe for each other friendly STORMCAST ETERNAL unit wholly within 9" of this model when the attack is made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord-Celestant on Stardrake`,
    effects: [
      {
        name: `Arcane Lineage`,
        desc: `Add 1 to casting rolls for friendly WIZARDS while they are within 18" of this model. In addition, subtract 1 from casting rolls for enemy WIZARDS while they are within 18" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cavernous Jaws`,
        desc: `After this model makes a pile-in move, this model’s Stardrake can bite one or more enemy models with its cavernous jaws. The number of bites it can make is shown on the damage table above. For each bite, pick one enemy model within 3" of this model and roll a dice. If the roll is greater than that model’s Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inescapable Vengeance`,
        desc: `Add D3 to the Attacks characteristic of this model’s Celestine Hammer or Stormbound Blade if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Heavens`,
        desc: `At the start of your shooting phase, if this model is on the battlefield, it can either breathe a Roiling Thunderhead or call down a Rain of Stars. If it breathes a Roiling Thunderhead, pick 1 enemy unit within 18" of this model that is visible to it. Roll a dice for each model in that unit that is within 18" of this model. For each 6+ that unit suffers 1 mortal wound.If it calls down a Rain of Stars, pick up to D6 enemy units on the battlefield. Roll a dice for each unit you pick. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sweeping Tail`,
        desc: `Each time this model attacks, roll a dice for each enemy unit within 3" of this model after all of this model’s attacks have been resolved. If the roll is less than the number of models in that enemy unit, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stormbound Blade`,
        desc: `If the unmodified hit roll for an attack made with a Stormbound Blade is 6, that attack inflicts 3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Celestial Host`,
        desc: `You can use this command ability at the start of the combat phase if a friendly model with this command ability is on the battlefield. If you do so, you can re-roll failed wound rolls for attacks made by friendly STARDRAKE and DRACOTH mounts until the end of that phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,     
      },
    ],
  },
  {
    name: `Lord-Celestant`,
    effects: [
      {
        name: `Furious Retribution`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability that is within 3" of an enemy unit. Add 1 to hit rolls for friendly STORMCAST ETERNAL units wholly within 12" of that model when they attack in that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inescapable Vengeance`,
        desc: `Add D3 to the Attacks characteristic of this model’s weapons if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Warcloak`,
        desc: `In your shooting phase, this model can make D6 storm magic strikes. For each strike, pick 1 enemy unit within 16" of this model that is visible to them and roll a dice. On a 4+ that unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord-Castellant`,
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
    ],
  },
  {
    name: `Gryph-Hound`,
    effects: [
      {
        name: `Warning Cry`,
        desc: `If a reserve enemy unit is set up on the battlefield for the first time within 10" of this unit, friendly STORMCAST ETERNAL units wholly within 9" of this unit can attack that reserve unit with all of the missile weapons they are armed with. A unit that uses this ability to attack a reserve unit cannot use this ability to attack another reserve unit in the same phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Darting Attacks`,
        desc: `Each time this unit attacks, it can make a 6" retreat move after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pack Leader Alpha`,
        desc: `If a unit of GRYPH-HOUNDS has 3 or more models, one Gryph‑hound can be a Gryph‑hound Alpha. Add 1 to the Attacks characteristic of a Gryph‑hound Alpha’s Beak and Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Loyal Companion`,
        desc: `Add 2 to the Attacks characteristic of this unit’s Beak and Claws while this unit is wholly within 6" of a friendly LORD-CASTELLANT or LORD-VERITANT.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord-Relictor`,
    effects: [
      {
        name: `Healing Storm`,
        desc: `In your hero phase, you can declare that this model is praying for a healing storm. If you do so, pick a friendly model with the STORMCAST ETERNAL keyword that is within 12" of this model and roll a dice. On a roll of 3 or more you can heal up to D3 wounds that have been suffered by the model that you picked. A Lord-Relictor cannot pray for a healing storm and a lightning storm in the same turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lightning Storm`,
        desc: `In your hero phase, you can declare that the Lord-Relictor will pray for a lightning storm. If you do so, pick an enemy unit that is within 12" of this model and roll a dice. On a roll of 3 or more, the unit you picked suffers D3 mortal wounds, and your opponent must subtract 1 from all hit rolls for the unit until your next hero phase. A Lord-Relictor cannot pray for a lightning storm and a healing storm in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord-Exorcist`,
    effects: [
      {
        name: `Redemptor Casket`,
        desc: `At the start of your shooting phase, roll a dice for each DAEMON or NIGHTHAUNT unit within 6" of this model. On a 4+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Lord-Ordinator`,
    effects: [
      {
        name: `Arcane Engineer`,
        desc: `Add 1 to hit rolls for friendly ORDER WAR MACHINES while wholly within 9" of any friendly LORD-ORDINATORS.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Meteoric Slam`,
        desc: `If you roll 2 or more unmodified hit rolls of 6 for this model’s Astral Hammers, then after its attacks have been resolved that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Comet Strike`,
        desc: `If the unmodified hit roll for an attack made with an Astral Grandhammer is 6, that attack inflicts 2 mortal wounds and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Solemn Duty`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, you do not have to take battleshock tests for friendly STORMCAST ETERNAL units that are wholly within 18" of that model.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Lord-Veritant`,
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
        desc: `In your hero phase, you can pick 1 enemy WIZARD within 7" of this model and roll a dice. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bound in Service`,
        desc: `Add 3 to the unbinding roll for this model’s Lantern of Abjuration if there is a friendly GRYPH-HOUND model within 6" of the enemy WIZARD attempting to cast the spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Knight-Azyros`,
    effects: [
      {
        name: `Illuminator of the Lost`,
        desc: `You can re‑roll hit rolls of 1 for attacks made by friendly units that target enemy units while the enemy unit is within 10" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `The Light of Sigmar`,
        desc: `Once per battle, in your hero phase, this model can use its celestial beacon. If it does so, each enemy unit within 8" of this model suffers D3 mortal wounds. CHAOS units within 8" suffer D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Knight-Venator`,
    effects: [
      {
        name: `Celestial Strike`,
        desc: `If the unmodified wound roll for an attack made with a Star‑eagle’s Celestial Beak and Talons is 6, that attack has a Rend characteristic of ‑3 instead of ‘‑’. `,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Star-fated Arrow`,
        desc: `Once per battle, in your shooting phase, this model can shoot a Star‑fated Arrow. If it does so, until the end of that phase, the Attacks characteristic of this model’s Realmhunter’s Bow is reduced to 1, but it has a Damage characteristic of D3+3 instead of 1. If the target is a HERO or MONSTER, this weapon has a Damage characteristic of D6+3 until the end of that phase instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Knight-Incantor`,
    effects: [
      {
        name: `Voidstorm`,
        desc: `Once per battle, when this model attempts to unbind a spell, instead of making an unbinding roll you can say this model is using its Voidstorm Scroll. If you do so, the spell is automatically unbound (do not roll the dice).`,
        when: [HERO_PHASE],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Knight-Heraldor`,
    effects: [
      {
        name: `Onwards to Glory`,
        desc: `At the start of your movement phase, you can pick a friendly STORMCAST ETERNAL unit wholly within 12" of this model. That unit can retreat and/or run in that movement phase and still charge later in the same turn. `,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Thunderblast`,
        desc: `In your shooting phase, pick a terrain feature wholly within 18" of this model. Each enemy unit within 3" of that terrain feature suffers D3 mortal wounds. `,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Knight-Questor`,
    effects: [
      {
        name: `Heroic Challenge`,
        desc: `If this model is within 6" of an enemy HERO when it makes a pile-in move, it can pile in an extra 3", but must end that pile-in move within 1" of an enemy HERO. In addition you can re-roll failed hit rolls for attacks made by this model against a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thundercharged Strike`,
        desc: `If the unmodified wound roll for an attack made with a Questor Warblade is 6, that attack has a Damage characteristic of 2 instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sigmarite Shield`,
        desc: `Re-roll failed save rolls for attacks that target this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Knight-Vexillor`,
    effects: [
      {
        name: `Icon of War`,
        desc: `You can re‑roll charge rolls for friendly STORMCAST ETERNAL units that are wholly within 18" of this model when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Meteoric Standard`,
        desc: `If this model has a Meteoric Standard, once per battle, in your hero phase, you can pick a point on the battlefield within 24" of this model. Each unit within 2D6" of that point suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pennant of the Stormbringer`,
        desc: `If this model has a Pennant of the Stormbringer, once per battle, at the end of your movement phase, you can pick a friendly STORMCAST ETERNAL unit on the battlefield. Remove that unit from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Knight-Zephyros`,
    effects: [
      {
        name: `Lightning Fast Strikes`,
        desc: `Add 1 to the Attacks characteristic of this model’s Whirlwind Axes if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tireless Hunter`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Windrider`,
        desc: `When a friendly STORMCAST ETERNAL unit within 9" of this model uses their Ride the Winds Aetheric ability, this model can follow in their wake if it has not already made a move in that movement phase. If it does so, immediately move this model up to the distance moved by the unit they are following. This model must end that move within 9" of the unit it is following and more than 3" from any enemy models. If this model uses this ability, it cannot move in that movement phase, and cannot make a charge move later in the same turn`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Drakesworn Templar`,
    effects: [
      {
        name: `Arc Hammer`,
        desc: `If the unmodified hit roll for an attack made with an Arc Hammer is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skybolt Bow`,
        desc: `If you score one or more hits on an enemy unit with this model’s Skybolt Bow, add 1 to hit rolls for attacks made by friendly DRACOTHIAN GUARD units that target that enemy unit until the end of that turn.`,
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
        desc: `After this model makes a pile-in move, this model’s Stardrake can bite one or more enemy models with its cavernous jaws. The number of bites it can make is shown on the damage table above. For each bite, pick one enemy model within 3" of this model and roll a dice. If the roll is greater than that model’s Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Heavens`,
        desc: `At the start of your shooting phase, if this model is on the battlefield, it can either breathe a Roiling Thunderhead or call down a Rain of Stars. If it breathes a Roiling Thunderhead, pick 1 enemy unit within 18" of this model that is visible to it. Roll a dice for each model in that unit that is within 18" of this model. For each 6+ that unit suffers 1 mortal wound.If it calls down a Rain of Stars, pick up to D6 enemy units on the battlefield. Roll a dice for each unit you pick. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sweeping Tail`,
        desc: `Each time this model attacks, roll a dice for each enemy unit within 3" of this model after all of this model’s attacks have been resolved. If the roll is less than the number of models in that enemy unit, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Grand Convocation`,
    effects: [
      {
        name: `Powers Combined`,
        desc: `Add 1 to casting rolls for WIZARDS from this battalion when they are wholly within 9" of two or more other WIZARDS from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hailstorm Battery`,
    effects: [
      {
        name: `Hailstorm Strike`,
        desc: `You can re-roll failed hit rolls for attacks made by the CELESTAR BALLISTA from this battalion if the unit of CASTIGATORS from the same battalion inflicted one or more wounds on the target unit in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Cleansing Phalanx`,
    effects: [
      {
        name: `Channelled Empoowerment`,
        desc: `If a unit of EVOCATORS from this battalion successfully casts their Empower spell on a unit of SEQUITORS from the same battalion, and the spell is not unbound, you can re-roll failed hit rolls for attacks made by the SEQUITORS unit in addition to the effects of the spell.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sacrosanct Chamber`,
    effects: [
      {
        name: `Celestial Fulcrum`,
        desc: `At the start of your hero phase, pick a LORD-ARCANUM from this battalion. That model can attempt to cast 1 additional spell that hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Auxiliary Chamber`,
    effects: [
      {
        name: `Azyrite Hurricane`,
        desc: `Add 1 to the Attacks characteristic of missile weapons used by models from this battalion that are not HEROES.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Angelos Conclave`,
    effects: [
      {
        name: `Aetheric Wake`,
        desc: `When units from this battalion use the Ride the Winds Aetheric ability, roll 9 dice instead of 6 dice when determining the distance moved.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Justicar Chamber`,
    effects: [
      {
        name: `Fight in Concert`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by units of VANGUARD-RAPTORS from this battalion, if the target of that attack is an enemy unit within 18" of any AETHERWING units from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Lightning Echelon`,
    effects: [
      {
        name: `Line-breaker Assault`,
        desc: `Once per battle, at the end of your charge phase, you can make a line-breaker assault with each unit from this battalion that made a charge move that charge phase. Pick one enemy unit within 1" of each unit making a line-breaker assault. That enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Extremis Chamber`,
    effects: [
      {
        name: `Borne by the High Star`,
        desc: `At the start of your first hero phase, you can transport all reserve units from this battalion that are in the Celestial Realm to the battlefield. If you do so, pick a point on the battlefield and set up the units wholly within 24" of that point and more than 9" from any enemy unit. Those units cannot move in the following movement phase. After setting up those units,  roll a dice for each enemy unit within 18" of the point you picked. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Thunderwave Echelon`,
    effects: [
      {
        name: `Ride of the Annihilators`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of one or more units from the same battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Drakesworn Temple`,
    effects: [
      {
        name: `Nova surge`,
        desc: `Once per battle, in your hero phase, you can summon a celestial wave. If you do so, each unit within 3" of any models from this battalion is caught in the celestial wave. Each enemy unit caught in the celestial wave suffers D3 mortal wounds. Heal D3 wounds allocated to each friendly STORMCAST ETERNAL unit caught in the celestial wave.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warrior Chamber`,
    effects: [
      {
        name: `Wrath of the Storm`,
        desc: `You can re-roll failed wound rolls for attacks made by models from this battalion while there are 50 or more models from the same battalion on the battlefield.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Harbinger Chamber`,
    effects: [
      {
        name: `Celestial Nimbus`,
        desc: `Add 1 to hit rolls made by models from this batalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exemplar Chamber`,
    effects: [
      {
        name: `Martial Bond`,
        desc: `If a unit from this battalion is destroyed in the combat phase, pick another unit from the same battalion. Add 1 to the Attacks characteristic of that unit's melee weapons for the rest of the battle. A unit cannot be picked to benefit from this ability more than once per battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Lords of the Storm`,
    effects: [
      {
        name: `Storm-born Commanders`,
        desc: `At the start of your hero phase, if any HEROES from this battalion are on the battlefield, roll a dice. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Thunderhead Brotherhood`,
    effects: [
      {
        name: `Sigmarite Shieldwall`,
        desc: `You can re-roll save rolls of 1 for attacks that target a unit of JUDICATORS from this battalion if that unit is wholly within 3" of a unit of LIBERATORS from the same battalion that has any models carrying a Sigmarite Shield.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Hammerstrike Force`,
    effects: [
      {
        name: `Celestial Supercharge`,
        desc: `In your hero phase, you can pick one unit of PALADINS from this battalion that is wholly within 9" of the unit of PROSECUTORS from the same battalion. If you do so, add 1 to wound rolls for attacks made by the unit you pick until the end of the turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Wing`,
    effects: [
      {
        name: `Bearers of the Storm`,
        desc: `If the unmodified hit roll for an attack made by a unit of LIBERATORS from this battalion that is wholly within 16" of a unit of PROSECUTORS from the same battalion is 6, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Devastation Brotherhood`,
    effects: [
      {
        name: `Crushing Assault`,
        desc: `If an enemy unit suffers wounds from attacks made by all three units of PALADINS from this battalion in the same combat phase, that enemy unit suffers D6 mortal wounds at the end of that combat phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soulstrike Brotherhood`,
    effects: [
      {
        name: `Interception Force`,
        desc: `If any units of VANGUARD-HUNTERS from this battalion were on the battlefield at the start of a turn in which a reserve SACROSANCT unit from the same battalion is set up on the battlefield for the first time, add 1 to the Attacks characteristic of missile weapons used by that SACROSANCT unit in that turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]
