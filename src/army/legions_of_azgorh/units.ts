import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Drazhoath the Ashen`,
    effects: [
      {
        name: `Blazing Body`,
        desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of this model. On a 4+,that unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Blood Rage`,
        desc: `You can re-roll wound rolls for attacks made with Cinderbreath's Brazen Horns and Teeth if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hellshard Amulet`,
        desc: `Roll a D6 each time you allocate a wound inflicted by an attack made with a melee weapon to this model. On a 5+, that wound is negated and the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Prophet of Ash and Flame`,
        desc: `Add 1 to casting rolls for this model if the battle is being fought in the Aqshy, the Realm of Fire.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lord of the Black Fortress`,
        desc: `You can use this command ability at the start of the battleshock phase if this model is on the battlefield. If you do so, do not take battleshock tests for friendly Legion of Azgorh units while they are wholly within 24" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Daemonsmith`,
    effects: [
      {
        name: `Ensorcelled Armour`,
        desc: `Add 1 to unbinding rolls for this model if 1 or more wounds have been allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Daemonsmiths are Wizards. They can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield, and Ash Storm spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ash Storm`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 36" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit, and that unit cannot run.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Blood of Hashut`,
        desc: `Do not use the attack sequence for an attack made with the Blood of Hashut. Instead roll a D6. On a 2+ the target unit suffers D3 mortal wounds. If the target unit is a War Machine it suffers D6 mortal wounds instead of D3.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Shar'Tor the Executioner`,
    effects: [
      {
        name: `Darktide Reaping`,
        desc: `If the unmodified hit roll for an attack made with the Darktide Axe is a 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Mask of the Executioner`,
        desc: `At the start of your hero phase, you can pick 1 enemy unit within 8" of this model and roll a D6. On a 1 or 2 nothing happens. On a 3-5 that enemy unit suffers D3 mortal wounds. On a 6, that enemy unit suffers D6 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Trample and Gore`,
        desc: `Add 1 to charge rolls for this unit. In addition, this unit's Crushing Hooves have a Damage characteristic of D3 instead of 1 if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Lord of the Ba'hal`,
        desc: `You can use this command ability at the start of your charge phase if this model is on the battlefield. If you do so, you can re-roll charge rolls for friendly Ba'hal units while they are wholly within 24" of this model in that charge phase. In addition, you can re-roll hit rolls of 1 for attacks made with Crushing Hooves by friendly Ba'hal units while they are wholly within 24" of this model in the subsequent combat phase.`,
        when: [START_OF_CHARGE_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bull Centaur Taur'Ruk`,
    effects: [
      {
        name: `Trample and Gore`,
        desc: `Add 1 to charge rolls for this unit. In addition, this unit's Crushing Hooves have a Damage characteristic of D3 instead of 1 if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Favour of the Burning God`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability. Add 1 to hit rolls for attacks made with melee weapons by friendly Ba'hal units while they are wholly within 12" of that model until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bull Centaur Renders`,
    effects: [
      {
        name: `Spiteshield`,
        desc: `If the unmodified save roll for an attack with a melee weapon that targets a unit that includes any models carrying a Spiteshield is 6, the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Trample and Gore`,
        desc: `Add 1 to charge rolls for this unit. In addition, this unit's Crushing Hooves have a Damage characteristic of D3 instead of 1 if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Infernal Guard Castellan`,
    effects: [
      {
        name: `Pyrelock Pistol`,
        desc: `If the unmodified hit roll for an attack made with a Pyrelock Pistol is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Martial Contempt`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 enemy unit within 12" of a friendly model with this command ability. Until the start of your next hero phase, add 1 to wound rolls for attacks made by friendly Legion of Azgorh units that target that unit. The same enemy unit cannot be picked as the target of this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Infernal Guard Battle Standard Bearer`,
    effects: [
      {
        name: `Icon Bearer`,
        desc: `Add 1 to the Bravery characteristic of friendly Legion of Azgorh units while they are wholly within 18" of this model. In addition, you can reroll wound rolls of 1 for attacks made with melee weapons by friendly Legion of Azgorh units.`,
        when: [BATTLESHOCK_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Infernal Guard Fireglaives`,
    effects: [
      {
        name: `Fireglaive Deathmask`,
        desc: `The leader of this unit is a Fireglaive Deathmask. A Fireglaive Deathmask is armed with an Ashsteel Hand Weapon and Pyrelock Pistol instead of a Pyrelock Fireglaive and a Pyrelock Fireglaive's Bayonet-cleaver.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Icon of Dominion Bearers`,
        desc: `1 model in this unit can be Icon of Dominion Bearer. Add 1 to the Bravery characteristic of a unit that includes an Icon of Dominion Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Drummer`,
        desc: `1 model in this unit can be a Drummer. Add 1 to run rolls for a unit that includes a Drummer.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Infernal Guard Ironsworn`,
    effects: [
      {
        name: `Fireglaive Deathmask`,
        desc: `The leader of this unit is a Fireglaive Deathmask. A Fireglaive Deathmask is armed with an Ashsteel Hand Weapon and Pyrelock Pistol instead of a Pyrelock Fireglaive and a Pyrelock Fireglaive's Bayonet-cleaver.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Icon of Dominion Bearers`,
        desc: `1 model in this unit can be Icon of Dominion Bearer. Add 1 to the Bravery characteristic of a unit that includes an Icon of Dominion Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Drummer`,
        desc: `1 model in this unit can be a Drummer. Add 1 to run rolls for a unit that includes a Drummer.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Pyrelock Pistol`,
        desc: `If the unmodified hit roll for an attack made with a Pyrelock Pistol is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spiteshield`,
        desc: `If the unmodified save roll for an attack with a melee weapon that targets a unit that includes any models carrying a Spiteshield is 6, the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `K'Daai Fireborn`,
    effects: [
      {
        name: `Burning Bright`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this unit. In addition, this unit can run and still charge later in the same turn.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Kiss of Fire`,
        desc: `At the end of the combat phase, roll 1 dice for each enemy unit within 3" of this unit. On a 2+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Deathshrieker Rocket Launcher`,
    effects: [
      {
        name: `Death From on High`,
        desc: `This model's Deathshrieker Rockets can target enemy units that are not visible to the attacking model. In addition, add 1 to hit rolls for attacks made with Deathshrieker Rockets if the target unit has 5 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Infernal Engineers`,
        desc: `Add 1 to the Attacks characteristic of this model's Deathshrieker Rockets while this model is within 3" of a friendly Daemonsmith.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Siege Artillery`,
        desc: `This unit cannot run or make charge moves. In addition, add 1 to save rolls for attacks made with missile weapons that target this model.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Iron Daemon War Engine`,
    effects: [
      {
        name: `Carriage Hauler`,
        desc: `At the start of your movement phase, you can pick 1 friendly Deathshrieker Rocket Launcher, Magma Cannon, or Dreadquake Mortar unit within 1" of this model. If you do so, that unit can use this model's Move characteristic during that movement phase, as long as it is within 1" of this model at the end of that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `More Power!`,
        desc: `In your shooting phase, you can change the Attacks characteristic of this model's Steam Cannonade from 2D6 to either 3D6 or 4D6. However, if you do so and the roll is 12+, this model suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Magma Cannon`,
    effects: [
      {
        name: `Infernal Engineers`,
        desc: `Add 6" to the Range characteristic of this model's Magma Blast while this model is within 3" of a friendly Daemonsmith.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Magma Blast`,
        desc: `Do not use the attack sequence for an attack made with a Magma Blast. Instead, roll a D6.Add 1 to the roll if the target unit has 10 or more models. On a 3+, the target unit suffers a number of mortal wounds equal to the roll.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Siege Artillery`,
        desc: `This unit cannot run or make charge moves. In addition, add 1 to save rolls for attacks made with missile weapons that target this model.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Dreadquake Mortar`,
    effects: [
      {
        name: `Cruel Overlords`,
        desc: `When this model is picked to shoot in your shooting phase, you can say that the Slavemasters are lashing the Slave Ogor. If you do so, roll a D6. On a 1 or 2, this unit suffers D3 mortal wounds (if it is not slain it can shoot normally). On a 3+, add 1 to the Attacks characteristic of this model's Dreadquake Bombs for that phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Infernal Engineers`,
        desc: `Add 1 to hit rolls for attacks made with this model's Dreadquake Bomb while this model is within 3" of a friendly Daemonsmith.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Quake Blast`,
        desc: `This model's Dreadquake Bomb can target enemy units that are not visible to the attacking model. In addition, you can re-roll the dice that determines the Damage characteristic of this model's Dreadquake Bomb if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Siege Artillery`,
        desc: `This unit cannot run or make charge moves. In addition, add 1 to save rolls for attacks made with missile weapons that target this model.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Skullcracker War Engine`,
    effects: [
      {
        name: `Beaten into Scrap`,
        desc: `You can re-roll wound rolls for attacks made with this model's Hammer and Picks that target a War Machine.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Carriage Hauler`,
        desc: `At the start of your movement phase, you can pick 1 friendly Deathshrieker Rocket Launcher, Magma Cannon, or Dreadquake Mortar unit within 1" of this model. If you do so, that unit can use this model's Move characteristic during that movement phase, as long as it is within 1" of this model at the end of that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `More Power!`,
        desc: `In your combat phase, you can change the Attacks characteristic of this model's Hammers and Picks from 2D6 to either 3D6 or 4D6. However, if you do so and the roll is 12+, this model suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Blackshard Warhost`,
    effects: [
      {
        name: `Unyielding Slaughterers`,
        desc: `Add 1 to the Bravery characteristic of units from this battalion. In addition, you can re-roll hit rolls of 1 for attacks made with melee weapons by models from this battalion if that model has not made a move in the same turn.`,
        when: [COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Hashut's Wrath Artillery Train`,
    effects: [
      {
        name: `Murderous Barrage`,
        desc: `Units from this battalion with the Infernal Engineers ability can benefit from that ability as long as the Daemonsmith from the same battalion is on the battlefield (even if the Daemonsmith is not within 3" of the model using the Infernal Engineers ability).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Execution Herd`,
    effects: [
      {
        name: `Marked for Death`,
        desc: `After set-up is complete, but before the battle begins, pick 1 enemy unit to be marked for death. You can re-roll hit rolls for attacks made by units from this battalion that target that unit. If that unit is destroyed, you can choose a new unit to be marked for death in your next hero phase.`,
        when: [END_OF_SETUP, COMBAT_PHASE, HERO_PHASE],
      },
    ],
  },
]
