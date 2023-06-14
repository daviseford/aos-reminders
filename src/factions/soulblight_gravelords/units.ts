import { keyPicker, tagAs } from 'factions/metatagger'
import { Nagash } from 'factions/nighthaunt/units'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_ANY_PHASE,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import spells from './spells'

const VampiricAgilityEffect = {
  name: `Vampiric Agility`,
  desc: `When this unit makes a move, it can pass across terrain features in the same manner as a unit that can fly.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const CallToTheHuntEffect = {
  name: `Call to the Hunt`,
  desc: `In the combat phase, if this unit made a charge move in the same turn, add 1 to the Attacks characteristic of melee weapons used by friendly VYRKOS SUMMONABLE units while they are wholly within 12" of this unit.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `You can reroll ward rolls of 1 for this unit for the purposes of the Deathless Minions battle trait if this unit includes any Standard Bearers.`,
  when: [WARDS_PHASE],
  shared: true,
}
const BeheadingStrikeEffect = {
  name: `Beheading Strike`,
  desc: `If the unmodified hit roll for an attack made with a Baleful Tomb Blade is 6, that attack causes 2 mortal wounds to the target in addition to any damage it inflicts.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const CursedWeaponsEffect = {
  name: `Cursed Weapons`,
  desc: `If the unmodified wound roll for an attack made with a melee weapon by this unit is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const LocusOfUndeathEffect = {
  name: `Locus of Undeath`,
  desc: `If the unmodified wound roll for an attack made by a friendly DEADWALKER ZOMBIES unit wholly within 12" of any friendly units with this ability is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const TerrorEffect = {
  name: `Terror`,
  desc: `Enemy units cannot receive the Inspiring Presence command while they are within 3" of any friendly units with this ability.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const TheHungerEffect = {
  name: `The Hunger`,
  desc: `Each time this unit fights, after all of its attacks have been resolved, you can heal up to a number of wounds allocated to this unit equal to the number of wounds and mortal wounds caused by those attacks that were allocated to enemy units (to a maximum of 6).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const NightmaresMiasmaEffect = {
  name: `Nightmares Miasma`,
  desc: `While an enemy unit is within 3" of any friendly units with this ability, worsen the Rend characteristic of that unit's melee weapons by 1 (to a minimum of '-').`,
  when: [COMBAT_PHASE],
  shared: true,
}
const WailOfTheDamnedEffect = {
  name: `Wail of the Damned`,
  desc: `In your shooting phase, roll a dice for each enemy unit within range of this unit's Wail of the Damned ability. The range of this unit's Wail of the Damned ability is shown on its damage table. On a 4+, that unit suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const DeathlyChargeEffect = {
  name: `Deathly Charge`,
  desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit. If you do so, roll 2 dice for each model in this unit. For each 5+, the target suffers 1 mortal wound.`,
  when: [CHARGE_PHASE],
  shared: true,
}

const Units = {
  ...Nagash,

  'Mannfred von Carstein': {
    mandatory: {
      spells: [keyPicker(spells, ['Wind of Death'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      TheHungerEffect,
      {
        name: `Armour of Templehof`,
        desc: `The first wound or mortal wound caused to this unit in each phase is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Sword of Unholy Power`,
        desc: `Each time this unit fights, any wounds caused by this unit's Ebon Claws, Sickle-glaive and Spectral Claws and Daggers must be allocated first, followed by any wounds caused by this unit's Gheistvor. If any enemy models are slain by wounds caused by this unit's Gheistvor, until the end of the phase, add 1 to the Attacks characteristic of melee weapons used by friendly LEGION OF NIGHT SUMMONABLE units while they are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mortarch of Night`,
        desc: `The strike-first effect applies to this unit if it makes a charge move in the same turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Mortarch of Night`,
        desc: `If this unit receives the Redeploy command, it can attempt a charge instead of making a D6" move.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  Neferata: {
    mandatory: {
      spells: [keyPicker(spells, ['Dark Mist'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Dagger of Jet`,
        desc: `At the end of any phase, if any wounds caused by this unit's Akmet-har were allocated to an enemy HERO in that phase and that enemy HERO has not been slain, roll a dice. On a 5+, that enemy HERO is slain.`,
        when: [END_OF_ANY_PHASE],
      },
      {
        name: `Twilight's Allure`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target friendly LEGION OF BLOOD units wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mortarch of Blood`,
        desc: `At the end of deployment, before determining control of objectives, you can pick up to 3 friendly LEGION OF BLOOD units on the battlefield. First, remove this unit from the battlefield and set it up again wholly within your territory. Then, remove those friendly LEGION OF BLOOD units from the battlefield and set them up again wholly within your territory.`,
        when: [END_OF_COMBAT_PHASE],
      },
      TheHungerEffect,
    ],
  },

  'Prince Vhordrai': {
    mandatory: {
      spells: [keyPicker(spells, ['Quickblood'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `Fist of Nagash`,
        desc: `Once per turn, if this unit is on the battlefield when a friendly KASTELAI VAMPIRE unit gains an ability with the Might of the Crimson Keep battle trait, you can pick 1 other friendly KASTELAI VAMPIRE unit wholly within 24" of this unit that has not already gained that ability and that has not gained any other abilities with the Might of the Crimson Keep battle trait in that turn. That unit gains the same ability.`,
        when: [END_OF_COMBAT_PHASE],
      },
      TerrorEffect,
      {
        name: `Bloodlance Charge`,
        desc: `This unit's Bloodlance has a Rend characteristic of -3 and a Damage characteristic of 3 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Prince Duvalle': {
    mandatory: {
      spells: [keyPicker(spells, ['Fiendish Lure'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `'Come Then, Amuse Us'`,
        desc: `At the start of the combat phase, if this unit and any friendly THE CRIMSON COURT models are within 3" of the same enemy unit, your opponent must pick 1 of the following effects to apply until the end of that phase:
        
        - Improve the Rend characteristic of this unit's Possessed Blade by 1.
        
        - This unit cannot be picked as the target of attacks made with melee weapons.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'The Crimson Court': {
    effects: [
      TheHungerEffect,
      {
        name: `Gorath the Enforcer`,
        desc: `Gorath the Enforcer has a Wounds characteristic of 4.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      VampiricAgilityEffect,
    ],
  },

  'Lauka Vai': {
    mandatory: {
      spells: [keyPicker(spells, ["The Queen's Dictat"])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `A Queen Amongst Monsters`,
        desc: `Once per turn, at the end of the charge phase, you can pick 1 friendly AVENGORII MONSTER wholly within 12" of this unit. You can carry out 2 different monstrous rampages with that MONSTER in that phase instead of 1.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Champion of the Avengorii`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 5+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      NightmaresMiasmaEffect,
    ],
  },

  'Vengorian Lord': {
    mandatory: {
      spells: [keyPicker(spells, ['Cursed Reflection'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      NightmaresMiasmaEffect,
      TheHungerEffect,
      {
        name: `Festering Feast`,
        desc: `Once per turn, at the end of the combat phase, you can pick 1 friendly SOULBLIGHT GRAVELORDS MONSTER that is not a HERO, that is wholly within 12" of this unit and that destroyed any enemy units in that phase. Heal all wounds allocated to that MONSTER.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },

  'Belladamma Volga': {
    mandatory: {
      spells: [keyPicker(spells, ['Under a Killing Moon', 'Lycancurse'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `First of the Vyrkos`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `First of the Vyrkos`,
        desc: `If this unit is within 3" of any friendly VYRKOS DIRE WOLVES units, before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, roll a dice. On a 3+, that wound or mortal wound is allocated to 1 of those friendly units instead of this unit.`,
        when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
      },
    ],
  },

  'Lady Annika': {
    effects: [
      TheHungerEffect,
      {
        name: `Supernatural Speed`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Supernatural Speed`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit anywhere within enemy territory and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Supernatural Speed`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit anywhere within enemy territory and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Kiss of the Blade Proboscian`,
        desc: `At the end of any phase, if any wounds caused by attacks made with this unit's Blade Proboscian in that phase were allocated to an enemy HERO or MONSTER, and that enemy unit has not been destroyed, worsen the Save characteristic of that unit by 1 (to a minimum of 6+) for the rest of the battle.`,
        when: [END_OF_ANY_PHASE],
      },
    ],
  },

  Kritza: {
    effects: [
      TheHungerEffect,
      {
        name: `Scurrying Retreat`,
        desc: `In the combat phase, when you pick this unit to fight, you can say that it will make a scurrying retreat. If you do so, this unit retreats instead of fighting.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Verminous Court`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 1" of this unit that has an artefact of power and roll a dice. On a 3+, that artefact of power can no longer be used (if it was used to enhance a weapon, that weapon reverts to its normal form).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Radukar the Wolf': {
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      CallToTheHuntEffect,
      {
        name: `Loyal to the Last`,
        desc: `If this unit is within 3" of a friendly KOSARGI NIGHTGUARD unit, before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, roll a dice. On a 3+, that wound or mortal wound is allocated to that friendly unit instead of this unit.`,
        when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
      },
    ],
  },

  'Radukar the Beast': {
    effects: [
      TheHungerEffect,
      {
        name: `Bounding Charge`,
        desc: `This unit can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      CallToTheHuntEffect,
      {
        name: `Supernatural Reflexes`,
        desc: `Subtract 1 from hit rolls and wound rolls for attacks that target this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Unleashed Ferocity`,
        desc: `If the unmodified hit roll for an attack made with this unit's Blood-slick Claws is 6, the target suffers 2 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Beast Will Out`,
        desc: `This unit cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `The Beast Will Out`,
        desc: `At the end of any phase, if any wounds or mortal wounds were allocated to this unit in that phase, and this unit is more than 12" from all enemy units, this unit can move up to D6".`,
        when: [END_OF_ANY_PHASE],
      },
    ],
  },

  'Gorslav the Gravekeeper': {
    effects: [
      {
        name: `Keeper of the Corpse-gardens`,
        desc: `If this unit is within 3" of any friendly VYRKOS DEADWALKER ZOMBIES units, before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, roll a dice. On a 2+, that wound or mortal wound is allocated to 1 of those friendly units instead of this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Arise! Arise!`,
        desc: `Once per turn, at the end of your movement phase, you can pick 1 friendly VYRKOS DEADWALKER ZOMBIES unit that has been destroyed. A new replacement unit with half of the models from the unit that was destroyed (rounding up) is added to your army. Replacement units must be set up wholly within 9" of this unit and more than 9" from all enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  'Torgillius the Chamberlain': {
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Trusted Lieutenant`,
        desc: `Friendly VYRKOS SUMMONABLE units have a ward of 5+ while they are wholly within 12" of this unit.`,
        when: [WARDS_PHASE],
      },
    ],
  },

  'Vyrkos Blood-born': {
    effects: [
      {
        name: `Shadowfast`,
        desc: `After deployment but before the first battle round begins, you can move this unit up to 10". If both players can move units before the first battle round begins, they must roll off and the winner chooses who moves their units first.`,
        when: [END_OF_SETUP],
      },
      VampiricAgilityEffect,
      TheHungerEffect,
    ],
  },

  'Watch Captain Halgrim': {
    effects: [
      {
        name: `Cursed Halberd`,
        desc: `If the unmodified hit roll for an attack made with a Cursed Halberd is 6, that attack causes 2 mortal wounds to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Disciplined Advance`,
        desc: `This unit can issue the At the Double command up to 3 times to friendly VYRKOS DEATHRATTLE units in the same phase. If it does so, no command points are spent the second and third times this unit issues that command in that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  Vargskyr: {
    effects: [
      {
        name: `Bounding Leaps`,
        desc: `You can attempt a charge with this unit if it is within 18" of an enemy unit instead of 12". In addition, roll 3D6 instead of 2D6 when making a charge roll for this unit.`,
        when: [CHARGE_PHASE],
      },
      TheHungerEffect,
    ],
  },

  'Kosargi Nightguard': {
    effects: [
      {
        name: `Deathly Vigour`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `A Pact Maintained`,
        desc: `Add 1 to the Attacks characteristic of this unit's Bardiches while it is wholly within 12" of a friendly RADUKAR THE WOLF or RADUKAR THE BEAST.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Vampire Lord on Zombie Dragon': {
    mandatory: {
      spells: [keyPicker(spells, ['Curse of Exsanguination'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `Deathlance Charge`,
        desc: `This unit's Deathlance has a Rend characteristic of -3 and a Damage characteristic of 3 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      TerrorEffect,
    ],
  },

  'Blood Knights': {
    effects: [
      TheHungerEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Kastellan. Add 1 to the Attacks characteristic of that model's Templar Lance or Templar Blade.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Riders of Ruin`,
        desc: `Models in this unit can pass across other models with a Wounds characteristic of 3 or less in the same manner as a model that can fly. After this unit has moved, roll a dice for each enemy unit that has any models it passed across. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Martial Fury`,
        desc: `Add 1 to the Damage characteristic of this unit's melee weapons if this unit made a charge move in the same turn. This ability has no effect on attacks made by this unit's mounts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Vargheists: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Vargoyle. Add 1 to the Attacks characteristic of that model's Murderous Fangs and Talons.`,
        when: [COMBAT_PHASE],
      },
      TheHungerEffect,
      {
        name: `Death's Descent`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is circling high above as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Death's Descent`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Blood-maddened Frenzy`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Vampire Lord': {
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `Crimson Feast`,
        desc: `Once per turn, at the start of the combat phase, you can pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit wholly within 12" of this unit. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase. The same unit cannot benefit from this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Bloodseeker Palanquin': {
    mandatory: {
      spells: [keyPicker(spells, ['Blood Siphon'])],
    },
    effects: [
      TheHungerEffect,
      {
        name: `A Promising Concoction`,
        desc: `The first time an enemy HERO is slain by an attack made by this unit, for the rest of the battle, add 1 to the Attacks characteristic of melee weapons used by friendly VAMPIRE units while they are wholly within 12" of this unit, and you can carry out 2 different heroic actions with this unit at the start of the hero phase instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      WailOfTheDamnedEffect,
      GenericEffects.WizardOneSpellEffect,
    ],
  },

  'Mortis Engine': {
    effects: [
      WailOfTheDamnedEffect,
      {
        name: `The Reliquary`,
        desc: `Each time a friendly SOULBLIGHT GRAVELORDS WIZARD successfully casts a spell that is not unbound, unbinds a spell or dispels an endless spell, place 1 reliquary counter beside this unit (to a maximum of 6). Once per battle, in your hero phase, you can say that this unit will unleash the energies of its reliquary. If you do so, each enemy unit within 6" of this unit suffers a number of mortal wounds equal to the number of reliquary counters beside this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Nexus of Death Energy`,
        desc: `Each time you pick a friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit wholly within 12" of this unit using the Deathly Invocation battle trait, you can either heal up to D3+3 wounds allocated to that unit instead of 3 or, if no wounds have been allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic of D3+3 or less instead of 3 or less.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Coven Throne': {
    mandatory: {
      spells: [keyPicker(spells, ['Undying Servitude'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `Tactical Insight`,
        desc: `This unit can issue the same command up to 2 times in the same phase. If it does so, each command must be received by a friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit. No command point is spent the second time this unit issues that command in that phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Scrying Pool`,
        desc: `If you take the first turn in the current battle round, this unit can attempt to cast 1 extra spell in your hero phase. If you take the second turn in the current battle round, you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },

  Necromancer: {
    mandatory: {
      spells: [keyPicker(spells, ["Vanhel's Danse Macabre"])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Undead Minions`,
        desc: `If this unit is within 3" of any friendly SOULBLIGHT GRAVELORDS SUMMONABLE units, before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, roll a dice. On a 4+, that wound or mortal wound is allocated to 1 of those friendly units instead of this unit.`,
        when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
      },
    ],
  },

  'Deadwalker Zombies': {
    effects: [
      {
        name: `Dragged Down and Torn Apart`,
        desc: `Roll a dice each time a model in this unit is slain by an attack made with a melee weapon. On a 5+, the attacking unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Newly Dead`,
        desc: `At the end of the combat phase, you can roll a dice for each enemy model that was slain by wounds caused by this unit's attacks in that phase. For each 2+, you can add 1 Deadwalker Zombie model to this unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },

  'Corpse Cart': {
    effects: [
      {
        name: `Shyishan Relic`,
        desc: `This unit can have an Unholy Lodestone or a Balefire Brazier.

        - Add 1 to casting rolls for friendly SOULBLIGHT GRAVELORDS WIZARDS wholly within 12" of any friendly units that have an Unholy Lodestone.

        - Subtract 1 from casting rolls for enemy WIZARDS within 12" of any friendly units that have a Balefire Brazier. `,
        when: [HERO_PHASE],
      },
      LocusOfUndeathEffect,
    ],
  },

  'Zombie Dragon': {
    effects: [...GenericEffects.ZombieDragon],
  },

  Terrorgheist: {
    effects: [...GenericEffects.Terrorgheist],
  },

  'Wight King': {
    effects: [
      BeheadingStrikeEffect,
      {
        name: `Lord of Shambling Bones`,
        desc: `Once per turn, at the start of your hero phase, you can pick 1 friendly Deathrattle Skeletons unit or Grave Guard unit wholly within 12" of this unit. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Wight King on Skeletal Steed': {
    effects: [
      {
        name: `The King's Charge`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Lord of Trampling Bones`,
        desc: `You can reroll charge rolls for friendly BLACK KNIGHTS units wholly within 12" of this unit. In addition, if a friendly BLACK KNIGHTS unit finishes a charge move wholly within 12" of this unit, the effect of its Deathly Charge ability is triggered on each 4+ instead of each 5+.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Black Knights': {
    effects: [
      DeathlyChargeEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hellknight. Add 1 to the Attacks characteristic of that model's Barrow Lance.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Hornblower. Treat charge rolls of less than 6 for this unit as 6 if it includes any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Grave Guard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Seneschal. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Hornblower. Treat charge rolls of less than 6 for this unit as 6 if it includes any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
      CursedWeaponsEffect,
      {
        name: `Shields`,
        desc: `If this unit is armed with Wight Blades and Crypt Shields, it has a Save characteristic of 4+ instead of 5+.`,
        when: [SAVES_PHASE],
      },
    ],
  },

  'Deathrattle Skeletons': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Skeleton Champion. Add 1 to the Attacks characteristic of that model's Ancient Weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Skeleton Legion`,
        desc: `At the start of the combat phase, roll a dice for each slain model from this unit. On a 4+, you can return 1 slain model to this unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Tide of Bones and Blades`,
        desc: `Improve the Rend characteristic of this unit's melee weapons by 1 if the number of models in this unit is greater than the number of models in the target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'The Sepulchral Guard': {
    effects: [
      {
        name: `The Sepulchral Warden`,
        desc: `The Sepulchral Warden has a Wounds characteristic of 3.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Sepulchral Warden`,
        desc: `At the start of your hero phase, if this model is on the battlefield, you can return D3 slain models to this unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Frightening Speed`,
        desc: `You can reroll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Frightening Speed`,
        desc: `This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Serve in Death`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Dire Wolves': {
    effects: [
      {
        name: `Champion`,
        desc: `1 in every 10 models in this unit must be a Doom Wolf. Add 1 to the Attacks characteristic of that model's Rotting Fangs and Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `On the Hunt`,
        desc: `This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Fell Bats': {
    effects: [
      TheHungerEffect,
      {
        name: `Single-minded Ferocity`,
        desc: `This unit can retreat and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Single-minded Ferocity`,
        desc: `At the end of any phase, if any enemy models were slain by wounds caused by this unit's attacks in that phase, add 1 to the Attacks characteristic of this unit's Elongated Fangs for the rest of the battle.`,
        when: [END_OF_ANY_PHASE],
      },
    ],
  },

  'Cado Ezechiar': {
    mandatory: {
      spells: [keyPicker(spells, ['Retribution or Salvation'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `The Court of the Lost`,
        desc: `At the start of your hero phase, if this unit is on the battlefield, you can say it will summon a spirit from the Court of the Lost. If you do so, pick 1 of the effects below. That effect lasts until the start of your next hero phase.

        Spirit of the Steed: This unit has a Move characteristic of 14".

        Spirit of the Tutor: Add 1 to casting, unbinding and dispelling rolls for this unit.

        Spirit of the Fallen: If an attack made by this unit wounds the target, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a save roll).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Deintalos the Exile': {
    mandatory: {
      spells: [keyPicker(spells, ['Channelled Dynamism'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      TheHungerEffect,
      {
        name: `Crackling Field`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Terrible Dynamism`,
        desc: `At the end of the battleshock phase, if a friendly THE EXILED DEAD unit is within 6" of this unit, you can return 1 slain model to that unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },

  'Ivya Volga': {
    effects: [
      TheHungerEffect,
      {
        name: `Shrieking Swarm`,
        desc: `Subtract 1 from hit rolls for attacks that target this unit. In addition, if this unit has any wounds allocated to it, the Attacks characteristic of this unit's Needling Fangs is 12 instead of 2D6.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Behemoth's Bane`,
        desc: `If any enemy MONSTERS are within 3" of this unit, this unit counts as 10 models for the purposes of contesting objectives. In addition, while an enemy MONSTER is within 3" of this unit, the Attacks characteristic of that MONSTER's melee weapons is 1.`,
        when: [DURING_GAME],
      },
      {
        name: `Behemoth's Bane`,
        desc: `While an enemy MONSTER is within 3" of this unit, the Attacks characteristic of that MONSTER's melee weapons is 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'King Morlak Velmorn': {
    effects: [
      BeheadingStrikeEffect,
      {
        name: `Deadly Command`,
        desc: `Once per turn, this unit can issue a command to a friendly THE SONS OF VELMORN unit without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Undying Dynasty`,
        desc: `At the start of the combat phase, roll a dice for each slain model from a friendly THE SONS OF VELMORN unit wholly within 12" of this unit. On a 4+, you can return 1 slain model to that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Askurgan Trueblades': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Askurgan Exemplar. That model has a Wounds characteristic of 4 and is armed with Paired Askurgan Blades instead of Askurgan Weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Curseblood`,
        desc: `1 in every 8 models in this unit can be a Curseblood. A Curseblood has a Wounds characteristic of 4 and is armed with Elongated Claws and Slavering Maw instead of Askurgan Weapons.`,
        when: [COMBAT_PHASE],
      },
      TheHungerEffect,
      {
        name: `Gut-wrenching Howl`,
        desc: `At the end of the charge phase, if this unit includes any Cursebloods, you can pick 1 enemy unit within 1" of this unit and say that the Curseblood will unleash a gut wrenching howl. If you do so, roll a dice. Add 1 to the roll for each Curseblood in this unit. On a 4+, the strike-last effect applies to that enemy unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Creed of the Beast`,
        desc: `Subtract 1 from hit rolls and wound rolls for attacks made with melee weapons by enemy MONSTERS that target this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Creed of the Beast`,
        desc: `Each time an enemy MONSTER unit is destroyed by attacks made by this unit, add 3" to this unit's Move characteristic and add 1 to the Attacks characteristic of this unit's melee weapons for the rest of the battle.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  'The Exiled Dead': {
    effects: [
      {
        name: `Champion`,
        desc: `Prentice Marcov is the unit champion and has a Wounds characteristic of 3. Add 1 to casting and unbinding rolls for a friendly DEINTALOS THE EXILE if this unit includes Prentice Marcov.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dynamic Cage`,
        desc: `If the unmodified hit roll for an attack made with an Arco-electric Weapon is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crackling Field`,
        desc: `While this unit is wholly within 9" of a friendly DEINTALOS THE EXILE, Bault, Vlash, Ione and Coyl have a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },

  'The Sons of Velmorn': {
    effects: [
      {
        name: `Sir Jedran Falseborn`,
        desc: `Sir Jedran Falseborn has a Wounds characteristic of 4.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      CursedWeaponsEffect,
      {
        name: `Shield Up!`,
        desc: `Once per turn, at the start of the combat phase, you can say that this unit will form a shieldwall. If you do so, this unit has a Save characteristic of 3+ instead of 4+ until the end of that phase. However, if you do so, this unit cannot make pile-in moves in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Canny Strike`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that unit cannot make pile-in moves in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
