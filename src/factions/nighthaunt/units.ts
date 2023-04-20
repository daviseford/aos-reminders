import { keyPicker, tagAs } from 'factions/metatagger'
import { OBRWarmasterEffect } from 'factions/ossiarch_bonereapers/units'
import { GenericEffects } from 'generic_rules'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import rule_sources from './rule_sources'
import spells from './spells'

const ChillingHordeEffect = {
  name: `Chilling Horde`,
  desc: `Add 1 to wound rolls for attacks made with melee weapons by this unit if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const WarmasterEffect = {
  name: `Warmaster`,
  desc: `If this unit is included in a Nighthaunt army, it is treated as a general even if it is not the model picked to be the army's general.`,
  when: [DURING_GAME],
  shared: true,
}
const StolenHoursEffect = {
  name: `Stolen Hours`,
  desc: `At the end of the combat phase, if any enemy models were slain by attacks made with this unit's Sword of Stolen Hours in that phase, you can heal 1 wound allocated to this unit and add 1 to the Wounds characteristic of this unit.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}

export const Nagash = {
  'Nagash, Supreme Lord of the Undead': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Death Magic Incarnate'])],
      spells: [keyPicker(spells, ['Hand of Dust', 'Soul Stealer'])],
    },
    effects: [
      {
        name: `Alakanash, the Staff of Power`,
        desc: `Add the Staff of Power value shown on this unit's damage table to casting, dispelling and unbinding rolls for this unit. In addition, this unit can attempt to cast Arcane Bolt any number of times in the same hero phase, even if another Wizard has already attempted to cast the spell in that phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
      {
        name: `Invocation of Nagash`,
        desc: `At the start of your hero phase, if this unit is on the battlefield, you can pick up to 5 different friendly SUMMONABLE units or friendly OSSIARCH BONEREAPERS units in any combination. For each of those units, you can either heal up to 3 wounds that have been allocated to that unit or, if no wounds have been allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 3 or less.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Supreme Lord of the Undead`,
        desc: `If this unit is on the battlefield when you use an ability that returns slain models to a friendly DEATH unit, you can either reroll the dice that determines the number of slain models returned to that unit or add 1 to the number of slain models that are returned to that unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Morikhane`,
        desc: `This unit has a ward of 4+ for damage inflicted by mortal wounds. In addition, if the unmodified ward roll for this unit is 6, that attacking unit suffers 1 mortal wound.`,
        when: [WARDS_PHASE],
      },
      {
        name: `The Nine Books of Nagash`,
        desc: `The Nine Books of Nagash allow this unit to cast extra spells in your hero phase and unbind extra spells in the enemy hero phase. The number of extra spells this unit can attempt to cast or unbind is shown on this unit's damage table.`,
        when: [HERO_PHASE],
      },
      OBRWarmasterEffect,
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 3 spells in your hero phase and attempt to unbind 3 spells in the enemy hero phase. If this unit is part of a Nighthaunt, Flesh-eater Courts, Ossiarch Bonereapers or Soulblight Gravelords army, it knows all of the spells from the spell lores in that faction's allegiance abilities in addition to the other spells it knows.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
    ],
  },
}

const Units = {
  ...Nagash,
  'Awlrach the Drowner': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Passage Through the Underworlds'])],
    },
    effects: [
      {
        name: `Scything Ram`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that unit suffers D3 mortal wounds. If any models are slain by the mortal wounds caused by this ability, add D3 to the Attacks characteristic of this unit's Deathwood Oar until the end of that turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Lady Olynder, Mortarch of Grief': {
    mandatory: {
      spells: [keyPicker(spells, ['Grief-Stricken'])],
    },
    effects: [
      WarmasterEffect,
      {
        name: `Grave-sands of Time`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Lifting the Veil`,
        desc: `At the start of your shooting phase, you can pick 1 enemy unit within 12" of this unit and roll a dice. On a 2+, that unit suffers a number of mortal wounds equal to the roll. Add 1 to the number of mortal wounds the target suffers if it is terrified. If any enemy models are slain by this ability, you can heal up to D3 wounds allocated to this unit for each enemy model that was slain.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Mortarch of Grief`,
        desc: `Roll a dice each time an enemy unit issues a command within 12" of this unit. On a 5+, that command is not received (it still counts as having been used) and the command point that was spent to issue that command is lost.`,
        when: [DURING_GAME],
      },
      {
        name: `No Rest For the Wicked`,
        desc: `Once per battle, at the start of your hero phase, if this unit is on the battlefield, you can return up to D6 slain models to each friendly NIGHTHAUNT SUMMONABLE unit on the battlefield (roll separately for each unit).`,
        when: [START_OF_HERO_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Kurdoss Valentian, the Craven King': {
    effects: [
      {
        name: `If I Cannot Rule, None Shall Rule!`,
        desc: `At the start of each battle round, after the players have received their starting command points, you can roll a dice if this unit is on the battlefield. Add 1 to the roll if this unit is within 6" of any enemy HERO. On a 5+, subtract 1 from your opponent's command points (to a minimum of 0) and add 1 to your command points.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Reikenor the Grimhailer': {
    mandatory: {
      spells: [keyPicker(spells, ['Wraithstorm'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Corpse Candles`,
        desc: `In your hero phase, before this unit attempts to cast a spell, you can say that it will snuff out a corpse candle. If you do so, pick either this unit or 1 enemy unit within 12" of this unit. The unit you picked suffers 1 mortal wound. If the mortal wound was suffered by an enemy unit, add 1 to the casting roll. If the mortal wound was suffered by this unit, add 3 to the casting roll.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grim Justice`,
        desc: `Add 1 to hit and wound rolls for attacks made with this unit's Fellreaper if the target is a PRIEST or WIZARD.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Scriptor Mortis': {
    effects: [
      {
        name: `Flickers of Wychlight`,
        desc: `Once per phase, you can allocate 1 wound or mortal wound that would be allocated to this HERO to a friendly NIGHTHAUNT SUMMONABLE unit within 6" of this HERO instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Sentenced to Eternal Torment`,
        desc: `In your hero phase, you can say that this unit is going to record the name of a judged soul. If you do so, pick 1 enemy HERO that does not have the DEATH keyword and that is visible to this unit to be the judged soul. At the start of each of your subsequent hero phases, if the judged soul and this unit are on the battlefield, you must make a judgement roll for the judged soul, and this unit cannot record the name of a different judged soul in that phase. In addition, if the battle would end and the judged soul and this unit are on the battlefield, then before the battle ends, you must make a judgement roll for the judged soul.

        To make a judgement roll, roll a dice. If the roll is less than the number of the current battle round, the judged soul suffers 2D6 mortal wounds. The same unit cannot be picked to be a judged soul more than once in the same battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sentenced to Eternal Torment`,
        desc: `At the start of each of your subsequent hero phases, if the judged soul and this unit are on the battlefield, you must make a judgement roll for the judged soul, and this unit cannot record the name of a different judged soul in that phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Sentenced to Eternal Torment`,
        desc: `If the battle would end and the judged soul and this unit are on the battlefield, then before the battle ends, you must make a judgement roll for the judged soul.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Knight of Shrouds': {
    effects: [
      StolenHoursEffect,
      {
        name: `Spectral Overseer`,
        desc: `Once per battle round, this unit can issue the Redeploy or Unleash Hell command to a friendly NIGHTHAUNT SUMMONABLE unit without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Spectral Overseer`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly NIGHTHAUNT SUMMONABLE unit wholly within 12" of this unit and that has not yet fought in that phase. This unit and that NIGHTHAUNT SUMMONABLE unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Knight of Shrouds on Ethereal Steed': {
    effects: [
      StolenHoursEffect,
      {
        name: `Lord of Gheists`,
        desc: `Once per battle round, this unit can issue the All-out Attack command to a friendly NIGHTHAUNT SUMMONABLE unit without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Lord of Gheists`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly NIGHTHAUNT SUMMONABLE unit wholly within 12" of this unit and that has not yet fought in that phase. This unit and that NIGHTHAUNT SUMMONABLE unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Craventhrone Guard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Craven Huntmaster. Add 1 to the Attacks characteristic of that model's Wicked Sidearm.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Spectral Standard Bearer. If this unit receives the Rally command while it includes any Spectral Standard Bearers, when you roll a dice for a slain model from this unit, you can return 1 slain model to this unit on a 5+ instead of a 6.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Spectral Bolts`,
        desc: `This unit can target enemy units with shooting attacks even if the target is not visible to the attacking model. In addition, enemy units targeted by shooting attacks made by this unit do not receive the benefit of cover for those shooting attacks.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Guardian of Souls': {
    mandatory: {
      spells: [keyPicker(spells, ['Spectral Lure'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Nightmare Lantern`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly Nighthaunt units that are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Spirit Torment': {
    effects: [
      {
        name: `Captured Soul Energy`,
        desc: `At the end of the combat phase, you can pick 1 friendly NIGHTHAUNT SUMMONABLE unit wholly within 12" of this unit. You can either heal up to 3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 3 or less. The same unit cannot benefit from this ability more than once per turn.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  Chainghasts: {
    effects: [
      GenericEffects.Elite,
      {
        name: `Another Link in the Chain`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly Nighthaunt units wholly within 12" of any friendly units with this ability while a friendly Spirit Torment is on the battlefield.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dreadblade Harrow': {
    effects: [
      {
        name: `Phantasmal Discorporation`,
        desc: `At the end of your movement phase, you can remove this unit from the battlefield and set it up again on the battlefield more than 1" from all terrain features and objectives and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Curse of Loyalty`,
        desc: `Once per battle round, if your general has the NIGHTHAUNT keyword and issues a command, this unit can issue the same command in the same phase without a command point being spent. If it does so, that command must be received by a friendly NIGHTHAUNT unit.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2022],
      },
    ],
  },
  'Lord Executioner': {
    effects: [
      {
        name: `Staring Death in the Face`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 3" of this unit. Subtract 1 from wound rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Disembodied Skulls`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Tomb Banshee': {
    effects: [
      {
        name: `Ghostly Howl`,
        desc: `At the end of your charge phase, you can pick 1 enemy unit within 12" of this unit and roll a dice. Add 1 to the roll if the target is terrified. On a 4+, your opponent must add 1 to the number of command points that are spent to issue a command to that enemy unit until your next hero phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Cairn Wraith': {
    effects: [
      {
        name: `Eager Death-dealers`,
        desc: `The Attacks characteristic of this unit's Cairnoch Scythe is equal to the number of enemy models within 3" of this unit when the attack is made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Glaivewraith Stalkers': {
    effects: [
      GenericEffects.Elite,
      {
        name: `Musician`,
        desc: `1 in every 4 models in this unit can be a Deathbeat Drummer. Add 1 to charge rolls for this unit while it has any Deathbeat Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `The Point of Death`,
        desc: `At the start of your first hero phase, if this unit is on the battlefield, you can pick 1 enemy unit to be its prey. After this unit makes a normal move, if this unit finishes that move closer to its prey, add 3 to charge rolls for this unit until your next hero phase.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
      {
        name: `The Point of Death`,
        desc: `After this unit makes a normal move, if this unit finishes that move closer to its prey, add 3 to charge rolls for this unit until your next hero phase.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Grimghast Reapers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Extoller of Shyish. That model is armed with a Death Knell instead of a Slasher Scythe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaped Like Corn`,
        desc: `Add 1 to the Attacks characteristic of this unit's Slasher Scythes if there are 5 or more models in the target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Chainrasps: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Dreadwarden. Add 1 to the Attacks characteristic of that model's Malignant Weapon.`,
        when: [COMBAT_PHASE],
      },
      ChillingHordeEffect,
    ],
  },
  'Bladegheist Revenants': {
    effects: [
      GenericEffects.Elite,
      {
        name: `Whirling Death`,
        desc: `Add 1 to the Attacks characteristic of this unit's Tomb Greatblades if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Myrmourn Banshees': {
    effects: [
      GenericEffects.Elite,
      {
        name: `Spell-eaters`,
        desc: `You can roll 2D6 each time an enemy Wizard successfully casts a spell that is not unbound and chooses for the effect of the spell to apply to a unit wholly within 12" of this unit, or when an endless spell finishes a move within 6" of this unit. Add 1 to the roll if this unit has 3 or more models. If the roll is greater than the casting value for that spell or endless spell, that spell is unbound before it has any effect or that endless spell is dispelled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreadscythe Harridans': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Slasher Crone. Add 1 to that Attacks characteristic of that model's Scythed Limbs.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Harrowing Shriek`,
        desc: `Subtract 1 from wound rolls for attacks made by enemy units within 3" of this unit if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous Bloodlust`,
        desc: `Add 1 to hit and wound rolls for attacks made with melee weapons by this unit if it is within 6" of any enemy models that have any wounds allocated to them or if it is within 6" of any enemy units that have had any models slain in that turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Spirit Hosts': {
    effects: [
      GenericEffects.Elite,
      {
        name: `Drawn to War`,
        desc: `Before you allocate a wound or mortal wound to a friendly NIGHTHAUNT HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, if any friendly units with this ability are within 3" of that HERO, you can roll a dice. On a 3+, that wound or mortal wound is allocated to a friendly unit with this ability that is within 3" of that HERO instead of that HERO and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_OCTOBER_2022],
      },
    ],
  },
  Hexwraiths: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hellwraith. Add 1 to the Attacks characteristic of that model's Spectral Scythe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Phantasmal Advance`,
        desc: `At the start of your movement phase, you can say that this unit will perform a phantasmal advance. If you do so, double this unit's Move characteristic until the end of that phase, but this unit cannot charge in the same turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Spectral Hunters`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Black Coach': {
    effects: [
      {
        name: `Nimbus of Power`,
        desc: `Instead of picking this unit to make a normal move or retreat, you can say it will travel the underworlds to a new location. If you do so, remove this unit from the battlefield and set it up again on the battlefield more than 1" from all terrain features and objectives and more than 9" from all enemy units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Evocation of Death`,
        desc: `When this unit is set up for the first time, place a D6 beside it with the 1 facing up.`,
        when: [DURING_SETUP],
      },
      {
        name: `Evocation of Death`,
        desc: `Each time an enemy model is slain or flees within 12" of this unit, increase the value of the dice beside this unit by 1 (to a maximum of 6).`,
        when: [WOUND_ALLOCATION_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Evocation of Death`,
        desc: `If the value of the dice beside this unit is 5-6, this unit has a ward of 4+ instead of 5+ from the Insubstantial Form ability.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Evocation of Death`,
        desc: `Once per turn, in your shooting phase, if the value of the dice beside this unit is 6, you can say this unit will unleash its stored necromantic energy. If you do so, pick 1 enemy unit within 12" of this unit and roll a dice. On a 2+, that enemy unit suffers 3D3 mortal wounds. Then, change the value of the dice beside this unit back to 1.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Insubstantial Form`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Runaway Coach`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'The Briar Queen': {
    mandatory: {
      spells: [keyPicker(spells, ['Howling Vortex'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Grasping Chains`,
        desc: `Before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, if this unit is within 3" of its retinue, roll a dice. On a 1-2, that wound or mortal wound is allocated to this unit as normal. On a 3+, that wound or mortal wound is allocated to this unit's retinue instead of this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Thorns of the Briar Queen': {
    effects: [
      {
        name: `Champion`,
        desc: `Varclav the Cruel is the unit champion. Add 1 to the Attacks characteristic of that model's Malignant Weapon.`,
        when: [COMBAT_PHASE],
      },
      ChillingHordeEffect,
    ],
  },
  'Krulghast Cruciator': {
    effects: [
      {
        name: `Empowered Through Excruciation`,
        desc: `If this unit is within 12" of any terrified units, subtract 1 from the damage inflicted (to a minimum of 1) by each successful attack that targets a friendly NIGHTHAUNT unit wholly within 12" of this unit. The same enemy unit cannot be affected by this ability more than once per phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_OCTOBER_2022],
      },
    ],
  },
  Mourngul: {
    effects: [
      {
        name: `Devourer of Flesh and Souls`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Ethereal`,
        desc: `Ignore modifiers (positive and negative) when making save rolls for attacks that target this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with this model's Nightmarish Claws and Fangs is 6, that attack causes 2 mortal wounds to the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghastly Apparition`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units while they are within 6" of any friendly models with this ability.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
