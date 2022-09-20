import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_START_OF_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import rule_sources from './rule_sources'
import Spells from './spells'

const ArcaneTomeEffect = {
  name: `Arcane Tome`,
  desc: `Once per battle, when this model attempts to cast or unbind a spell, you can roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine the casting or unbinding roll.`,
  when: [HERO_PHASE],
  shared: true,
}
const CapriciousWarpflameEffect = {
  name: `Capricious Warpflame`,
  desc: `Add 1 to hit rolls for attacks made by this unit if the target unit has 10 or more models.`,
  when: [SHOOTING_PHASE],
  rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_JULY_2021],
  shared: true,
}
const MagicTouchedEffect = {
  name: `Magic-touched`,
  desc: `If the casting roll for this model is a double and the casting attempt is successful and not unbound, this model can attempt to cast 1 extra spell this turn. If it does so and the extra casting roll is a double, the spell automatically fails and this model is slain. If a friendly Magister is slain by this effect, roll a D6 before removing the model. On a 2+, 1 Tzeentch Chaos Spawn is added to your army. Set up the Tzeentch Chaos Spawn anywhere on the battlefield within 1" of the slain Magister and more than 3" from any enemy units.`,
  when: [HERO_PHASE],
  shared: true,
}
const MagisterMagicEffect = {
  name: `Magic`,
  desc: `This model is a wizard. It can attempt to cast 1 spell and attempt to unbind 1 spell. It knows Arcane Bolt, Mystic Shield, and Bolt of Change.`,
  when: [HERO_PHASE],
  shared: true,
}
const MasteryOfMagicEffect = {
  name: `Mastery of Magic`,
  desc: `When this model makes a casting, unbinding or dispelling roll, you can change the lowest D6 to match the highest D6. This counts as a modifier.`,
  when: [HERO_PHASE],
  shared: true,
}
const SkySharksEffect = {
  name: `Sky-sharks`,
  desc: `If the target is an enemy MONSTER, change the Damage characteristic of this unit's Lamprey Bite to D3.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const SpellEaterEffect = {
  name: `Spell-eater`,
  desc: `Once per turn, in your hero phase, you can pick 1 endless spell within 18" of this model. That endless spell is dispelled.`,
  when: [HERO_PHASE],
  shared: true,
}
const SpellThiefEffect = {
  name: `Spell-thief`,
  desc: `If this model successfully unbinds an enemy spell with an unbinding roll of 9+, this model can attempt to cast that spell, if it is possible for it to do so, for the rest of the battle.`,
  when: [HERO_PHASE],
  shared: true,
}
const TouchedbyFireEffect = {
  name: `Touched by Fire`,
  desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit that was inflicted by a melee weapon. On a 5+, the attacking unit suffers 1 mortal wound.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const WakeofFireEffect = {
  name: `Wake of Fire`,
  desc: `After this unit has made a normal move, you can pick 1 enemy unit that has any models passed across by any models from this unit and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}

const Units = {
  // Daemons
  'Lord of Change': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Gateway'])],
      command_abilities: [keyPicker(CommandAbilities, ['Beacon of Sorcery'])],
    },
    effects: [
      MasteryOfMagicEffect,
      SpellEaterEffect,
      SpellThiefEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Infernal Gateway.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Kairos Fateweaver': {
    mandatory: {
      spells: [keyPicker(Spells, ['Gift of Change'])],
    },
    effects: [
      MasteryOfMagicEffect,
      SpellEaterEffect,
      {
        name: `Oracle of Eternity`,
        desc: `Once per battle, in either player's turn, if this model is on the battlefield, you can replace a single dice from one of the following dice rolls with a result of your choice.

        Casting rolls, Unbinding rolls, Dispelling rolls, Run rolls, Charge rolls, Hit rolls, Wound rolls, Save rolls, Any roll that determines the Damage characteristic of a missile or melee weapon, Battleshock test

        Note that this ability only allows you to replace a single dice roll. For 2D6 rolls (such as casting rolls or charge rolls), you can only replace 1 of the dice. In addition, any rolls that have been replaced count as unmodified rolls and cannot be rerolled or modified further.`,
        when: [DURING_GAME],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 3 spells and attempt to unbind 3 spells. Knows Arcane Bolt, Mystic Shield, and Gift of Change.
               While friendly Wizards are wholly within 18" of him, Kairos Fateweaver knows any spells on those Wizards' warscrolls that are possible for him to cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gaunt Summoner of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Flames'])],
    },
    effects: [
      {
        name: `Book of Profane Secrets`,
        desc: `Once per battle this model can use this ability at the start of your hero phase. Summon 1 unit of the following to the battlefield: 5 Horrors of Tzeentch, 10 Bloodletters, 10 Daemonettes, 10 Plaguebearers or 6 Furies. The summoned unit must be set up wholly within 9" of a this model and more than 9" from any enemy units.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_JULY_2020],
      },
      {
        name: `Warptongue Blade`,
        desc: `If the unmodified wound roll for an attack made with a Warptongue Blade is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Infernal Flames.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fateskimmer, Herald of Tzeentch on Burning Chariot': {
    mandatory: {
      spells: [keyPicker(Spells, ["Tzeentch's Firestorm (Fateskimmer)"])],
    },
    effects: [
      ArcaneTomeEffect,
      SkySharksEffect,
      WakeofFireEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Tzeentch's Firestorm.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fluxmaster, Herald of Tzeentch on Disc': {
    mandatory: {
      spells: [keyPicker(Spells, ['Blue Fire of Tzeentch'])],
    },
    effects: [
      ArcaneTomeEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Blue Fire of Tzeentch.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Changeling': {
    effects: [
      {
        name: `Arch-deceiver`,
        desc: `At the start of the first battle round, after armies have been set up but before the first turn begins, you can remove this model from the battlefield. If you do so, at the end of your first movement phase, you must set this model up again anywhere within your opponent's territory more than 3" from any enemy units.`,
        when: [TURN_ONE_START_OF_TURN, TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Puckish Misdirection`,
        desc: `In the enemy hero phase, you can pick 1 enemy unit within 9" of this model. If you do so, until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and half the Move characteristic of that unit (rounding up).`,
        when: [HERO_PHASE],
      },
      {
        name: `Changeling Magic`,
        desc: `While this model is within 9" of an enemy Wizard, it knows any spell on that Wizard's warscroll that are possible for this model to cast.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt and Mystic Shield.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Changecaster, Herald of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Pink Fire of Tzeentch'])],
    },
    effects: [
      ArcaneTomeEffect,
      {
        name: `Fortune and Fate`,
        desc: `If this model successfully casts a spell with a casting roll of 9+, this model can attempt to cast 1 extra spell in that phase. The extra spell casts also have this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Pink Fire of Tzeentch.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Blue Scribes': {
    mandatory: {
      spells: [keyPicker(Spells, ['Boon of Tzeentch'])],
    },
    effects: [
      {
        name: `Frantic Scribbling`,
        desc: `Each time a Wizard wholly within 18" of this model successfully casts a spell that is not unbound and that is possible for this model to cast, you can roll a D6. On a 4+, this model knows that spell for the rest of the battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scrolls of Sorcery`,
        desc: `Once in each of your hero phases, when this model attempts to cast a spell, instead of making a casting roll, you can say that it will read from its scrolls of sorcery. If you do so, roll a D6. On a 2+, that spell is automatically cast and cannot be unbound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Boon of Tzeentch.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Screamers of Tzeentch': {
    effects: [
      SkySharksEffect,
      {
        name: `Slashing Fins`,
        desc: `After this unit has made a normal move, pick 1 enemy unit and roll 1 dice for each model in this unit that passed across any models from that unit. For each 5+, that unit suffers 1 mortal wound. If that enemy unit is a Wizard, for each 5+, inflict D3 mortal wounds instead of 1.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Burning Chariots of Tzeentch': {
    effects: [SkySharksEffect, CapriciousWarpflameEffect, TouchedbyFireEffect, WakeofFireEffect],
  },
  'Exalted Flamers of Tzeentch': {
    effects: [CapriciousWarpflameEffect, TouchedbyFireEffect, GenericEffects.Elite],
  },
  'Flamers of Tzeentch': {
    effects: [CapriciousWarpflameEffect, TouchedbyFireEffect],
  },
  'Horrors of Tzeentch': {
    effects: [
      {
        name: `Battle Ability`,
        desc: `When you pick this unit to be part of your army or when you add this unit to your army during a battle, you must decide if this unit will have either the Split and Split Again ability or the Petty Vengeance ability (it cannot have both). Note your choice on your army roster.`,
        when: [START_OF_GAME],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
      {
        name: `Horrors`,
        desc: `Each model in a Horrors of Tzeentch unit must be either a Pink Horror, a Blue Horror or a Brimstone Horror (you can have different types of Horror in the same unit). You cannot allocate wounds or mortal wounds to a Blue Horror if its unit includes any Iridescent or Pink Horrors, and you cannot allocate a wound to a Brimstone Horror if its unit includes any Blue Horrors.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
      {
        name: `Champion`,
        desc: `1 Pink Horror in this unit can be an Iridescent Horror instead.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 Pink Horrors in this unit can be a Pink Horror Icon Bearer instead. At the start of your hero phase, if you have a Disciples of Tzeentch army, roll 1 dice for each Pink Horror Icon Bearer in this unit. For each 3+, you receive 1 Fate Point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 Pink Horrors in this unit can be a Pink Horror Hornblower instead. Add 1 to save rolls for this unit while it includes any Pink Horror Hornblowers.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
      {
        name: `Split and Split Again`,
        desc: `Each time an Iridescent Horror or Pink Horror in this unit is slain by a wound or mortal wound, it does not count as having been slain but you must immediately remove it from play and replace it with 2 Blue Horrors that are added to its unit.

        Each time a Blue Horror in this unit is slain by a wound or mortal wound, it does not count as having been slain but you must immediately remove it from play and replace it with 1 Brimstone Horrors model that is added to its unit.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_TZEENTCH,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.ERRATA_AUGUST_2021,
        ],
      },
      {
        name: `Adding and Removing Horrors`,
        desc: `Replacement models that are added to this unit must be set up one at a time within 1" of the position that was occupied by the model they are replacing.

        Replacement models that are added to this unit can only be set up within 3" of an enemy unit if a model from this unit is already within 3" of that enemy unit. Replacement models added to this unit can take it above its maximum size.
        
        Designer's Note: Horrors that flee cannot Split and Split Again. If a Horror Splits and Splits again, it is immediately removed from play and the replacement models are added to the unit before the next wound or mortal wound is allocated to the unit. A Horror that is removed from play because it has Split and Split Again does not count as a slain model for the purposes of the Battleshock rules (core rules, 15.0) and it cannot be returned through the use of rules that allow you to return slain models to the unit.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
      {
        name: `Petty Vengeance`,
        desc: `If a model in this unit is slain, you can pick 1 enemy unit within 1" of this unit and roll a dice. If the roll is equal to or greater than the Petty Vengeance Roll for the slain model, that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_AUGUST_2021],
      },
    ],
  },
  // Mortals
  'Magister on Disc of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Bolt of Change'])],
    },
    effects: [MagicTouchedEffect, MagisterMagicEffect],
  },
  Magister: {
    mandatory: {
      spells: [keyPicker(Spells, ['Bolt of Change'])],
    },
    effects: [MagicTouchedEffect, MagisterMagicEffect],
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
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield and Glean Magic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Eyes of the Nine': {
    effects: [
      {
        name: `Arcanite Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a unit that has any models armed with Arcanite Shields. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Split`,
        desc: `If the Blue Horror model from a friendly unit with this ability is slain, you can add 1 Brimstone Horrors model to that unit after removing the slain model. The Brimstone Horrors' Magical Flames have an Attacks characteristic of 1 instead of 2, and their Taloned Hands have an Attacks characteristic of 2 instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Vortemis the All-seeing': {
    mandatory: {
      spells: [keyPicker(Spells, ['Sorcerous Insight'])],
    },
    effects: [
      MagicTouchedEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Sorcerous Insight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Fatemaster: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lord of Fate'])],
    },
    effects: [
      {
        name: `Soulbound Shield`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+, ignore the effects of that spell or endless spell on this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hovering Disc of Tzeentch`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit unless the attacking unit is a MONSTER or can fly.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Ogroid Thaumaturge': {
    mandatory: {
      spells: [keyPicker(Spells, ['Choking Tendrils'])],
    },
    effects: [
      {
        name: `Brutal Rage`,
        desc: `You can reroll hit and wound rolls for attacks made with melee weapons by this model if any wounds or mortal wounds were allocated to this model earlier in the same phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mighty Rampage`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Choking Tendrils.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Kairic Acolytes': {
    mandatory: {
      spells: [keyPicker(Spells, ['Gestalt Sorcery'])],
    },
    effects: [
      GenericEffects.ArcaniteShieldEffect,
      {
        name: `Paired Cursed Blades`,
        desc: `You can reroll hit rolls for attacks made with a pair of Cursed Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scroll of Dark Arts`,
        desc: `A unit that includes any Scrolls of Dark Arts can add 1 to casting and unbinding rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vulcharc`,
        desc: `If an enemy Wizard successfully casts a spell within 18" of a friendly unit that includes any Vulcharcs, roll a D6. On a 4+, that Wizard suffers 1 mortal wound after the effects of that spell have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This unit is a Wizard while it has 9 or more models. It can attempt to cast 1 spell in your hero phase and attmept to unbind 1 spell in the enemy hero phase. It knows the Gestalt Sorcery spell. It cannot attempt to cast any spells other than Gestalt Sorcery, but any number of Kairic Acolytes units that have 9 or more models can attempt to cast Gestalt Sorcery in the same hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzeentch Chaos Spawn': {
    effects: [
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks made by a Tzeentch Chaos Spawn's Freakish Mutations, resolve those attacks with a To Hit and To Wound characteristic of 3+ instead of 4+.`,
        when: [COMBAT_PHASE],
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
      {
        name: `Magic`,
        desc: `This model is a Wizard. It can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Infernal Gateway spells.`,
        when: [HERO_PHASE],
      },
      // Intentionally placed command ability here thanks to duplicate key names and different effects.
      {
        name: `Beacon of Sorcery`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can add 1 to casting and unbinding rolls for friendly TZEENTCH DAEMON WIZARDS while they are wholly within 24" of that model. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
    ],
  },
}

export default tagAs({ ...Units }, 'unit')
