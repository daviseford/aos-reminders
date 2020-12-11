import { OrderUnits } from 'factions/grand_alliances'
import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Prayers from './prayers'

const AuricRunesonEffects = [
  {
    name: `Vying for Glory`,
    desc: `You can reroll hit rolls for attacks made by this model if there are any other friendly AURIC RUNESONS within 6" of this model.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Wyrmslayer Javelin`,
    desc: `Add 2 to the Damage characteristic for attacks made with this model's Wyrmslayer Javelin that target a MONSTER.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
]
const MagmadrothEffects = [
  {
    name: `Roaring Fyrestream`,
    desc: `Select a target unit and roll a D6. If the roll is equal to or less than the number of models in the target unit, that unit suffers D3 mortal wounds. If the roll is equal to or less than the number of models in the target unit, and the target unit is within 6" of this model, the target unit suffers D6 mortal wounds instead.`,
    when: [SHOOTING_PHASE],
  },
  {
    name: `Lashing Tail`,
    desc: `Roll a D6 for each enemy unit within 3" of this model. If the roll is less than the number of models in that unit, it suffers D3 mortal wounds.`,
    when: [END_OF_COMBAT_PHASE],
  },
  {
    name: `Volcanic Blood`,
    desc: `Roll a D6 each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound.`,
    when: [COMBAT_PHASE],
  },
]
const StareDownEffect = {
  name: `Stare Down`,
  desc: `Pick an enemy unit within 3" of this model. Subtract D3 from that unit's Bravery characteristic until the start of your next hero phase.`,
  when: [HERO_PHASE],
}
const WeaponBreakerEffect = {
  name: `Weapon Breaker`,
  desc: `Pick an enemy HERO within 3" of this model and roll a D6. On a 6, pick one of the melee weapons that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon for the rest of the battle. You cannot pick the same weapon to be affected by this ability more than once per battle.`,
  when: [END_OF_COMBAT_PHASE],
}
const BerserkFuryEffect = {
  name: `Berserk Fury`,
  desc: `Once per battle, you can choose to unleash this unit's berserk fury. If you do so, until the end of that phase, if a model from this unit is slain, before that model is removed from play, that model can make a pile in move and then attack with all of the melee weapons it is armed with.`,
  when: [START_OF_COMBAT_PHASE],
}
const FyresteelHandaxesEffect = {
  name: `Fyresteel Handaxes`,
  desc: `You can reroll hit rolls for attacks made with a pair of Fyresteel Handaxes.`,
  when: [COMBAT_PHASE],
}

//Unit names
const Units = {
  ...keyPicker(OrderUnits, ['Apprentice Runesmith']),
  'Auric Runefather on Magmadroth': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Steadfast Advance'])],
    },
    effects: [...MagmadrothEffects, StareDownEffect, WeaponBreakerEffect],
  },
  'Bael-Grimnir on Flamespitter': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["Runefather's Favour"])],
    },
    effects: [
      {
        name: `Furious Endurance`,
        desc: `6+ to negate an allocated wound or mortal wound to this model.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      ...MagmadrothEffects,
      {
        name: `Flamespitter's Fury`,
        desc: `Add 6" to the range of this model's Roaring Fyrestream ability if this model did not move in teh movement phase of the same turn.`,
        when: [SHOOTING_PHASE],
      },
      StareDownEffect,
      {
        name: `Hrathling`,
        desc: `Pick an enemy HERO within 3" of this model and roll a D6. On a 5+, pick one of the melee weapons that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon for the rest of the battle. You cannot pick the same weapon to be affected by this ability more than once per battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Auric Runeson on Magmadroth': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Molten Battering Ram'])],
    },
    effects: [...MagmadrothEffects, StareDownEffect],
  },
  'Auric Runesmiter on Magmadroth': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Runic Empowerment'])],
    },
    effects: [
      ...MagmadrothEffects,
      {
        name: `Grand Ritual of Awakening`,
        desc: `Once per battle, you can say this model has consumed a nugget of ur-gold. If you do so, add 1 to save rolls for attacks that target friendly FYRESLAYERS units wholly within 12" of this model until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grand Ritual of Awakening`,
        desc: `If active, add 1 to save rolls for attacks that target friendly FYRESLAYERS units wholly within 12" of this model until the start of your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Fjul-Grimnir': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Honour Our Oaths'])],
    },
    effects: [
      {
        name: `Grimnir's Blessing`,
        desc: `5+ to negate an allocated a wound or mortal wound to Fjul-Grimnir while this model is within 3" of a friendly Chosen Axes unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      StareDownEffect,
      WeaponBreakerEffect,
    ],
  },
  'The Chosen Axes': {
    effects: [
      {
        name: `Chosen Kin`,
        desc: `Add 1 to wound rolls for attacks made by this unit while FJUL-GRIMNIR is within 3" of this unit. Do not take battleshock tests for this unit while it is within 3" of FJUL-GRIMNIR.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, BATTLESHOCK_PHASE],
      },
      BerserkFuryEffect,
      FyresteelHandaxesEffect,
    ],
  },
  'Auric Runefather': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lodge Leader'])],
    },
    effects: [StareDownEffect, WeaponBreakerEffect],
  },
  'Auric Runeson': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Dauntless Assault'])],
    },
    effects: [...AuricRunesonEffects],
  },
  Battlesmith: {
    effects: [
      {
        name: `Icon of Grimnir`,
        desc: `You can say that this model is raising its Icon of Grimnir. If it does so, add 1 to save rolls for attacks that target friendly FYRESLAYERS units wholly within 12" of this model until the start of your next hero phase. However, if you do so, until the start of your next hero phase, friendly FYRESLAYERS units wholly within 12" of this model cannot retreat. A unit cannot benefit from this ability more than once per phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Icon of Grimnir`,
        desc: `If active, add 1 to save rolls for attacks that target friendly FYRESLAYERS units wholly within 12" of this model until the start of your next hero phase.`,
        when: [SAVES_PHASE],
      },
      {
        name: `None Shall Defile the Icon`,
        desc: `If this model is slain, before it is removed from play, friendly FYRESLAYERS units wholly within 12" of this model can swear to protect the fallen icon. If a unit does so, that unit cannot make normal moves and charge moves for the rest of the battle, but you can reroll hit and wound rolls for attacks made with melee weapons by that unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Auric Runemaster': {
    mandatory: {
      prayers: [keyPicker(Prayers, ["Volcano's Call"])],
    },
    effects: [
      {
        name: `Holy Seeker`,
        desc: `Pick 1 enemy unit within 12" of this model and roll 2 dice. If you roll at least one 6, for the rest of the battle, you can reroll hit rolls of 1 for attacks made by friendly Fyreslayers units that target that unit. If you roll two or more 6s, for the rest of the battle, you can reroll hit and wound rolls of 1 for attacks made by friendly FYRESLAYERS units that target that unit instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Grimwrath Berzerker': {
    effects: [
      {
        name: `Unstoppable Berzerker`,
        desc: `6+ to negate a wound or mortal wound allocated to this model. Add 1 to the roll if there are any enemy units within 3" of this model.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Battlefury`,
        desc: `If this model is within 3" of an enemy unit, roll a D6. On a 2+ make a pile in move with this model, and then attack with all the melee weapons this model is armed with.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Dead, But Not Defeated`,
        desc: `If this model is slain, before it is removed from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Doomseeker: {
    effects: [
      {
        name: `Oathbound`,
        desc: `At the start of the first battle round, pick 1 enemy unit that this model has sworn to destroy. At the end of the combat phase, if this model is within 3" of that unit, this model can make a pile-in move and then attack with all the melee weapons it is armed with.`,
        when: [START_OF_GAME, END_OF_COMBAT_PHASE],
      },
      {
        name: `Runic Power`,
        desc: `Add 1 to the Damage characteristic of this model's melee weapons if it has 1 wound allocated to it. Add 2 to the Damage characteristic of this model's melee weapons instead if it has 2 or more wounds allocated to it.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Auric Runesmiter': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Runic Empowerment'])],
    },
    effects: [
      {
        name: `Magmic Tunneling`,
        desc: `Instead of setting up this model on the battlefield, you can place this model to one side and say that it is set up underground as a reserve unit. If you do so, when you would set up another friendly FYRESLAYERS unit, instead of setting up that unit on the battlefield, you can say that it is joining this model underground as a reserve unit. 1 unit can join this model in this way. At the end of your movement phase, you can set up this model anywhere on the battlefield, more than 9" from any enemy units; then set up any unit that joined this model wholly within 12" of this model and more than 9" from any enemy units. Any reserve units underground that are not set up on the battlefield before the start of the fourth battle round are destroyed.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Vulkite Berzerkers': {
    effects: [
      {
        name: `Horn of Grimnir`,
        desc: `Add 1 to charge rolls for units that include any Horns of Grimnir.`,
        when: [CHARGE_PHASE],
      },
      BerserkFuryEffect,
      FyresteelHandaxesEffect,
      {
        name: `Bladed Slingshield`,
        desc: `After a unit armed with Bladed Slingshields makes a charge move, pick 1 enemy unit and roll a D6 for each model from the charging unit within 8" of that enemy unit. For each 6, the enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bladed Slingshield`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit armed with Bladed Slingshields if the target unit did not make a charge move in the same turn.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Auric Hearthguard': {
    effects: [
      {
        name: `Molten Rockbolts`,
        desc: `Add 1 to the Damage for attacks made by Magmapike missile weapons that target MONSTERS. In addition, if any wounds are inflicted on a MONSTER by Magmapike missile weapons, roll a D6. On a 4+, until the end of that unit's next turn, halve that unit's Move characteristic and subtract 1 from hit rolls for attacks made by that unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sworn Protectors`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly FYRESLAYERS HERO that is not mounted on a MAGMADROTH and is within 3" of any friendly units with this ability. On a 4+ that wound or mortal wound is negated, and you must choose a friendly unit with this ability that is within 3" to suffer 1 mortal wound after all wounds or mortal wounds have been allocated to that friendly HERO.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Hearthguard Berzerkers': {
    effects: [
      {
        name: `Duty Unto Death`,
        desc: `6+ to negate a wound or mortal wound allocated to this unit. Add 2 to the roll if there are any friendly FYRESLAYERS HEROES within 10" of this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Smouldering Braziers`,
        desc: `If the unmodified hit roll for an attack made with a Flamestrike Poleaxe is 6, that attack inflicts 2 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
