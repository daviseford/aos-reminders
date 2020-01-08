import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  TURN_ONE_DURING_ROUND,
  TURN_ONE_HERO_PHASE,
  WOUND_ALLOCATION,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const FlyingTransportEffect = {
  name: `FLYING TRANSPORT`,
  desc: `This model can fly, and can be garrisoned by up to 15 friendly Marine models even though it is not a terrain feature.

  Halve this model's Move characteristic and it cannot Fly High if there are 11 or more models in its garrison. Units cannot join or leave this model's garrison if it has made a move or flown high in the same phase (they can join or leave before it does so). Models in the garrison are not counted towards gaining control of an objective.

  An attack made by a weapon that is in range of this model can target either this model or a unit in its garrison. If this model is destroyed, before it is removed from play, roll 1 dice for each model in its garrison. On a 1, that model is slain. Set up any surviving models wholly within 3" of this model and more than 3" from any enemy units.`,
  when: [DURING_GAME],
}
const DisengageEffect = {
  name: `Disengage`,
  desc: `This model and any models in its garrison can still shoot if this model retreats in the same turn, as long as there are no enemy units that can fly within 3" of this model at the start of the retreat move and there are less than 10 wounds allocated to this model at the start of the retreat move.`,
  when: [MOVEMENT_PHASE, SHOOTING_PHASE],
}
const FlyHighEffect = {
  name: `Fly High`,
  desc: `Instead of making a normal move with this model, if there are less than 7 wounds currently allocated to this model, you can say that it will fly high (it can retreat and disengage). If you do so, remove this model from the battlefield and set it up again more than 1" from any terrain features or objectives and more than 9" from any enemy models.`,
  when: [MOVEMENT_PHASE],
}
const SkyCannonEffect = {
  name: `Sky Cannon`,
  desc: `Before attacking with a Sky Cannon, choose either the Shrapnel or Shell missile weapon characteristics for that shooting attack.`,
  when: [SHOOTING_PHASE],
}
const AetherKhemistEffects = [
  {
    name: `Aetheric Augmentation`,
    desc: `Pick a friendly SKYFARERS unit within 10" and then select one type of weapon carried by that unit. Until your next hero phase, add 1 to the attacks characteristic of that weapon. A weapon cannot be augmented more than once per hero phase.`,
    when: [HERO_PHASE],
  },
  {
    name: `Atmospheric Isolation`,
    desc: `Subtract 1 from the attacks characteristic for all enemy melee weapons on models within 3" (Min 1).`,
    when: [START_OF_COMBAT_PHASE],
  },
]
const GlorySeekersEffects = [
  {
    name: `Glory Seekers`,
    desc: `You can re-roll battleshock tests for this unit while it is wholly within 9" of an objective. This ability cannot be used if this unit is part of a garrison.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Glory Seekers`,
    desc: `You can add 1 to hit rolls for attacks made by this unit while it is wholly within 9" of an objective. This ability cannot be used if this unit is part of a garrison.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
]
const getSkyhookEffect = (val: number) => ({
  name: `Skyhook`,
  desc: `Add ${val} to charge rolls for this unit if it is armed with a Skyhook.`,
  when: [CHARGE_PHASE],
})
const HitchersEffect = {
  name: `Hitchers`,
  desc: `If this model is wholly within 6" of a friendly SKYVESSEL immediately before the SKYVESSEL uses its Fly High ability, you can say that this model will hitch a lift instead of making a normal move (as long as this model has not already made a normal move in the same phase).

  If you do so, after that SKYVESSEL has moved, remove this model from the battlefield and set it up again wholly within 6" of that SKYVESSEL, more than 1" from any terrain features or objectives and more than 9" from any enemy models.

  No more than 7 models can hitch a lift on the same SKYVESSEL in the same turn.`,
  when: [MOVEMENT_PHASE],
}
const EndrincraftEffect = {
  name: `Endrincraft`,
  desc: `At the start of your hero phase, you can pick 1 friendly SKYVESSEL within 1" of this unit and roll 1 dice for each model in this unit. For each 4+, heal 1 wound allocated to that SKYVESSEL.`,
  when: [START_OF_HERO_PHASE],
}
const GrapnelLauncherEffect = {
  name: `Grapnel Launcher`,
  desc: `Enemy units cannot retreat if they are within 3" of any models from this unit armed with a Grapnel Launcher.`,
  when: [MOVEMENT_PHASE],
}
const BombRacksEffect = {
  name: `Bomb Racks`,
  desc: `At the start of the combat phase, you can pick 1 enemy unit within 1" of this model and roll a dice. Add the Bomb Rack modifier from this model's damage table to the roll. On a 4+, that enemy unit suffers D3 mortal wounds.`,
  when: [START_OF_COMBAT_PHASE],
}
const SkyminesEffect = {
  name: `Skymines`,
  desc: `If an enemy unit that can fly ends a charge move within 1" of any friendly units with this ability, you can roll 1 dice for each model in that enemy unit. For each 6, that unit suffers 1 mortal wound.`,
  when: [CHARGE_PHASE],
}
const AethericNavigationEffect = {
  name: `Aetheric Navigation`,
  desc: `This model can move an extra D3" if a friendly Aetheric Navigator is visible to it.`,
  when: [MOVEMENT_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Endrinmaster`,
    effects: [
      {
        name: `Endrincraft`,
        desc: `One SKYVESSEL that an Endrinrigger is embarked on or within 3" of immediately heals D3 wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Supercharged Harness`,
        desc: `Roll a D6. On a 1, suffer a mortal wound. On a 3+, the damage characteristic of the Aethermight Hammer is 3 until the end of this phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aether-Khemist`,
    effects: [...AetherKhemistEffects],
  },
  {
    name: `Bjorgen Thundrik`,
    effects: [...AetherKhemistEffects],
  },
  {
    name: `Thundrik's Profiteers`,
    effects: [
      {
        name: `Khazgan Drakkskewer`,
        desc: `Khazgan has +1 Wounds and is treated as if he can fly when moving.`,
        when: [DURING_GAME],
      },
      ...GlorySeekersEffects,
    ],
  },
  {
    name: `Aetheric Navigator`,
    effects: [
      {
        name: `Aethersight`,
        desc: `This model can attempt to unbind 1 spell each enemy hero phase as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aetherstorm`,
        desc: `Roll a D6. On a 3+, all enemy units that can fly halve their movement characteristic if they start within 18" of this model, until your next hero phase. The Aetheric Navigator cannot use Read the Winds the same turn Aetherstorm is used.`,
        when: [HERO_PHASE],
      },
      {
        name: `Read the Winds`,
        desc: `If the Navigator does not move, re-roll run/charge rolls for all visible SKYVESSELS. Cannot use in same turn as Aetherstorm. If the Aetheric Navigator is embarked, Read the Winds only affects the SKYVESSEL they are embarked upon.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Arkanaut Admiral`,
    effects: [
      {
        name: `If You Want A Job Done...`,
        desc: `You can re-roll hit and wound rolls of 1 for attacks made with a melee weapon by this model that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Protect the Admiral!`,
        desc: `Do not take battleshock tests for friendly KHARADRON OVERLORDS units while they are wholly within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Protect the Admiral!`,
        desc: `Roll a dice before you allocate a wound or mortal wound to a friendly ARKANAUT ADMIRAL while it is within 3" of any friendly SKYFARERS units with 5 or more models. On a 5+, you must allocate that wound or mortal wound to a friendly SKYFARERS unit with 5 or more models that is within 3" of that ARKANAUT ADMIRAL, instead of to that ARKANAUT ADMIRAL.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Master of the Skies`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. That SKYVESSEL can shoot in that phase even if it ran earlier in the same turn.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `On My Mark, Fire!`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. You can re-roll hit rolls of 1 for attacks made by that SKYVESSEL in that phase.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Repel Boarders!`,
        desc: `You can use this command ability at the start of your combat phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. Add 1 to hit rolls for attacks made by that SKYVESSEL and any models in its garrison in that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Up And At Them!`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly SKYFARERS unit that is wholly within 12" of a friendly model with this command ability. You can re-roll charge rolls for that unit in that phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Grundstok Thunderers`,
    effects: [
      {
        name: `Honour Bearer`,
        desc: `Re-roll battleshock tests for units with a Honor Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Drillbill`,
        desc: `If an enemy unit ends its charge within 1" of a unit with a drillbill, roll a die. On 2+ the charging unit suffer a mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Keep your Distance`,
        desc: `When you choose this unit to attack, instead you can retreat, making a move/run out of combat instead. May not embark.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Choking Fug`,
        desc: `Enemy models that end their charge within 2" of a model with an Aetheric Fumigator subtract 1 from the attacks characterstics of melee weapons to a minimum of 1 until the end of the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pin Them, Shred Them`,
        desc: `If a model armed with a Grundstok Mortar causes unsaved wounds this phase, you can re-roll the number of shots for models armed with Decksweepers, if they target the same unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Finish Them`,
        desc: `If a model armed with a Decksweeper causes unsaved wounds this phase, you can re-roll hit and damage rolls for models armed with Aethercannons, if they target the same unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Brokk Grungsson, Lord-Magnate of Barak-Nar`,
    effects: [
      {
        name: `Custom-built Dirigible Suit`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Endrinharness`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this model is 6, that attack inflicts D3 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      HitchersEffect,
      {
        name: `First Rule of Grungsson`,
        desc: `You can use this command ability at the start of your charge phase if a friendly model with this command ability is on the battlefield. If you do so, pick 1 friendly model with this command ability. You can re-roll charge rolls for friendly BARAK-NAR units that are wholly within 24" of that model until the end of that phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skywardens`,
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
      getSkyhookEffect(1),
      GrapnelLauncherEffect,
      HitchersEffect,
      SkyminesEffect,
    ],
  },
  {
    name: `Endrinriggers`,
    effects: [
      {
        name: `Mizzenmaster`,
        desc: `1 model in this unit can be a Mizzenmaster. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      EndrincraftEffect,
      getSkyhookEffect(1),
      GrapnelLauncherEffect,
      HitchersEffect,
    ],
  },
  {
    name: `Arkanaut Company`,
    effects: [...GlorySeekersEffects],
  },
  {
    name: `Grundstok Gunhauler`,
    effects: [
      FlyHighEffect,
      DisengageEffect,
      BombRacksEffect,
      {
        name: `Ahead Full`,
        desc: `Once per battle, at the start of your movement phase, you can say that this model will move ahead full. If you do so, add 6" to the Move characteristic of this model in that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Escort Vessel`,
        desc: `Roll 1 dice each time you allocate a wound or mortal wound to a friendly SKYVESSEL other than a GRUNDSTOK GUNHAULER while it is within 3" of any friendly GRUNDSTOK GUNHAULERS. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Drill Cannon`,
        desc: `If the unmodified hit roll for an attack made with a Drill Cannon is 5+, that attack inflicts 3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
      SkyCannonEffect,
    ],
  },
  {
    name: `Arkanaut Frigate`,
    effects: [
      BombRacksEffect,
      DisengageEffect,
      FlyHighEffect,
      FlyingTransportEffect,
      SkyCannonEffect,
      getSkyhookEffect(2),
    ],
  },
  {
    name: `Arkanaut Ironclad`,
    effects: [
      BombRacksEffect,
      DisengageEffect,
      FlyHighEffect,
      FlyingTransportEffect,
      SkyCannonEffect,
      getSkyhookEffect(2),
      {
        name: `Aetheric Navigator and Endrinrigger`,
        desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aetheric Navigator and Endrinrigger`,
        desc: `You can re-roll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Grand Armada`,
    effects: [
      {
        name: `On a War Footing`,
        desc: `All SKYVESSELS can make a move.`,
        when: [TURN_ONE_HERO_PHASE],
      },
      {
        name: `Constitutional Experts`,
        desc: `While Admiral and one HERO are alive, you can use footnotes (except from 'These are Just Guidelines') once per round.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Iron Sky Command`,
    effects: [
      {
        name: `Lord of the Skies`,
        desc: `Friendly units with 12" of Ironclad subtract 1 from battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Trusted Bodyguard`,
        desc: `When HERO within 3" of Arkanaut Company. Wound / mortal wound on 5+ transfered to Arkanaut Company.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Iron Sky Squadron`,
    effects: [
      {
        name: `Bold Privateers`,
        desc: `When Arkanaut Company disembarks, re-roll run and charges that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Opening Salvo`,
        desc: `+1 attacks to all missile weapons on Frigates.`,
        when: [TURN_ONE_DURING_ROUND],
      },
    ],
  },
  {
    name: `Grundstok Escort Wing`,
    effects: [
      {
        name: `Focus Fire`,
        desc: `+1 to hit rolls vs one targeted enemy unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aetherstrike Force`,
    effects: [
      {
        name: `Marked for Destruction`,
        desc: `Knight-Venator can use Star-fated Arrow. If target is hit but not slain, +1 hit rolls against target for battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lightning-fast Volleys`,
        desc: `Choose single unit (not Knight-Venator) within 6" of two battalion units; chosen unit can make shooting attacks.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
