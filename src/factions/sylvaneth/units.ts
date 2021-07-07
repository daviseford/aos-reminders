import { keyPicker, tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import rule_sources from './rule_sources'
import spells from './spells'

const MartialMemoriesEffects = [
  {
    name: `Martial Memories`,
    desc: `Once per phase, you can reroll 1 failed hit roll or 1 failed wound roll for an attack made by this unit, or 1 failed save roll for an attack that targets this unit. You cannot use this ability to reroll more than one dice for this unit in the same phase.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Martial Memories`,
    desc: `Once per phase, you can reroll 1 battleshock test for this unit. You cannot use this ability to reroll more than one dice for this unit in the same phase.`,
    when: [BATTLESHOCK_PHASE],
    shared: true,
  },
  {
    name: `Martial Memories`,
    desc: `Once per phase, you can reroll 1 charge roll. You cannot use this ability to reroll more than one dice for this unit in the same phase.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
  {
    name: `Martial Memories`,
    desc: `Once per phase, you can reroll 1 run roll. You cannot use this ability to reroll more than one dice for this unit in the same phase.`,
    when: [MOVEMENT_PHASE],
    shared: true,
  },
]

const BlessingsOfTheForestEffect = {
  name: `Blessings of the Forest`,
  desc: `Subtract 1 from hit rolls for attacks that target this unit if it is wholly within 6" of any friendly AWAKENED WYLDWOODS.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  shared: true,
}

const TreeLordBaseEffects = [
  {
    name: `Spirit Paths`,
    desc: `In your movement phase, if this unit is within 6" of an Awakened Wyldwood in your army, it can walk the spirit paths instead of making a normal move or retreating. If it does so, remove this model from the battlefield and set it up wholly within 6" of a different friendly AWAKENED WYLDWOOD and more than 9" from any enemy units.`,
    when: [MOVEMENT_PHASE],
    rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
    shared: true,
  },
  {
    name: `Groundshaking Stomp`,
    desc: `At the start of the combat phase, pick 1 enemy unit within 3" of this model and roll a D6. On a 4+ that unit fights at the end of that combat phase, after the players have picked any other units to fight.`,
    when: [START_OF_COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Impale`,
    desc: `If the unmodified hit roll for an attack made with Massive Impaling Talons is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll)`,
    when: [COMBAT_PHASE],
    shared: true,
  },
]

const Units = {
  'Alarielle The Everqueen': {
    mandatory: {
      spells: [keyPicker(spells, ['Metamorphosis'])],
      command_abilities: [keyPicker(command_abilities, ["Ghyran's Wrath"])],
    },
    effects: [
      {
        name: `Lifebloom`,
        desc: `You can heal up to 2D6 wounds allocatewd to this model. You can also heal up to D3 wounds allocated to each friendly Sylvaneth unit wholly within 30" of this model.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Living Battering Ram`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2-5 that unit suffers D3 mortal wounds. On a 6 the target suffers D6 mortal wounds.`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Soul Amphorae`,
        desc: `Once per battle you can summon 1 of the following units to the battlefield:
        
        20 Dryads
        10 Tree-Revenants
        10 Spite-Revenants
        3 Kurnoth Hunters
        1 Branchwych
        1 Treelord

        The summoned unit is added to your army, and must be set up wholly within 9" of this model and more than 9" from any enemy units`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Swirling Glowspites`,
        desc: `This model can retreat and still shoot and/or charge in the same turn.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Talon of the Dwindling`,
        desc: `Roll a D6 each time a wound allocated from this weapon is not negated. On a 6 the target is slain otherwise the wound is negated.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. Can attempt to cast 3 spells and unbind 3 three spells. Knows Arcane Bolt, Mystic Shield and Metamorphosis.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
  'Drycha Hamadreth': {
    mandatory: { spells: [keyPicker(spells, ['Primal Terror'])] },
    effects: [
      {
        name: `Deadly Infestation`,
        desc: `If the unmodified hit roll for an attack made with a Colony of Flitterfuries or a Swarm of Squirmlings is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll)`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Mercurial Aspect`,
        desc: `At the start of the battle round, declare whether this model is Enraged or Embittered. The relevant ability below lasts until the end of that battle round:

        Enraged: While this model is Enraged, its Colony of Flitterfuries has an Attacks characteristic of 20 instead of 10.

        Embittered: While this model is Embittered, its Swarm of Squirmlings has an Attacks characteristic of 20 instead of 10.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Song of Spite`,
        desc: `You can reroll wound rolls of 1 for attacks made by friendly SPITE-REVENANTS units while they are wholly within 16" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Drycha Hamadreth is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Primal Terror spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit of Durthu': {
    effects: [
      ...TreeLordBaseEffects,
      {
        name: `Champion of the Everqueen's Will`,
        desc: `Add 1 to the Bravery characteristic of friendly SYLVANETH units while they are wholly within 12" of any friendly models with this ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Wrathful Guardian`,
        desc: `Add 2 to the Attacks characteristic of this model's Guardian Sword while this model is wholly within 8" of any friendly AWAKENED WYLDWOODS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Treelord Ancient': {
    mandatory: {
      spells: [keyPicker(spells, ['Awakening the Wood'])],
      command_abilities: [keyPicker(command_abilities, ['Heed the Spirit-song'])],
    },
    effects: [
      ...TreeLordBaseEffects,
      {
        name: `Silent Communion`,
        desc: `Once per battle, in your hero phase, you can pick 1 friendly model with this ability and set up 1 AWAKENED WYLDWOOD wholly within 18" of that model and more than 3" from terrain features or 1" from any other model or objective, and add it to your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Awakening the Wood spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Treelord: {
    effects: [...TreeLordBaseEffects],
  },
  'Arch-Revenant': {
    mandatory: { command_abilities: [keyPicker(command_abilities, ['Call to Battle'])] },
    effects: [
      {
        name: `Crescent Shield`,
        desc: `At the start of the combat phase, say whether this model is using their shield for protection or to steady their weapon. If they use their shield for protection, you can add 1 to save rolls for attacks that target this model in that phase. If they use the shield to steady their weapon, you can reroll hit rolls of 1 for attacks made with this model's Revenant's Glaive in that phase.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Crescent Shield`,
        desc: `If they use their shield for protection, you can add 1 to save rolls for attacks that target this model in that phase.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Crescent Shield`,
        desc: `If they use the shield to steady their weapon, you can reroll hit rolls of 1 for attacks made with this model's Revenant's Glaive in that phase.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Champion of Kurnoth`,
        desc: `Reroll hit rolls of 1 for attacks made by friendly KURNOTH HUNTERS units while they are wholly within 12" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Ultimate Sacrifice`,
        desc: `Once per battle, when you allocate a wound or mortal wound to this model, you can choose to negate it. If you do so, this model cannot fly or use its Zephyrspite's Tail Pincers attack for the rest of the battle.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Branchwych: {
    mandatory: { spells: [keyPicker(spells, ['Unleash Spites'])] },
    effects: [
      {
        name: `Fury of the Forest`,
        desc: `Add 1 to hit rolls for attacks made by this model while it is wholly within 6" of any friendly AWAKENED WYLDWOODS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Quick-tempered`,
        desc: `Add 2 to the Attacks characteristic of this model's Greenwood Scythe whilst any wounds are allocated to this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Unleash Spites spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Branchwraith: {
    mandatory: { spells: [keyPicker(spells, ['Roused to Wrath'])] },
    effects: [
      BlessingsOfTheForestEffect,
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Roused to Wrath spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Ylthari: {
    mandatory: { spells: [keyPicker(spells, ['The Reaping'])] },
    effects: [
      {
        name: `Vigour and Wrath`,
        desc: `You can reroll wound rolls of 1 for attacks made by this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Ylthari is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and The Reaping spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Ylthari's Guardians": {
    effects: [
      ...MartialMemoriesEffects,
      {
        name: `Vigour and Wrath`,
        desc: `You can reroll wound rolls of 1 for attacks made by this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Tree-Revenants': {
    effects: [
      {
        name: `Scion`,
        desc: `1 model in this unit can be a Scion. Add 2 to the Attacks characteristic of that model's Enchanted Blade. A Scion can be armed with a Protector Glaive instead of an Enchanted Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Glade Banner Bearer`,
        desc: `Whenever a unit that includes any Glade Banner Bearers makes a pile-in move, you can move it up to 6" instead of up to 3".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waypipes`,
        desc: `In your movement phase, a unit that includes any Waypipes can walk the spirit paths instead of making a normal move or retreating. If it does so, remove this unit from the battlefield and set it up anywhere on the battlefield more than 9" from any enemy units.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      ...MartialMemoriesEffects,
    ],
  },
  'Spite-Revenants': {
    effects: [
      {
        name: `Shadestalker`,
        desc: `1 model in this unit can be a Shadestalker. Add 1 to the Attacks characteristic of that model's Cruel Talons and Fangs.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unbridled Malice`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any friendly units with this ability. In addition, reroll successful battleshock tests for enemy units while they are within 3" of any friendly units with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Kurnoth Hunters': {
    effects: [
      {
        name: `Huntmaster`,
        desc: `1 model in this unit can be a Huntmaster. Add 1 to hit rolls for attacks made by that model.`,
        when: [DURING_GAME],
      },
      {
        name: `Envoys of the Everqueen`,
        desc: `If a friendly SYLVANETH HERO uses a command ability, friendly SYLVANETH units wholly within 12" of this unit are treated as being in range of that command ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Tanglethorn Thicket`,
        desc: `At the start of the charge phase, you can say that this unit will sprout thorned branches. If you do so, until the end of the turn, this unit cannot move except to pile in up to 1", but you can add 1 to save rolls for attacks that target this unit.`,
        when: [START_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Tanglethorn Thicket`,
        desc: `If active, you can add 1 to save rolls for attacks that target this unit.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Trample Underfoot`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Sundering Strikes (Greatswords)`,
        desc: `If the unmodified wound roll for an attack made with a Kurnoth Greatsword is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Dryads: {
    effects: [
      {
        name: `Branch Nymph`,
        desc: `1 model in this unit can be a Branch Nymph. Add 1 to the Attacks characteristic of that model's Wracking Talons.`,
        when: [COMBAT_PHASE],
      },
      BlessingsOfTheForestEffect,
      {
        name: `Enrapturing Song`,
        desc: `At the start of your combat phase, pick 1 enemy unit within 3" of this unit. Add 1 to hit rolls for attacks made by this unit that target that enemy unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impenetrable Thicket`,
        desc: `Add 1 to save rolls for attacks that target this unit while it contains 10 or more models.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  "Skaeth's Wild Hunt": {
    mandatory: { spells: [keyPicker(spells, ['Might of Kurnoth'])] },
    effects: [
      {
        name: `Fleet of Foot`,
        desc: `This unit can run and still shoot and/or charge later in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Karthaen`,
        desc: `While Karthaen is still in the unit, this unit is considered a Wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Qulathis the Exile': {
    effects: [
      {
        name: `Strike Unseen`,
        desc: `The cover modifier adds 2 to save rolls vs missile weapons for this model, instead of 1.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Oaken Arrows`,
        desc: `If the unmodified hit roll for an attack made with Winter's Call is 6, inflict 1 mortal wound on the target in addition to normal damage.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Guardian of the Enga'la Weald`,
        desc: `ENGA'LA WEALD is a Glade keyword (this means that this model cannot gain another Glade keyword if it is included in a Sylvaneth army - see the Glades battle trait in Battletome: Sylvaneth).`,
        when: [DURING_GAME],
      },
    ],
  },
  'Warsong Revenant': {
    mandatory: { spells: [keyPicker(spells, ['Unleash Swarm of Spites'])] },
    effects: [
      {
        name: `Alarielle's Song`,
        desc: `Add 1 to the Bravery characteristic of friendly Sylvaneth units wholly within 12" of any models with this ability. Subtract 1 from enemy unit bravery characterisitics while they are within 12" of any models with this ability.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Arboreal Cloak`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to this model. On a 4+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Wyldwood Revenants`,
        desc: `Add 1 to casting, dispelling, and unbinding rolls for this model while it is within 9" of any AWAKENED WILDWOODS.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. Can attempt to cast 2 spells and unbind 1 spell. Knows Arcane Bolt, Mystic Shield and Unleash Swarm of Spites.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
