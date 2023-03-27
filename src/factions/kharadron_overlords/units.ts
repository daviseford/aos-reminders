import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import rule_sources from './rule_sources'

const EmbarkingDeployEffect = {
  name: `Embarking (Deployment)`,
  desc: `During deployment, instead of setting up a SKYFARER unit on the battlefield, you can say that it is embarked in a friendly TRANSPORT VESSEL that is already on the battlefield.`,
  when: [DURING_SETUP],
  shared: true,
}
const EmbarkingEffect = {
  name: `Embarking`,
  desc: `In the movement phase, if a friendly SKYFARER unit finishes a move wholly within 3" of a friendly TRANSPORT VESSEL and both of those units are more than 3" from all enemy units, you can say that the TRANSPORT VESSEL will embark that SKYFARER unit.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const EmbarkedEffect = {
  name: `Embarked`,
  desc: `Embarked units are still treated as being on the battlefield. Range and visiblity is measured to and from the TRANSPORT VESSEL in which the unit is embarked.

  For the purposes of visibilty, models in an embarked unit are treated as models that can fly.

  Embarked units are in cover. In addition, subtract 1 from hit rolls for attackes that target embarked units.

  Models in an embarked unit cannot contest objectives.

  Embarked units cannot move. However when a TRASNPORT VESSEL finished any type of move, all units embarked in it are considered to have made the same type of move.`,
  when: [DURING_GAME],
  shared: true,
}
const DisembarkEffect = {
  name: `Disembarking`,
  desc: `In your movement phase, if a friendly SKYFARER unit is embarked in a TRANSPORT VESSEL that has not yet moved in that phase, you can say that the SKYFARER unit will disembark. If you do so, set up that SKYFARER unit wholly within 3" of that TRANSPORT VESSEL and more than 3" from all enemy units. A unit disembarks in this way can still move in the same turn.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const DisembarkFromDestroyedVessel = {
  name: `Disembarking from a Destroyed Vessel`,
  desc: `If a friendly TRANSPORT VESSEL is destroyed, before removing it from play, roll a number of dice equal to the number of models embarked in it. For each roll of 1, 1 embarked model is slain (you choose which models are slain). Then, all units embarked in that TRANSPORT VESSEL must immediately disembark before it is removed from play.

  When a unit disembarks, if a model cannot be set up wholly within 3" of the TRANSPORT VESSEL in which it is embared and more than 3" from all enemy units, it is slain.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const FlyingTransportEffect = {
  name: `Flying Transport`,
  desc: `This model can fly. In addition, up to 12 (22 for Ironclad) SKYFARER models can be embarked in it. If this unit is part of an army that is not a Kharadron Overlords army, it can still use the Sky-fleets battle trait (Embark/Disembark rules).`,
  when: [DURING_GAME],
  shared: true,
}
const SkyCannonEffect = {
  name: `Sky Cannon`,
  desc: `Before attacking with a Sky Cannon, choose either the Shrapnel or Shell missile weapon characteristics for that shooting attack.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const AetherKhemistEffects = [
  {
    name: `Aetheric Augmentation`,
    desc: `At the start of your shooting phase, if this unit is not embarked, you can pick 1 friendly SKYFARERS unit that is not embarked and is wholly within 12" of this unit. Improve the Rend characteristic of that unit's missile weapons by 1 until the end of that phase. That same unit cannot be affects by this ability more than once per phase.`,
    when: [SHOOTING_PHASE],
    rule_sources: [rule_sources.BATTLETOME_KHARADRON_OVERLORDS, rule_sources.ERRATA_MARCH_2023],
  },
  {
    name: `Atmospheric Isolation`,
    desc: `Subtract 1 from hit rolls for attacks made by enemy models while they are within 3" of any friendly units with this ability that are not embarked.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
]
const SkyhookEffect = {
  name: `Skyhook`,
  desc: `The Damage characteristic of this unit's Skyhook or Light Skyhook is 3 if the target of the attack is a MONSTER.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const ShipSkyhookEffect = {
  name: `Skyvessel Skyhook`,
  desc: `The Damage characters of this unit's Great Skyhook or Heavy Skyhook is 6 if that target is a MONSTER. In addition, if an attack is made with this unit's Great/Heavy Skyhook scores a hit on a MONSTER, if that MONSTER is not slain, after that attack has been resovled, roll a dice. On a 4+, that MONSTER is snagged until the end of the turn. While a MONSTER is snagged, it cannot carry out monstrous rampages. A MONSTER cannot be snagged more than once in the same turn.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const GrapnelLauncherEffect = {
  name: `Grapnel Launcher`,
  desc: `While this unit includes any models armed with a grapnel launcher, once per battle, at the end of your movement phase, you can say this unit will reel itself twoards an object. If you do so, pick a point on the battlefield within 15" of this unit and on a terrain feature. Then, remove this unit from the battlefield and set it up again wholly within 3" of that point and more than 9" from all enemy units.`,
  when: [END_OF_MOVEMENT_PHASE],
  shared: true,
}
const BulwarksOfIron = {
  name: `Bulwarks of Iron`,
  desc: `This unit counts as 5 models for the purposes of contesting objectives.`,
  when: [DURING_GAME],
  shared: true,
}
const BombRacksEffect = {
  name: `Bomb Racks`,
  desc: `After this unit finishes a normal move or a run, you can pick 1 enemy unit that this unit passed across and roll a number of dice equal to the Bomb Racks value shown on this unit's damage table. For each 4+, that enemy unit suffers 1 mortal wound. This ability has no effect on units that can fly.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const EndrinmasterHealEffect = (val: '3' | 'D3') => ({
  name: `Endrinmaster`,
  desc: `At the start of your hero phase, you can pick 1 friendly SKYVESSEL within 1" of this model. Heal up to ${val} wounds allocated to that SKYVESSEL.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
})
const DrillEffect = (nVal: 'Cannon' | 'Launcher', rVal: '5+' | '6') => ({
  name: `Drill ${nVal}`,
  desc: `If the unmodified hit roll for an attack made with a Drill ${nVal} is ${rVal}, that attack causes 3 mortal wounds to the target and the attack sequence ends.`,
  when: [SHOOTING_PHASE],
  shared: true,
})

const Units = {
  Codewright: {
    effects: [
      {
        name: `Advisory Role`,
        desc: `At the start of your hero phase, if this unit is within 6" of another friendly KHARADRON OVERLORDS HERO, roll 2 dice. For each 4+, you receieve 1 command point.`,
        when: [HERO_PHASE],
      },
      {
        name: `I Think You'll Find...`,
        desc: `A Codewright can carry out the "Search for a Precedent" heroic action instead of any other heroic action. Roll a dice. On a 1, nothing happens. On a 2-3, you can pick a new footnote to apply to your army until the end of the battle. On a 4+ you can pick a new footnote and/or amendment until the end of the battle. You cannot pick a footnote or amendment previously picked for your army. The new footnote/amendment replaces your current one.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Endrinmaster with Dirigible Suit': {
    effects: [
      {
        name: `By Grungi, I Have My Eye On You!`,
        desc: `Add 1 to field repairs rolls made for friendly ENDRINRIGGERS units while they are wholly within 12" of this unit.`,
        when: [DURING_GAME],
      },
      EndrinmasterHealEffect('3'),
    ],
  },
  'Endrinmaster with Endrinharness': {
    effects: [
      {
        name: `'Aye Aye, Captain!`,
        desc: `At the start of your hero phase, if this unit is embarked and it has not yet used its Endrinmaster ability, you can say that this unit will attempt to crank up the power. If you do so, roll a dice. On a 1, the TRANSPORT VESSEL in which this unit is embarked suffers D3 mortal wounds and the Endrinmaster ability cannot be used by this unit in this phase. On a 2+, until the end of the turn, you can use the top row of that TRANSPORT VESSEL's damage table, regardless of how many wounds it has suffered.`,
        when: [HERO_PHASE],
      },
      EndrinmasterHealEffect('3'),
    ],
  },
  'Aether-Khemist': {
    effects: [...AetherKhemistEffects],
  },
  'Bjorgen Thundrik': {
    effects: [
      {
        name: `Toxic Gases`,
        desc: `Once per battle, at the start of the combat phase, you can say this unit will release toxic gases. If you do so, for each enemy unit within 6" of this unit, roll a number of dice equal to the number of models in that unit that are within 6" of this unit. For each 5+, that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Paymaster`,
        desc: `Once per turn, this unit can issue a command to a friendly THUNDRIK's PROFITEERS unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Thundrik's Profiteers": {
    effects: [
      {
        name: `Khazgan Drakkskewer`,
        desc: `Khazgan Drakkskewer has a Wounds characteristic of 3. In addition, Khazgan Drakkskewer can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Protect the Boss`,
        desc: `While this unit is wholly within 3" of a friendly BJORGEN THUNDRIK, he has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Aetheric Navigator': {
    effects: [
      {
        name: `Aethersight`,
        desc: `This model can attempt to unbind 1 spell in the enemy hero phase, in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aethersight`,
        desc: `This model can attempt to dispel 1 endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Read the Winds`,
        desc: `In your hero phase, you can say that 1 friendly unit with this ability will read the winds. If you do so, roll 6 dice. Then pick 1 of the following effects:

        Aetherstorm: For each roll of 1, pick 1 different enemy unit within 30" of this unit and visible to this unit. That enemy unit suffers D3 mortal wounds. In addition. If any mortal wounds caused by this ability are allocated to an enemy unit and not negated, halve that unit's Move characteristic until the start of your next hero phase.

        Favourable Conditions: For each roll of 6, pick 1 different friendly SKYVESSEL within 30" of this unit and visible to this unit. That SKYVESSEL can make a normal move of D3+3"`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Arkanaut Admiral': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Bring Every Gun to Bear', 'Command the Skies'])],
    },
    effects: [
      {
        name: `The Admiral's Flagship`,
        desc: `If this unit is the general of a Kharadron Overlords army, you can pick 1 ARKANAUT IRONCLAD or ARKANAUT FRIGATE in the army to be its flagship. Record this information on your army roster. Once per turn, this unit can issue a command to its flagship without a command point being spent.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Grudgebreaker Rounds`,
        desc: `Once per battle, at the start of your shooting phase, pick 1 friendly KHARADRON OVERLORDS unit wholly within 12" of this unit that is not a SKYVESSEL. Until the end of that phase, improve the Rend characteristic of that unit's missle weapons by 1. The same unit cannot be picked to benefit from this ability than once in the same phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Grundstok Thunderers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Gunnery Sergeant. Add 2 to the Attacks characteristic of that model's Aethershot Rifle.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be an Honour Bearer. Add 1 to the Bravery characteristic of this unit if it includes any Honour Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Choking Fug - Shooting`,
        desc: `Attacks made with an Aetheric Fumigator automatically hit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Choking Fug - Combat`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 3" of a model in this unit that is armed with an Aetheric Fumigator. If you do so, roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Explosive Shells`,
        desc: `The Attacks characteristic of a Grundstok Mortar is equal to the number of models in the target unit, to a maximum Attacks characteristic of 5.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Suppressing Fire`,
        desc: `Each time this unit shoots, after all of its attacks have been resolved, if every model in this unit shot and targeted the same enemy unit, roll 2D6. Add to the roll the number of wounds caused by those attacks that were allocated to that enemy unit and not negated. If the score exceeds that enemy unit's Bravery characteristic, it is suppressed until the start of your next hero phase. Subtract 1 from hit rolls for attacks made by a unint is suppressed. A unit cannot be suppressed more than once at the same time.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Drillbill`,
        desc: `Each time this unit fights, once all of its attacks have been resolved, if this unit includes a Gunnery Sergeant, pick 1 enemy unit within 3" of its Gunnery Sergean and roll a dice. On a 5+, that enemy unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Brokk Grungsson, Lord-Magnate of Barak-Nar': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Command the Fleet'])],
    },
    effects: [
      {
        name: `Moustache-mounted Aetherblasters`,
        desc: `Each time this unit fights, after all of its attacks have been resolved, you can pick 1 enemy unit within 3" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `First Rule of Grungsson`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Attacks characteristic of melee weapons used by friendly BARAK-NAR SKYFARER units while they are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Skywardens: {
    effects: [
      {
        name: `Custodian`,
        desc: `1 model in this unit can be a Custodian. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Timed Charges`,
        desc: `Roll 1 dice for each enemy unit that is within 3" of this unit immediately before this unit makes a retreat move. On a 4+, the unit being rolled for suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      SkyhookEffect,
      GrapnelLauncherEffect,
    ],
  },
  Endrinriggers: {
    effects: [
      {
        name: `Mizzenmaster`,
        desc: `1 model in this unit can be a Mizzenmaster. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Emergency Field Repairs`,
        desc: `Once per turn, at the end of any phase, if this unit is more than 3" from all enemy units, you can say this unit will carry out emergency field repairs. If you do so, pick 1 friendly SKYVESSEL within 3" of this unit and roll a dice for each model in this unit. Each of these rolls is called a field repairs roll. For each 4-5, you can heal 1 wound allocated to that SKYVESSEL. For each 6+, you can heal 2 wounds instead.`,
        when: [DURING_GAME],
      },
      DrillEffect('Launcher', '6'),
      SkyhookEffect,
      GrapnelLauncherEffect,
    ],
  },
  'Arkanaut Company': {
    effects: [
      {
        name: 'Champion',
        desc: '1 model in this unit can be a Company Captain. That model is army with an Aetherflare Pistol or Volley Pistol instead of a Privateer Pistol.',
        when: [SHOOTING_PHASE],
      },
      {
        name: `Glory-seekers`,
        desc: `While this unit is not embarked, add 1 to hit rolls for attacks made by this unit that target a unit contesting an objective.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      SkyhookEffect,
    ],
  },
  'Grundstok Gunhauler': {
    effects: [
      {
        name: `Ahead Full`,
        desc: `Once per battle, at the start of your movement phase, you can say that this model will move ahead full. If you do so, add 6" to the Move characteristic of this model in that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Escort Vessel`,
        desc: `Friendly SKYVESSELS other than GRUNDSTOK GUNHAULERS have a ward of 6+ while they are within 3" of any friendly GRUNDSTOK GUNHAULERS.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      BombRacksEffect,
      EmbarkedEffect,
      EmbarkingDeployEffect,
      EmbarkingEffect,
      DisembarkEffect,
      DisembarkFromDestroyedVessel,
      DrillEffect('Cannon', '5+'),
      SkyCannonEffect,
    ],
  },
  'Arkanaut Frigate': {
    effects: [
      {
        name: `Assault Boat`,
        desc: `After this unit finishes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the Ramming Dice value shown on this unit's damage table. For each 4+, that enemy unit suffers 1 mortal wound. Then, you can pick any friendly units embarked in this unit to disembark. Units that disembark in this way must be set up within 3" of an enemy unit and count as having made a charge move. In addition, in the following combat phase, the strike-first effect applies to units that disembarked in this way.`,
        when: [CHARGE_PHASE],
      },
      BulwarksOfIron,
      BombRacksEffect,
      FlyingTransportEffect,
      EmbarkedEffect,
      EmbarkingDeployEffect,
      EmbarkingEffect,
      DisembarkEffect,
      DisembarkFromDestroyedVessel,
      ShipSkyhookEffect,
      SkyCannonEffect,
    ],
  },
  'Arkanaut Ironclad': {
    effects: [
      {
        name: `Supremacy Mine`,
        desc: `Once per battle, at the end of the enemy charge phasem you can say this unit will drop its supremacy mine. If you do so, pick 1 enemy unit within 3" of this unit and roll a dice. On a 2+, that enemy unit suffers a number of mortal wounds equal to the roll.`,
        when: [END_OF_CHARGE_PHASE],
      },
      BulwarksOfIron,
      BombRacksEffect,
      FlyingTransportEffect,
      EmbarkedEffect,
      EmbarkingDeployEffect,
      EmbarkingEffect,
      DisembarkEffect,
      DisembarkFromDestroyedVessel,
      ShipSkyhookEffect,
      SkyCannonEffect,
    ],
  },
  'Drekki Flynt': {
    effects: [
      {
        name: `Captain of the Aelsling`,
        desc: `You can pick 1 Barak-Mhornar Arkanaut Frigate in your army to be the Aelsling. This unit you pick cannot also be picked to be a flagship. Record this information on your roster. Add 1 to the Damage characteristic of that unit's Boarding Weapons.`,
        when: [START_OF_GAME, COMBAT_PHASE],
      },
      {
        name: `Let Me Drive!`,
        desc: `You can reroll run rolls and charge rolls made for the Aelsling while this unit is embarked in it.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },

      {
        name: `Auxiliary Skyhook`,
        desc: `Each time this unit fights, after all of its attacks have been resolved, you can pick 1 enemy Monster within 3" of this unit and roll a dice. On a 2+, that Monster suffers 3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Light-fingered`,
        desc: `At the start of the combat phase, if this unit is within 1" of an enemy Hero that has an artefact of power, you can say that Drekki will try to 'borrow' that artefact. If you do so, roll a dice. On a 3+, that artefact of power can no longer be used (if a weapon was picked when the artefact of power was selected, that weapon reverts to normal). This ability cannot be used while this unit is embarked.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
