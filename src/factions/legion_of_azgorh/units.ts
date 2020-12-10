import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const InfernalGuardBaseEffects = [
  {
    name: `Fireglaive Deathmask`,
    desc: `The leader of this unit is a Fireglaive Deathmask. A Fireglaive Deathmask is armed with an Ashsteel Hand Weapon and Pyrelock Pistol instead of a Pyrelock Fireglaive and a Pyrelock Fireglaive's Bayonet-cleaver.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Icon of Dominion Bearers`,
    desc: `Add 1 to the Bravery characteristic of a unit that includes an Icon of Dominion Bearer.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Drummer`,
    desc: `Add 1 to run rolls for a unit that includes a Drummer.`,
    when: [MOVEMENT_PHASE],
  },
]
const TrampleAndGoreEffect = {
  name: `Trample and Gore`,
  desc: `Add 1 to charge rolls for this unit. In addition, this unit's Crushing Hooves have a Damage characteristic of D3 instead of 1 if this unit made a charge move in the same turn.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
}
const PyrelockPistolEffect = {
  name: `Pyrelock Pistol`,
  desc: `If the unmodified hit roll for an attack made with a Pyrelock Pistol is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
  when: [SHOOTING_PHASE],
}
const SpiteshieldEffect = {
  name: `Spiteshield`,
  desc: `If the unmodified save roll for an attack with a melee weapon that targets a unit that includes any models carrying a Spiteshield is 6, the attacking unit suffers 1 mortal wound.`,
  when: [SAVES_PHASE],
}
const CarriageHaulerEffect = {
  name: `Carriage Hauler`,
  desc: `At the start of your movement phase, you can pick 1 friendly Deathshrieker Rocket Launcher, Magma Cannon, or Dreadquake Mortar unit within 1" of this model. If you do so, that unit can use this model's Move characteristic during that movement phase, as long as it is within 1" of this model at the end of that movement phase.`,
  when: [START_OF_MOVEMENT_PHASE],
}
const SiegeArtilleryEffects = [
  {
    name: `Siege Artillery`,
    desc: `This unit cannot run or make charge moves.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Siege Artillery`,
    desc: `Add 1 to save rolls for attacks made with missile weapons that target this model.`,
    when: [SAVES_PHASE],
  },
]

const Units = {
  'Drazhoath the Ashen': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lord of the Black Fortress'])],
    },
    effects: [
      {
        name: `Blazing Body`,
        desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of this model. On a 4+,that unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Blood Rage`,
        desc: `You can reroll wound rolls for attacks made with Cinderbreath's Brazen Horns and Teeth if this model made a charge move in the same turn.`,
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
    ],
  },
  Daemonsmith: {
    mandatory: {
      spells: [keyPicker(Spells, ['Ash Storm'])],
    },
    effects: [
      {
        name: `Ensorcelled Armour`,
        desc: `Add 1 to unbinding rolls for this model if 1 or more wounds have been allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Daemonsmiths are WIZARDS. They can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield, and Ash Storm spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood of Hashut`,
        desc: `Do not use the attack sequence for an attack made with the Blood of Hashut. Instead roll a D6. On a 2+ the target unit suffers D3 mortal wounds. If the target unit is a War Machine it suffers D6 mortal wounds instead of D3.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Shar`Tor the Executioner': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lord of the Ba`hal'])],
    },
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
      TrampleAndGoreEffect,
    ],
  },
  'Bull Centaur Taur`Ruk': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Favour of the Burning God'])],
    },
    effects: [TrampleAndGoreEffect],
  },
  'Bull Centaur Renders': {
    effects: [SpiteshieldEffect, TrampleAndGoreEffect],
  },
  'Infernal Guard Castellan': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Martial Contempt'])],
    },
    effects: [PyrelockPistolEffect],
  },
  'Infernal Guard Battle Standard Bearer': {
    effects: [
      {
        name: `Icon Bearer`,
        desc: `Add 1 to the Bravery characteristic of friendly Legion of Azgorh units while they are wholly within 18" of this model. In addition, you can reroll wound rolls of 1 for attacks made with melee weapons by friendly Legion of Azgorh units.`,
        when: [BATTLESHOCK_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Infernal Guard Fireglaives': {
    effects: [...InfernalGuardBaseEffects],
  },
  'Infernal Guard Ironsworn': {
    effects: [...InfernalGuardBaseEffects, PyrelockPistolEffect, SpiteshieldEffect],
  },
  'K`Daai Fireborn': {
    effects: [
      {
        name: `Burning Bright`,
        desc: `This unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Burning Bright`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this unit.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Kiss of Fire`,
        desc: `At the end of the combat phase, roll 1 dice for each enemy unit within 3" of this unit. On a 2+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Deathshrieker Rocket Launcher': {
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
      ...SiegeArtilleryEffects,
    ],
  },
  'Iron Daemon War Engine': {
    effects: [
      CarriageHaulerEffect,
      {
        name: `More Power!`,
        desc: `In your shooting phase, you can change the Attacks characteristic of this model's Steam Cannonade from 2D6 to either 3D6 or 4D6. However, if you do so and the roll is 12+, this model suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Magma Cannon': {
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
      ...SiegeArtilleryEffects,
    ],
  },
  'Dreadquake Mortar': {
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
        desc: `This model's Dreadquake Bomb can target enemy units that are not visible to the attacking model. In addition, you can reroll the dice that determines the Damage characteristic of this model's Dreadquake Bomb if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      ...SiegeArtilleryEffects,
    ],
  },
  'Skullcracker War Engine': {
    effects: [
      {
        name: `Beaten into Scrap`,
        desc: `You can reroll wound rolls for attacks made with this model's Hammer and Picks that target a War Machine.`,
        when: [COMBAT_PHASE],
      },
      CarriageHaulerEffect,
      {
        name: `More Power!`,
        desc: `In your combat phase, you can change the Attacks characteristic of this model's Hammers and Picks from 2D6 to either 3D6 or 4D6. However, if you do so and the roll is 12+, this model suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs({ ...Units }, 'unit')
