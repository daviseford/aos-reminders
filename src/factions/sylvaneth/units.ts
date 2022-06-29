import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import scenery from './scenery'
import spells from './spells'

const BlessingsOfTheForestEffect = {
  name: `Blessings of the Forest`,
  desc: `Subtract 1 from hit rolls and wound rolls for attacks that target this unit if it is wholly within 9" of any overgrown or friendly AWAKENED WYLDWOODS.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  shared: true,
}

const TreeLordBaseEffects = [
  {
    name: `Spirit Paths`,
    desc: `At the start of your movement phase, if this unit is wholly within 6" of an overgrown terrain or Awakened Wyldwood in your army, it can walk the spirit paths instead of making a move in that phase. If it does so, remove this unit from the battlefield and set it up wholly within 6" of a different overgrown terrain or AWAKENED WYLDWOOD in your army and more than 9" from any enemy units.`,
    when: [START_OF_MOVEMENT_PHASE],
    shared: true,
  },
  {
    name: `Groundshaker`,
    desc: `You can carry out this monstrous rampage instead of any others with this unit. Pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, the strike-last effect applies to that enemy unit in the following combat phase.`,
    when: [END_OF_CHARGE_PHASE],
    shared: true,
  },
]

const BugRiderEffects = [
  {
    name: `Champion`,
    desc: `1 model in this unit can be a champion. Add 1 to the Attacks characteristic of that model's melee weapons, this has no effect on the mount.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Banner Bearer`,
    desc: `1 in every 3 models in this unit can be a Banner bearer. This unit can pile-in up to 6" instead of 3" while it includes any Standard Bearers.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Musician`,
    desc: `1 in every 3 models in this unit can be a Hornblower. When this unit receives the Rally command it can return 1 slain model for each roll of 5+ instead of only 6 while it includes any Hornblowers.`,
    when: [START_OF_HERO_PHASE],
    shared: true,
  },
  {
    name: `Thrumming with Life`,
    desc: `At the end of each phase, if any models were slain by an attack made by this unit, you can heal all wounds allocated to this unit.`,
    when: [DURING_GAME, WOUND_ALLOCATION_PHASE],
    shared: true,
  },
]
const WarmasterEffect = {
  name: `Warmaster`,
  desc: `If this unit is included in a Sylvaneth army, it is treated as a general even if it is not the model picked to be the army's general.`,
  when: [DURING_GAME],
  shared: true,
}

const Units = {
  'Alarielle The Everqueen': {
    mandatory: {
      spells: [keyPicker(spells, ['Metamorphosis'])],
    },
    effects: [
      {
        name: `Lifebloom`,
        desc: `In your hero phase, you can heal up to 2D6 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lifebloom`,
        desc: `Once per battle, at the end of your hero phase, if this unit has been destroyed, you can roll a dice and add the number of the current battle round to the roll. 
        
        On a 6+, you can set up this unit on the battlefield wholly within 12" of an overgrown terrain feature or friendly Awakened Wyldood, more than 9" from all enemy units and with 8 wounds allocated to it.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Living Battering Ram`,
        desc: `If you carry out a Stomp monstrous ramapge with this unit and the enemy unit you picked has a Wounds characteristic of 1, that enemy unit suffers D6 mortal wounds instead of D3.`,
        when: [END_OF_CHARGE_PHASE],
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
      },
      {
        name: `Swirling Glowspites`,
        desc: `This model can retreat and still shoot and/or charge in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
      {
        name: `Talon of the Dwindling`,
        desc: `Roll a D6 at the end of any phase if any wounds are allocated from this weapon and not negated, and the enemy model has not been slain. On a 6 the enemy model is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Rise of Life`,
        desc: `Once per battle, at the start of your hero phase, you can use this ability. Until the end of that turn, all terrain features on the battlefield that are not already considered to be overgrown are treated as overgrown.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. Can attempt to cast 3 spells and unbind 3 three spells. Knows Arcane Bolt, Mystic Shield and Metamorphosis. If this unit is part of a Sylvaneth army, it knows all of the spells from the Lore of the Deepwood in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Drycha Hamadreth': {
    mandatory: { spells: [keyPicker(spells, ['Primal Terror'])] },
    effects: [
      WarmasterEffect,
      {
        name: `Deadly Infestation`,
        desc: `If the unmodified hit roll for an attack made with a Colony of Flitterfuries or a Swarm of Squirmlings is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound or save roll)`,
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
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly SPITE-REVENANTS units wholly within 18" of this model.`,
        when: [COMBAT_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Spirit of Durthu': {
    effects: [
      ...TreeLordBaseEffects,
      {
        name: `Wrathful Guardian`,
        desc: `Add 1 to the Attacks characteristic of this unit's Guardian Sword while this unit is wholly within 9" of any overgrown terrain feature or friendly Awakened Wyldwoods in your army.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Treelord Ancient': {
    mandatory: {
      spells: [keyPicker(spells, ['Awakening the Wood'])],
      scenery: [keyPicker(scenery, ['Awakened Wyldwood'])],
    },
    effects: [
      ...TreeLordBaseEffects,
      {
        name: `Silent Communion`,
        desc: `Once per battle, in your hero phase, if this unit is on the battlefield, you can setup 1 friendly Awakend Wyldwood terrain feature consisting of 1 scenery piece on the battlefield of that model and more than 3" from all other models, endless spells, invocations, terrain features or objectives, and add it to your army.`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  Treelord: {
    effects: [
      ...TreeLordBaseEffects,
      {
        name: `Lash and Tangle`,
        desc: `If an attack made with a melee weapon by this unit scores a hit, models in the target unit cannot make pile-in moves until the end of that turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Arch-Revenant': {
    mandatory: { command_abilities: [keyPicker(command_abilities, ['Call to Battle'])] },
    effects: [
      {
        name: `Crescent Shield`,
        desc: `At the start of the combat phase, say whether this unit is adopting a defensive or aggressive stance. 
        
        Defensive: It has a 4+ ward until the end of that phase.
        Aggressive: Add 1 to the Attacks characteristic of this unit's Revenant's Glaive until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Crescent Shield`,
        desc: `If this unit took up a defensive stance, it has a 4+ ward.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Crescent Shield`,
        desc: `If this unit took up an aggressive stance, add 1 to the Attacks characteristic of this unit's Revenant's Glaive.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Champion of Kurnoth`,
        desc: `Add 1 to wound rolls for attacks made by friendly KURNOTH HUNTERS units while they are wholly within 12" of any friendly units with this ability.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'The Lady of Vines': {
    mandatory: { spells: [keyPicker(spells, ['Aspect of the Everqueen'])] },
    effects: [
      WarmasterEffect,
      {
        name: `Writhing Vines`,
        desc: `If this unit is within 3" of any enemy units, pick 1 of the following:

        Protective Barrier: Subtract 1 from hit rolls that target this unit until the end of the phase.
        Ensnare Foes: Add 1 to hit rolls for attacks made by this unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Roused to Wrath`,
        desc: `Once per battle, if this unit is on the battlefield you can say it will call its allies forth. Roll a dice, on a 2+ you can summon 1 unit of 10 Dryads. The unit must be setup wholly within 9" of an overgrown terrain feature or Awakened Wylwood and 9" away from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Verdian Crown`,
        desc: `Friendly Sylvaneth units wholly within 6" of this unit are treated as being wholly within 6" of an Awakened Wyldwood in your army.`,
        when: [DURING_ROUND],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  Branchwych: {
    mandatory: { spells: [keyPicker(spells, ['Unleash Spites'])] },
    effects: [
      {
        name: `Fury of the Forest`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made by this model while it is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood.`,
        when: [COMBAT_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
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
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  "Ylthari's Guardians": {
    effects: [
      {
        name: `Martial Memories`,
        desc: `Once per turn, this unit can receive the All-out Attack or All-out Defence command without the command being issued and without a command point being spent.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
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
        desc: `1 model in this unit can be a Scion. Add 1 to the Attacks characteristic of that model's melee weapon. A Scion can be armed with a Protector Glaive instead of an Enchanted Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Glade Banner Bearer`,
        desc: `Whenever a unit that includes any Glade Banner Bearers makes a pile-in move, you can move it up to 6" instead of up to 3".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waypiper`,
        desc: `At the start of your movement phase, a unit that includes any Waypipes can walk the spirit paths instead of making a normal move or retreating. If it does so, remove this unit from the battlefield and set it up anywhere on the battlefield more than 9" from any enemy units.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Martial Memories`,
        desc: `Once per battle round, this unit can receive the All-out Attack or All-out Defence command without the command being issued and without a command point being spent.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Spite-Revenants': {
    effects: [
      {
        name: `Shadestalker`,
        desc: `Add 1 to the Attacks characteristic of that model's Cruel Talons and Fangs.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unbridled Malice`,
        desc: `If the unmodified hit roll for an attack made with Cruel Talons and Fangs is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Kurnoth Hunters': {
    effects: [
      {
        name: `Huntmaster`,
        desc: `1 model in this unit can be a Huntmaster. Add 1 to Attack characteristic made by that model.`,
        when: [DURING_GAME],
      },
      {
        name: `Envoys of the Everqueen`,
        desc: `While this unit is contesting an objective, friendly SYLVANETH units wholly within 6" of that objective are treated as being wholly within 6" of an overgrown terrain feature.`,
        when: [DURING_GAME],
      },
      {
        name: `Tanglethorn Thicket (Sythes)`,
        desc: `If any models in an enemy unit finish a pile-in move within 3" of any friendly units with this ability, that enemy unit suffers 1 mortal wound after it finishes its pile-in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Trample Underfoot`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Sundering Strikes (Greatswords)`,
        desc: `If the unmodified wound roll for an attack made with a Kurnoth Greatsword is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends.`,
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
        name: `Karthaen (Wizard)`,
        desc: `While Karthaen is still in the unit, this unit is considered a Wizard and can cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Skaeth`,
        desc: `Skaeth has a Wounds characteristic of 2.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Qulathis the Exile': {
    effects: [
      {
        name: `Strike Unseen`,
        desc: `The cover modifier adds 2 to save rolls vs missile weapons for this model, instead of 1.`,
        when: [SAVES_PHASE],
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
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Arboreal Cloak`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Wyldwood Revenants`,
        desc: `Add 1 to casting, dispelling, and unbinding rolls for this model while it is within 9" of any overgrown terrain or friendly AWAKENED WILDWOODS.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. Can attempt to cast 2 spells and unbind 1 spell. Knows Arcane Bolt, Mystic Shield and Unleash Swarm of Spites.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spiterider Lancers': {
    effects: [
      ...BugRiderEffects,
      {
        name: `Descent of the Spiteriders`,
        desc: `The strike-first effect applies to this unit if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Revenant Seekers': {
    effects: [
      ...BugRiderEffects,
      {
        name: `Harvesters of the Lamentiri`,
        desc: `Once per turn, at the end of your movement phase, pick 1 friendly SYLVANETH unit with a wounds characteristic of 5 or less that is wholly within 12" of this unit and roll a dice. On a 2+, you can return 1 slain model to that unit. You cannot pick the same unit to benefit from this ability more than once per turn.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Gossamid Archers': {
    effects: [
      {
        name: `Flitwing Scion`,
        desc: `1 model in this unit can be a Flitwing Scion. Add 1 to the Attacks characteristic of that model's Gossamid Bow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Larval Shafts`,
        desc: `Unmodified hit rolls of 6 made with a Gossamid Bow inflicts D3 mortal wounds and the attack sequence ends.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Forest Fighters`,
        desc: `If this unit has 2 or more models, it is coherent if each model in the unit is within 2" horizontally of at least 1 other model in the unit instead of 1".`,
        when: [DURING_GAME],
      },
      {
        name: `Zephyrspites`,
        desc: `After this unit has received the Unleash Hell command and all of its shooting attacks have been resolved, if this unit is within 3" of any enemy units, you can roll a dice. On a 2+, this unit can retreat.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
