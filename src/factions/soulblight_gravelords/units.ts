import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericSpells } from 'generic_rules'
import GenericBattleTraits from 'generic_rules/battle_traits'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import spells from './spells'

const TheHungerEffect = {
  name: `The Hunger`,
  desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this unit's attacks in that phase, you can heal up to D3 wounds allocated to this unit.`,
  when: [END_OF_COMBAT_PHASE],
}

const NightmaresMiasmaEffect = {
  name: `Nightmares Miasma`,
  desc: `While an enemy unit is within 3" of any friendly models with this ability, worsen the Rend characteristic of that unit's melee weapons by 1 (to a minimum of '-')`,
  when: [COMBAT_PHASE],
}

const UndeniableImpulseEffect = {
  name: `Undeniable Impulse`,
  desc: `At the start of your hero phase, roll a dice for this model. If the roll is equal to or less than the number of the current battle round, until your next hero phase, this model can run and still charge later in the same turn. However, this model cannot use command abilities until your next hero phase.`,
  when: [START_OF_HERO_PHASE],
}

const WailOfTheDamnedEffect = {
  name: `Wail of the Damned`,
  desc: `Do not use the attack sequence for an attack made with a Wail of the Damned. Instead, roll a dice for each enemy unit within range of this model's Wail of the Damned. On a 4+, that unit suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
}

const FrightfulTouchEffect = {
  name: `Frightful Touch`,
  desc: `If the unmodified hit roll for an attack made with this model's Spectral Claws and Blades is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
}

const Units = {
  'Nagash, Supreme Lord of the Undead': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Supreme Lord of the Undead'])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Hand of Dust', 'Soul Stealer']), ...GenericSpells],
    },
    effects: [
      {
        name: `Alakanash, the Staff of Power`,
        desc: `Add the Staff of Power value shown on this model's damage table to casting, dispelling and unbinding rolls for this model. In addition, this model can attempt to cast Arcane Bolt and Mystic Shield any number of times in the same hero phase, even if another WIZARD has already attempted to cast the spell in that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Invocation of Nagash`,
        desc: `At the start of your hero phase, if this model is on the battlefield, you can pick up to 5 different friendly SUMMONABLE units or friendly OSSIARCH BONEREAPERS units in any combination. For each of those units, you can either heal up to 3 wounds that have been allocated to that unit or, if no wounds have been allocated to it, you can return number of slain models to that unit with a combined Wounds characteristic of 3 or less.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with this model's Spectral Claws and Daggers is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Morikhane`,
        desc: `Roll a dice each time you allocate a mortal wound to this model. On a 1-3, nothing happens. On a 4-5, that mortal wound is negated. On a 6, that mortal wound is negated and the attacking unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Nine Books of Nagash`,
        desc: `The Nine Books of Nagash allow Nagash to cast extra spells in your hero phase and unbind extra spells in the enemy hero phase. The number of extra spells he can attempt to cast or unbind is shown on this model's damage table.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `Nagash is a WIZARD. He can attempt to cast 3 spells in your hero phase and attempt to unbind 3 spells in the enemy hero phase (he can also attempt to cast and unbind extra spells due to the Nine Books of Nagash ability). He knows the Arcane Bolt, Mystic Shield, Hand of Dust and Soul Stealer spells.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Mannfred von Carstein': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Vigour of Undeath'])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Wind of Death']), ...GenericSpells],
    },
    effects: [
      TheHungerEffect,
      {
        name: `Armour of Templehof`,
        desc: `The first wound or mortal wound allocated to this model in each phase is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Sword of Unholy Power`,
        desc: `If any enemy models are slain by wounds inflicted by this model's Gheistvor, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly SOULBLIGHT GRAVELORDS SUMMONABLE units while they are wholly within 12" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mortarch of Night`,
        desc: `At the start of the combat phase, if this model is within 3" of any enemy units, you can remove this model from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with this model's Spectral Claws and Daggers is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Neferata: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ["Twilight's Allure"])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Dark Mist'])],
    },
    effects: [
      {
        name: `Dagger of Jet`,
        desc: `At the end of any phase, if any wounds inflicted by this model's Akmet-har in that phase were allocated to an enemy HERO and not negated, and that enemy model has not been slain, roll a dice. On a 5+, that enemy HERO is slain.`,
        when: [WOUND_ALLOCATION_PHASE, END_OF_COMBAT_PHASE],
      },
      {
        name: `Mortarch of Blood`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that phase, you can heal up to D6 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with this model's Spectral Claws and Daggers is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Prince Vhordrai': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Fist of Nagash'])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Quickblood'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `Chalice of Blood`,
        desc: `Once per battle, in your hero phase, you can heal up to D6 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodlance Charge`,
        desc: `Add 2 to the Damage characteristic of this model's Bloodlance and improve the Rend characteristic of that weapon by 1 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Breath of Shyish`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 9" of this model that is visible to it and roll a dice. On a 3+, that unit suffers a number of mortal wounds equal to the Breath of Shyish value shown on this model's damage table.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'Prince Duvalle': {
    mandatory: {
      spells: [keyPicker(spells, ['Invigorating Aura', 'Fiendish Lure'])],
    },
    effects: [TheHungerEffect],
  },

  'The Crimson Court': {
    effects: [
      TheHungerEffect,
      {
        name: `Vampiric Agility`,
        desc: `When this unit makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  'Lauka Vai': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['A Queen Amongst Monsters'])],
      spells: [keyPicker(spells, ['Invigorating Aura', "Death's Downpour"])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `Champion of the Avengorii`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 5+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      NightmaresMiasmaEffect,
      UndeniableImpulseEffect,
    ],
  },

  'Vengorian Lords': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Festering Feast'])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Clotted Deluge'])],
    },
    effects: [NightmaresMiasmaEffect, UndeniableImpulseEffect, TheHungerEffect],
  },

  'Belladamma Volga': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Pack Alpha'])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Under a Killing Moon', 'Lycancurse'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `First of the Vyrkos`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `First of the Vyrkos`,
        desc: `Roll a dice before you allocate wound or mortal wound to this model if it is within 3" of any friendly DIRE WOLVES units. On a 3+, that wound or mortal wound is allocated to 1 of those units instead of this model.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  'Lady Annika': {
    effects: [
      {
        name: `Supernatural Speed`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Kiss of the Blade Proboscian`,
        desc: `At the end of a phase, if any enemy models were slain by wounds inflicted by this model's attacks in that phase, you can heal all wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },

  Kritza: {
    effects: [
      {
        name: `Scurrying Retreat`,
        desc: `If this model has been slain, at the end of your movement phase, roll a dice. On a 4+, a new model identical to the one that was slain is added to your army. Set up this model anywhere on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Nauseating Aroma`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Radukar the Wolf': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Call to the Hunt'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `Supernatural Strength`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this model is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Loyal to the Last`,
        desc: `Roll a dice before you allocate a wound or mortal wound to this model while it is within 3" of any friendly KOSARGI NIGHTGUARD units. On a 2+, that wound or mortal wound is allocated to 1 of those units instead of this model.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  'Radukar the Beast': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Call to the Hunt', 'Mustering Howl'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `Bounding Charge`,
        desc: `This model can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Supernatural Reflexes`,
        desc: `Subtract 1 from hit rolls for attacks that target this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Unleashed Ferocity`,
        desc: `If the unmodified hit roll for an attack made with this model's Blood-slick Claws is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Gorslav the Gravekeeper': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Arise! Arise!'])],
    },
    effects: [
      {
        name: `Keeper of the Corpse-gardens`,
        desc: `Roll a dice before you allocate wound or mortal wound to this model if it is within 3" of any friendly DEADWALKERS units. On a 4+, that wound or mortal wound is allocated to 1 units instead of this model.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  'Torgillius the Chamberlain': {
    mandatory: {
      spells: [keyPicker(spells, ['Invigorating Aura', 'Necrotising Bolt'])],
    },
    effects: [
      {
        name: `Mastery of Grave-sand`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this unit. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Trusted Lieutenant`,
        desc: `At the start of your hero phase, if this model is within 3" of a friendly RADUKAR THE WOLF, roll a dice. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Vyrkos Blood-born': {
    effects: [
      {
        name: `Shadowfast`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this unit. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  'Watch Captain Halgrim': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Disciplined Advance'])],
    },
    effects: [
      {
        name: `Cursed Halberd`,
        desc: `If the unmodified hit roll for an attack made with a Cursed Halberd is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Vargskyr: {
    effects: [
      {
        name: `Gnarled Hide`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Bounding Leaps`,
        desc: `You can attempt to charge with this model if it is within 18" of the enemy instead of 12". Roll 3D6 instead of 2D6 when making a charge roll for this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Kosargi Nightguard': {
    effects: [
      {
        name: `Deathly Vigour`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this unit. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Servants Even in Death`,
        desc: `Add 1 to the Attacks characteristic of this unit's Bardiches while it is wholly within 12" of a friendly RADUKAR THE WOLF.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Vampire Lord on Zombie Dragon': {
    mandatory: {
      spells: [keyPicker(spells, ['Invigorating Aura', 'Curse of Exsanguination'])],
    },
    effects: [
      ...GenericBattleTraits.ZombieDragon, // Pestilential Breath
      TheHungerEffect,
      {
        name: `Deathlance Charge`,
        desc: `Add 2 to the Damage characteristic of this model's Deathlance and improve the Rend characteristic of that weapon by 1 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Blood Knights': {
    effects: [
      TheHungerEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Kastellan. Add 1 to the Attacks characteristic of a Kastellan's Templar Lance or Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Standard Bearer. You can reroll rolls of 1 for the Deathless Minions battle trait for this unit while it has any Standard Bearers.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Riders of Ruin`,
        desc: `In your movement phase, if this unit is within 3" of an enemy unit, it can make a normal move. If it does so, it can pass across other models with a Wounds characteristic of 3 or less (that do not have a mount) in the same manner as a model that can fly. After this unit has made a normal move, roll a dice for each enemy unit that has any models passed across by any models in this unit. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Martial Fury`,
        desc: `Add 1 to the Damage characteristic of this unit's Templar Lances or Blades if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Vargheists: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Vargoyle. Add 1 to the Attacks characteristic of a Vargoyle's Murderous Fangs and Talons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Death's Descent`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is circling high above as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from any enemy units. At the start of the fourth battle round, any models that are still in reserve are slain.`,
        when: [DURING_SETUP],
      },
      {
        name: `Death's Descent`,
        desc: `If this unit was placed in reserve during setup, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Death's Descent`,
        desc: `At the start of the fourth battle round, any models that are still in reserve are slain.`,
        when: [TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Blood-maddened Feeding Frenzy`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Vampire Lord': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Crimson Feast'])],
      spells: [keyPicker(spells, ['Invigorating Aura'])],
    },
    effects: [TheHungerEffect],
  },

  'Bloodseeker Palanquin': {
    mandatory: {
      spells: [keyPicker(spells, ['Invigorating Aura', 'Blood Siphon'])],
    },
    effects: [
      {
        name: `A Fine Vintage`,
        desc: `If an enemy HERO is slain within 9" of this model, add 1 to the Attacks characteristic of melee weapons used by friendly VAMPIRE units wholly within 12" of this model until your next hero phase.`,
        when: [COMBAT_PHASE, WOUND_ALLOCATION_PHASE],
      },
      FrightfulTouchEffect,
      WailOfTheDamnedEffect,
    ],
  },

  'Mortis Engine': {
    effects: [
      WailOfTheDamnedEffect,
      FrightfulTouchEffect,
      {
        name: `The Reliquary`,
        desc: `Once per battle, in your hero phase, you can say that this model will unleash the energies of its reliquary. If you do so, roll a dice for each unit within 12" of this model. On a 2+, that unit suffers D3 mortal wounds. DEATH units are not affected by this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bound Necromancer`,
        desc: `Add 1 to casting rolls for friendly SOULBLIGHT GRAVELORDS WIZARDS wholly within 12" of any friendly models with this ability.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Coven Throne': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Tactical Insight'])],
      spells: [keyPicker(spells, ['Invigorating Aura', 'Shudder'])],
    },
    effects: [
      TheHungerEffect,
      FrightfulTouchEffect,
      {
        name: `Scrying Pool`,
        desc: `Once per turn, you can reroll 1 hit roll or 1 wound roll for an attack made by this model or 1 save roll for an attack that targets this model.`,
        when: [COMBAT_PHASE, SAVES_PHASE],
      },
    ],
  },

  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
}

export default tagAs(Units, 'unit')
