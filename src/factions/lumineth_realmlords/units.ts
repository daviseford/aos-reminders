import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import rule_sources from './rule_sources'
import spells from './spells'

const getBoltAndShieldWizardEffect = (
  numberOfCasts: number,
  numberOfUnbinds: number,
  additionalKnownSpell: string
) => ({
  name: `Magic`,
  desc: `This model is a wizard. It can attempt to cast ${numberOfCasts} spell and attempt to unbind ${numberOfUnbinds} spell. It knows ${
    additionalKnownSpell === ''
      ? 'Arcane Bolt and Mystic Shield'
      : 'Arcane Bolt, Mystic Shield and ' + additionalKnownSpell
  }.`,
  when: [HERO_PHASE],
})

const getSunmetalWeaponsEffect = (weapon: string) => ({
  name: `Sunmetal Weapons`,
  desc: `If the unmodified hit roll for an attack made with a ${weapon} is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
})

const getVanariWizardsEffect = (minimumModelCountToBeWizard: number) => ({
  name: `Magic`,
  desc: `This unit is a WIZARD while it has ${minimumModelCountToBeWizard} or more models. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. They know the Power of Hysh spell.`,
  when: [HERO_PHASE],
})

const alarithSpiritFreeCommandAbilityEffect = (effectName: string, effectRange: number) => ({
  name: effectName,
  desc: `Pick 1 friendly LUMINETH REALM-LORDS AELF HERO within ${effectRange}" of this model. If that model is within ${effectRange}" of this model at the start of your next hero phase, then that model can use a command ability in that turn without spending any command points.`,
  when: [END_OF_HERO_PHASE],
})

const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `You can reroll battleshock tests for units that include any Standard Bearers.`,
  when: [BATTLESHOCK_PHASE],
}

const AllButImmovableEffect = {
  name: `All but Immovable`,
  desc: `If this model doesnt not make a charge move in your charge phase, add 1 to the Attacks characteristic of this model's melee weapons until your next movement phase.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
}

const StonemageSymbiosisEffect = {
  name: `Stonemage Symbiosis`,
  desc: `When looking at this model's damage table, if it is within 12" of a friendly STONEMAGE, it is treated as if it has suffered 0 wounds.`,
  when: [DURING_GAME],
}

const CrushingBlowEffect = {
  name: `Crushing Blow`,
  desc: `Unmodified hit rolls of 6 with Stone Mallets add 1 to the damage inflicted if the attack is successful.`,
  when: [COMBAT_PHASE],
}

const PurestAetherquartzHitRollEffect = {
  name: `Purest Aetherquartz`,
  desc: `Subtract 1 for hit rolls that target this unit. If this unit uses its last Aetherquartz, it can no longer use this ability.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
}
const PurestAetherquartzCastingEffect = {
  name: `Purest Aetherquartz`,
  desc: `Add 1 to the casting roll when attempting to cast Greater Power of Hysh. If this unit uses its last Aetherquartz, it can no longer use this ability.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
}

const IntoTheGaleOverSaveEffect = {
  name: `Into the Gale`,
  desc: `Roll a dice each time you allocate a wound or mortal wound to this unit, on a 5+ that wound or mortal wound is ignored.`,
  when: [WOUND_ALLOCATION_PHASE],
  rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_MAY_2021],
}
const IntoTheGalePileInRestrictionEffect = {
  name: `Into the Gale`,
  desc: `If an enemy model starts a pile-in move within 3" of any friendly units with this ability, subtract 2" from the distance that model can pile in during that phase (to a minimum of 1").`,
  when: [COMBAT_PHASE],
  rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_MAY_2021],
}

const LivingCycloneEffect = {
  name: `Living Cyclone`,
  desc: `Roll a dice each time an enemy unit that is within 3" of this model after it makes a charge move. On a 3+, the unit suffers a mortal wound and is -1 to hit until the end of the next combat phase (a unit can only be affected by this ability once per phase).`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
}

const SpiritOfTheWindEffect = {
  name: `Spirit of the Wind`,
  desc: `At end of the shooting phase, this model can move 12" but cannot run (it can retreat). Additionally it can retreat and still charge later in the turn.`,
  when: [SHOOTING_PHASE],
}

const WindmageSymbiosisEffect = {
  name: `Windmage Symbiosis`,
  desc: `If this model is within 12" of any friendly WINDMAGES, it heals D3 wounds.`,
  when: [HERO_PHASE],
}

const Units = {
  'Alarith Stoneguard': {
    effects: [
      StandardBearerEffect,
      CrushingBlowEffect,
      {
        name: `Diamondpick Hammer`,
        desc: `Unmodified hit rolls of 6 with Diamondpick Hammers inflict 1 mortal wound on the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pair of Stratum Hammers`,
        desc: `Reroll to hit rolls for a Pair of Stratum Hammers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Alarith Stonemage': {
    mandatory: {
      spells: [keyPicker(spells, ['Gravitic Reduction'])],
    },
    effects: [
      getBoltAndShieldWizardEffect(1, 1, 'Gravitic Reduction'),
      {
        name: `Stonemage stance`,
        desc: `This model and any friendly ALARITH STONEGUARD units wholly within 12" of this model cannot make a pile-in move this phase. However until the end of the phase, improve the Rend characteristic of melee weapons used by this model and those friendly units by 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Alarith Spirit of the Mountain': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Faith of the Mountains'])],
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      StonemageSymbiosisEffect,
      AllButImmovableEffect,
      alarithSpiritFreeCommandAbilityEffect(`Ponderous Advice`, 3),
      {
        name: `Stoneheart Shockwave`,
        desc: `Pick 1 enemy unit within range of this ability that is visible to this model. Subtract 1 from to hit rolls until the end of that phase. A unit cannot be affected by this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE, START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Archmage Teclis': {
    mandatory: {
      spells: [keyPicker(spells, ['Protection of Teclis', 'Storm of Searing White Light'])],
    },
    effects: [
      {
        name: `Archmage`,
        desc: `At the start of your hero phase, say if you're going to cast 1, 2 or 4 spells. If this model will cast 1 spell, when it attempts to cast that spell, it is automatically cast with a casting roll of 12 that cannot be modified (do not roll 2D6) and it cannot be unbound. If casting 2 spells, each is automatically cast with a casting roll of 12, and they can be unbound. If casting 4 spells, each is automatically cast with a casting roll of 10, and they can be unbound.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_MAY_2021],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. The number of spells it can cast depends on the Archmage ability. It can unbind any number of spells. Knows Arcane Bolt and Mystic Shield, Protection of Teclis and Storm of Seering White Light.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aura of Celennar`,
        desc: `Add 1 to casting and unbind rolls for friendly LUMINETH REALM-LORDS in range of this models Aura of Celennar ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Discs of the Aelementari`,
        desc: `In your hero phase, you can automatically dispel 1 endless spell. In the enemy hero phase, you can automatically unbind 1 enemy spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Seeing Stone of Celennar`,
        desc: `Each time a friendly model within range of this model's Aura of Celennar ability is affected by a spell or endless spell cast by an enemy WIZARD, you can roll a D6. On a 4+, ignore the effects. Then, pick 1 enemy unit within 18" of that unit. That enemy unit suffers D3 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
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
      alarithSpiritFreeCommandAbilityEffect(`Eldar Wisdom`, 6),
      {
        name: `Firestealer Hammers`,
        desc: `Unmodified hit rolls of 6 with Firestealer hammers inflict 1 mortal wound in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Guardian of Hysh`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy models within range of this ability.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Ellania and Allathor, Eclipsian Warsages': {
    mandatory: {
      spells: [keyPicker(spells, ['Salvation of Hysh'])],
    },
    effects: [
      getBoltAndShieldWizardEffect(2, 2, 'Salvation of Hysh'),
      {
        name: `Aspect of Celennar`,
        desc: `Add 1 to casting, dispelling and unbinding rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Realm Wanderers`,
        desc: `If this model with within 3" of your general, roll a dice. On a 4+, you receive 1 command point.`,
        when: [HERO_PHASE],
      },
      {
        name: `Altairi`,
        desc: `Damage characteristic is equal to the current battle round.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Altairi`,
        desc: `Once per battle, pick 1 point on the battlefield within 12" of this model that is visible. Draw an imaginary line 1mm wide between that point and the closest point on this model's base. Roll a dice for each unit that has any models passed across by this line. On a 2+, that unit suffers a number of mortal wounds equal to the number of the current battle round.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sudden Translocation`,
        desc: `At the end of the phase, roll a dice if this model fought in that phase. If the roll is less than the number of the current battle round, or less than the number of wounds allocated to this model then heal up to D6 wounds and remove it from the battlefield. Then set it back up more than 12" from any enemy models. If this is impossible, this model is removed, but does not count as having been slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hurakan Spirit of the Wind': {
    effects: [
      IntoTheGaleOverSaveEffect,
      IntoTheGalePileInRestrictionEffect,
      SpiritOfTheWindEffect,
      LivingCycloneEffect,
      WindmageSymbiosisEffect,
    ],
  },
  'Hurakan Windchargers': {
    effects: [
      StandardBearerEffect,
      {
        name: `Windcharger Arrows`,
        desc: `Do not apply cover saves for attacks made with a Windcharger Bow.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Go Where the Wind Blows`,
        desc: `When this unit moves, it can move across terrain in the same matter as a model that can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Hurakan Windmage': {
    mandatory: {
      spells: [keyPicker(spells, ['Windblast Vortex'])],
    },
    effects: [
      getBoltAndShieldWizardEffect(1, 1, 'Windblast Vortex'),
      {
        name: `Fan of Redirection`,
        desc: `Add 1 to save rolls for attacks made with missile weapons that target this model. Additionally, if the unmodified save roll for a missle weapon is 6, after all the attacking unit's attacks have been resolved, inflict 1 mortal wound on 1 enemy unit within 9" of this model that is visible to it.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Windleap`,
        desc: `If a friendly WINDCHARGERS unit starts a move wholly within 6", when it moves it has a move characteristic of 16" and can fly.`,
        when: [MOVEMENT_PHASE],
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
        name: `Demonbane`,
        desc: `The damage inflicted by Demonbane is 3 instead of D3 if the target has the CHAOS and DEMON keywords.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Voice of Tyrion`,
        desc: `If this model is on the battlefield, and TECLIS is not part of your army, on a 2+ you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Myari Lightcaller': {
    mandatory: {
      spells: [keyPicker(spells, ['Dazzling Light'])],
    },
    effects: [
      getBoltAndShieldWizardEffect(1, 1, 'Dazzling Light'),
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
      getSunmetalWeaponsEffect(`Sunmetal Greatsword or an Auralan Bow`),
      CrushingBlowEffect,
      {
        name: `Guardians`,
        desc: `Roll a D6 for each wound or mortal wound allocated to a friendly MYARI LIGHTCALLER within 3". On a 2+, this unit is allocated the wound instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Scinari Calligrave': {
    mandatory: {
      spells: [keyPicker(spells, ['Erasure'])],
    },
    effects: [
      getBoltAndShieldWizardEffect(1, 1, 'Erasure'),
      {
        name: `Realmscribe`,
        desc: `One per battle, instead of attempting to cast spells with 1 friendly model with this ability, roll a dice and add the current battle round. on a 5+ pick a point on the battle field. For the rest of the battle do not take battleshock tests for friendly LUMINETH REALM-LORDS units wholly with 9" of that point, and add 1 to casting, dispelling and unbinding rolls for friendly LUMINETH REALM-LORDS WIZARDS within 9" of that point.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Scinari Cathallar': {
    mandatory: {
      spells: [keyPicker(spells, ['Darkness of the Soul'])],
    },
    effects: [
      getBoltAndShieldWizardEffect(1, 1, 'Darkness of the Soul'),
      {
        name: `Emotional Transference`,
        desc: `Pick one friendly LUMINETH REALM-LORDS unit wholly within 18" of this model and roll a D6. On a 2+, do not take a battle shock test for that unit. In addition, if any model from that unit were slain during that turn, you can pick one enemy unit within 18" of this model that has to take a battleshock test in that phase. Add the number of models from the friendly unit that were slain during that turn to the battleshock roll for that enemy unit.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Scinari Loreseeker': {
    effects: [
      getBoltAndShieldWizardEffect(1, 1, ''),
      {
        name: `Loreseeker`,
        desc: `If an enemy model with an artifact is slain within 3" of any friendly models with this ability, you receive 1 command point.`,
        when: [DURING_GAME],
      },
      {
        name: `Lone Agent`,
        desc: `You can add 1 to save rolls for attacks that target this model, if it is more than 9" from any friendly models.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Lone Agent`,
        desc: `Instead of setting this model up as usual you can set it in Lone Agent reserve. At the start of the first battle round, before determining who has the first turn, you must set this model up on the battlefield anywhere more than 3" from any enemy units, and not in your territory. If you set up this model within 6" of an objective that has no enemy units within 6" of it, you gain control of that objective, and your opponent cannot gain control of it while this model is within 6" of it.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Severith, Lord of the Seventh Wind': {
    effects: [
      IntoTheGaleOverSaveEffect,
      IntoTheGalePileInRestrictionEffect,
      SpiritOfTheWindEffect,
      LivingCycloneEffect,
      WindmageSymbiosisEffect,
      {
        name: `Scour`,
        desc: `Pick one faction terrain piece within 1" of this model. Roll a dice, on a 2+ the terrain feature's warscroll cannot be used for the rest of the battle.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Searing Desert Winds`,
        desc: `After this unit makes a move, pick 1 enemy unit this model moved across. On a 3+ it suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'The Light of Eltharion': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Unflinching Valour'])],
    },
    effects: [
      {
        name: `Celennari Blade`,
        desc: `You can pick 1 enemy HERO within 3" of this model. If you do so, add 1 to the damage inflicted by successful attacks made with this model's Celennari Blade that target that HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fangsword of Eltharion`,
        desc: `Add 1 to wound rolls for attacks made with this model's Fangsword of Eltharion if this model made a charge move in the same turn. In addition, if the unmodified wound roll for an attack made with this model's Fangsword of Eltharion is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Searing Darts of Light`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 18" of this model that is visible to them and roll a D6. On a 1, nothing happens. On a 2-4, that unit suffers D3 mortal wounds. On a 5+, that unit suffers D6 mortal wounds.`,
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
        desc: `Ignore negative modifiers when making hit rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vanari Auralan Sentinels': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      getVanariWizardsEffect(5),
      getSunmetalWeaponsEffect(`Auralan Bow`),
      {
        name: `Scryhawk Lantern`,
        desc: `Pick one enemy unit within 30" of this unit's High Sentinel that is not visible to them. Choose the Lofted missile weapon characteristic for this unit's Auralan Bows in that phase, but that enemy unit is treated as being visible to all friendly models from that unit until the end of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Many-stringed Weapon`,
        desc: `Before attacking with Auralan Bows, choose the Aimed or Lofted missile weapon characteristic for all shooting attacks made by this unit in that phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Vanari Auralan Wardens': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      getSunmetalWeaponsEffect(`Warden's Pike`),
      getVanariWizardsEffect(5),
      {
        name: `Moonfire Flask`,
        desc: `Once per battle, you can pick 1 enemy unit within 3" of this unit's High Warden and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Wall of Blades`,
        desc: `If the target unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Warden's Pikes and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vanari Bannerblade': {
    effects: [
      getSunmetalWeaponsEffect(`Bannerblade's Sword`),
      {
        name: `World Banner`,
        desc: `Add 1 (or 3 if any Bannerblades are within 3" of any enemy units) to the bravery of all LUMINETH REALM-LORDS wholly within 18" of this model.`,
        when: [DURING_GAME],
      },
      {
        name: `World Banner`,
        desc: `One per battle, roll a dice for each enemy unit within 18". If the roll is equal to or less than the number of the current battle round, the unit suffers D3 mortal wounds and subtracts 1 from hit rolls until the end of the phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Vanari Bladelords': {
    effects: [
      {
        name: `Guardians`,
        desc: `Roll a D6 for each wound or mortal wound allocated to a friendly SCINARI within 3". On a 2+, you must allocate the wound instead to a unit with this ability.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Swordmasters`,
        desc: `Before fighting with this unit, pick either Perfect Strike (do not make a hit roll) or Flurry of Blows (attacks characteristic equal to the number of enemy models within 2" of the attacking model).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Vanashimor Banners`,
        desc: `Each time the unit is affected by a spell or endless spell, roll a dice. On a 4+ ignore the effects of the spell or endless spell.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Vanari Dawnriders': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      {
        name: `Deathly Furrows`,
        desc: `If you use this ability, you can either add 1 to the Attacks characteristic of this unit's melee weapons, but it can only target units that have a Wounds characteristic of 1 or 2 and do not have a mount, or you can add 2 to the Attacks characteristic of this unit's melee weapons, but it can only target units that have a Wounds characteristic of 1 and do not have a mount.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Lances of the Dawn`,
        desc: `If this unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Sunmetal Lances and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      getSunmetalWeaponsEffect(`Sunmetal Lance`),
      getVanariWizardsEffect(3),
      StandardBearerEffect,
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
  'Vanari Starshard Ballistas': {
    effects: [
      {
        name: `Blinding Bolts`,
        desc: `Once per battle, units hit by an attack from this unit, subtract 1 from hit rolls until the end of the turn. A unit cannot be affected more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Messenger Hawk`,
        desc: `Pick one enemy unit within 24" of a friendly LUMINETH REALM-LORDS HERO and 1 friendly STARSHARD BALLISTAS unit within 24" of that HERO. Add 1 to hit rolls by that STARSHARD BALLISTAS unit that target that enemy unit until the end of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Warding Lanterns`,
        desc: `Each time you allocate a wound or mortal wound to the bearer, if the unit has not moved this turn, roll a D6. On a 6 the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Warding Lanterns`,
        desc: `If the unit has not moved this turn, add 1 to attacks of this unit's Starshard bolts.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
