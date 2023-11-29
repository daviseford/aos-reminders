import { keyPicker, tagAs } from 'factions/metatagger'
import rule_sources from 'factions/slaves_to_darkness/rule_sources'
import { BookOfProfaneSecretsEffect, LordsOfTheSilverTowerEffect } from 'factions/slaves_to_darkness/units'
import { GenericEffects } from 'generic_rules'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import Spells from './spells'
import { TItemDescriptions } from 'factions/factionTypes'

export const TzaangorChampionEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be an Aviarch. Add 1 to the Attacks characteristic of that model's Tzeentchian Spear.`,
  when: [COMBAT_PHASE],
  shared: true,
}
export const BabblingStreamOfSecretsEffect = {
  name: `Babbling Stream of Secrets`,
  desc: `In the combat phase, enemy units within 3" of any friendly units with this ability cannot receive commands.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const GuidedByThePastEffect = {
  name: `Guided by the Past`,
  desc: `You can add 1 to wound rolls for attacks made with melee weapons by friendly units with this ability if you are taking the second turn in the current battleround. This ability does not affect attacks made by a mount.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const SilveredPortalEffect = {
  name: `Silvered Portal`,
  desc: `After you have deployed this unit, when you would set up another friendly TZEENTCH unit that is not a MONSTER, you can say that it is in this Gaunt Summoner's Silver Tower as a reserve unit. Up to 2 units can be set up in reserve in this way. At the end of any of your movement phases, you can set up 1 or more of these units on the battlefield wholly within 9" of this unit and more than 9" from all enemy units. At the start of the fourth battle round, reserve units that are still in a Silver Tower are destroyed.`,
  when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS, rule_sources.ERRATA_JANUARY_2023],
  shared: true,
}
const ArcaneTomeEffect = {
  name: `Arcane Tome`,
  desc: `Once per battle, you can reroll 1 casting roll for this unit. If you do so, add 3 to the new casting roll.`,
  when: [HERO_PHASE],
  shared: true,
}
const CapriciousWarpflameEffect = {
  name: `Capricious Warpflame`,
  desc: `Add 1 to hit rolls for attacks made by this unit's Warpflame, Billowing Warpflame or Flaming Maws weapon if the target unit has 5 or more models.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const MagicTouchedEffect = {
  name: `Magic-touched`,
  desc: `If the first casting attempt made by this unit in your hero phase is successful and the spell is not unbound, this unit can attempt to cast 1 extra spell in that phase. If it does so and the casting roll for that extra spell is a double, the casting attempt automatically fails and this unit is slain. If this happens, you can choose for this unit to be transformed into a Spawn (pg 65) instead of being slain.`,
  when: [HERO_PHASE],
  shared: true,
}
const BeaconOfSorcery = {
  name: `Beacon of Sorcery`,
  desc: `Add 1 to casting rolls, dispelling rolls and unbinding rolls for friendly Tzeentch Wizards while they are wholly within 18" of this unit. In addition, this unit knows all of the spells from the Lore of Change.`,
  when: [HERO_PHASE],
  shared: true,
}
const MasteryOfMagicEffect = {
  name: `Mastery of Magic`,
  desc: `When you make a casting, unbinding or dispelling roll for this unit, you can change the lowest D6 to match the highest D6.`,
  when: [HERO_PHASE],
  shared: true,
}
const SpellThiefEffect = {
  name: `Spell-thief`,
  desc: `If this unit successfully dispels an endless spell, instead of dispelling it, you can say that it will steal it. If you do so, this unit gains control of that endless spell and counts as the Wizard that summoned it until its dispelled or another unit steals it.`,
  when: [HERO_PHASE],
  shared: true,
}
const WakeofFireEffect = {
  name: `Wake of Fire`,
  desc: `After this unit has made a normal move, pick 1 enemy unit and roll a dice if this unit passed across any models in that enemy unit. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}

const Units = {
  // Daemons
  'Lord of Change': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Gateway'])],
    },
    effects: [MasteryOfMagicEffect, SpellThiefEffect, BeaconOfSorcery, GenericEffects.WizardTwoSpellsEffect],
  },
  'Kairos Fateweaver': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Gateway'])],
    },
    effects: [
      MasteryOfMagicEffect,
      BeaconOfSorcery,
      SpellThiefEffect,
      {
        name: `Oracle of Eternity`,
        desc: `At the start of your hero phase, if this unit is part of your army and on the battlefield, and you have fewer than 9 Destiny Dice, you can roll a dice and add it to your Destiny Dice.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a WIZARD. Can attempt to cast 3 spells and attempt to unbind 3 spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gaunt Summoner': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Flames'])],
    },
    effects: [
      BookOfProfaneSecretsEffect,
      LordsOfTheSilverTowerEffect,
      SilveredPortalEffect,
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Gaunt Summoner on Disc of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Flames'])],
    },
    effects: [
      BookOfProfaneSecretsEffect,
      LordsOfTheSilverTowerEffect,
      SilveredPortalEffect,
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Fateskimmer, Herald of Tzeentch on Burning Chariot': {
    mandatory: {
      spells: [keyPicker(Spells, ['Red Fire of Tzeentch'])],
    },
    effects: [ArcaneTomeEffect, WakeofFireEffect, GenericEffects.WizardOneSpellEffect],
  },
  'Fluxmaster, Herald of Tzeentch on Disc': {
    mandatory: {
      spells: [keyPicker(Spells, ['Blue Fire of Tzeentch'])],
    },
    effects: [ArcaneTomeEffect, GenericEffects.WizardOneSpellEffect],
  },
  'The Changeling': {
    effects: [
      {
        name: `Arch-deceiver`,
        desc: `After deployment but before the first battle round begins, you can remove this unit from the battlefield. If you do so, at the end of your first movement phase, you must set this unit up again anywhere within your opponent's territory more than 3" from all enemy units.`,
        when: [END_OF_SETUP, TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Puckish Misdirection`,
        desc: `In the enemy hero phase, you can pick 1 enemy unit within 9" of this model. If you do so, until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and half the Move characteristic of that unit (rounding up).`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Changecaster, Herald of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Pink Fire of Tzeentch'])],
    },
    effects: [ArcaneTomeEffect, GenericEffects.WizardOneSpellEffect],
  },
  'The Blue Scribes': {
    mandatory: {
      spells: [keyPicker(Spells, ['Boon of Tzeentch'])],
    },
    effects: [
      {
        name: `Frantic Scribbling`,
        desc: `If this unit is part of a Disciples of Tzeentch army, each time an enemy Wizard within 9" of this unit successfully casts a spell, and that spell is not unbound, you can roll a dice. On a 3+, you receive 1 Fate Point.`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Scrolls of Sorcery`,
        desc: `This unit knows all of the spells from the Lore of Fate and Lore of Change. In addition, once in each of your hero phases, when this unit attempts to cast a spell, instead of making a casting roll, you can say that it will read from its scrolls of sorcery. If you do so, roll a dice. On a 2+, that spell is succesfully cast and cannot be unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Screamers of Tzeentch': {
    effects: [
      {
        name: `Slashing Fins`,
        desc: `After this unit has made a normal move, run, retreated or made a charge move, pick 1 enemy unit and roll a dice for each model in this unit that passed across any models in that enemy unit. For each 4+, that enemy unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Burning Chariots of Tzeentch': {
    effects: [CapriciousWarpflameEffect, WakeofFireEffect, GenericEffects.Elite],
  },
  'Exalted Flamers of Tzeentch': {
    effects: [CapriciousWarpflameEffect, GenericEffects.Elite],
  },
  'Flamers of Tzeentch': {
    effects: [
      CapriciousWarpflameEffect,
      {
        name: `Guided by Billowing Flames`,
        desc: `Add 1 to the Attacks characteristic of this unit's Warpflame while it is wholly within 9" of any friendly Exalted Flamers and/or any friendly Burning Chariots.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Horrors of Tzeentch': {
    effects: [
      {
        name: `Battle Ability`,
        desc: `When you pick this unit to be part of your army or when you summon this unit and add it to your army during a battle, you must decide if this unit will have either the Split and Split Again ability or the Petty Vengeance ability (it cannot have both). Note your choice on your army roster.`,
        when: [START_OF_GAME],
      },
      {
        name: `Horrors`,
        desc: `Each model in a Horrors of Tzeentch unit must be either a Pink Horror, a Blue Horror or a Brimstone Horror (you can have different types of Horror in the same unit). You cannot allocate wounds or mortal wounds to a Blue Horror if its unit includes any Iridescent or Pink Horrors, and you cannot allocate a wound to a Brimstone Horror if its unit includes any Blue Horrors.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Champion`,
        desc: `1 Pink Horror in this unit can be an Iridescent Horror instead.`,
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 Pink Horrors in this unit can be a Pink Horror Icon Bearer instead. At the start of your hero phase, if you have a Disciples of Tzeentch army, roll 1 dice for each Pink Horror Icon Bearer in this unit. For each 3+, you receive 1 Fate Point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 Pink Horrors in this unit can be a Pink Horror Hornblower instead. Add 1 to save rolls for this unit while it includes any Pink Horror Hornblowers.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Split and Split Again`,
        desc: `Each time an Iridescent Horror or Pink Horror in this unit is slain by a wound or mortal wound, it does not count as having been slain but you must immediately remove it from play and replace it with 2 Blue Horrors that are added to its unit.

        Each time a Blue Horror in this unit is slain by a wound or mortal wound, it does not count as having been slain but you must immediately remove it from play and replace it with 1 Brimstone Horrors model that is added to its unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Adding and Removing Horrors`,
        desc: `Replacement models that are added to this unit must be set up one at a time within 1" of the position that was occupied by the model they are replacing.

        Replacement models that are added to this unit can only be set up within 3" of an enemy unit if a model from this unit is already within 3" of that enemy unit. 
        
        Replacement models added to this unit can take it above its maximum size.
        
        Designer's Note: Horrors that flee cannot Split and Split Again. If a Horror Splits and Splits again, it is immediately removed from play and the replacement models are added to the unit before the next wound or mortal wound is allocated to the unit. A Horror that is removed from play because it has Split and Split Again does not count as a slain model for the purposes of the Battleshock rules (core rules, 15.0) and it cannot be returned through the use of rules that allow you to return slain models to the unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Petty Vengeance`,
        desc: `If a model in this unit is slain, you can pick 1 enemy unit within 1" of this unit and roll a dice. If the roll is equal to or greater than the Petty Vengeance Roll for the slain model, that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Mortals
  'Magister on Disc of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Bolt of Change'])],
    },
    effects: [MagicTouchedEffect, GenericEffects.WizardOneSpellEffect],
  },
  Magister: {
    mandatory: {
      spells: [keyPicker(Spells, ['Bolt of Change'])],
    },
    effects: [MagicTouchedEffect, GenericEffects.WizardOneSpellEffect],
  },
  'Curseling, Eye of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Glean Magic'])],
    },
    effects: [
      {
        name: `Vessel of Chaos`,
        desc: `If this model successfully unbinds a spell that is possible for it to cast, it can immediately attempt to cast that spell even though it is the enemy hero phase. If that spell is successfully cast, it cannot be unbound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Disrupter of the Arcane`,
        desc: `You can reroll unbinding and dispelling rolls for this model.`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'The Eyes of the Nine': {
    effects: [
      {
        name: `Arcanite Shield`,
        desc: `Narvia and Turosh have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Split`,
        desc: `If the Blue Horror model from this unit is slain, you can add 1 Brimstone Horrors model to that unit. The Brimstone Horrors model is armed with Magical Flames and Taloned Hands. Its Magical Flames have an Attacks characteristic of 1 instead of 2, and its Taloned Hands have an Attacks characteristic of 2 instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Vortemis the All-seeing': {
    mandatory: {
      spells: [keyPicker(Spells, ['Sorcerous Insight'])],
    },
    effects: [MagicTouchedEffect, GenericEffects.WizardOneSpellEffect],
  },
  Fatemaster: {
    effects: [
      {
        name: `Lord of Fate`,
        desc: `Add 1 to wound rolls for attacks made by friendly Disciples of Tzeentch units wholly within 9" of this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Soulbound Shield`,
        desc: `Each time this unit is affected by a spell or the ability of an endless spell, you can roll a dice. If you do so, on a 4+, ignore the effects of that spell or that endless spell's ability on this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ogroid Thaumaturge': {
    mandatory: {
      spells: [keyPicker(Spells, ['Choking Tendrils'])],
    },
    effects: [
      {
        name: `Berserk Rage`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made with melee weapons by this unit if any wounds or mortal wounds were allocated to this unit earlier in the phase.`,
        when: [COMBAT_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Kairic Acolytes': {
    mandatory: {
      spells: [keyPicker(Spells, ['Gestalt Sorcery'])],
    },
    effects: [
      GenericEffects.ArcaniteShieldEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Kairic Adept. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scroll of Dark Arts`,
        desc: `1 in every 10 models in this unit can carry a Scroll of Dark Arts. Add 1 to casting and unbinding rolls for this unit while it has any Scroll of Dark Arts.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vulcharc`,
        desc: `1 in every 10 models in this unit can be accompanied by a Vulcharc. If an enemy Wizard successfully casts a spell within 18" of a friendly unit that includes any Vulcharcs, roll a dice. On a 4+, that Wizard suffers 1 mortal wound after the effects of that spell have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This unit is a Wizard while it has 9 or more models. It can attempt to cast 1 spell in your hero phase and attmept to unbind 1 spell in the enemy hero phase. It knows the Gestalt Sorcery spell and cannot attempt to cast any spells. Any number of Kairic Acolytes units can attempt to cast Gestalt Sorcery in the same hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzeentch Chaos Spawn': {
    effects: [
      {
        name: `Writhing Tentacles`,
        desc: `If the unmodified hit roll for an attack made with Freakish Mutations is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spawn of Sorcery`,
        desc: `Heal all of the wounds allocated to this unit if a Wizard within 9" of this unit successfully casts a spell that is not unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Tzaangors
  'Tzaangor Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Boon of Mutation'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Sorcerous Elixer`,
        desc: `Once per battle, in your hero phase, this unit can attempt to cast 1 extra spell. If it does so, you can add 3 to the casting roll for that spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzaangor Skyfires': {
    effects: [
      {
        name: `Guided by the Future`,
        desc: `Ignore negative modifiers to hit or wound rolls for attacks made with missile weapons by this unit, and ignore positive modifiers to save rolls for attacks made with missile weapons by this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Judgement from Afar`,
        desc: `If the unmodified hit roll for an attack made with an Arrow of Fate is 6, the target suffers D3 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Tzaangor Enlightened': {
    effects: [TzaangorChampionEffect, BabblingStreamOfSecretsEffect, GuidedByThePastEffect],
  },
  'Tzaangor Enlightened on Discs of Tzeentch': {
    effects: [TzaangorChampionEffect, BabblingStreamOfSecretsEffect, GuidedByThePastEffect],
  },
  Tzaangors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Twistbray. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be an Icon Bearer. While this unit includes any Icon Bearers, it can use the Ornate Totems ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Brayhorn Blower. While this unit includes any Brayhorn Blowers, it can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Tzaangor Mutant`,
        desc: `1 in every 5 models in this unit can be a Tzaangor Mutant armed with a pair of Savage Blades and Vicious Beak. Add 1 to the Attacks characteristic of that model's pair of Savage Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savagery Unleashed`,
        desc: `Add 1 to the Attacks characteristic of this unit's Vicious Beaks if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },

      {
        name: `Ornate Totem`,
        desc: `While this unit includes any Icon Bearers, at the start of your hero phase, you can pick 1 enemy unit within 18" of this unit and roll a dice for each Wizard that is within 9" of this unit. For each 4+, the unit you picked suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Exalted Greater Demon of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Gateway'])],
    },
    effects: [
      MasteryOfMagicEffect,
      SpellThiefEffect,
      GenericEffects.WizardTwoSpellsEffect,
      // Intentionally placed command ability here thanks to duplicate key names and different effects.
      {
        name: `Beacon of Sorcery`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can add 1 to casting and unbinding rolls for friendly TZEENTCH DAEMON WIZARDS while they are wholly within 24" of that model. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
