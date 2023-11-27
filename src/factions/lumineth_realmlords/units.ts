import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_ANY_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import spells from './spells'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const getSunmetalWeaponsEffect = (weapon: string) => ({
  name: `Sunmetal Weapons`,
  desc: `If the unmodified hit roll for an attack made with a ${weapon} is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
})

const getVanariWizardsEffect = (minimumModelCountToBeWizard: number, modelToBeWizard: string) => ({
  name: `Magic`,
  desc: `The ${modelToBeWizard} is a WIZARD while this unit has ${minimumModelCountToBeWizard} or more models. That model can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase.`,
  when: [HERO_PHASE],
  shared: true,
})

const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `You can reroll battleshock tests for units that include any Standard Bearers.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}

const AllButImmovableEffect = {
  name: `All but Immovable`,
  desc: `If this model doesnt not make a charge move in your charge phase, add 1 to the Attacks characteristic of this model's melee weapons until your next movement phase.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
  shared: true,
}

const StonemageSymbiosisEffect = {
  name: `Stonemage Symbiosis`,
  desc: `If this unit is within 12" of a friendly Stonemage, use the top row on this unit's damage table, regardless of how many wounds it has suffered.`,
  when: [DURING_GAME],
  shared: true,
}

const CrushingBlowEffect = {
  name: `Crushing Blow`,
  desc: `If the unmodified hit roll for an attack made with a melee weapon by this unit is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const DeepThinkersEffect = {
  name: `Deep Thinkers`,
  desc: `Once per battle, in your hero phase, when this unit attempts to cast its first spell in that phase, it is automatically cast with a casting roll of 9 (do not roll 2d6), but it can be unbound.`,
  when: [HERO_PHASE],
  rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
  shared: true,
}
const PurestAetherquartzHitRollEffect = {
  name: `Purest Aetherquartz`,
  desc: `Subtract 1 for hit rolls that target this unit. If this unit uses its last Aetherquartz, it can no longer use this ability.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
  shared: true,
}
const PurestAetherquartzCastingEffect = {
  name: `Purest Aetherquartz`,
  desc: `Add 1 to the casting roll when attempting to cast Greater Power of Hysh. If this unit uses its last Aetherquartz, it can no longer use this ability.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
  shared: true,
}

const IntoTheGaleOverSaveEffect = {
  name: `Into the Gale`,
  desc: `This unit has a ward of 5+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const LivingCycloneEffect = {
  name: `Living Cyclone`,
  desc: `Roll a dice for each enemy unit that is within 3" of this unit after this unit makes a charge move. On a 3+, that unit suffers 1 mortal wound, and subtract 1 from hit rolls for that unit until the end of the next combat phase. The same unit cannot be affected by this ability more than once per phase.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
  shared: true,
}

const MoveLikeTheWindEffect = {
  name: `Move like the wind`,
  desc: `When you make a pile-in move with this unit, it does not have to finish the move no further from the nearest enemy unit than it was at the start of the move. In addition, when you make a pile-in move with this unit, if it made a charge move in the same turn, it can move an extra 3" when it piles in.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
  shared: true,
}

const SpiritOfTheWindEffect = {
  name: `Spirit of the Wind`,
  desc: `At the end of your shooting phase, this model can make a normal move or a retreat of 12" (it cannot run). In addition, this unit can retreat and still charge later in the turn.`,
  when: [END_OF_SHOOTING_PHASE],
  shared: true,
}

const EnduringAsRockEffect = {
  name: `Enduring as Rock`,
  desc: `When this unit is targeted by an attack, worsen the Rend characteristic of that attack by 1, to a minimum of 0.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
  rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
  shared: true,
}

const ShiningCompanyEffect = {
  name: `Shining Company`,
  desc: `Subtract 1 from hit rolls for attacks that target this unit if this base of each model in this unit is touching the bases of 2 or more other models in the same unit.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
  shared: true,
}

const SunmetalWeaponEffect = {
  name: `Sunmetal Weapons`,
  desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack causes 1 mortal wound to the target and the attack sequence ends (do not make a wound roll or save roll). This ability has no effect made by this unti's mounts.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const Units = {
  'Archmage Teclis': {
    mandatory: {
      spells: [keyPicker(spells, ['Protection of Teclis', 'Storm of Searing White Light'])],
    },
    effects: [
      {
        name: `Archmage`,
        desc: `At the start of your hero phase, you must say how many spells this unit will cast. The number of spells it can cast are shown in the damage table. If you say 1 spell, when it attempts to cast that spell, it is automatically cast with a casting roll of 12 that cannot be modified (do not roll 2D6) and it cannot be unbound. If you say 2 spells, when it attempts to cast those spells, each is automatically cast with a casting roll of 12 that cannot be modified (do not roll 2D6). These spells can be unbound. If you say up to 4 spells, each is automatically cast with a casting roll of 10 that cannot be modified (do not roll 2D6). These spells can be unbound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a WIZARD. The number of spells it can cast depends on the Archmage ability. It can unbind any number of spells in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aura of Celennar`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for friendly Lumineth Realm-Lords units wholly within range of this unit's Aura of Celennar ability. The range of the Aura of Celennar ability for this unit is shown on the damage table.`,
        when: [HERO_PHASE],
      },
      {
        name: `Discs of the Aelementari`,
        desc: `At the start of your hero phase, in addition to casting spells, this unit can automatically dispel 1 endless spell (do not roll 2D6).`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_LUMINETH,
          meta_rule_sources.BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023,
        ],
      },
      {
        name: `Discs of the Aelementari`,
        desc: `In the enemy hero phase, this unit can automatically unbind 1 enemy spell (do not roll 2D6).`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_LUMINETH,
          meta_rule_sources.BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023,
        ],
      },
      {
        name: `Seeing Stone of Celennar`,
        desc: `Each time a friendly unit within range of this unit's Aura of Celennar ability is affected by the abilities of an endless spell summoned by an enemy WIZARD or a spell cast by an enemy WIZARD, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit. Then, if the dice roll was successful, pick 1 enemy unit within 18" of that unit. That enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_APRIL_2023],
      },
    ],
  },
  'The Light of Eltharion': {
    effects: [
      {
        name: `Celennari Blade`,
        desc: `At the start of the combat phase, you can pick 1 enemy Hero or Monster within 3" of this unit. If you do so, attacks made with this unit's Celennari Blade that target that Hero or Monster in this phase have a Damage characteristic of 2D3 instead of 3.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fangsword of Eltharion`,
        desc: `Add 1 to wound rolls for attacks made with this model's Fangsword of Eltharion if this model made a charge move in the same turn. In addition, if the unmodified wound roll for an attack made with this model's Fangsword of Eltharion is 6, that attack inflicts 1 mortal wound on the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Searing Darts of Light`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 18" of this unit that is visible to it and roll a dice. On a 1, nothing happens. On a 2-4, that unit suffers D3 mortal wounds. On a 5+, that unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spirit Armour`,
        desc: `Halve the damage inflicted by attacks made with missile weapons or melee weapons that target this model (rounding up).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Spirit Armour`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Supreme Swordmaster`,
        desc: `Ignore negative modifiers when making hit rolls for attacks made by this unit. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lyrior Uthralle, Warden of Ymetrica': {
    mandatory: {
      spells: [keyPicker(spells, ['Greater Power of Hysh'])],
    },
    effects: [
      PurestAetherquartzHitRollEffect,
      PurestAetherquartzCastingEffect,
      getSunmetalWeaponsEffect(`Regent's Sword`),
      {
        name: `Daemonbane`,
        desc: `The damage inflicted by a successful attack made with Daemonbane is 3 instead of D3 if the target has the Chaos and Daemon keywords.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Voice of Tyrion`,
        desc: `Once per battle round, this unit can issue a command to a friendly Ymetrica unit anywhere on the battlefield without spending a command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Vanari Lord Regent': {
    mandatory: {
      spells: [keyPicker(spells, ['Greater Power of Hysh'])],
    },
    effects: [
      getSunmetalWeaponsEffect(`Regent's Sword`),
      PurestAetherquartzCastingEffect,
      PurestAetherquartzHitRollEffect,
    ],
  },
  'Vanari Bannerblade': {
    effects: [
      SunmetalWeaponEffect,
      {
        name: `World Banner`,
        desc: `You can reroll charge rolls for friendly Lumineth Realm-Lords units wholly within 18" of any friendly Bannerblades.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `World Banner`,
        desc: `In addition, once per battle at the start of any phase, you can say that this unit will draw upon the power of its World Banner. If you do so, roll a dice for each enemy unit within 18" of this unit. If the roll is equal to or less than the current battle round, that unit suffers D3 mortal wounds, and subtract 1 from hit rolls for that unit until the end of that phase.`,
        when: [START_OF_ANY_PHASE],
      },
    ],
  },
  'Vanari Auralan Sentinels': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      getVanariWizardsEffect(5, `High Sentinel`),
      {
        name: `Scryhawk Lantern`,
        desc: `Add 6" to the Range characteristic of this unit's Lofted Auralan Bows while it is within 12" of any other friendly Auralan Sentinels units or Starshard Ballistas.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Many-stringed Weapon`,
        desc: `Each time this unit shoots, choose either the Aimed or Lofted weapon characteristic for all the attacks it makes with its Auralan Bows.`,
        when: [SHOOTING_PHASE],
      },
    ],
    SunmetalWeaponEffect,
  },
  'Vanari Auralan Wardens': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      SunmetalWeaponEffect,
      getVanariWizardsEffect(5, `High Warden`),
      {
        name: `Wall of Blades`,
        desc: `If the target unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Warden's Pike and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      ShiningCompanyEffect,
    ],
  },
  'Vanari Dawnriders': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      {
        name: `Deathly Furrows`,
        desc: `At the start of the combat phase, you can say that this unit will use its Deathly Furrows ability. If you do so, in that phase, you can either 1 to the Attacks characteristic of this unit's melee weapons, but it can only target units that a Wounds characteristic of 1 or 2 and do not have a mount, or you can add 2 to the Attacks characteristic of this unit's melee weapons, but it can only target units that have a Wounds characteristic of 1 and do not have a mount.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Lances of the Dawn`,
        desc: `If this unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Sunmetal Lances and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      SunmetalWeaponEffect,
      getVanariWizardsEffect(3, `Steedmaster`),
      StandardBearerEffect,
      ShiningCompanyEffect,
    ],
  },
  'Vanari Starshard Ballistas': {
    effects: [
      {
        name: `Blinding Bolts`,
        desc: `Once per battle, when you pick this unit to shoot, you can say that it will fire its blinding bolts. If you do so, in addition to any damage inflicted, units that are hit by an attack made by this unit in that phase are dazzled until the end of the turn. Subtract 1 from hit rolls for a unit that is dazzled.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Scryhawksk`,
        desc: `Add 6" to the Range characteristic of this unit's Starshard Bolts while it is within 12" of any other friendly Starshard Ballistas or Auralan Sentinels units.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Warding Lanterns`,
        desc: `This unit has a ward of 6+ if it remains stationery in the same turn.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Vanari Bladelords': {
    effects: [
      {
        name: `Guardians`,
        desc: `Before you allocate a wound or mortal wound to a friendly Scinari unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to that Scinari unit, if any friendly units with this ability are within 3" of that unit, roll a dice. On a 2+, that wound or mortal wound must be allocated to a friendly unit with this ability within 3" of that unit instead of that tunit and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Swordmasters`,
        desc: `Each time this unit fights, choose either the Perfect Strike or Flurry of Blows weapon characteristics for rall attacks it makes with its Sunmetal Greatblades.
        
        Do not use the attack sequence for a Perfect Strike attack. Instead roll a dice. On a 2+, that target suffers 1 mortal wowund. Add 1 to the attack characteristic of a Flurry of Blows attack if there are 3-9 models in the target unit. Add 2 to the Attacks characteristic of a Flurry of Blows attack instead if there are 10 or more models in the target unit..`,
        when: [COMBAT_PHASE],
      },
      SunmetalWeaponEffect,
      ShiningCompanyEffect,
    ],
  },
  'Scinari Cathallar': {
    mandatory: {
      spells: [keyPicker(spells, ['Darkness of the Soul'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Absorb Despair`,
        desc: `Once per phase, if a friendly unit uses its aetherquartz reserve while it is wholly within 18" of any friendly units with this ability, you can say that this unit will absorb the negative energy. If you do so, do not subtract 1 from that unit's Bravery characterstic. Instead, you can pick 1 enemy unit within 18" of this unit. If you do so, subtract 1 from the Bravery characteristic of that unit for the rest of the battle. The same enemy unit cannot be affected by this ability more than once per battle.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Scinari Enlightener': {
    mandatory: {
      spells: [keyPicker(spells, ['Twinned Tether'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      DeepThinkersEffect,
      {
        name: `Rune of Enthlai`,
        desc: `Once per turn, if this unit successfully casts a spell from the Lore of Hysh, and that spell is not unbound, you can roll a dice after the effect of that spell has been resolved. On a 3+, you can immediately resolve the effect of that spell for a second time, but you cannot pick the same target that was picked for that spell the first time its effect was resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Scinari Calligrave': {
    mandatory: {
      spells: [keyPicker(spells, ['Erasure'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      DeepThinkersEffect,
      {
        name: `Realmscribe`,
        desc: `One per battle, instead of attempting to cast any spells with 1 friendly model with this ability, you can roll a dice. Add the number of the current battle round to the roll.. on a 5+ pick a point on the battlefield. For the rest of the battle do not take battleshock tests for friendly Lumineth Realm-Lords units wholly with 9" of that point, and add 1 to casting, dispelling and unbinding rolls for friendly Lumineth Realm-Lords Wizards within 9" of that point.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Scinari Loreseeker': {
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Lone Agent`,
        desc: `Add 1 to save rolls for attacks that target this unit if it is more than 9" from all friendly models.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Lone Agent`,
        desc: `Instead of setting this unit on the battlefield, you can place it to one side and say that it is set up as a Lone Agent reserve unit. If you do so, at the end of  deployment, before determining control of objectives, you must set up all friendly Lone Agent reserve units on the battlefield more than 3" from all enemy units and not in your territory.
        
        If you set up a friendly Lone Agent reserve unit within 6" of an objective that is not controlled by enemy units, that Lone Agent reserve unit counts as 10 models for the purposes of contesting that objective.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Alarith Spirit of the Mountain': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Faith of the Mountains'])],
    },
    effects: [
      StonemageSymbiosisEffect,
      AllButImmovableEffect,
      {
        name: `Stoneheart Shockwave`,
        desc: `At the start of your opponent's shooting phase and at the start of the combat phase, you can pick 1 enemy unit within range of this unit's Stoneheart Shock Wave ability and is visible to it. The range of this unit's Stoneheart Shock Wave ability is shown on its damage table. If you do so, subtract 1 from hit rolls for that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE, START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Alarith Stoneguard': {
    effects: [
      StandardBearerEffect,
      CrushingBlowEffect,
      EnduringAsRockEffect,
      {
        name: `Fortitude of the Earth`,
        desc: `This unit has a ward of 4+ against mortal wounds while it is contesting an objective that you control.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Alarith Stonemage': {
    mandatory: {
      spells: [keyPicker(spells, ['Gravitic Redirection'])],
    },
    effects: [
      EnduringAsRockEffect,
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Stonemage stance`,
        desc: `At the start of the combat phase, you can say that this unit will adopt the Stonemage stance. If you do so, this unit and any friendly Stoneguard units wholly within 12" of this unit cannot make pile-in moves in that phase. However, until the end of that phase, improve the Rend characteristic of melee weapons used by this unit and those friendly units by 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Avalenor, the Stoneheart King': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Unshakeable Faith of the Mountains'])],
    },
    effects: [
      StonemageSymbiosisEffect,
      AllButImmovableEffect,
      EnduringAsRockEffect,
      {
        name: `Firestealer Hammers`,
        desc: `If the unmodified hit roll for an attack made with the Firestealer Hammers is 6, that attack causes 1 mortal wound in to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Guardian of Hysh`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units within range of this unit's Guardian of Hysh ability. The range of this unit's Guardian of Hysh ability is shown on its damage table.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Ellania and Ellathor, Eclipsian Warsages': {
    mandatory: {
      spells: [keyPicker(spells, ['Salvation of Hysh'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Aspect of Celennar`,
        desc: `Add 1 to casting, dispelling and unbinding rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Realm Wanderers`,
        desc: `This unit can be included as an ally in armies that have an Order general. In addition, if this model with within 3" of your general at the start of your hero phase, roll a dice. On a 4+, you receive 1 extra command point. However, this unit can never be a general.`,
        when: [HERO_PHASE],
      },
      {
        name: `Altairi`,
        desc: `The Damage characteristic of Altairi is equal to the number of the current battle round.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Altairi`,
        desc: `Once per battle in your shooting phase, you can say that Ellathor will unlease a blazing sunbolt. If you do so, pick 1 point on the battlefield within 12" of this unit and visible to it and draw a line between that point and the closest point on this unit's base. Roll a dice for each unit that has any models passed across by this line. On a 2+, that unit suffers a number of mortal wounds equal to the number of the current battle round.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sudden Translocation`,
        desc: `At the end of the combat phase, roll a dice if this unit fought in that phase. If the roll is less than the number of the current battle round, or less than the number of wounds allocated to this model then heal up to D6 wounds and remove it from the battlefield. Then, set it back up more than 12" from all enemy units. If this is impossible, this model is removed, but does not count as having been destroyed.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Hurakan Windmage': {
    mandatory: {
      spells: [keyPicker(spells, ['Windblast Vortex'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      MoveLikeTheWindEffect,
      {
        name: `Fan of Redirection`,
        desc: `Add 1 to save rolls for attacks made with missile weapons that target this model. In addition, if the unmodified save roll for an attack made with a missile weapon that targets this unit is 6, after all the attacking unit's attacks have been resolved, you can cause 1 mortal wound to 1 enemy unit within 9" of this unit and visible to it.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Windleap`,
        desc: `If a friendly Windchargers unit starts a move wholly within 6", when it makes that move, that unit has a Move characteristic of 16" and can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Hurakan Windchargers': {
    effects: [
      StandardBearerEffect,
      MoveLikeTheWindEffect,
      {
        name: `Windcharger Arrows`,
        desc: `Ward rolls cannot be made for wounds and mortal wounds caused by attacks made with missile weapons by this unit.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Go Where the Wind Blows`,
        desc: `When this unit moves, it can pass across terrain in the same matter as a model that can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Sevireth, Lord of the Seventh Wind': {
    effects: [
      IntoTheGaleOverSaveEffect,
      LivingCycloneEffect,
      MoveLikeTheWindEffect,
      SpiritOfTheWindEffect,
      {
        name: `Scour`,
        desc: `At the end of the charge phase, you can pick this unit to carry out the Smash To Rubble monstrous rampage even though it is not a Monster.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Searing Desert Winds`,
        desc: `After this unit makes a normal move (including if it moves at the end of the shooting phase), pick 1 enemy unit this model moved across. On a 3+ it suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Hurakan Spirit of the Wind': {
    effects: [IntoTheGaleOverSaveEffect, SpiritOfTheWindEffect, LivingCycloneEffect],
  },
  'Myari Lightcaller': {
    mandatory: {
      spells: [keyPicker(spells, ['Dazzling Light'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      DeepThinkersEffect,
      {
        name: `Scryowl Familiar`,
        desc: `Add 1 to casting, unbinding, and dispelling rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scryowl Familiar`,
        desc: `You can pick 1 enemy unit within 24" and not visible. The target becomes visible.`,
        when: [START_OF_HERO_PHASE, START_OF_SHOOTING_PHASE],
      },
    ],
  },
  "Myari's Purifiers": {
    effects: [
      {
        name: `Guardians`,
        desc: `Before you allocate a wound or mortal wound to a friendly Myari Lightcaller within 3" of this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to Myari Lightcaller within 3" of this unit, roll a dice. On a 2+, that wound or mortal wound must be allocated to this unit instead of Myari Lightcaller and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Purifying Strikes`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack causes 1 mortal wound to the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
