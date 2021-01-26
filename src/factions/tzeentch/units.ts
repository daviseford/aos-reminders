import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_START_OF_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const ArcaneTomeEffect = {
  name: `Arcane Tome`,
  desc: `Once per battle, when this model attempts to cast or unbind a spell, you can roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine the casting or unbinding roll.`,
  when: [HERO_PHASE],
}
const CapriciousWarpflameEffect = {
  name: `Capricious Warpflame`,
  desc: `Add 1 to hit rolls for attacks made by this unit if the target unit has 10 or more models. Add 2 to hit rolls instead of 1 if the target unit has 20 or more models.`,
  when: [SHOOTING_PHASE],
}
const MagicTouchedEffect = {
  name: `Magic-touched`,
  desc: `If the casting roll for this model is a double and the casting attempt is successful and not unbound, this model can attempt to cast 1 extra spell this turn. If it does so and the extra casting roll is a double, the spell automatically fails and this model is slain. If a friendly Magister is slain by this effect, roll a D6 before removing the model. On a 2+, 1 Tzeentch Chaos Spawn is added to your army. Set up the Tzeentch Chaos Spawn anywhere on the battlefield within 1" of the slain Magister and more than 3" from any enemy units.`,
  when: [HERO_PHASE],
}
const MasteryOfMagicEffect = {
  name: `Mastery of Magic`,
  desc: `When this model makes a casting, unbinding or dispelling roll, you can change the lowest D6 to match the highest D6. This counts as a modifier.`,
  when: [HERO_PHASE],
}
const SkySharksEffect = {
  name: `Sky-sharks`,
  desc: `If the target is an enemy Monster, change the Damage characteristic of this unit's Lamprey Bite to D3.`,
  when: [COMBAT_PHASE],
}
const SpellEaterEffect = {
  name: `Spell-eater`,
  desc: `Once per turn, in your hero phase, you can pick 1 endless spell within 18" of this model. That endless spell is dispelled.`,
  when: [HERO_PHASE],
}
const SpellThiefEffect = {
  name: `Spell-thief`,
  desc: `If this model successfully unbinds an enemy spell with an unbinding roll of 9+, this model can attempt to cast that spell, if it is possible for it to do so, for the rest of the battle.`,
  when: [HERO_PHASE],
}
const TouchedbyFireEffect = {
  name: `Touched by Fire`,
  desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit that was inflicted by a melee weapon. On a 5+, the attacking unit suffers 1 mortal wound.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const WakeofFireEffect = {
  name: `Wake of Fire`,
  desc: `After this unit has made a normal move, you can pick 1 enemy unit that has any models passed across by any models from this unit and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [MOVEMENT_PHASE],
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
    effects: [
      ArcaneTomeEffect,
      SkySharksEffect,
      WakeofFireEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Tzeentch's Firestorm.`,
        when: [HERO_PHASE],
      },
      // Intentionally placed here to prevent duplicate key problem in spells file (Relates to Issue #856).
      {
        name: `Tzeentch's Firestorm`,
        desc: `Casting value of 8. Roll a D6 for each enemy unit within 9" of the caster and visible to them. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
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
    effects: [CapriciousWarpflameEffect, TouchedbyFireEffect],
  },
  'Flamers of Tzeentch': {
    effects: [
      CapriciousWarpflameEffect,
      TouchedbyFireEffect,
      {
        name: `Guided by Billowing Flames`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Warpflame while it is wholly within 9" of any friendly Exalted Flamers.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Horrors of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Channelled Pink Fire'])],
    },
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If the unmodified roll for a battleshock test for this unit while it includes any Pink Horror Icon Bearers is 1, you can return D6 slain Horrors of Tzeentch models to this unit, and no models from this unit will flee in that battleshock phase. Set up the Horrors of Tzeentch models one at a time within 1" of a model from this unit that has not been returned in that phase. The models can only be set up within 3" of an enemy unit if this unit was within 3" of that enemy unit before any models were returned.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Horn Blower`,
        desc: `If the unmodified roll for a battleshock test for an enemy unit that is within 6" of this unit while this unit includes any Pink Horror Hornblowers is 1, that battleshock test must be rerolled.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Ectoplasmic Elasticity`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a Pink Horror from this unit. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Flickers Flames`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Magical Flames while this unit has 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Split and Split Again`,
        desc: `When you allocate wounds or mortal wounds to this unit, you must allocate them to a Pink Horror model if it is possible to do so.

        Each time an Iridescent Horror or Pink Horror model from a friendly unit with this ability is slain, you can add 2 Blue Horror models to that unit after removing the slain model. Each time a Blue Horror model from a friendly unit with this ability is slain, you can add 1 Brimstone Horrors model to that unit after removing the slain model.

        Set up the additional models one at a time within 1" of the position that the slain model had occupied. The additional models can only be set up within 3" of an enemy unit if the position that the slain model had occupied or any other models from the slain model's unit are within 3" of that enemy unit. If you cannot set up the additional models in this way, they are removed from play (they do not count as being slain).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Locus of Conjuration`,
        desc: `You can add 1 to any casting rolls made for this unit if it is wholly within 12" of any friendly TZEENTCH DAEMON HEROES.`,
        when: [HERO_PHASE],
      },
      {
        name: `Petty Vengeance`,
        desc: `If a Pink Horror model from this unit is slain and you do not use its Split and Split Again ability to add any models to this unit, you can pick 1 enemy unit within 1" of this unit and roll a D6. On a 5+, that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Magic`,
        desc: `This unit is a Wizard while it has 9 or more Pink Horrors. It can attempt to cast 1 spell in your hero phase and attmept to unbind 1 spell in the enemy hero phase. It knows the Channelled Pink Fire spell. It cannot attempt to cast any spells other than Channelled Pink Fire, but any number of Horrors of Tzeentch units that have 9 or more Pink Horrors can attempt to cast Channelled Pink Fire in the same hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Mortals
  'Magister on Disc of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Bolt of Change'])],
    },
    effects: [
      MagicTouchedEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Bolt of Change.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Magister: {
    mandatory: {
      spells: [keyPicker(Spells, ['Bolt of Change'])],
    },
    effects: [
      MagicTouchedEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Bolt of Change.`,
        when: [HERO_PHASE],
      },
    ],
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
        desc: `Add 2 to the result of any save rolls for this model in the combat phase unless the attacker is a Monster or can fly.`,
        when: [SAVES_PHASE],
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
      {
        name: `Arcanite Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a unit that has any models armed with Arcanite Shields. On a 6, that wound or mortal wound is negated. When you allocate wounds or mortal wounds to this unit, you must allocate them to a model armed with an Arcanite Shield if it is possible to do so.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
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
