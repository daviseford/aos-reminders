import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Auric Runefather on Magmadroth`,
    effects: [
      {
        name: `Roaring Fyrestream`,
        desc: `Do not use the attack sequence for an attack made with a Roaring Fyrestream. Instead, make the dice roll shown on the damage table above. If the roll is equal to or less than the number of models in the target unit, that unit suffers D3 mortal wounds. If the roll is equal to or less than the number of models in the target unit, and the target unit is within 6" of this model, the target unit suffers D6 mortal wounds instead.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lashing Tail`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this model. If the roll is less than the number of models in that unit, it suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Volcanic Blood`,
        desc: `Roll a dice each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stare Down`,
        desc: `In your hero phase, pick an enemy unit within 3" of this model. Subtract D3 from that unit's Bravery characteristic until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Weapon Breaker`,
        desc: `At the end of the combat phase, pick an enemy HERO within 3" of this model and roll a dice. On a 6, pick one of the melee weapons that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon for the rest of the battle. You cannot pick the same weapon to be affected by this ability more than once per battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Steadfast Advance`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick a friendly model with this command ability. Until the start of your next hero phase, do not take battleshock tests for friendly FYRESLAYERS units while they are wholly within 18" of that model.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bael-Grimnir on Flamespitter`,
    effects: [
      {
        name: `Furious Endurance`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 6 that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Roaring Fyrestream`,
        desc: `Do not use the attack sequence for an attack made with a Roaring Fyrestream. Instead, make the dice roll shown on the damage table above. If the roll is equal to or less than the number of models in the target unit, that unit suffers D3 mortal wounds. If the roll is equal to or less than the number of models in the target unit, and the target unit is within 6" of this model, the target unit suffers D6 mortal wounds instead.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Flamespitter's Fury`,
        desc: `Add 6" to the range of this model's Roaring Fyrestream ability if this model did not move in teh movement phase of the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lashing Tail`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this model. If the roll is less than the number of models in that unit, it suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Volcanic Blood`,
        desc: `Roll a dice each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stare Down`,
        desc: `In your hero phase, pick an enemy unit within 3" of this model. Subtract D3 from that unit's Bravery characteristic until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hrathling`,
        desc: `At the end of the combat phase, pick an enemy HERO within 3" of this model and roll a dice. On a 5+, pick one of the melee weapons that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon for the rest of the battle. You cannot pick the same weapon to be affected by this ability more than once per battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Runefather's Favour`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly VOSTARG HERO within 12" of this model other than this model and roll a dice. On a 4+ that HERO can immediately pile-in and attack with al of the melee weapons it is armed with. You cannot pick the same HERO to benefit from this ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Auric Runeson on Magmadroth`,
    effects: [
      {
        name: `Roaring Fyrestream`,
        desc: `Do not use the attack sequence for an attack made with a Roaring Fyrestream. Instead, make the dice roll shown on the damage table above. If the roll is equal to or less than the number of models in the target unit, that unit suffers D3 mortal wounds. If the roll is equal to or less than the number of models in the target unit, and the target unit is within 6" of this model, the target unit suffers D6 mortal wounds instead.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lashing Tail`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this model. If the roll is less than the number of models in that unit, it suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Volcanic Blood`,
        desc: `Roll a dice each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Vying for Glory`,
        desc: `You can re-roll hit rolls for attacks made by this model if there are any other friendly AURIC RUNESONS within 6" of this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Wyrmslayer Javelin`,
        desc: `Add 2 to the Damage characteristic for attacks made with this model's Wyrmslayer Javelin that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Molten Battering Ram`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly MAGMADROTH that is within 12" of a friendly model with this command ability. After that unit makes a charge move in that charge phase, you can pick 1 enemy unit within 1" of that model and roll a dice. On a 2+ that enemy unit suffers D6 mortal wounds. The same unit cannot be picked to be affected by this command ability more than once per phase.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Auric Runesmiter on Magmadroth`,
    effects: [
      {
        name: `Roaring Fyrestream`,
        desc: `Do not use the attack sequence for an attack made with a Roaring Fyrestream. Instead, make the dice roll shown on the damage table above. If the roll is equal to or less than the number of models in the target unit, that unit suffers D3 mortal wounds. If the roll is equal to or less than the number of models in the target unit, and the target unit is within 6" of this model, the target unit suffers D6 mortal wounds instead.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lashing Tail`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this model. If the roll is less than the number of models in that unit, it suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Volcanic Blood`,
        desc: `Roll a dice each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grand Ritual of Awakening`,
        desc: `Once per battle, during your hero phase, you can say this model has consumed a nugget of ur-gold. If you do so, add 1 to save rolls for attacks that target friendly FYRESLAYERS units wholly within 12" of this model until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Runic Empowerment`,
        desc: `At the start of your hero phase, this model can chant this prayer. If they do so, make a prayer roll by rolling a dice. On a 1-2, the prayer is not answered. On a 3+ the prayer is answered. If this prayer is answered, pick a friendly FYRESLAYERS unit wholly within 12" of this model, or wholly within 18" of this model if this model is armed with a Forge Key. You can re-roll wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Fjul-Grimnir`,
    effects: [
      {
        name: `Grimnir's Blessing`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to Fjul-Grimnir while this model is within 3" of a friendly Chosen Axes unit. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Stare Down`,
        desc: `In your hero phase, pick an enemy unit within 3" of this model. Subtract D3 from that unit's Bravery characteristic until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Weapon Breaker`,
        desc: `At the end of the combat phase, pick an enemy HERO within 3" of this model and roll a dice. On a 6, pick one of the melee weapons that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon for the rest of the battle. You cannot pick the same weapon to be affected by this ability more than once per battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Honour Our Oaths`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, add 1 to hit rolls for attacks made by friendly VOSTARG units while they are wholly within 12" of that model. The same unit cannot be picked to be affected by this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `The Chosen Axes`,
    effects: [
      {
        name: `Chosen Kin`,
        desc: `Add 1 to wound rolls for attacks made by this unit while FJUL-GRIMNIR is within 3" of this unit. Do not take battleshock tests for this unit while it is within 3" of FJUL-GRIMNIR.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Berserk Fury`,
        desc: `Once per battle, at the start of the combat phase, you can choose to unleash this unit's berserk fury. If you do so, until the end of that phase, if a model from this unit is slain, before that model is removed from play, that model can make a pile in move and then attack with all of the melee weapons it is armed with.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fyresteel Handaxes`,
        desc: `You can re-roll hit rolls for attacks made with a pair of Fyresteel Handaxes.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Auric Runefather`,
    effects: [
      {
        name: `Stare Down`,
        desc: `In your hero phase, pick an enemy unit within 3" of this model. Subtract D3 from that unit's Bravery characteristic until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Weapon Breaker`,
        desc: `At the end of the combat phase, pick an enemy HERO within 3" of this model and roll a dice. On a 6, pick one of the melee weapons that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon for the rest of the battle. You cannot pick the same weapon to be affected by this ability more than once per battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Lodge Leader`,
        desc: `You can use this command ability at the start of the charge phase. If you do so, pick a friendly model with this command ability. Add 1 charge rolls for friendly FYRESLAYERS units wholly within 12" of that model until the end of that phase.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Auric Runeson`,
    effects: [
      {
        name: `Vying for Glory`,
        desc: `You can re-roll hit rolls for attacks made by this model if there are any other friendly AURIC RUNESONS within 6" of this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Wyrmslayer Javelin`,
        desc: `Add 2 to the Damage characteristic for attacks made with this model's Wyrmslayer Javelin that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Dauntless Assault`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Add 1 to wound rolls for attacks made by friendly FYRESLAYERS units wholly within 12" of that model until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Battlesmith`,
    effects: [
      {
        name: `Icon of Grimnir`,
        desc: `In your hero phase, you can say that this model is raising its icon of Grimnir. If it does so, add 1 to save rolls for attacks that target friendly FYRESLAYERS units wholly within 12" of this model until the start of your next hero phase. However, if you do so, until the start of your next hero phase, friendly FYRESLAYERS units wholly within 12" of this model cannot retreat.`,
        when: [HERO_PHASE],
      },
      {
        name: `None Shall Defile the Icon`,
        desc: `f this model is slain, before it is removed from play, friendly FYRESLAYERS units wholly within 12" of this model can swear to protect the fallen icon. If a unit does so, that unit cannot make normal moves and charge moves for the rest of the battle, but you can re-roll hit and wound rolls for attacks made with melee weapons by that unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Auric Runemaster`,
    effects: [
      {
        name: `Holy Seeker`,
        desc: `In your hero phase, you can pick 1 enemy unit within 12" of this model and roll 2 dice. If you roll at least one 6, for the rest of the battle, you can re-roll hit rolls of 1 for attacks made by friendly Fyreslayers units that target that unit. If you roll two or more 6s, for the rest of the battle, you can re-roll hit and wound rolls of 1 for attacks made by friendly FYRESLAYERS units that target that unit instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Volcano's Call`,
        desc: `At the start of your hero phase, this model can chant this prayer. If they do so, make a prayer roll by rolling a dice. On a 1-2, the prayer is not answered. On a 3+ the prayer is answered. If this prayer is answered, pick a terrain feature within 18" of this model. Roll a dice for each model within 1" of that terrain feature. For each roll of a 6, that model's unit suffers 1 mortal wound. In addition, until your next hero phase, that terrain feature has the 'Deadly' scenery rule in addition to any other scenery rules it may have.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Grimwrath Berzerker`,
    effects: [
      {
        name: `Unstoppable Berzerker`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. Add 1 to the roll if there are any enemy units within 3" of this model. On a 6+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Battlefury`,
        desc: `At the end of the combat phase, if this model is within 3" of an enemy unit, roll a dice. On a 2+ make a pile in move with this model, and then attack with all the melee weapons this model is armed with.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Dead, But Not Defeated`,
        desc: `If this model is slain, before it is removed from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Doomseeker`,
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
  {
    name: `Auric Runesmiter`,
    effects: [
      {
        name: `Magmic Tunneling`,
        desc: `Instead of setting up this model on the battlefield, you can place this model to one side and say that it is set up underground as a reserve unit. If you do so, when you would set up another friendly FYRESLAYERS unit, instead of setting up that unit on the battlefield, you can say that it is joining this model underground as a reserve unit. 1 unit can join this model in this way. At the end of your movement phase, you can set up this model anywhere on the battlefield, more than 9" from any enemy units; then set up any unit that joined this model wholly within 12" of this model and more than 9" from any enemy units. Any reserve units underground that are not set up on the battlefield before the start of the fourth battle round are destroyed.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Runic Empowerment`,
        desc: `At the start of your hero phase, this model can chant this prayer. If they do so, make a prayer roll by rolling a dice. On a 1-2, the prayer is not answered. On a 3+ the prayer is answered. If this prayer is answered, pick a friendly FYRESLAYERS unit wholly within 12" of this model, or wholly within 18" of this model if this model is armed with a Forge Key. You can re-roll wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vulkite Berzerkers`,
    effects: [
      {
        name: `Horn of Grimnir`,
        desc: `1 in every 5 models in this unit can have a Horn of Grimnir. Add 1 to charge rolls for units that include any Horns of Grimnir.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Berserk Fury`,
        desc: `Once per battle, at the start of the combat phase, you can choose to unleash this unit's berserk fury. If you do so, until the end of that phase, if a model from this unit is slain, before that model is removed from play, that model can make a pile in move and then attack with all of the melee weapons it is armed with.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fyresteel Handaxes`,
        desc: `You can re-roll hit rolls for attacks made with a pair of Fyresteel Handaxes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bladed Slingshield`,
        desc: `After a unit armed with Bladed Slingshields makes a charge move, pick 1 enemy unit and roll a dice for each model from the charging unit within 8" of that enemy unit. For each 6, the enemy unit suffers 1 mortal wound. In addition, add 1 to save rolls for attacks made with melee weapons that target a unit armed with Bladed Slingshields if the target unit did not make a charge move in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Auric Hearthguard`,
    effects: [
      {
        name: `Molten Rockbolts`,
        desc: `Add 1 to the Damage characteristic for attacks made by Magmapike missile weapons that target MONSTERS. In addition, if any wounds are inflicted on a MONSTER by Magmapike missile weapons, roll a dice. On a 4+, until the end of that unit's next turn, halve that unit's Move characteristic and subtract 1 from hit rolls for attacks made by that unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sworn Protectors`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly FYRESLAYERS HERO that is not mounted on a MAGMADROTH and is within 3" of any friendly units with this ability. On a 4+ that wound or mortal wound is negated, and you must choose a friendly unit with this ability that is within 3" to suffer 1 mortal wound after all wounds or mortal wounds have been allocated to that friendly HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Hearthguard Berzerkers`,
    effects: [
      {
        name: `Duty Unto Death`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this unit. Add 2 to the roll if there are any friendly FYRESLAYERS HEROES within 10" of this unit. On a 6+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Smouldering Braziers`,
        desc: `If the unmodified hit roll for an attack made with a Flamestrike Poleaxe is 6, that attack inflicts 2 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Zharrgron Flame-spitter`,
    effects: [
      {
        name: `Summon Zharrgron Flame-spitter`,
        desc: `At the start of your hero phase, 1 friendly FYRESLAYERS PRIEST can attempt to perform this magmic invocation. If they do so, make an invocation roll by rolling a dice. On a 3+ the invocation roll is successful. If the invocation roll is successful, set up this model wholly within 6" of that FYRESLAYERS PRIEST.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magma Blast`,
        desc: `At the start of your shooting phase, if there is a friendly FYRESLAYERS PRIEST within 6" of this model, you can pick an enemy unit within 24" of this model and roll 12 dice. Add 1 to the roll if there are 10 or more models in the unit. Add 2 to the roll instead if there are 20 or more models in the unit. For each 6+, the unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Runic Fyrewall`,
    effects: [
      {
        name: `Summon Runic Fyrewall`,
        desc: `At the start of your hero phase, 1 friendly FYRESLAYERS PRIEST can attempt to perform this magmic invocation. If they do so, make an invocation roll by rolling a dice. On a 3+ the invocation roll is successful. If the invocation roll is successful, set up this model wholly within 18" of that FYRESLAYERS PRIEST.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Roaring Rune-fire`,
        desc: `A model cannot see another model if an imaginary straight line, 1mm wide, drawn from the centre of its base to the centre of the other model's base passes within 1" of this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Awakened Runes`,
        desc: `Re-roll save rolls of 1 for attacks that target FYRESLAYERS units wholly within 12" of this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Impervious to Heat`,
        desc: `MAGMADROTHS can pass across this model in the same manner as a model that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Molten Infernoth`,
    effects: [
      {
        name: `Summon Molten Infernoth`,
        desc: `At the start of your hero phase, 1 friendly FYRESLAYERS PRIEST can attempt to perform this magmic invocation. If they do so, make an invocation roll by rolling a dice. On a 3+ the invocation roll is successful. If the invocation roll is successful, set up this model wholly within 12" of that FYRESLAYERS PRIEST.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Burning Tide`,
        desc: `When this magmic invocation is set up, the player who set it up can immediately make a move with it. In addition, at the start of each of their subsequent hero phases, the player who set this magmic invocation up can make a move with it if it is still on the battlefield. When you move this magmic invocation, it can move up to 2D6"`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Erupting Inferno`,
        desc: `After this model has moved, roll 12 dice for each unit that is within 3" of it at the end of its move. For each 6, that unit suffers 1 mortal wound. FYRESLAYERS units are not affected by this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fiery Wrath of Vulcatrix`,
        desc: `Add 1 to the Bravery characteristic of FYRESLAYERS units while they are wholly within 18" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Grand Fyrd`,
    effects: [
      {
        name: `Blazing Runes`,
        desc: `Ur-gold enhanced effects trigger on 5+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lords of the Lodge`,
    effects: [
      {
        name: `Oathbound Guardians`,
        desc: `If a unit of HEARTHGUARD BERZERKERS from this battalion is wholly within 12" of a HERO from the same battalion at the start of the combat phase, then after that unit has fought in that phase for the first time, when it is your turn to pick a unit to fight with later in the same phase, you can select it again.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warrior Kinband`,
    effects: [
      {
        name: `Berserk Kindred`,
        desc: `You can use the Berserk Fury ability for 1 VULKITE BERZERKERS unit from this battalion twice in the same battle if that unit is wholly within 12" of an AURIC RUNESON from the same battalion the second time the ability is used.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Forge Brethren`,
    effects: [
      {
        name: `Bulwark of Molten Stone`,
        desc: `At the start of the enemy hero phase, you can pick 1 friendly unit wholly within 18" of any units of AURIC HEARTHGUARD from this battalion. If you do so add 1 to save rolls for that target until your next hero.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lords of Vostarg`,
    effects: [
      {
        name: `Strength in Tradition`,
        desc: `Once per battle round, a HERO from this battalion can use a command ability without spending a command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Vostarg Warrior Kinband`,
    effects: [
      {
        name: `Mighty Deeds and Blazing Oaths`,
        desc: `Add 1 to the melee weapon Attacks for VULKITE BERZERKERS units from this battalion while they are wholly within 12" of this battalion' AURIC RUNESON.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Vostarg Forge Brethren`,
    effects: [
      {
        name: `Heir of the Fyreheart Temple`,
        desc: `If a friendly unit of AURIC HEARTHGUARD from this battalion is wholly within 12" of Dhurgan when he uses his Magmic Prayer of Runic Empowerment ability, the prayer is answered on a 2+ instead of 3+.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
