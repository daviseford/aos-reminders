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
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_DURING_ROUND,
  TURN_ONE_HERO_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'

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
const GlorySeekersEffect = {
  name: `Glory Seekers`,
  desc: `Add 1 to hit rolls on attacks targeting a HERO or MONSTER.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
}
const ExplodingDrillEffect = {
  name: `Exploding Drill`,
  desc: `If the wound roll for a Drill Cannon is 6+, pick another enemy unit within 3" of the target. That unit suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
}
const SkyhookEffect = {
  name: `Skyhook`,
  desc: `After all attacks for this unit are completed, if any wounds inflicted by this unit's Skyhook were allocated to an enemy unit and not negated, you can move this unit D6", as long as it ends closer to one of the enemy units the wounds were allocated to.`,
  when: [SHOOTING_PHASE],
}
const EndinriggersBaseEffects = [
  ExplodingDrillEffect,
  {
    name: `Grapnel Launcher`,
    desc: `If this unit is more than 3" from an enemy unit, choose a terrain feature or model with a wounds characteristic of 10+ within 24". Roll a D6 for each model armed with a grapnel launcher. If any die is 4+, immediately move any distance as long as each model in this unit is moved directly and in a straight line towards the target and no model in this unit moves within 3" of any enemy models at any point in the move.`,
    when: [END_OF_SHOOTING_PHASE],
  },
  {
    name: `Hitchers`,
    desc: `Models are not counted toward the maximum number of SKYFARERS that can be embarked on a SKYVESSEL or the Overburdened rule.`,
    when: [DURING_GAME],
  },
  SkyhookEffect,
]

const BombRacksEffect = {
  name: `Bomb Racks`,
  desc: `If a non-flying enemy ends their charge within 1", select a bomb type and then roll a die. On a 4+ the enemy unit suffers the selected bomb effect.
  
  Detonation Drills: Enemy unit fights after all other units.
  
  Grudgesettler Bombs: Enemy suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
}
const SkyminesEffect = {
  name: `Skymines`,
  desc: `When a flying enemy unit ends a charge within 1", roll a die for each model in the charging unit. For each 6+ the enemy unit suffers a mortal wound.`,
  when: [CHARGE_PHASE],
}
const ArkanautBaseEffects = [
  BombRacksEffect,
  {
    name: `Tireless Endrinrigger`,
    desc: `Roll a D6, on a 4+ heal 1 wound.`,
    when: [HERO_PHASE],
  },
  {
    name: `Set-up`,
    desc: `When you set up a SKYVESSEL with the Vessel ability, you can declare SKYFARER units will start the battle embarked within it instead of being set up seperatly.`,
    when: [DURING_SETUP],
  },
  {
    name: `Embark`,
    desc: `If all models in a SKYFARER unit moves within 3" of this SKYVESSEL, they can embark. Remove the unit from the battlefield and place it to one side.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Disembark`,
    desc: `Any friendly units embarked in this vessel may disembark. Units disembarking must be setup within 3" of this vessel and more than 3" from enemy units. Any disembarking model that cannot be setup in this way is slain.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Destroyed`,
    desc: `When this SKYVESSEL is destroyed, all embarked units disembark before the vessel is removed. Roll a D6 for each model in the embarked unit. For each 1, slay a model of your choice in that unit.`,
    when: [WOUND_ALLOCATION],
  },
]

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
      GlorySeekersEffect,
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
        desc: `If the Navigator does not move, re-roll run/charge rolls for all visible SKYVESSELS. Cannot use in same turn as Aetherstorm. IF the Aetheric Navigator is embarked, Read the winds only affects the SKYVESSEL they are embarked upon.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Arkanaut Admiral`,
    effects: [
      {
        name: `First to the Fray`,
        desc: `On successful charge, add 1 to charge rolls for KHARADRON OVERLORDS units within 18" of this model until the end of the phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Master of the Skies`,
        desc: `The SKYVESSEL the Arkanaut Admiral is embarked upon can run and shoot.`,
        when: [HERO_PHASE],
      },
      {
        name: `If You Want A Job Done...`,
        desc: `Re-roll hit and wound rolls of 1 if the target is a MONSTER or HERO.`,
        when: [HERO_PHASE],
      },
      {
        name: `Invoke the Code - Lead by Example`,
        desc: `KHARADRON OVERLORDS within 12" do not take battleshock tests until your next hero phase.`,
        when: [BATTLESHOCK_PHASE],
        command_ability: true,
      },
      {
        name: `Invoke the Code - Look out for the Boss`,
        desc: `Until next hero phase, when the Admiral suffers a wound or mortal wound roll a die. On a 5+ a SKYFARERS unit within 1" suffers a mortal wound instead".`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Invoke the Code - Talk Softly, Carry a Big Hammer`,
        desc: `Re-roll failed hit and wound rolls.`,
        when: [COMBAT_PHASE],
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
        name: `The Lord-Magnate Moves`,
        desc: `On a successful charge, pick an enemy unit within 1/2" and roll a die, on a 2+ inflict D3 mortal wounds to the selected unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Champion of Barak-Nar`,
        desc: `Re-roll hit and wounds rolls of 1 when targeting a HERO or MONSTER.`,
        when: [HERO_PHASE],
      },
      {
        name: `Supercharged Harness`,
        desc: `Roll a D6; On a 1, suffer a mortal wound. On a 3+, the damage characteristic for Aethermatic Saw attacks is 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `High Hitcher`,
        desc: `When embarked on a SKYVESSEL Brokk does not count toward the maximum number of SKYFARERS or the Overburdened rule.`,
        when: [DURING_GAME],
      },
      {
        name: `First Rule of Grungsson`,
        desc: `KHARADRON OVERLORDS units within 18" can run and charge until your next hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skywardens`,
    effects: [
      ...EndinriggersBaseEffects,
      SkyminesEffect,
      {
        name: `Timed Charges`,
        desc: `When this unit retreats, before moving the unit, roll a die for each enemy unit within 3". On a 6 that unit suffers a mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Endrinriggers`,
    effects: [
      ...EndinriggersBaseEffects,
      {
        name: `Endrincraft`,
        desc: `Heal 1 wound on a single SKYVESSEL this unit is embarked upon, or within 1".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arkanaut Company`,
    effects: [GlorySeekersEffect],
  },
  {
    name: `Grundstok Gunhauler`,
    effects: [
      ExplodingDrillEffect,
      BombRacksEffect,
      {
        name: `Ahead Full`,
        desc: `The Gunahuler can re-roll run and charge rolls this turn; but cannot attack in the shooting phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Escort Vessel`,
        desc: `Each time a SKYVESSEL within 3" suffers wound or mortal wound, roll a die. On a 5+, the Gunhauler suffers a mortal wound instead. You can only use this ability once for each wound or mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Arkanaut Frigate`,
    effects: [
      {
        name: `Aetheric Navigation`,
        desc: `The Frigate can move an extra D3" if an Aetheric Navigator is visible.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `All Hands to the Guns`,
        desc: `Until your next hero phase re-roll hits rolls of 1 in the shooting phase; the Frigate's movement is halved and it cannot run.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vessel/Overburdened`,
        desc: `This model can carry up to 15 SKYFARER models, but its movement characteristic is reduced by 1" for each over 10.`,
        when: [DURING_GAME],
      },
      SkyhookEffect,
      SkyminesEffect,
      ...ArkanautBaseEffects,
    ],
  },
  {
    name: `Arkanaut Ironclad`,
    effects: [
      {
        name: `Flagship`,
        desc: `Until your next hero phase all visible SKYVESSELS gain 1 of the following effects:
        
        Fire At Will: Add 2 to the attacks characteristic of Aethershot Carbines.
        
        Make Every Shot Count: Re-roll hit rolls of 1 during the shooting phase.
        
        Prove Your Worth: Add 3" to the range of all missile weapons.
        
        'Ware The Skies: Re-roll hit and wound rolls of 1 against targets that can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Batten the Hatches`,
        desc: `Before any unit disembarks you can choose to Batten the Hatches. If you do so re-roll saves of 1. Embarked units cannot embark/disembark.`,
        when: [HERO_PHASE],
      },
      {
        name: `Supremacy Mine`,
        desc: `Once per battle, when enemy flying unit ends charge within 1", roll a die. On a 2+, inflict D6 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Vessel/Overburdened`,
        desc: `This model can carry up to 25 SKYFARER models but its movement characteristic is reduced by 1" for each over 20.`,
        when: [DURING_GAME],
      },
      SkyhookEffect,
      ...ArkanautBaseEffects,
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
