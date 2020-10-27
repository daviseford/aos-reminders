import { APPRENTICE_RUNESMITH } from 'army/grand_alliances/order/subfactions/duardin'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const FlyingTransportEffect = {
  name: `Flying Transport`,
  desc: `This model can fly, and can be garrisoned by up to 15 friendly Marine models even though it is not a terrain feature. If this model is in a warscroll battalion, units from the same battalion that can garrison this model can be set up as this model's garrison when this model is set up.

  Halve this model's Move characteristic and it cannot Fly High if there are 11 or more models in its garrison. Units cannot join or leave this model's garrison if it has made a move or flown high in the same phase (they can join or leave before it does so). Models in the garrison are not counted towards gaining control of an objective.

  An attack made by a weapon that is in range of this model can target either this model or a unit in its garrison. If this model is destroyed, before it is removed from play, roll 1 dice for each model in its garrison. On a 1, that model is slain. Set up any surviving models wholly within 3" of this model and more than 3" from any enemy units.`,
  when: [DURING_GAME],
}
const EndrinharnessEffect = {
  name: `Endrinharness`,
  desc: `If the unmodified hit roll for an attack made with a melee weapon by this model is 6, that attack inflicts D3 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
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
    desc: `In your hero phase you can pick 1 friendly SKYFARERS unit wholly within 12" of this model. Until your next hero phase, you can reroll wound rolls of 1 for attacks made by that unit. This ability cannot be used by an AETHER-KHEMIST that is part of a garrison, or on a friendly unit that is part of a garrison.`,
    when: [HERO_PHASE],
  },
  {
    name: `Atmospheric Isolation`,
    desc: `Subtract 1 from hit rolls for attacks made by enemy models while they are within 3" of any friendly models with this ability. This ability cannot be used by an AETHER-KHEMIST that is part of a garrison.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
]
const GlorySeekersEffects = [
  {
    name: `Glory Seekers`,
    desc: `You can reroll battleshock tests for this unit while it is wholly within 9" of an objective. This ability cannot be used if this unit is part of a garrison.`,
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
  desc: `At the start of the combat phase, you can pick 1 enemy unit within 1" of this model and roll a D6. Add the Bomb Rack modifier from this model's damage table to the roll. On a 4+, that enemy unit suffers D3 mortal wounds.`,
  when: [START_OF_COMBAT_PHASE],
}
const SkyminesEffect = {
  name: `Skymines`,
  desc: `If an enemy unit that can fly ends a charge move within 1" of any friendly units with this ability, you can roll 1 dice for each model in that enemy unit. For each 6, that unit suffers 1 mortal wound.`,
  when: [CHARGE_PHASE],
}
const EndrinmasterHealEffect = (val: '3' | 'D3') => ({
  name: `Endrinmaster`,
  desc: `At the start of your hero phase, you can pick 1 friendly SKYVESSEL within 1" of this model. Heal up to ${val} wounds allocated to that SKYVESSEL.`,
  when: [START_OF_HERO_PHASE],
})
const ByGrugniEffect = {
  name: `By Grungni, I Have My Eye On You!`,
  desc: `You can use this command ability in your hero phase before a friendly ENDRINRIGGERS unit wholly within 18" of a friendly model with this command ability uses its Endrincraft ability. If you do so, you can reroll any of the dice that determine how many wounds are healed by that ENDRINRIGGERS unit in that phase.`,
  when: [HERO_PHASE],
  command_ability: true,
}

// Unit Names
export const Units: TUnits = [
  APPRENTICE_RUNESMITH,
  {
    name: `Endrinmaster with Dirigible Suit`,
    effects: [ByGrugniEffect, EndrinmasterHealEffect('3'), HitchersEffect],
  },
  {
    name: `Endrinmaster with Endrinharness`,
    effects: [ByGrugniEffect, EndrinmasterHealEffect('D3'), EndrinharnessEffect],
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
        desc: `Add 1 to Khazgan Drakkskewer's Wounds characteristic. In addition, Khazgan Drakkskewer can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Thundrik's Profiteers`,
        desc: `You can add 1 to hit rolls for attacks made by this unit while it is wholly within 9" of BJORGEN THUNDRIK. This ability cannot be used if this unit is part of a garrison.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Thundrik's Profiteers`,
        desc: `You can reroll battleshock tests for this unit while it is wholly within 9" of BJORGEN THUNDRIK. This ability cannot be used if this unit is part of a garrison.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Aetheric Navigator`,
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
  {
    name: `Arkanaut Admiral`,
    effects: [
      {
        name: `If You Want A Job Done...`,
        desc: `You can reroll hit and wound rolls of 1 for attacks made with a melee weapon by this model that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Protect the Admiral!`,
        desc: `Do not take battleshock tests for friendly KHARADRON OVERLORDS units while they are wholly within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Protect the Admiral!`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to a friendly ARKANAUT ADMIRAL while it is within 3" of any friendly SKYFARERS units with 5 or more models. On a 5+, you must allocate that wound or mortal wound to a friendly SKYFARERS unit with 5 or more models that is within 3" of that ARKANAUT ADMIRAL, instead of to that ARKANAUT ADMIRAL.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Master of the Skies`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. That SKYVESSEL can shoot in that phase even if it ran earlier in the same turn.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `On My Mark, Fire!`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. You can reroll hit rolls of 1 for attacks made by that SKYVESSEL in that phase.`,
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
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly SKYFARERS unit that is wholly within 12" of a friendly model with this command ability. You can reroll charge rolls for that unit in that phase.`,
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
  {
    name: `Brokk Grungsson, Lord-Magnate of Barak-Nar`,
    effects: [
      {
        name: `Custom-built Dirigible Suit`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `First Rule of Grungsson`,
        desc: `You can use this command ability at the start of your charge phase if a friendly model with this command ability is on the battlefield. If you do so, pick 1 friendly model with this command ability. You can reroll charge rolls for friendly BARAK-NAR units that are wholly within 24" of that model until the end of that phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
      EndrinharnessEffect,
      HitchersEffect,
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
      DisengageEffect,
      FlyHighEffect,
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
      getSkyhookEffect(2),
      SkyCannonEffect,
    ],
  },
  {
    name: `Arkanaut Ironclad`,
    effects: [
      {
        name: `Aetheric Navigator and Endrinrigger`,
        desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aetheric Navigator and Endrinrigger`,
        desc: `You can reroll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
      BombRacksEffect,
      DisengageEffect,
      FlyHighEffect,
      FlyingTransportEffect,
      getSkyhookEffect(2),
      SkyCannonEffect,
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Intrepid Prospectors`,
    effects: [
      {
        name: `This'll Be Quick Work`,
        desc: `After armies have been set up but before the first battle round begins, you can move friendly units from this battalion up to 6".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Grand Armada`,
    effects: [
      {
        name: `Constitutional Experts`,
        desc: `Once per battle, if the ARKANAUT ADMIRAL or BROKK GRUNGSSON from this battalion is on the battlefield, you can use a footnote even if it has been used before in the same battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Iron Sky Command`,
    effects: [
      {
        name: `Lords of the Skies`,
        desc: `Do not take battleshock tests for friendly KHARADRON OVERLORDS units while they are wholly within 18" of the ARKANAUT IRONCLAD from this battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Iron Sky Attack Squadron`,
    effects: [
      {
        name: `Bold Privateers`,
        desc: `ARKANAUT COMPANY units from this battalion can leave an ARKANAUT FRIGATE from the same battalion either before or after it has moved.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Bold Privateers`,
        desc: `Roll 3D6 instead of 2D6 when making charge rolls for ARKANAUT COMPANY units from this battalion that left an ARKANAUT FRIGATE from the same battalion in the movement phase of the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Grundstok Escort Wing`,
    effects: [
      {
        name: `Focused Fire`,
        desc: `At the start of your shooting phase, you can pick 1 enemy unit for this battalion to focus fire on. If you do so, you can reroll hit rolls of 1 for attacks made by units from this battalion that target that unit in that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
]
