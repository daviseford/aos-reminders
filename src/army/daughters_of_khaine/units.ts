import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_FOUR_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const MorthaiEffect = {
  name: `One Soul, Two Bodies / Two Bodies, One Soul`,
  desc: `Wounds and mortal wounds allocated to Morathi-Khaine have no effect and are instead allocated to the Shadow Queen. Wounds allocated to the Shadow Queen in this manner cannot be negated.
           If a spell or ability would cause Morathi-Khaine or the Shadow Queen to be slain without wounds being allocated is instead not slain and 3 wounds are allocated to the Shadow Queen.
           If the Shadow Queen is slain, Morathi-Khaine is also slain after the Shadow Queen is removed from play.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const HagQueenEffects = [
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
]
const BloodwrackEffects = [
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
    desc: `Casting value of 5. Pick a unit within 18" and visible to the caster. Until your next hero phase, subtract 1 from wound rolls for that unit in the combat phase.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Enfeebling Foe`,
    desc: `If active, subtract 1 from wound rolls for debuffed unit in the combat phase.`,
    when: [COMBAT_PHASE],
  },
]
const WitchbrewEffects = [
  {
    name: `Witchbrew`,
    desc: `You can pick a friendly Daughters of Khaine unit within 3" of this model to drink Witchbrew.`,
    when: [HERO_PHASE],
  },
  {
    name: `Witchbrew`,
    desc: `If active, reroll failed wound rolls for that unit's melee weapons.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Witchbrew`,
    desc: `If active, you do not need to take battleshock tests for the unit.`,
    when: [BATTLESHOCK_PHASE],
  },
]
const SlaughterQueenEffects = [
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
]
const AvatarOfKhaineEffects = [
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
]
const StandardBearerAndHornblowerEffects = [
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
]
const HeartpiercerShieldEffect = {
  name: `Heartpiercer Shield`,
  desc: `Add 1 to the save rolls of this unit against melee attacks. If the unmodified melee save is a 6, the attacking unit suffers 1 mortal wound after all its attacks have resolved.`,
  when: [SAVES_PHASE],
}
const DescendToBattleEffects = [
  {
    name: `Descend to Battle`,
    desc: `Instead of setting up this unit on the battlefield, you can set it aside to be deployed later in the game.`,
    when: [DURING_SETUP],
  },
  {
    name: `Descend to Battle`,
    desc: `If this unit is still off the battlefield, it is slain.`,
    when: [TURN_FOUR_START_OF_ROUND],
  },
  {
    name: `Descend to Battle`,
    desc: `If set aside, you may set up this unit anywhere on the battlefield that is more than 9" from any enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
]
const BladedBucklersEffect = {
  name: `Bladed Bucklers`,
  desc: `Units with bladed bucklers have a save characteristic of 5+ in this phase. In addition, each time you make an unmodified save roll of 6 in this phase, the attacking unit suffers 1 mortal wound after it has made all of its attacks.`,
  when: [COMBAT_PHASE],
}
const BloodshieldEffect = {
  name: `Bloodshield`,
  desc: `Add 1 to the save rolls for friendly Daughters of Khaine units that are wholly within range of this model.`,
  when: [SAVES_PHASE],
}
const BladedImpactEffect = {
  name: `Bladed Impact`,
  desc: `Roll a D6 if this model ends a charge move within 1" of any enemy units. On a 2+ that nearest enemy suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
}
const HeartseekersEffect = {
  name: `Heartseekers`,
  desc: `Each time you make an unmodified hit roll of 6 for this unit's Heartseeker Bow, the target suffers 1 mortal wound instead of the normal damage.`,
  when: [SHOOTING_PHASE],
}
const TurnedCrystalEffect = {
  name: `Turned to Crystal`,
  desc: `You can pick 1 enemy unit within 1" of this unit and roll D6 for each model in this unit. On each 3+ the target suffers 1 mortal wound.`,
  when: [END_OF_COMBAT_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Morathi-Khaine`,
    effects: [
      {
        name: `Commanding Presence`,
        desc: `Subtract 1 from hit rolls targeting this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      MorthaiEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 3 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Black Horror of Ulgu.`,
        when: [HERO_PHASE],
      },
      {
        name: `Black Horror of Ulgu`,
        desc: `Casting value of 7. Pick a unit within 36" and visible to the caster. Roll a D6. On a 1, target suffers 1 mortal wound. On a 2-3 target suffers D3 mortal wounds. On a 4+ target suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Worship Through Bloodshed`,
        desc: `If this model is on the battlefield, you can pick 1 other friendly Daughters of Khaine unit wholly within 24". The target can shoot or fight if it is within 3" of enemy units. Cannot be used more than once in the same phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Shadow Queen`,
    effects: [
      {
        name: `Fury of the Shadow Queen`,
        desc: `While this model is within 3" of enemy units, friendly Harpies and Melusai units wholly within 18" of this model add 1 to their melee attacks characteristics.`,
        when: [COMBAT_PHASE],
      },
      MorthaiEffect,
      {
        name: `Iron Heart of Khaine`,
        desc: `No more than 3 non-negated wounds/mortal wounds can be allocated to this model in a turn. Further wounds are ignored with no effect.
               Wounds/mortal wounds allocated to this model at the start of the battle round count towards the first turn of that round.
               Wounds/mortal wounds allocated to this model at the end of the battle round count towards the second turn of that round.
               Spells/abilities causing this model to be slain with no wounds allocated instead allocates 3 unnegatable wounds, subject to the 3 wound per turn limit.
               Wounds allocated to this model cannot be healed.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Hag Queen`,
    effects: [...HagQueenEffects, ...WitchbrewEffects],
  },
  {
    name: `Slaughter Queen`,
    effects: [
      ...HagQueenEffects,
      {
        name: `Dance of Doom`,
        desc: `If active, until your next hero phase, this model can be chosen to pile in and attack twice in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      ...SlaughterQueenEffects,
    ],
  },
  {
    name: `Avatar of Khaine`,
    effects: [...AvatarOfKhaineEffects],
  },
  {
    name: `Hag Queen on Cauldron of Blood`,
    effects: [
      BladedImpactEffect,
      BloodshieldEffect,
      ...WitchbrewEffects,
      ...HagQueenEffects,
      ...AvatarOfKhaineEffects,
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
      ...StandardBearerAndHornblowerEffects,
      {
        name: `Paired Sacrificial Knives`,
        desc: `Add 1 to the attacks characteristic of a Witch Aelf's Sacrificial Knife if it is armed with paired Sacrificial Knives.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frenzied Fervour`,
        desc: `If this unit is within any friendly Daughters of Khaine heroes in this phase, add 1 to the attacks characteristic of its Sacrificial Knives until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
      BladedBucklersEffect,
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
      ...StandardBearerAndHornblowerEffects,
      {
        name: `Dance of Death`,
        desc: `Sisters of Slaughter can be chosen to pile in and attack in the combat phase if they are within 6" of an enemy, and can move up to 6" when they pile in.`,
        when: [COMBAT_PHASE],
      },
      BladedBucklersEffect,
    ],
  },
  {
    name: `Slaughter Queen on Cauldron of Blood`,
    effects: [
      BladedImpactEffect,
      BloodshieldEffect,
      ...HagQueenEffects,
      ...AvatarOfKhaineEffects,
      ...SlaughterQueenEffects,
    ],
  },
  {
    name: `Bloodwrack Shrine`,
    effects: [
      BladedImpactEffect,
      {
        name: `Aura of Agony`,
        desc: `Roll a D6 for each enemy unit within 7" of any friendly Bloodwrack Shrines. If the dice roll is greater than or equal to the score listed in the damage table, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      ...BloodwrackEffects,
    ],
  },
  {
    name: `Blood Sisters`,
    effects: [
      {
        name: `Gorgai`,
        desc: `Add 1 to the attacks characteristic of a Gorgai's Heartshard Glaive.`,
        when: [COMBAT_PHASE],
      },
      TurnedCrystalEffect,
    ],
  },
  {
    name: `Blood Stalkers`,
    effects: [HeartseekersEffect],
  },
  {
    name: `Bloodwrack Medusa`,
    effects: [...BloodwrackEffects],
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
        desc: `Casting value of 6. Pick an enemy model within 18" and visible to any model in the casting unit. The target suffers D3 mortal wounds if the casting unit has fewer than 5 models. D6 mortal wounds if it has 5 to 9 models. 6 mortal wounds if it has 10 or more models.`,
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
        desc: `Add 1 to the attacks characteristic for a Shryke.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      ...DescendToBattleEffects,
      {
        name: `Fire and Flight`,
        desc: `After this unit has finished making all of its attacks, roll a D6: on a 4+ it can make a 6" normal move as if it were your movement phase, but it cannot retreat or run as part of this move.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Death From Above`,
        desc: `This unit can run and shoot in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Death From Above`,
        desc: `Change the Rend characteristic of this unit's Barbed Javelins to -2 if it was set up on the battlefield in this turn.`,
        when: [SHOOTING_PHASE],
      },
      HeartpiercerShieldEffect,
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
      ...DescendToBattleEffects,
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
      HeartpiercerShieldEffect,
    ],
  },
  {
    name: `Morgwaeth the Bloodied`,
    effects: [...HagQueenEffects, ...WitchbrewEffects],
  },
  {
    name: `The Blade-Coven`,
    effects: [
      {
        name: `Kyrae`,
        desc: `Kyrae has a Wounds characteristic of 2.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      HeartseekersEffect,
      {
        name: `Daughters of the First Temple`,
        desc: `Roll a D6 each time a friendly Morgwaeth the Bloodied unit within 3" of this unit suffers a wound or mortal wound. On a 4+ this unit is allocated the wound instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Khainite Shadowstalkers`,
    effects: [
      {
        name: `Shroud Queen`,
        desc: `This model has a Wounds characteristic of 3.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Shadow Leap`,
        desc: `Instead of making a normal move, you can remove this unit and set it up again on the battlefield more than 9" from enemy units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Cursed Missiles`,
        desc: `Unmodified hits of 6 for this weapon inflict 1 mortal wound instead of normal damage (attack ends).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Harness Shadow`,
        desc: `Subtract 1 from melee attack hit rolls targeting this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Melusai Ironscale`,
    effects: [
      {
        name: `Blood of the Oracle`,
        desc: `Roll a D6 each time this unit is affected by a spell or endless spell. On a 5+, ignore the effects on this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gory Offering`,
        desc: `If any enemy models were slain by this model in this phase, you can add 1 to the attacks characteristic of friendly Melusai units wholly within 12". Effect lasts until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
      TurnedCrystalEffect,
      {
        name: `Wrath of the Scathborn`,
        desc: `Once per turn you can pick 1 friendly Melusai unit wholly within 12". Until your next hero phase, the target can run using 2D6 distance and still shoot and/or charge in the same turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Wrath of the Scathborn`,
        desc: `If active, unit can roll 2D6 when making the run roll. Unit may still shoot and/or charge in subsequent phases this turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Bloodwrack Sisterhood`,
    effects: [
      {
        name: `Delight in Slaughter`,
        desc: `In your hero phase, roll a D6 for each unit in this battalion that is within 3" of an enemy unit and within 9" of the battalion's Cauldron of Blood; on a 6 it can immediately pile in and attack as if it were the combat phase. This does not stop them from piling in and attacking again later in the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `War Coven of Morathi`,
    effects: [
      {
        name: `Blood Rituals`,
        desc: `If your army has the Daughters of Khaine allegiance, units in this battalion count the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
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
        name: `Lethal Transfixion`,
        desc: `Each time your opponent makes a hit roll of 1 (after rerolls, but before modifiers are applied) when attacking a Temple Nest unit in the combat phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
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
  {
    name: `Tyralla's Scathcoven`,
    effects: [
      {
        name: `Devoted to the Oracle`,
        desc: `You can reroll 1's to save for attacks against this battalion's units.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Vyperic Guard`,
    effects: [
      {
        name: `Vaunted Slayers`,
        desc: `Once per battle, a hero from this battalion can use a command ability without spending a command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Scathcoven`,
    effects: [
      {
        name: `Devoted to Morathi`,
        desc: `Do not take battleshocks test for this battalion's units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Shrine Blood`,
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `You can pick any number this battalion's units within 6" of a battallion Bloodwrack Shrine. 1 model from each selected unit is slain. Heal 1 allocated wound for each slain Harpy or 2 allocated wounds for each slain Melusai on the Shrine.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
