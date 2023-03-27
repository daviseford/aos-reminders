import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  TURN_ONE_START_OF_TURN,
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
const EndrincraftEffect = {
  name: `Endrincraft`,
  desc: `At the start of your hero phase, you can pick 1 friendly SKYVESSEL within 1" of this unit and roll 1 dice for each model in this unit. For each 4+, heal 1 wound allocated to that SKYVESSEL.`,
  when: [START_OF_HERO_PHASE],
}
const GrapnelLauncherEffect = {
  name: `Grapnel Launcher`,
  desc: `While this unit includes any models armed with a grapnel launcher, once per battle, at the end of your movement phase, you can say this unit will reel itself twoards an object. If you do so, pick a point on the battlefield within 15" of this unit and on a terrain feature. Then, remove this unit from the battlefield and set it up again wholly within 3" of that point and more than 9" from all enemy units.`,
  when: [END_OF_MOVEMENT_PHASE],
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

const Units = {
  'Endrinmaster with Dirigible Suit': {
    effects: [EndrinmasterHealEffect('3')],
  },
  'Endrinmaster with Endrinharness': {
    effects: [EndrinmasterHealEffect('3')],
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
        name: `Aetherstorm`,
        desc: `In your hero phase, you can pick 1 enemy unit within 36" of this model that is visible to them and can fly, and roll a D6. On a 1-2 nothing happens. On a 3-5 halve the Move characteristic of that unit until your next hero phase. On a 6, halve the Move characteristic of that unit until your next hero phase, and that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Read the Winds`,
        desc: `You can reroll run and charge rolls for friendly SKYVESSELS that are visible to a friendly AETHERIC NAVIGATOR that has not attempted to use the Aetherstorm ability in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Arkanaut Admiral': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Bring Every Gun to Bear', 'Master of the Skies'])],
    },
    effects: [
      {
        name: `If You Want a Job Done...`,
        desc: `Add 1 to hit rolls for attacks made bv this unit that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
      },
      {
        name: `Protect the Admiral!`,
        desc: `Before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, if this unit is within 3" of any other friendly SKYFARERS units, you can roll a dice. On a 1-2, that wound or mortal wound is allocated to this unit as normal. On a 3+, that wound or mortal wound is allocated to another friendly SKYFARERS unit within 3" of this unit instead and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
      },
      {
        name: `Aether-powered Munitions`,
        desc: `After the players have received their starting command points but before the start of the first turn, you can pick 1 of the following Aether-powered Munitions for this unit to use during the battle:

        Blazebeard and Sons 'Drakk-hobbler' Mag-bolas: Once per battle, at the start of your shooting phase, pick 1 enemy MONSTER within 12" of this unit and roll a dice. On a 2+, that unit is grappled until the end of your opponent's turn. While an enemy unit is grappled, charge rolls made for that unit are made by rolling 1D6 instead of 2D6.

        Celestium Burst-grenade: Once per battle, at the start of your shooting phase, pick 1 enemy unit within 12" of this unit and roll a dice. On a 2+, ward rolls cannot be made for wounds and mortal wounds caused by attacks that target that unit until the end of the phase.

        Grudgebreaker Rounds: Once per battle, at the start of your shooting phase, pick 1 friendly KHARADRON OVERLORDS unit wholly within 12" of this unit that is not a SKYVESSEL. Until the end of that phase, improve the Rend characteristic of that unit's missle weapons by 1. The same unit cannot be picked to benefit from this ability than once in the same phase. `,
        when: [TURN_ONE_START_OF_TURN],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
      },
    ],
  },
  'Grundstok Thunderers': {
    effects: [
      {
        name: `Honour Bearer`,
        desc: `Reroll battleshock tests for units with a Honor Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Choking Fug`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy models within 3" of any friendly models armed with an Aetheric Fumigator. This ability cannot be used by a model that is part of a garrison.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Pin Them, Shred Them, Finish Them`,
        desc: `Add 1 to hit rolls for attacks made with a Grundstok Mortar, Decksweeper or Aethercannon when it is used by a unit that has at least 1 of each of these weapons (i.e. at least 1 Grundstok Mortar, and at least 1 Decksweeper, and at least 1 Aethercannon). This ability cannot be used by a model that is part of a garrison.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Drive Them Back!`,
        desc: `Add 1 to the Attacks characteristic of missile weapons used by this unit while any enemy units are within 3" of this unit. This ability cannot be used by a model that is part of a garrison.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Brokk Grungsson, Lord-Magnate of Barak-Nar': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Command the Fleet'])],
    },
    effects: [
      {
        name: `Custom-built Dirigible Suit`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
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
      EndrincraftEffect,
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
        name: `Drill Cannon`,
        desc: `If the unmodified hit roll for an attack made with a Drill Cannon is 5+, that attack inflicts 3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Escort Vessel`,
        desc: `Roll 1 dice each time you allocate a wound or mortal wound to a friendly SKYVESSEL other than a GRUNDSTOK GUNHAULER while it is within 3" of any friendly GRUNDSTOK GUNHAULERS. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      // Differs from the other Bomb Racks ability
      {
        name: `Bomb Racks`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
      EmbarkedEffect,
      EmbarkingDeployEffect,
      EmbarkingEffect,
      DisembarkEffect,
      DisembarkFromDestroyedVessel,
      SkyCannonEffect,
    ],
  },
  'Arkanaut Frigate': {
    effects: [
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
