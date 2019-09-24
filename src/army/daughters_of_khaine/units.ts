import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Morathi, High Oracle of Khaine`,
    effects: [
      {
        name: `Monstrous Transformation`,
        desc: `Morathi can transform into her monstrous aspect.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Truth Revealed.`,
        desc: `Roll a D6 and if the result is equal to or less than the number of wounds currently allocated to Morathi, she transforms into Morathi, the Shadow Queen.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Iron Heart of Khaine`,
        desc: `Morathi, High Oracle of Khaine cannot be healed, but no more than 3 wounds can be allocated to her in any one turn. Any additional wounds and/or mortal wounds allocated to her in the same turn are negated and have no effect.`,
        when: [DURING_GAME],
      },
      {
        name: `Sorceress Supreme`,
        desc: `Add 1 to casting and unbinding rolls made for Morathi, High Oracle of Khaine. In addition, double the range of spells she attempts to cast.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enchanting Beauty`,
        desc: `Subtract 1 from the hit rolls of attacks that target Morathi, High Oracle of Khaine.`,
        when: [DURING_GAME],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 3 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Arnzipal's Black Horror.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arnzipal's Black Horror`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" visible to the caster and roll a D6. On a 1 that unit suffers 1 mortal wound. On a 2 or 3 it suffers D3 mortal wounds. On a 4+ it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Worship Through Bloodshed`,
        desc: `If Morathi, High Oracle of Khaine is your general, you can use this ability. If you do, pick up to 2 friendly Daughters of Khaine units within 14" of Morathi (you cannot choose Morathi herself ). Those units can immediately shoot as if it were the shooting phase. Alternatively, if either unit is within 3" of an enemy unit, it can instead be chosen to pile in and attack as if it were the combat phase. The same unit cannot be picked to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Morathi, the Shadow Queen`,
    effects: [
      {
        name: `Monstrous Revelation`,
        desc: `When Morathi transforms, her High Oracle of Khaine model is removed from the battlefield and her Shadow Queen model is set up on the spot where she was standing before her transformation.

               Morathi's Shadow Queen model can only be set up within 3" of an enemy unit if her High Oracle of Khaine model was within 3" of that unit before her transformation.

               If there is insufficient room to place Morathi exactly where she was standing before her transformation, simply place the model as close as possible to that spot where there is room. If, after her Shadow Queen model has been set up, Morathi is more than 14" away from the spot where she was standing before her transformation, she cannot move in the following movement phase.

               Any wounds allocated to Morathi in her High Oracle of Khaine form prior to her transformation are carried over to her Shadow Queen form and then doubled.

               Morathi remains in this form for the remainder of the battle. If she was your general in the High Oracle form she remains your general.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gaze of Morathi`,
        desc: `If a target is hit by the Gaze of Morathi, pick a model in the target unit and roll a D6. If the result exceeds that model's Wounds characteristic, it is slain.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `The Iron Heart of Khaine`,
        desc: `Morathi, the Shadow Queen cannot be healed, but no more than 3 wounds can be allocated to her in any one turn. Any additional wounds and/or mortal wounds allocated to her in the same turn are negated and have no effect.`,
        when: [DURING_GAME],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Arnzipal's Black Horror.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arnzipal's Black Horror`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" visible to the caster and roll a D6. On a 1 that unit suffers 1 mortal wound. On a 2 or 3 it suffers D3 mortal wounds. On a 4+ it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Hag Queen`,
    effects: [
      {
        name: `Priestess of Khaine`,
        desc: `Pick a prayer this model knows and roll a D6. On a result of 1 she is found unworthy and suffers 1 mortal wound. On a 2 nothing happens. On a 3+ the prayer is successful and its effect takes place. A Hag Queen knows the Rune of Khaine and Touch of Death prayers.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune of Khaine`,
        desc: `If active, the Hag Queen's Blade of Khaine has a Damage characteristic of D3 instead of 1 until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Touch of Death`,
        desc: `If active, pick a unit within 3" of this model and then hide a dice in one of your hands. Your opponent must pick a hand; if that hand is holding the dice, the unit you picked suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Witchbrew`,
        desc: `You can pick a friendly Daughters of Khaine unit within 3" of this model to drink witchbrew.`,
        when: [HERO_PHASE],
      },
      {
        name: `Witchbrew`,
        desc: `If active, re-roll failed wound rolls for that unit's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Witchbrew`,
        desc: `If active, you do not need to take battleshock tests for the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Slaughter Queen`,
    effects: [
      {
        name: `Priestess of Khaine`,
        desc: `Pick a prayer this model knows and roll a D6. On a result of 1 she is found unworthy and suffers 1 mortal wound. On a 2 nothing happens. On a 3+ the prayer is successful and its effect takes place. A Hag Queen knows the Rune of Khaine, Touch of Death, and Dance of Doom prayers.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune of Khaine`,
        desc: `If active, the Hag Queen's Blade of Khaine has a Damage characteristic of D3 instead of 1 until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Touch of Death`,
        desc: `If active, pick a unit within 3" of this model and then hide a dice in one of your hands. Your opponent must pick a hand; if that hand is holding the dice, the unit you picked suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dance of Doom`,
        desc: `If active, until your next hero phase, this model can be chosen to pile in and attack twice in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pact of Blood`,
        desc: `A Slaughter Queen can attempt to unbind one spell in the enemy hero phase as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Orgy of Slaughter`,
        desc: `If this model is your general, you can use this ability. If you do, pick a friendly Daughters of Khaine unit within 14" of this model. If that unit is within 3" of an enemy unit, it can pile in and attack as if it were the combat phase. The same unit cannot be picked to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Avatar of Khaine`,
    effects: [
      {
        name: `Wrath of Khaine`,
        desc: `If your army includes any Avatars of Khaine, friendly Daughters of Khaine priests know the Wrath of Khaine prayer in addition to any other prayers they know.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of Khaine`,
        desc: `If active, pick a friendly Avatar of Khaine on the battlefield. Until your next hero phase it is now Animated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Animated`,
        desc: `The Avatar of Khaine cannot move, cannot shoot, and cannot be selected to fight unless it has been Animated in the hero phase (either via prayer or Blood Rite). Even if the model has not been Animated, it is still treated as a model in your army with the exception that enemy units starting their movement phase within 3" of it can move normally without a retreat.`,
        when: [DURING_GAME],
      },
      {
        name: `Idol of Worship`,
        desc: `Add 1 to the bravery characteristic of friendly Daughters of Khaine units that are within 7" of any friendly Avatars of Khaine.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Hag Queen on Cauldron of Blood`,
    effects: [
      {
        name: `Bladed Impact`,
        desc: `Roll a D6 if this model ends a charge move within 1" of any enemy units. On a 2+ that nearest enemy suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bloodshield`,
        desc: `Add 1 to the save rolls for friendly Daughters of Khaine units that are wholly within range of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Witchbrew`,
        desc: `You can pick a friendly Daughters of Khaine unit within 3" of this model to drink witchbrew.`,
        when: [HERO_PHASE],
      },
      {
        name: `Witchbrew`,
        desc: `If active, re-roll failed wound rolls for that unit's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Witchbrew`,
        desc: `If active, you do not need to take battleshock tests for the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Priestess of Khaine`,
        desc: `Pick a prayer this model knows and roll a D6. On a result of 1 she is found unworthy and suffers 1 mortal wound. On a 2 nothing happens. On a 3+ the prayer is successful and its effect takes place. A Hag Queen knows the Rune of Khaine, Touch of Death, and Dance of Doom prayers.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune of Khaine`,
        desc: `If active, the Hag Queen's Blade of Khaine has a Damage characteristic of D3 instead of 1 until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Touch of Death`,
        desc: `If active, pick a unit within 3" of this model and then hide a dice in one of your hands. Your opponent must pick a hand; if that hand is holding the dice, the unit you picked suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of Khaine`,
        desc: `If your army includes any Avatars of Khaine, friendly Daughters of Khaine priests know the Wrath of Khaine prayer in addition to any other prayers they know.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of Khaine`,
        desc: `If active, pick a friendly Avatar of Khaine on the battlefield. Until your next hero phase it is now Animated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Animated`,
        desc: `The Avatar of Khaine cannot shoot and cannot be selected to fight unless it has been Animated in the hero phase (either via prayer or Blood Rite).`,
        when: [DURING_GAME],
      },
      {
        name: `Idol of Worship`,
        desc: `Add 1 to the bravery characteristic of friendly Daughters of Khaine units that are within 7" of any friendly Avatars of Khaine.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Witch Aelves`,
    effects: [
      {
        name: `Hag`,
        desc: `Add 1 to hit rolls for a Hag.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Roll two dice instead of one and discard the highest result if this unit contains any standard bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `A unit that includes any hornblowers can run and charge.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Paired Sacrificial Knives`,
        desc: `Add 1 to the attacks characteristic of a Witch Aelf's Sacrificial Knife if it is armed with paried Sacrificial Knives.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frenzied Fervour`,
        desc: `If this unit is within any friendly Daughters of Khaine heroes in this phase, add 1 to the attacks characteristic of its Sacrificial Knives until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bladed Bucklers`,
        desc: `Witch Aelves with bladed bucklers have a save characteristic of 5+ in this phase. In addition, each time you make an unmodified save roll of 6 in this phase, the attacking unit suffers 1 mortal wound after it has made all of its attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sisters of Slaughter`,
    effects: [
      {
        name: `Handmaiden`,
        desc: `Add 1 to hit rolls for a Handmaiden.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Roll two dice instead of one and discard the highest result if this unit contains any standard bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `A unit that includes any hornblowers can run and charge.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Dance of Death`,
        desc: `Sisters of Slaughter can be chosen to pile in and attack in the combat phase if they are within 6" of an enemy, and can move up to 6" when they pile in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bladed Bucklers`,
        desc: `Sisters of Slaughter with bladed bucklers have a save characteristic of 5+ in this phase. In addition, each time you make an unmodified save roll of 6 in this phase, the attacking unit suffers 1 mortal wound after it has made all of its attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Slaughter Queen on Cauldron of Blood`,
    effects: [
      {
        name: `Bladed Impact`,
        desc: `Roll a D6 if this model ends a charge move within 1" of any enemy units. On a 2+ that nearest enemy suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bloodshield`,
        desc: `Add 1 to the save rolls for friendly Daughters of Khaine units that are wholly within range of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Pact of Blood`,
        desc: `A Slaughter Queen can attempt to unbind one spell in the enemy hero phase as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Priestess of Khaine`,
        desc: `Pick a prayer this model knows and roll a D6. On a result of 1 she is found unworthy and suffers 1 mortal wound. On a 2 nothing happens. On a 3+ the prayer is successful and its effect takes place. A Hag Queen knows the Rune of Khaine, Touch of Death, and Dance of Doom prayers.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune of Khaine`,
        desc: `If active, the Hag Queen's Blade of Khaine has a Damage characteristic of D3 instead of 1 until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Touch of Death`,
        desc: `If active, pick a unit within 3" of this model and then hide a dice in one of your hands. Your opponent must pick a hand; if that hand is holding the dice, the unit you picked suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of Khaine`,
        desc: `If your army includes any Avatars of Khaine, friendly Daughters of Khaine priests know the Wrath of Khaine prayer in addition to any other prayers they know.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of Khaine`,
        desc: `If active, pick a friendly Avatar of Khaine on the battlefield. Until your next hero phase it is now Animated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Animated`,
        desc: `The Avatar of Khaine cannot shoot and cannot be selected to fight unless it has been Animated in the hero phase (either via prayer or Blood Rite).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Idol of Worship`,
        desc: `Add 1 to the bravery characteristic of friendly Daughters of Khaine units that are within 7" of any friendly Avatars of Khaine.`,
        when: [DURING_GAME],
      },
      {
        name: `Orgy of Slaughter`,
        desc: `If this model is your general, you can use this ability. If you do, pick a friendly Daughters of Khaine unit within 14" of this model. If that unit is within 3" of an enemy unit, it can pile in and attack as if it were the combat phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bloodwrack Shrine`,
    effects: [
      {
        name: `Bladed Impact`,
        desc: `Roll a D6 if this model ends a charge move within 1" of any enemy units. On a 2+ that nearest enemy suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bloodwrack Stare`,
        desc: `Pick a unit visible to this model and roll a D6 for each model in the target unit that is within range. For each 5+ the unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Aura of Agony`,
        desc: `Roll a D6 for each enemy unit within 7" of any friendly Bloodwrack Shrines. If the dice roll is greater than or equal to the score listed in the damage table, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Enfeebling Foe.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeebling Foe`,
        desc: `Casting value of 5. If successfully cast, pick a unit within 18" and visible to the caster. Until your next hero phase, subtract 1 from wound rolls for that unit in the combat phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Enfeebling Foe`,
        desc: `If active, subtract 1 from wound rolls for debuffed unit in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blood Sisters`,
    effects: [
      {
        name: `Gorgai`,
        desc: `Add 1 to hit rolls for a Gorgai.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Turned to Crystal`,
        desc: `Each time you score a hit with a Crystal Touch, the target suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blood Stalkers`,
    effects: [
      {
        name: `Krone`,
        desc: `Add 1 to hit rolls for a Krone.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Heartseekers`,
        desc: `Each time you make a hit roll of 6+ for this unit, the target suffers 1 mortal wound instead of the normal damage.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Bloodwrack Medusa`,
    effects: [
      {
        name: `Bloodwrack Stare`,
        desc: `Pick a unit visible to this model and roll a D6 for each model in the target unit that is within range. For each 5+ the unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Enfeebling Foe.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeebling Foe`,
        desc: `Casting value of 5. If successfully cast, pick a unit within 18" and visible to the caster. Until your next hero phase, subtract 1 from wound rolls for that unit in the combat phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Enfeebling Foe`,
        desc: `If active, subtract 1 from wound rolls for debuffed unit in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Doomfire Warlocks`,
    effects: [
      {
        name: `Master of Warlocks`,
        desc: `Add 1 to hit rolls for a Master of Warlocks' Doomfire Crossbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Master of Warlocks`,
        desc: `Add 1 to hit rolls for a Master of Warlocks' Cursed Scimitar.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Doomfire Coven`,
        desc: `Add 1 to the casting and unbinding rolls for this unit if it has 10 or more models.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This unit counts as a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Doomfire.`,
        when: [HERO_PHASE],
      },
      {
        name: `Doomfire`,
        desc: `Casting value of 6. If successfully cast, pick an enemy model within 18" and visible to any model in the casting unit. The target suffers D3 mortal wounds if the casting unit has fewer than 5 models. D6 mortal wounds if it has 5 to 9 models. 6 mortal wounds if it has 10 or more models.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Khinerai Heartrenders`,
    effects: [
      {
        name: `Shryke`,
        desc: `Add 1 to hit rolls for a Shryke.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Descend to Battle`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say it is circling high above. In any of your movement phases, it can descend to battle - set up the unit anywhere on the battlefield that is more than 9" from any enemy models. This is their move for that movement phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Fire and Flight`,
        desc: `After this unit has finished making all of its attacks, roll a D6: on a 4+ it can make a 6" normal move as if it were your movement phase, but it cannot retreat or run as part of this move.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Death From Above`,
        desc: `This unit can shoot even it ran in the same turn. In addition, change the Rend characteristic of this unit's Barbed Javelins to -2 if it was set up on the battlefield in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Heartpiercer Shield`,
        desc: `Khinerai Heartrenders have a Save characteristic of 5+. In addition, each time you make an unmodified save roll of 6 for such a unit, a Khinerai Heartrender pierces her assailant's heart with her shield - the attacking unit suffers 1 mortal wound after it has made all of its attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Khinerai Lifetakers`,
    effects: [
      {
        name: `Harridynn`,
        desc: `Add 1 to hit rolls for a Harridynn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Descend to Battle`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say it is circling high above. In any of your movement phases, it can descend to battle - set up the unit anywhere on the battlefield that is more than 9" from any enemy models. This is their move for that movement phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Fight and Flight`,
        desc: `After this unit has finished making all of its attacks, roll a D6: on a 4+ it can make a 6" normal move as if it were your movement phase, but it cannot run as part of this move.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Death on the Wind`,
        desc: `Add 1 to the damage characteristic of this unit's Barbed Sickles if it made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Heartpiercer Shield`,
        desc: `Khinerai Heartrenders have a Save characteristic of 5+. In addition, each time you make an unmodified save roll of 6 for such a unit, a Khinerai Heartrender pierces her assailant's heart with her shield - the attacking unit suffers 1 mortal wound after it has made all of its attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `War Coven of Morathi`,
    effects: [
      {
        name: `Blood Rituals`,
        desc: `If you army has the Daughters of Khaine allegiance, units in this battalion count the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Devout Followers`,
        desc: `Do not take battleshock tests for War Coven of Morathi units that are within 18" of Morathi (in either form) when the test is taken.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Cauldron Guard`,
    effects: [
      {
        name: `Frenzied Devotees`,
        desc: `Add 1 to the run and charge rolls made for units from this battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Slaughter Troupe`,
    effects: [
      {
        name: `Gladiatorial Acrobatics`,
        desc: `Slaughter Troupe units that retreat can still shoot and charge in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Temple Nest`,
    effects: [
      {
        name: `Lethal Transfixation`,
        desc: `Each time your opponent makes an unmodified hit roll of 1 when attacking a Temple Nest unit in this phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadow Patrol`,
    effects: [
      {
        name: `Shadowpaths`,
        desc: `Once per battle round, instead of moving one unit from this battalion that is more than 3" from enemy models, you can move along the shadowpaths. If it does so, remove the unit from the battlefield and set it up anywhere on the battlefield more than 9" from enemy models. This counts as its move in the movement phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Shadowhammer Compact`,
    effects: [
      {
        name: `Righteous Fervour`,
        desc: `Choose one Daughters of Khaine unit from this battalion and one Stormcast Eternals unit from this battalion that are within 6" of each other. Both units can either make a normal move (as though in the movement phase), shoot (as though in the shooting phase), or pile in and attack (as though in the combat phase). Both units must perform the same action. If only one can perform the selected action you may use the valid unit while the other does nothing.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
