import { keyPicker, tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import Prayers from './prayers'

const MagmadrothEffects = [
  {
    name: `Roaring Fyrestream`,
    desc: `The Attacks characteristic of a Roaring Fyrestream is equal to the number of models in the target unit (to a maximum Attacks characteristic of 10).`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
  {
    name: `Roaring Fyrestream`,
    desc: `At the end of your shooting phase, if this unit did not make an attack with its Roaring Fyrestream in that phase, you can say that an inferno is raging inside this unit. If an inferno is raging inside this unit, improve the Rend characteristic of its Roaring Fyrestream by 2. After the next attack made with this unit's Roaring Fyrestream has been resolved, an inferno is no longer raging inside this unit.`,
    when: [END_OF_SHOOTING_PHASE],
    shared: true,
  },
  {
    name: `Lashing Tail`,
    desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this unit. If the roll is equal to or less than the number of models in that enemy unit, that unit suffers D3 mortal wounds.`,
    when: [END_OF_COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Volcanic Blood`,
    desc: `Roll a dice each time a wound caused by an attack made with a melee weapon is allocated to this unit. On a 4+, the attacking unit suffers 1 mortal wound.`,
    when: [WOUND_ALLOCATION_PHASE],
    shared: true,
  },
]
const WhirlwindOfDestructionEffect = {
  name: `Whirlwind of Destruction`,
  desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const BerserkFuryEffect = {
  name: `Berserk Fury`,
  desc: `Once per battle, at the start of the combat phase, you can say that this unit will unleash its berserk fury. If you do so, until the end of that phase, if a model in this unit is slain, that model can fight before it is removed from play.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const LordOfTheLodgeEffect = {
  name: `Lord of the Lodge`,
  desc: `Once per battle, at the start of your combat phase, you can pick 1 friendly unit on the battlefield with this ability to unleash the wrath of Grimnir. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly FYRESLAYERS units while they are wholly within 12" of that unit.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const AuricRetinueEffect = {
  name: `Retinue`,
  desc: `At the start of the first battle round, before determining who has the first turn, you can pick 1 friendly AURIC HEARTHGUARD or HEARTHGUARD BERZERKERS unit on the battlefield that is not another unit's retinue to be this unit's retinue.`,
  when: [TURN_ONE_START_OF_ROUND],
  shared: true,
}
const RoyalRetinueEffect = {
  name: `Royal Retinue`,
  desc: `Before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, if this unit is within 3" of its retinue, you can roll a dice. On a 1-2, that wound or mortal wound is allocated to this unit as normal. On a 3+, that wound or mortal wound is allocated to this unit's retinue instead. If the retinue has a ward, you can make a ward roll before allocating that wound or mortal wound to it.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const DauntlessAssaultEffect = {
  name: `Dauntless Assault`,
  desc: `After this unit has fought in the combat phase for the first time, if its retinue has not yet fought in that combat phase, is within 3" of an enemy unit and is wholly within 12" of this unit, this unit's retinue can fight immediately.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const VyingForGloryEffect = {
  name: `Vying for Glory`,
  desc: `If the unmodified hit roll for an attack made by this unit that targets a MONSTER is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
  shared: true,
}
const VulkiteBezerkersBaseEffects = [
  {
    name: `Champion`,
    desc: `1 model in this unit can be a Karl. Add 1 to the Attacks characteristic of that model's melee weapons.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Musician`,
    desc: `1 in every 5 models in this unit can be a Hornblower of Grimnir. Add 1 to charge rolls for this unit if it includes any Hornblowers of Grimnir.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
  BerserkFuryEffect,
]

const Units = {
  'Auric Runefather': {
    effects: [AuricRetinueEffect, RoyalRetinueEffect, DauntlessAssaultEffect, LordOfTheLodgeEffect],
  },
  'Auric Runefather on Magmadroth': {
    effects: [...MagmadrothEffects, LordOfTheLodgeEffect],
  },
  'Auric Runeson': {
    effects: [AuricRetinueEffect, RoyalRetinueEffect, DauntlessAssaultEffect, VyingForGloryEffect],
  },
  'Auric Runeson on Magmadroth': {
    effects: [...MagmadrothEffects, VyingForGloryEffect],
  },
  'Auric Runesmiter': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Runic Empowerment'])],
    },
    effects: [
      {
        name: `Magmic Tunneling`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up underground as a reserve unit. Then, instead of setting up another friendly FYRESLAYERS unit, you can place that unit to one side and say that it will join this unit underground as a reserve unit. 1 unit can join this unit underground as a reserve unit. At the end of your movement phase, you can set up this unit anywhere on the battlefield more than 9" from all enemy units. Then, set up the unit that joined this unit wholly within 12" of this unit and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Magmic Tunneling`,
        desc: `At the end of your movement phase, you can set up this unit anywhere on the battlefield more than 9" from all enemy units. Then, set up the unit that joined this unit wholly within 12" of this unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Auric Runesmiter on Magmadroth': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Runic Empowerment'])],
    },
    effects: [...MagmadrothEffects],
  },
  'Auric Flamekeeper': {
    effects: [
      {
        name: `Masterflame Rune`,
        desc: `When this unit is set up, place a D6 beside it with the 1 facing up.`,
        when: [DURING_SETUP],
      },
      {
        name: `Masterflame Rune`,
        desc: `Each time a friendly FYRESLAYERS model is slain within 12" of this unit, increase the value of the dice beside this unit by 1 (to a maximum of 6).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Masterflame Rune`,
        desc: `Once per turn, at the start of the combat phase, if the value of the dice beside this unit is 6, you can say that this unit will draw upon the power of the runes of their fallen brethren. If you do so, pick 1 friendly AURIC HEARTHGUARD, HEARTHGUARD BERZERKERS or VULKITE BERZERKERS unit wholly within 12" of this unit and apply 1 of the following effects to that unit. Then, change the value of the dice beside this unit back to 1. Each effect lasts until the end of that phase.

        Grimnir's Grit: That unit has a ward of 6+.

        Grimnir's Wrath: If a model in that unit is slain and that model has not yet fought in that phase, that model can fight before it is removed from play.

        Grimnir's Resolve: If that unit is within 12" of an enemy unit and not within 3" of any enemy units, and that unit has not run or retreated in the same turn, that unit can immediately attempt a charge.

        Grimnir's Vengeance: Add 1 to the Damage characteristic of that unit's melee weapons.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Fjul-Grimnir': {
    effects: [
      {
        name: `Retinue`,
        desc: `This unit's retinue is the The Chosen Axes unit in your army.`,
        when: [DURING_GAME],
      },
      DauntlessAssaultEffect,
      RoyalRetinueEffect,
    ],
  },
  'The Chosen Axes': {
    effects: [
      {
        name: `Champion`,
        desc: `Tefk Flamebearer is the unit champion. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      BerserkFuryEffect,
      WhirlwindOfDestructionEffect,
    ],
  },
  Battlesmith: {
    effects: [
      {
        name: `Icon of Grimnir`,
        desc: `Friendly FYRESLAYERS units wholly within 12" of this unit have a ward of 6+`,
        when: [SAVES_PHASE],
      },
      {
        name: `Icon of Grimnir`,
        desc: `Once per battle, in your hero phase, you can pick 1 friendly unit on the battlefield with this ability to plant its Icon of Grimnir. If you do so, until the start of your next hero phase, friendly FYRESLAYERS units wholly within 12" of that unit have a ward of 5+ instead of 6+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Icon of Grimnir`,
        desc: `If the Icon of Grimnir is planted, friendly FYRESLAYERS units wholly within 12" of that unit have a ward of 5+ instead of 6+.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Bard of the Lodge`,
        desc: `If this unit issues the Rally command (core rules, 7.2), you can return 1 slain model to the unit that receives the command for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Auric Runemaster': {
    mandatory: {
      prayers: [keyPicker(Prayers, ["Volcano's Call"])],
    },
    effects: [
      {
        name: `High Priest of the Zharrgrim`,
        desc: `If this unit is part of a FYRESLAYERS army, it knows all of the prayers from the Zharrgrim Blessings prayer scripture in addition to the other prayers it knows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wise Council`,
        desc: `At the start of your hero phase, if your general is within 3" of any friendly AURIC RUNEMASTERS, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Grimwrath Berzerker': {
    effects: [
      {
        name: `Battle-fury`,
        desc: `At the end of the combat phase, if this unit is within 3" of an enemy unit and has fought no more than once in that phase, roll a dice. On a 2+, this unit can fight.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Dead But Not Defeated`,
        desc: `In the combat phase, if this unit is destroyed and has fought no more than once in that phase, this unit can fight before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Doomseeker: {
    effects: [
      {
        name: `Oathbound`,
        desc: `At the start of the first battle round, pick 1 enemy unit for this unit to swear to destroy.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Oathbound`,
        desc: `At the end of the combat phase, if this unit is within 3" of the unit it has sworn to destroy and has fought no more than once in that phase, this unit can fight but it can only target that unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Oathbound`,
        desc: `In the combat phase, if this unit is destroyed within 3" of the unit it has sworn to destroy and has fought no more than once in that phase, this unit can fight before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Runic Power`,
        desc: `Add 1 to the Damage characteristic of this unit's melee weapons if this unit has 1 wound allocated to it. Add 2 to the Damage characteristic of this unit's melee weapons instead if this unit has 2 or more wounds allocated to it or if the Oathbound ability has allowed this unit to fight before being removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vulkite Berzerkers with Bladed Slingshields': {
    effects: [
      ...VulkiteBezerkersBaseEffects,
      {
        name: `Bladed Slingshield`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 6, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Vulkite Berzerkers with Fyresteel Handaxes': {
    effects: [...VulkiteBezerkersBaseEffects, WhirlwindOfDestructionEffect],
  },
  'Auric Hearthguard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Karl. Add 1 to the Attacks characteristic of that model's Magmapike.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Molten Rockbolts`,
        desc: `If the unmodified hit roll for a shooting attack made with a Magmapike is 6, subtract 1" from the target unit's Move characteristic until the end of your opponent's next turn. This ability cannot reduce the target unit's Move characteristic below half.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Hearthguard Berzerkers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Karl. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Duty Unto Death`,
        desc: `This unit has a ward of 4+ if it is wholly within 9" of any friendly FYRESLAYERS HEROES.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Smouldering Braziers`,
        desc: `If the unmodified hit roll for an attack made with a Flamestrike Poleaxe is 6, that attack causes 2 mortal wounds to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
