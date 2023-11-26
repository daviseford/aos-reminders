import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_ANY_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import prayers from './prayers'
import rule_sources from './rule_sources'
import spells from './spells'

const InescapableVengeanceEffect = {
  name: `Inescapable Vengeance`,
  desc: `If the unmodified hit roll for an attack made with a melee weapon by this unit is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const BlastToAshesEffect = {
  name: `Blast to Ashes`,
  desc: `If the unmodified hit roll for an attack made with a Lightning Hammer is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const CelestialBlastEffect = {
  name: `Celestial Blast`,
  desc: `If the unmodified hit roll for an attack made with a Skybolt Bow is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const EvocatorChampionEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be an Evocator-Prime. Add 1 to the Attacks characteristic of that model's Tempest Blade and Stormstave or Grandstave.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const ArcaneHeritageEffect = {
  name: `Arcane Heritage`,
  desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
  when: [HERO_PHASE, END_OF_HERO_PHASE],
  shared: true,
}
const DraconicFlamestreamEffect = {
  name: `Draconic Flamestream`,
  desc: `Do not use the attack sequence for an attack made with a Draconic Flamestream. Instead, roll a dice. On a 1-2, nothing happens. On a 3-4, the target suffers D3 mortal wounds. On a 5-6, the target suffers D6 mortal wounds.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const DraggedIntoTheTempestEffect = {
  name: `Dragged into the Tempest`,
  desc: `In the combat phase, after all of this unit's attacks have been resolved, you can pick 1 enemy unit within 1" of this unit and roll a dice. If the roll is greater than that unit's Wounds characteristic, your opponent must pick 1 model in that unit. That model is slain.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const DispersedFormationEffect = {
  name: `Dispersed Formation`,
  desc: `If this unit has 2 to 5 models, it is coherent if each model in the unit is within 3" horizontally of at least 1 other model in the unit instead of 1". If this unit has more than 5 models, it is coherent if each model in the unit is within 3" horizontally of at least 2 other models in the unit instead of 1".`,
  when: [DURING_GAME],
  shared: true,
}
const ImpalingStrikesEffect = {
  name: `Impaling Strikes`,
  desc: `This unit's Stormstrike Glaive has a Damage characteristic of 3 instead of 1 if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const CleavingBlowEffect = {
  name: `Cleaving Blow`,
  desc: `Add 2 to the Attacks characteristic of a Thunderaxe if the number of models in the target unit is greater than the number of models in this unit.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const AncientMasterOfWarEffect = {
  name: `Ancient Master of War`,
  desc: `Subtract 1 from the Attacks characteristic of melee weapons that target this unit (to a minimum of 1).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const BlazingTempestEffect = {
  name: `Blazing Tempest`,
  desc: `Do not use the attack sequence for an attack made with a Blazing Tempest. Instead, roll a dice. On a 1-2, the target suffers 1 mortal wound. On a 3-4, the target suffers D3 mortal wounds. On a 5-6, the target suffers D6 mortal wounds.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const CalamitousTailEffect = {
  name: `Calamitous Tail`,
  desc: `The Attacks characteristic of a Calamitous Tail is equal to the number of enemy models within 3" of the attacking model.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const VoidstormScrollEffect = {
  name: `Voidstorm Scroll`,
  desc: `Once per battle, in the enemy hero phase, when this unit attempts to unbind a spell, you can say that it is using its voidstorm scroll. If you do so, that spell is automatically unbound (do not make an unbinding roll).`,
  when: [HERO_PHASE],
  shared: true,
}
const SoulChargedIconEffect = {
  name: `Soul-Charged Icon`,
  desc: `You can reroll charge rolls for friendly STORMCAST ETERNALS units wholly within 12" of this unit.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const SigmariteThundershieldEffect = {
  name: `Sigmarite Thundershield`,
  desc: `If the unmodified save roll for an attack made with a melee weapon that targets this unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
  when: [SAVES_PHASE],
  shared: true,
}
const CometTrailEffect = {
  name: `Comet Trail`,
  desc: `After this unit has made a normal move, add 1 to hit rolls for attacks made by friendly STORMCAST ETERNALS and Cities of Sigmar units within 3" of this unit until your next hero phase.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const StormBlastEffect = {
  name: `Stormblast`,
  desc: `Do not use the attack sequence for an attack made with a Stormblast. Instead, roll a dice. On a 4+, the target suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const AstralCompassEffect = {
  name: `Astral Compass`,
  desc: `If this unit includes any models carrying Astral Compasses, at the start of your movement phase, instead of taking a normal move, you can say that this unit will navigate the winds aetheric. If you do so, remove this unit from the battlefield and set it up again on the battlefield wholly within 6" of the battlefield edge and more than 9" from all enemy units.`,
  when: [START_OF_MOVEMENT_PHASE],
  shared: true,
}
const RideTheWindsAethericEffect = {
  name: `Ride the Winds Aetheric`,
  desc: `Instead of picking this unit to make a normal move or retreat, you can say that it will ride the winds aetheric. If you do so, remove this unit from the battlefield and set it up again on the battlefield more than 1" from all terrain features and objectives and more than 9" from all enemy units.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const CycleOfTheStormEffect = {
  name: `Cycle of the Storm`,
  desc: `Once per turn, before you allocate a wound or mortal wound to another friendly STORMCAST ETERNALS unit within 18" of this unit, and that wound or mortal wound would cause a model in that unit to be slain, you can say that this unit will capture and return that warrior's soul. If you do so, that wound or mortal wound is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
  rule_sources: [rule_sources.BATTLETOME_STORMCAST_ETERNALS, rule_sources.ERRATA_OCTOBER_2021],
  shared: true,
}
const SigmariteShieldEffect = {
  name: `Sigmarite Shields`,
  desc: `Add 1 to save rolls for attacks that target this unit if at least half of the models in this unit (rounding down) are armed with Sigmarite Shields.`,
  when: [SAVES_PHASE],
  shared: true,
}
const CelestialLightningArcEffect = {
  name: `Celestial Lightning Arc`,
  desc: `After this unit has fought for the first time in a phase and all of its attacks have been resolved, you can pick 1 enemy unit within 3" of this unit. Roll 2 dice for each model in this unit. For each 4+, that enemy unit suffers 1 mortal wound.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const IntolerableDamageEffect = {
  name: `Intolerable Damage`,
  desc: `If the unmodified wound roll for an attack made with a Dracoth's Claws and Fangs is 6, that attack has a Damage of D6 instead of 1.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const StarsoulMaceEffect = {
  name: `Starsoul Mace`,
  desc: `Do not use the attack sequence for an attack made with a Starsoul Mace. Instead, roll a dice. On a 2+, the target sufers D3 mortal wounds.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const ThunderousPounceEffect = {
  name: `Thunderous Pounce`,
  desc: `You can reroll charge rolls for this unit.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const WindriderEffect = {
  name: `Windrider`,
  desc: `Instead of picking this unit to make a normal move or retreat, you can say that it will ride the winds aetheric. If you do so, remove this unit from the battlefield and set it up again on the battlefield more than 1" from all terrain features and objectives and more than 9" from all enemy units.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const TirelessHuntersEffect = {
  name: `Tireless Hunters`,
  desc: `This unit can run and still shoot in the same turn.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const LayLowTheTyrantsEffect = {
  name: `Lay Low the Tyrants`,
  desc: `At the end of the combat phase, you can pick 1 enemy unit that is both within 1" of this unit and within 6" of an objective, and roll a dice. On a 4+, that unit suffers D3 mortal wounds.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}
const HeraldsOfRighteousnessEffect = {
  name: `Heralds of Righteousness`,
  desc: `You can attempt a charge with this unit if it is within 18" of an enemy unit instead of 12". Roll 3D6 instead of 2D6 when making a charge roll for this unit.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const LightningFastStrikesEffect = {
  name: `Lightning Fast Strikes`,
  desc: `Add D3 to the Attacks characteristic of this unit's Whirlwind Axes if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const StardrakeBaseEffects = [
  {
    name: `Arcane Lineage`,
    desc: `Add 1 to casting rolls for friendly Wizards within 18" of this unit and subtract 1 from casting rolls for enemy Wizards within 18" of this unit.`,
    when: [HERO_PHASE],
    shared: true,
  },
  {
    name: `Cavernous Jaws`,
    desc: `After this unit makes a pile-in move, you can say that this unit's Stardrake will bite the enemy with its cavernous jaws. If you do so, pick a number of enemy models within 3" of this unit equal to or less than the Cavernous Jaws value shown on this unit's damage table, and roll a dice for each. If the roll is greater than that model's Wounds characteristic, it is slain.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
]
const AnnihilatorBaseEffects = [
  {
    name: `Blazing Impact`,
    desc: `After this unit is set up on the battlefield for the first time, roll a dice for each enemy unit within 10" of this unit. On a 3+, that unit suffers D3 mortal wounds. In addition, you can reroll charge rolls for this unit if it was set up on the battlefield in the same turn.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
    shared: true,
  },
  {
    name: `Force of a Falling Star`,
    desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the unmodified charge roll for that charge move. Subtract 1 from the roll if this unit only has 2 models. Subtract 2 from the roll if this unit only has 1 model. For each 4+, that enemy unit suffers 1 mortal wound.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
]

const Units = {
  'Celestant-Prime': {
    effects: [
      {
        name: `Cometstrike Sceptre`,
        desc: `In your shooting phase, you can pick 1 point on the battlefield within 24" of this unit and visible to it. Each enemy unit within 3" of that point suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in the heavens as a reserve unit. If you do so, at the end of your movement phase, you must say if this unit will remain in reserve or if it will strike from the heavens.

        At the end of your movement phase, if this unit remains in reserve, add 2 to the Attacks characteristic of this unit's Ghal Maraz for the rest of the battle. If this unit strikes from the heavens, set this unit up on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Orrery of Celestial Fates`,
        desc: `Once per turn, before you make a hit or wound roll for an attack made by this unit, a save roll for an attack that targets this unit, or a run or charge roll for this unit, you can say that you will foresee the result of the roll. If you do so, instead of making the roll, you must choose the result of the roll. The result chosen for a D6 roll must be a whole number from 1 to 6, and the result chosen for a 2D6 roll must be a whole number from 2 to 12. The result cannot be rerolled, but any modifiers are applied to it as normal.`,
        when: [DURING_GAME],
      },
      {
        name: `Eye of the Celestial Storm`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Aventis Firestrike': {
    mandatory: {
      spells: [keyPicker(spells, ['Pyroelectric Blast'])],
    },
    effects: [
      CometTrailEffect,
      CycleOfTheStormEffect,
      {
        name: `Thunderhead Crown`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Astreia Solbright': {
    mandatory: {
      spells: [keyPicker(spells, ['Lightning Pulse'])],
    },
    effects: [
      CycleOfTheStormEffect,
      ThunderousPounceEffect,
      {
        name: `Soul Energy of the First Host`,
        desc: `At the start of the combat phase, you can pick 1 friendly Hammers of Sigmar Sacrosanct unit wholly within 12" of this unit. Add 1 to save rolls for attacks made with melee weapons that target that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Vandus Hammerhand': {
    effects: [
      {
        name: `Heldensen`,
        desc: `Add 2 to the Attacks characteristic of this unit's Heldensen if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      StormBlastEffect,
      {
        name: `Lord of the Hammerhands`,
        desc: `Do not take battleshock tests for friendly Hammers of Sigmar units wholly within 24" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Vengeful Determination`,
        desc: `Once per turn, at the start of the combat phase, you can pick 1 friendly Hammers of Sigmar Redeemer unit wholly within 12" of this unit. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Neave Blacktalon': {
    effects: [LightningFastStrikesEffect, WindriderEffect, TirelessHuntersEffect],
  },
  'Gavriel Sureheart': {
    effects: [
      InescapableVengeanceEffect,
      {
        name: `Once More, For Sigmar, Charge!`,
        desc: `You can reroll charge rolls for this unit. In addition, once per turn, this unit can issue the Forward to Victory command (core rules, 1 1.2) to a friendly Hammers of Sigmar unit without a command point being spent.`,
        when: [COMBAT_PHASE],
      },
      SigmariteThundershieldEffect,
    ],
  },
  'Karazai the Scarred': {
    effects: [
      AncientMasterOfWarEffect,
      BlazingTempestEffect,
      CalamitousTailEffect,
      {
        name: `Fires of Vengeance`,
        desc: `Each time this unit destroys an enemy unit, you can apply the relevant effect below:

        If the enemy unit was a HERO or Monster, add 1 to the Attacks characteristic of melee weapons used by this unit for the rest of the battle.

        If the enemy unit had a Wounds characteristic of 3 or more and was not a HERO or Monster, add 1 to run and charge rolls for this unit for the rest of the battle.

        If the enemy unit had a Wounds characteristic of 2 or less, you can heal 1 wound allocated to this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "Steelheart's Champions": {
    effects: [
      {
        name: `Champion`,
        desc: `Severin Steelheart is the unit champion. If the target unit has 5 or more models, you can reroll failed hit rolls for attacks made with that model's Broadsword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heroic Guard`,
        desc: `If an enemy unit finishes a charge move within 1/2" of this unit, add 1 to save rolls for attacks that target this unit until the end of that turn.`,
        when: [CHARGE_PHASE],
      },
      LayLowTheTyrantsEffect,
    ],
  },
  'The Farstriders': {
    effects: [
      {
        name: `Champion`,
        desc: `Sanson Farstrider is the unit champion. Sanson Farstrider is accompanied by a Star Falcon and carries an Astral Compass. Add 1 to the Attacks characteristic of that model's Stormwrought Weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Star Falcon`,
        desc: `If this unit includes Sanson Farstrider, at the start of your shooting phase, you can pick 1 enemy unit within 18" of this unit and roll a dice. On a 4+, that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Astral Compass`,
        desc: `If this unit includes Sanson Farstrider, at the start of your movement phase, instead of making a normal move, you can say that this unit will navigate the winds aetheric. If you do so, remove this unit from the battlefield and set it up again on the battlefield wholly within 6" of the battlefield edge and more than 9" from all enemy units.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Lord-Arcanum': {
    mandatory: {
      spells: [keyPicker(spells, ['Thunderclap'])],
    },
    effects: [
      CycleOfTheStormEffect,
      {
        name: `Aetheric Manipulation`,
        desc: `When moving a predatory endless spell controlled by this unit, add 6" to the distance that the endless spell can be moved in that phase.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Lord-Arcanum on Tauralon': {
    mandatory: {
      spells: [keyPicker(spells, ['Lightning Orb'])],
    },
    effects: [CycleOfTheStormEffect, CometTrailEffect],
  },
  'Lord-Arcanum on Celestial Dracoline': {
    mandatory: {
      spells: [keyPicker(spells, ['Storm Lance'])],
    },
    effects: [
      CycleOfTheStormEffect,
      ThunderousPounceEffect,
      {
        name: `Pack Alpha`,
        desc: `Add 1 to the Attacks characteristic of Monstrous Claws used by friendly Dracoline units wholly within 18" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord-Arcanum on Gryph-Charger': {
    mandatory: {
      spells: [keyPicker(spells, ['Healing Light'])],
    },
    effects: [RideTheWindsAethericEffect, CycleOfTheStormEffect],
  },
  'Lord-Aquilor': {
    effects: [
      RideTheWindsAethericEffect,
      {
        name: `Lord of the Azyrite Hurricane`,
        desc: `Once per battle round, this unit can issue a command to a friendly Vanguard unit wholly within 18" of this unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Lord-Celestant on Dracoth': {
    effects: [
      {
        name: `Tempestos Hammer`,
        desc: `Add D3 to the Attacks characteristic of this unit's Tempestos Hammer if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      SigmariteThundershieldEffect,
      StormBlastEffect,
      {
        name: `Furious Retribution`,
        desc: `Once per battle, this unit can issue the All-out Attack command (core rules, 13.4) to a friendly STORMCAST ETERNALS unit without a command point being spent.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      ImpalingStrikesEffect,
      BlastToAshesEffect,
      CleavingBlowEffect,
    ],
  },
  'Lord-Celestant on Stardrake': {
    effects: [
      ...StardrakeBaseEffects,
      SigmariteThundershieldEffect,
      {
        name: `Lord of the Host`,
        desc: `Once per battle, this unit can issue a command to a friendly STORMCAST ETERNALS unit wholly within 12" of this unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Lord-Celestant': {
    effects: [
      InescapableVengeanceEffect,
      {
        name: `Furious Retribution`,
        desc: `Once per battle, this unit can issue the All-out Attack command (core rules, 13.4) to a friendly STORMCAST ETERNALS unit without a command point being spent.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Lord-Castellant': {
    effects: [
      {
        name: `Warding Lantern`,
        desc: `In your hero phase, you can either pick 1 friendly STORMCAST ETERNALS unit wholly within 1 8" of this unit or 1 enemy unit wholly within 18" of this unit.

        If you pick a friendly STORMCAST ETERNALS unit, add 1 to save rolls for attacks that target that unit until your next hero phase.

        If you pick an enemy unit, roll a dice. On a 2+, the target suffers D3 mortal wounds. The same unit cannot be affected by this ability more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gryph-Hounds': {
    effects: [
      {
        name: `Champion`,
        desc: `If this unit has 3 or more models, 1 model in this unit can be a Gryph-hound Alpha. Add 1 to the Attacks characteristics of that model's Vicious Beak and Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warning Cry`,
        desc: `If an enemy reserve unit or summoned unit (core rules, 3.1) is set up on the battlefield for the first time within 12" of this unit, you can pick up to 3 friendly STORMCAST ETERNALS units wholly within 12" of this unit to shoot. Any shooting attacks made by a STORMCAST ETERNALS unit picked with this ability must target that reserve unit or summoned unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Darting Attacks`,
        desc: `After this unit has fought and all of its attacks have been resolved, it can retreat 6".`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Knight-Relictor': {
    effects: [
      {
        name: `Relic Censer`,
        desc: `Each time a friendly STORMCAST ETERNALS unit wholly within 12" of this unit is affected by a prayer or the abilities of an invocation, you can roll a dice. On a 4+, ignore the effect of that prayer or the effects of that invocation's abilities on that unit.`,
        when: [HERO_PHASE, END_OF_HERO_PHASE],
      },
    ],
  },
  'Lord-Relictor': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Healing Storm', 'Lightning Storm'])],
    },
    effects: [
      {
        name: `Mortis Priest`,
        desc: `Add 1 to chanting rolls for this unit.`,
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
        desc: `Slain models cannot be returned to enemy units that are within 9" of any friendly units with this ability.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Lord-Ordinator': {
    effects: [
      {
        name: `Arcane Engineer`,
        desc: `Add 1 to hit rolls for attacks made by friendly Order War Machines wholly within 9" of any friendly units with this ability.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Comet Strike`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this unit is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord-Veritant': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Sanction'])],
    },
    effects: [
      {
        name: `Lantern of Abjuration`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a Wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Knight-Arcanum': {
    mandatory: {
      spells: [keyPicker(spells, ['Blaze of the Heavens'])],
    },
    effects: [
      {
        name: `Indomitable Loreseekers`,
        desc: `Predatory endless spells cannot pass across this unit or finish a move within 3" of this unit.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Knight-Azyros': {
    effects: [
      {
        name: `The Light of Sigmar`,
        desc: `Once per turn, at the end of the charge phase, you can pick 1 enemy unit within 9" of this unit. Add 1 to hit rolls for attacks made by friendly STORMCAST ETERNALS units that target that enemy unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Knight-Draconis': {
    effects: [
      ArcaneHeritageEffect,
      DraconicFlamestreamEffect,
      {
        name: `Wrath of the Draconith`,
        desc: `Once per battle, in your hero phase, you can pick 1 friendly Stormdrake Guard unit wholly within 12" of this unit that has not made a shooting attack in that phase. That unit can shoot.`,
        when: [HERO_PHASE],
      },
      DraggedIntoTheTempestEffect,
    ],
  },
  'Knight-Venator': {
    effects: [
      {
        name: `Star-fated Arrow`,
        desc: `Once per battle, in your shooting phase, you can say that this unit will shoot a star-fated arrow instead of attacking with its missile weapons. If you do so, pick 1 enemy unit within 30" of this unit and roll a dice. On a 3+, the target suffers D3 mortal wounds. If the target is a HERO or Monster, it suffers D6 mortal wounds instead of D3.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Knight-Incantor': {
    mandatory: {
      spells: [keyPicker(spells, ['Spirit Storm'])],
    },
    effects: [VoidstormScrollEffect],
  },
  'Knight-Heraldor': {
    effects: [
      {
        name: `Thunderblast`,
        desc: `In your shooting phase, you can pick 1 terrain feature wholly within 18" of this unit. Roll a dice for each enemy unit within 3" of that terrain feature. On a 2+, that unit suffers D3 mortal wounds.`,
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
        desc: `Add 1 to hit rolls for attacks made by this unit that target a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thundercharged Strike`,
        desc: `If the unmodified hit roll for an attack made with a Questor Warblade is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
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
        name: `Meteoric Standard`,
        desc: `If this unit carries a Meteoric Standard, once per battle, in your hero phase, you can pick 1 point on the battlefield within 24" of this unit. Each enemy unit within 6" of that point suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pennant of the Stormbringer`,
        desc: `If this unit carries a Pennant of the Stormbringer, once per battle, at the end of your movement phase, you can pick 1 friendly STORMCAST ETERNALS unit on the battlefield. Remove that unit from the battlefield and set it up again on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      SoulChargedIconEffect,
    ],
  },
  'Knight-Vexillor with Banner of Apotheosis': {
    effects: [
      {
        name: `The Banner of the Reforged`,
        desc: `Once per battle, in your hero phase, you can pick up to 3 friendly STORMCAST ETERNALS units wholly within 12" of this unit to be affected by the banner's energy (you can pick the same unit multiple times).

        If you pick a unit once with this ability, you can heal up to D3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of D3 or less. If you pick a unit twice with this ability, you can heal up to 2D3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 2D3 or less. If you pick a unit three times with this ability, you can heal up to 3D3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 3D3 or less.`,
        when: [HERO_PHASE],
      },
      SoulChargedIconEffect,
    ],
  },
  'Knight-Zephyros': {
    effects: [TirelessHuntersEffect, WindriderEffect],
  },
  'Drakesworn Templar': {
    effects: [
      ...StardrakeBaseEffects,
      {
        name: `Arc Hammer`,
        desc: `If the unmodified hit roll for an attack made with an Arc Hammer is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stormlance`,
        desc: `If the unmodified hit roll for an attack made with a Stormlance that targets a MONSTER is 6, the target suffers D6 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tempest Axe`,
        desc: `Enemy models within 3" of a unit armed with a Tempest Axe cannot move more than 1" when making a pile-in move.`,
        when: [COMBAT_PHASE],
      },
      CelestialBlastEffect,
    ],
  },
  // Fulminators: {
  //   effects: [
  //     IntolerableDamageEffect,
  //     SigmariteShieldEffect,
  //     StormBlastEffect,
  //     {
  //       name: `Impaling Strikes`,
  //       desc: `Add 2 to the Damage of this unit's Stormstrike Glaives if the unit made a charge move in the same turn.`,
  //       when: [COMBAT_PHASE],
  //     },
  //     {
  //       name: `Glaivewall`,
  //       desc: `Add 1 to save rolls for attacks made with missiles weapons that target this unit.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  // Desolators: {
  //   effects: [
  //     IntolerableDamageEffect,
  //     SigmariteShieldEffect,
  //     StormBlastEffect,
  //     {
  //       name: `Fury of the Storm`,
  //       desc: `While this unit has 4 or more models, add 1 to the Attacks of this unit's Thunderaxes. While this unit has 6 or more models, add 2 to the Attacks instead.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  Tempestors: {
    effects: [
      IntolerableDamageEffect,
      SigmariteShieldEffect,
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
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Protector-Prime. Add 1 to the Attacks characteristic of that model's Stormstrike Glaive.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shield of the Storm`,
        desc: `Add 1 to save rolls for attacks that target this unit if at least half of the models in this unit (rounding down) are armed with Stormstrike Glaives.`,
        when: [SAVES_PHASE],
      },
      StarsoulMaceEffect,
    ],
  },
  Decimators: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Decimator-Prime. Add 1 to the Attacks characteristic of that model's Thunderaxe.`,
        when: [COMBAT_PHASE],
      },
      StarsoulMaceEffect,
      CleavingBlowEffect,
    ],
  },
  Liberators: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Liberator-Prime. Add 1 to the Attacks characteristic of that model's Heavens- wrought Weapons, Paired Heavens-wrought Weapons or Grandweapon.`,
        when: [COMBAT_PHASE],
      },
      LayLowTheTyrantsEffect,
      SigmariteShieldEffect,
    ],
  },
  Retributors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Retributor-Prime. Add 1 to the Attacks characteristic of that model's Lightning Hammer.`,
        when: [COMBAT_PHASE],
      },
      BlastToAshesEffect,
      StarsoulMaceEffect,
    ],
  },
  'Prosecutors with Stormcall Javelins': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Prosecutor-Prime. Add 1 to the Attacks characteristic of that model's Stormcall Javelin.`,
        when: [SHOOTING_PHASE],
      },
      DispersedFormationEffect,
      HeraldsOfRighteousnessEffect,
      SigmariteShieldEffect,
    ],
  },
  'Prosecutors with Celestial Hammers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Prosecutor-Prime. Add 1 to the Attacks characteristic of that model's Celestial Hammer or Pair of Celestial Hammers.`,
        when: [COMBAT_PHASE],
      },
      DispersedFormationEffect,
      HeraldsOfRighteousnessEffect,
      SigmariteShieldEffect,
    ],
  },
  'Judicators with Boltstorm Crossbows': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Judicator-Prime. Add 1 to the Attacks characteristic of that model's Boltstorm Crossbow or Thunderbolt Crossbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rapid Fire`,
        desc: `If an attack made with a Boltstorm Crossbow scores a hit, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Judicators with Skybolt Bows': {
    effects: [CelestialBlastEffect],
  },
  'Vanguard-Raptors with Hurricane Crossbows': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Raptor-Prime. Add 1 to the Attacks characteristic of that model's Hurricane Crossbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rapid Fire`,
        desc: `If an attack made with a Hurricane Crossbow scores a hit, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Vanguard-Raptors with Longstrike Crossbows': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Raptor-Prime. That model is accompanied by an Aetherwing armed with a Beak and Claws. For rules purposes, the Aetherwing is considered to be a companion (core rules, 22.3.1).`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_STORMCAST_ETERNALS, rule_sources.ERRATA_APRIL_2023],
      },
      {
        name: `Headshot`,
        desc: `If the unmodified hit roll for an attack made with a Longstrike Crossbow is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Vanguard-Hunters': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hunter-Prime. Add 1 to the Attacks characteristic of that model's Boltstorm Pistol and Stormwrought Weapon.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      AstralCompassEffect,
    ],
  },
  'Vanguard-Palladors': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Pallador-Prime. Add 1 to the Attacks characteristics of that model's Boltstorm Pistol and Shock Handaxe or Boltstorm Pistol and Starstrike Javelin.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
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
        name: `Marked for Destruction`,
        desc: `Add 1 to hit rolls for attacks made with missile weapons by friendly Vanguard-Raptors units if the target is within 1 2" of any friendly units with this ability.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Celestar Ballista': {
    effects: [
      {
        name: `Versatile Weapon`,
        desc: `Each time this unit shoots, choose either the Lightning-charged Shot or Rapid Fire weapon characteristics for all the attacks it makes with its Celestar Stormbolts.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Castigators: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Castigator-Prime. Add 1 to the Attacks characteristic of that model's Thunderhead Greatbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Castigator Aetheric Channelling`,
        desc: `At the start of the shooting phase, you must say whether this unit will increase either the accuracy or the power of its Thunderhead Greatbows.

        If you pick accuracy, until the end of that phase, add 1 to hit rolls for attacks made with this unit's Thunderhead Greatbows.

        If you pick power, until the end of that phase, this unit's Thunderhead Greatbows have a Rend characteristic of -2 instead of -1.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Burst of Celestial Energy`,
        desc: `If the unmodified hit roll for an attack made with a Thunderhead Greatbow that targets a Malignant or Daemon unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Sequitors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Sequitor-Prime. Add 1 to the Attacks characteristic of that model's Sacrosanct Weapons or Stormsmite Greatmace. If a Sequitor- Prime is armed with Sacrosanct Weapons and a Soulshield, it can also carry a Redemption Cache.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sequitor Aetheric Channelling`,
        desc: `At the start of the combat phase, you must say whether this unit will channel aetheric power into its weapons or into its shields.

        If you pick its weapons, until the end of that phase, if the unmodified hit roll for an attack made by this unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.
        
        If you pick its shields, until the end of that phase, this unit has a ward of 5+.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Redemption Cache`,
        desc: `Slain models cannot be returned to enemy units that are within 3" of this unit's Sequitor-Prime.`,
        when: [DURING_GAME],
      },
    ],
  },
  Vanquishers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Vanquisher-Prime. Add 1 to the Attacks characteristic of that model's Celestial Greatsword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Storm-forged Icon Bearer. Add 1 to the Bravery characteristic of a unit that includes any Storm-forged Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Vanquisher Herald. If this unit receives the Rally command while it includes any Vanquisher Heralds, when you roll a dice for a slain model from this unit, you can return 1 slain model to this unit on a 5+ instead of only a 6.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Lightning Strikes`,
        desc: `Add 1 to the Attacks characteristic of a Celestial Greatsword if there are 5 or more models in the target unit. Add 2 to the Attacks characteristic of a Celestial Greatsword instead of 1 if there are 10 or more models in the target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Evocators: {
    mandatory: {
      spells: [keyPicker(spells, ['Empower'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit is a Wizard while this unit has 2 or more models. It can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. It only knows the Empower spell and cannot attempt to cast any other spells. Any number of Evocators units can attempt to cast Empower in the same hero phase.`,
        when: [HERO_PHASE],
      },
      EvocatorChampionEffect,
      CelestialLightningArcEffect,
    ],
  },
  'Evocators on Celestial Dracolines': {
    mandatory: {
      spells: [keyPicker(spells, ['Empower'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit is a Wizard while it has 2 or more models. It can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. It only knows the Empower spell and cannot attempt to cast any other spells. Any number of Evocators units can attempt to cast Empower in the same hero phase.`,
        when: [HERO_PHASE],
      },
      EvocatorChampionEffect,
      ThunderousPounceEffect,
      CelestialLightningArcEffect,
    ],
  },
  // Removed in 2021 (?)
  // 'Lynus Ghalmorian on Gryph Charger': {
  //   mandatory: {
  //     command_abilities: [keyPicker(command_abilities, ['Sombre Exemplar'])],
  //     spells: [keyPicker(spells, ['Amethyst Gale'])],
  //   },
  //   effects: [
  //     AetherealStrikeEffect,
  //     RideTheWindsAethericEffect,
  //     CycleOfTheStormEffect,
  //     SpiritFlaskEffect,
  //     {
  //       name: `Shield of the Pale Knight`,
  //       desc: `You can reroll save rolls of 1 for attacks made with missile weapons that target this model or any friendly ANVILS OF HELDENHAMMER units wholly within 12" of this model.`,
  //       when: [SAVES_PHASE],
  //     },
  //     PrimeElectridsEffect,
  //   ],
  // },
  'Averon Stormsire': {
    mandatory: {
      spells: [keyPicker(spells, ['Stormsire'])],
    },
    effects: [VoidstormScrollEffect],
  },
  'Bastian Carthalos': {
    effects: [
      {
        name: `The Thunderborn`,
        desc: `Once per turn, in your hero phase, you can pick 1 enemy unit on the battlefield and roll a number of dice equal to the Wounds characteristic of that unit. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Castellan of Azyr`,
        desc: `At the start of the first battle round, after determining who has the first turn but before the first turn begins, you can pick up to D3 friendly Hammers of Sigmar units on the battlefield and set them up again (any restrictions in the deployment instructions for the battleplan being used still apply).`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Vessel of the Tempest`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Voice of Thunder`,
        desc: `Once per turn, this unit can issue a command to a Hammers of Sigmar unit anywhere on the battlefield without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Mantle of the First Storm`,
        desc: `At the end of a phase, if any enemy models were slain by wounds caused by this unit's attacks in that phase, you can heal all wounds allocated to this unit.`,
        when: [END_OF_ANY_PHASE],
      },
    ],
  },
  "Stormsire's Cursebreakers": {
    mandatory: {
      spells: [keyPicker(spells, ['Empower'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit is a Wizard while it has 2 models. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Empower spell. It cannot attempt to cast any spells other than Empower, but any number of units of Evocators can attempt to cast Empower in the same hero phase.`,
        when: [HERO_PHASE],
      },
      CelestialLightningArcEffect,
    ],
  },
  'Gardus Steel Soul': {
    effects: [
      {
        name: `Aura of Purity`,
        desc: `Friendly HALLOWED KNIGHTS units wholly within 12" of this unit have a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Martyr's Strength`,
        desc: `Roll a dice if this unit is destroyed in the combat phase. On a 2+, this unit can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Saintly Assault`,
        desc: `Once per battle, at the start of your charge phase, you can declare a saintly assault. If you do so, until the end of that turn, you can reroll charge rolls for friendly HALLOWED KNIGHTS units wholly within 12" of this unit and add 1 to the Attacks characteristic of melee weapons used by friendly HALLOWED KNIGHTS HEROES wholly within 12" of this unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  Yndrasta: {
    effects: [
      {
        name: `The Prime Huntress`,
        desc: `If any enemy MONSTERS are within 3" of this unit, add 10 to the number of wounds suffered by those MONSTERS when determining which row on their damage table to use.`,
        when: [DURING_GAME],
      },
      {
        name: `Champion of Sigmar`,
        desc: `This unit has a 4+ ward.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Dazzling Radiance`,
        desc: `Once per turn in your hero phase, if this unit is on the battlefield, you can return 1 slain model to each friendly STORMCAST ETERNALS unit with a Wounds characteristic of 3 or less that is wholly within 12" of this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hawk of the Celestial Skies`,
        desc: `Do not take battleshock tests for friendly STORMCAST ETERNALS and Cities of Sigmar units wholly within 12" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Lord-Imperatant': {
    effects: [
      {
        name: `Distinguished Leader`,
        desc: `Once per turn, this unit can issue a command without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Guided by Lightning`,
        desc: `Once per turn, at the end of your movement phase, if any friendly units with this ability are on the battlefield, you can say that they will guide the arrival of Sigmar's warriors. If you do so, pick 1 friendly STORMCAST ETERNALS Thunderstrike unit with a Wounds characteristic of 3 or less that is in reserve. When you use the Scions of the Storm allegiance ability to set up that unit on the battlefield in that phase, you can set it up more than 7" from all enemy units instead of more than 9".`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  Praetors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Praetor-Prime. Add 1 to the Attacks characteristic of that model's Soulguard's Halberd.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soul-forged Guardians`,
        desc: `At the start of the first battle round, before determining who has the first turn, you can pick 1 friendly STORMCAST ETERNALS HERO on the battlefield to which this unit will be bound (the same HERO cannot have more than 1 unit of Praetors bound to it at any time).

        Before you allocate a wound or mortal wound to that HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, if that HERO is within 3" of this unit, you can roll a dice.

        On a 1-2, that wound or mortal wound is allocated to that HERO as normal. On a 3-4, that wound or mortal wound is allocated to this unit instead of that HERO. On a 5-6, that wound or mortal wound is negated.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Soul-forged Guardians`,
        desc: `Before you allocate a wound or mortal wound to that HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, if that HERO is within 3" of this unit, you can roll a dice.

        On a 1-2, that wound or mortal wound is allocated to that HERO as normal. On a 3-4, that wound or mortal wound is allocated to this unit instead of that HERO. On a 5-6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Vindictors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Vindictor-Prime. Add 1 to the Attacks characteristic of that model's Stormspear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be an Azyrite Signifier. Add 1 to the Bravery characteristic of a unit that includes any Azyrite Signifiers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Stormsoul Arsenal`,
        desc: `If the unmodified hit roll for an attack made with a Stormspear is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Annihilators: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Annihilator-Prime. Add 1 to the Attacks characteristic of that model's Meteoric Hammer.`,
        when: [COMBAT_PHASE],
      },
      ...AnnihilatorBaseEffects,
    ],
  },
  'Annihilators with Meteoric Grandhammers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Annihilator-Prime. Add 1 to the Attacks characteristic of that model's Meteoric Grandhammer.`,
        when: [COMBAT_PHASE],
      },
      ...AnnihilatorBaseEffects,
    ],
  },
  'Stormstrike Chariot': {
    effects: [
      {
        name: `Celestial Blaze`,
        desc: `Subtract 1 from hit rolls for attacks that target this unit if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Azyr Unleashed`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number Of dice equal to the unmodified charge roll for that charge move. For each 4+, that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Knight-Judicator with Gryph-Hounds': {
    effects: [
      {
        name: `Faithful Gryph-hounds`,
        desc: `The first time this unit is set up on the battlefield, you must summon 1 Gryph-hounds unit consisting of 2 models to the battlefield and add it to your army. Set up the Gryph-hounds unit wholly within 3" of this unit and more than 9" from all enemy units.`,
        when: [DURING_GAME],
      },
      {
        name: `Gaze of Sigmar`,
        desc: `Once per battle, in your shooting phase, you can say that this unit will draw the gaze of Sigmar instead of attacking with its missile weapons. If you do so, pick 1 point on the battlefield within 30" of this unit and visible to it. Roll a dice for each enemy unit within 6" of that point. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Krondys: {
    mandatory: {
      spells: [keyPicker(spells, ['Atavistic Tempest'])],
    },
    effects: [
      BlazingTempestEffect,
      AncientMasterOfWarEffect,
      CalamitousTailEffect,
      {
        name: `Regalia Fulmentarus`,
        desc: `Add the Regalia Fulmentarus value shown on this unit's damage table to casting rolls for this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dracothian Guard Concussors': {
    effects: [GenericEffects.Elite, StormBlastEffect, BlastToAshesEffect],
  },
  'Dracothian Guard Desolators': {
    effects: [GenericEffects.Elite, StormBlastEffect, CleavingBlowEffect],
  },
  'Dracothian Guard Fulminators': {
    effects: [GenericEffects.Elite, ImpalingStrikesEffect, StormBlastEffect],
  },
  'Dracothian Guard Tempestors': {
    effects: [
      GenericEffects.Elite,
      StormBlastEffect,
      {
        name: `Volleystorm`,
        desc: `If an attack made with a Volleystorm Crossbow scores a hit, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Stormdrake Guard': {
    effects: [
      {
        name: `Monstrous Regiment`,
        desc: `Only 1 model in this unit can carry out a monstrous rampage each turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Stormdrake-Prime. Add 1 to the Attacks characteristic of that model's Drakerider's Lance or Drakerider's Warblade.`,
        when: [COMBAT_PHASE],
      },
      DispersedFormationEffect,
      {
        name: `Merciless Impact`,
        desc: `This unit's Drakerider's Lances have a Rend characteristic of -2 instead of -1 and a Damage characteristic of 2 instead of 1 if this unit made a charge move in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      ArcaneHeritageEffect,
      DraconicFlamestreamEffect,
      DraggedIntoTheTempestEffect,
      {
        name: `Draconic Onslaught`,
        desc: `Once per battle, in your charge phase, you can say that this unit will unleash its draconic onslaught. If you do so, you can reroll charge rolls for this unit in that phase.`,
        when: [CHARGE_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_JULY_2022,
          meta_rule_sources.BATTLESCROLL_GALLETIAN_CHAMPIONS_JANUARY_2022,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
    ],
  },
  Vigilors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Vigilor-Prime. Add 1 to the Attacks characteristic of that model's Stormcaller Bow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Navigators of the Storm`,
        desc: `In the shooting phase, if any wounds caused by attacks made with this unit's Stormcaller Bows are allocated to an enemy unit, add 1 to hit rolls for attacks that target that unit until the end of that turn. The same unit cannot be affected by this ability more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  "Xandire's Truthseekers": {
    effects: [
      {
        name: `Blazing Arrows`,
        desc: `If the unmodified hit roll for an attack made with this unit's Stormcaller Bow is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Kinetic Lodestone`,
        desc: `After an enemy unit finishes a charge move within 3" of Dhoraz Giant-fell, roll a dice. On a 3+, that unit suffers D3 mortal wounds. If that unit has a mount or is a MONSTER, it suffers 3 mortal wounds instead of D3.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Lantern Astrala`,
        desc: `Once per turn, at the end of the charge phase, you can pick 1 enemy unit within 9" of this unit. Add 1 to hit rolls for attacks made by friendly STORMCAST ETERNALS units that target that enemy unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Questor Soulsworn': {
    effects: [
      {
        name: `CHAMPION`,
        desc: `1 model in this unit can be a Questor-Prime. Add 1 to the Attacks characteristic of that model's Soulsworn Weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulsworn Knight-Reflector`,
        desc: `1 model in this unit can be a Soulsworn Knight-Relictor. This unit can only use the Relictor Soulguide ability while it includes a Soulsworn Knight-Relictor.`,
        when: [DURING_GAME],
      },
      {
        name: `Relictor Soulguide`,
        desc: `Once per battle, in your hero phase, you can say that this unit is being guided to glory. When you do so, remove this unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units. It cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ordained Quest`,
        desc: `For the purposes of contesting objectives wholly outside your territory, each model in this unit counts as 3 models.`,
        when: [END_OF_TURN],
      },
    ],
  },
  'Ionus Cryptborn': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Lightning Tempest'])],
    },
    effects: [
      {
        name: `Spirit-scouring Flames`,
        desc: `Each time a wound caused by an attack made with Spirit-scouring Flames is allocated to an enemy unit, that unit is soulburned. At the end of each hero phase, roll a dice for each soulburned unit. If the roll is equal to or less than the number of the current battle round, that unit suffers D3 mortal wounds.

        When a player uses an ability that allows them to heal any wounds that have been allocated to a unit, instead of healing any wounds allocated to a soulburned unit, that unit is no longer soulburned.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Draconic Horror`,
        desc: `Enemy units cannot receive the Rally and Inspiring Presence commands while they are within 12" of this unit.`,
        when: [START_OF_HERO_PHASE, START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Scry Intent`,
        desc: `Subtract 1 from the Attacks characteristic of melee weapons that target this unit (to a minimum of 1).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Arch-Relictor`,
        desc: `In your hero phase, this unit can chant 2 prayers that it knows instead of 1. At the start of your hero phase, you must say how many prayers this unit will chant. If you say 1, when it chants that prayer, it is automatically answered with a chanting roll of 6 and no additional prayers may be chanted. If you say 2, make chanting rolls for both prayers as normal.
        
        At the start of the enemy hero phase, you can pick 1 endless spell or invocation within 12" of this unit and roll a dice. On a 2+, that endless spell is dispelled or that invocation is banished.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
