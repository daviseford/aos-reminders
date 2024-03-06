import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Prayers from './prayers'
import rule_sources from './rule_sources'
import Spells from './spells'
import { TItemDescriptions } from 'factions/factionTypes'
import prayers from './prayers'

const MorathiEffect = {
  name: `One Soul, Two Bodies/ Two Bodies, One Soul`,
  desc: `If the Shadow Queen is on the battlefield, after making ward rolls for wounds or mortal wounds that would be allocated to this unit, any wounds or mortal wounds that have not been negated are instead allocated to the Shadow Queen and have no effect on this unit. Wounds and mortal wounds allocated to the Shadow Queen in this way cannot be negated.

  In addition, if the Shadow Queen is on the battlefield and the effect of an ability or spell would cause this unit to be destroyed without any wounds being allocated, then this unit is not destroyed and 3 wounds are allocated to the Shadow Queen instead. Wounds allocated to the Shadow Queen in this way cannot be negated.

  If the Shadow Queen is destroyed, after removing that unit from play, this unit is also destroyed.`,
  when: [WOUND_ALLOCATION_PHASE],
  rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_DECEMBER_2022],
  shared: true,
}

const WitchbrewEffect = {
  name: `Witchbrew`,
  desc: `At the start of your hero phase, you can pick a friendly Daughters of Khaine unit wholly within 12" of this model to drink witchbrew. A unit cannot drink witchbrew more than once in the same hero phase. If you do so, add 1 to the number of the current battle round when determining the abilities gained by that unit from the Blood Rites battle trait until the end of that turn. This ability and other similar abilities are cumulative.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
}

const StandardBearerAndMusicianEffects = [
  {
    name: `Standard Bearer`,
    desc: `1 in every 5 models in this unit can be a Death Pennant Bearer. You can reroll failed battleshock tests for this unit if it includes any Death Pennant Bearers.`,
    when: [BATTLESHOCK_PHASE],
    shared: true,
  },
  {
    name: `Hornblower`,
    desc: `1 in every 5 models in this unit can be a Hornblower. This unit can run and still charge later in the turn if it includes any Hornblowers.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    shared: true,
  },
]

const DescendToBattleEffects = [
  {
    name: `Descend to Battle`,
    desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is circling high above as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
    when: [DURING_SETUP],
    shared: true,
  },
  {
    name: `Descend to Battle`,
    desc: `If this unit is still circling high, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
    shared: true,
  },
]

const FightAndFlightEffect = {
  name: `Fire and Flight`,
  desc: `After this unit shoots, this unit can make a normal move of 6".`,
  when: [SHOOTING_PHASE],
  shared: true,
}

const BladedBucklersEffects = [
  {
    name: `Shield`,
    desc: `If this unit is armed with Bladed Bucklers, it has a Save characteristic of 5+ instead of 6+.`,
    when: [SAVES_PHASE],
    shared: true,
  },
  {
    name: `Bladed Bucklers`,
    desc: `If the unmodified save roll for an attack made with a melee weapon that targets a unit armed with Bladed Bucklers is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
    when: [SAVES_PHASE],
    shared: true,
  },
]

const BloodshieldEffect = {
  name: `Bloodshield`,
  desc: `Add 1 to save rolls for attacks that target friendly Daughters of Khaine units wholly within range of any friendly units with this ability. The range of this unit's Bloodshield ability is shown on its damage table.`,
  when: [SAVES_PHASE],
  shared: true,
}

const BladedImpactEffect = {
  name: `Bladed Impact`,
  desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
  shared: true,
}

const HeartseekersEffect = {
  name: `Heartseekers`,
  desc: `If the unmodified hit roll for an attack made with a Heartseeker Bow is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound roll or save roll).`,
  when: [SHOOTING_PHASE],
  shared: true,
}

const TurnedToCrystalEffect = {
  name: `Turned to Crystal`,
  desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers 1 mortal wound.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}

const AltarOfKhaineEffect = {
  name: `Altar of Khaine`,
  desc: `Add 1 to chanting rolls for friendly Daughters of Khaine Priests wholly within 9" of any friendly units with this ability.`,
  when: [HERO_PHASE],
  shared: true,
}

const DanceOfDeathEffect = {
  name: `Dance of Death`,
  desc: `This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const baseHagQueen = {
  mandatory: {
    prayers: [keyPicker(Prayers, ['Touch of Death'])],
  },
  effects: [WitchbrewEffect],
}

const baseSlaughterQueen = {
  mandatory: {
    prayers: [keyPicker(Prayers, ['Dance of Doom'])],
    command_abilities: [keyPicker(CommandAbilities, ['Orgy of Slaughter'])],
  },
}

const baseBloodwrack = {
  mandatory: {
    spells: [keyPicker(Spells, ['Enfeebling Foe'])],
  },
  effects: [
    {
      name: `Bloodwrack Stare`,
      desc: `Do not use the attack sequence for an attack made with a Bloodwrack Stare. Instead, roll a number of dice equal to the number of models in the target unit that are within range of the attack. For each 5+, the target unit suffers 1 mortal wound.`,
      when: [SHOOTING_PHASE],
      shared: true,
    },
    {
      name: `Melusai Kin`,
      desc: `At the start of your combat phase, you can pick 1 friendly Melusai unit wholly within 12" of this unit. Add 1 to the number of the current battle round when determining the abilities gained by that unit from the Blood Rites battle trait until the end of that phase. This ability and other similar abilities are cumulative.`,
      when: [START_OF_COMBAT_PHASE],
      shared: true,
    },
    {
      name: `Wizard`,
      desc: `This unit can attempt to cast 1 spell in your hero phase and attempt to unbind 2 spells in the enemy hero phase.`,
      when: [HERO_PHASE],
      shared: true,
    },
  ],
}

const ShadowLeapEffect = {
  name: `Shadow Leap`,
  desc: `In your movement phase, instead of making a normal move or retreat with this unit, you can say that it will shadow leap. If you do so, remove this unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}

const Morathi = {
  'Morathi-Khaine': {
    mandatory: {
      spells: [keyPicker(Spells, ['Black Horror of Ulgu'])],
      command_abilities: [keyPicker(CommandAbilities, ['Worship Through Bloodshed'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 3 spells in your hero phase and attempt to unbind 2 spells in the enemy hero phase. If this unit is part of a Daughters of Khaine army, it knows all of the spells from the Lore of Shadows in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Commanding Presence`,
        desc: `Subtract 1 from hit rolls for attacks that target this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      MorathiEffect,
    ],
  },
  'The Shadow Queen': {
    effects: [
      {
        name: `Fury of the Shadow Queen`,
        desc: `While this unit is within 3" of any enemy units, add 1 to the Attacks characteristic of melee weapons used by friendly Khinerai and Melusai units wholly within 18" of this unit.`,
        when: [COMBAT_PHASE],
      },
      MorathiEffect,
      {
        name: `Iron Heart of Khaine`,
        desc: `No more than 3 wounds and/or mortal wounds can be allocated to this unit in the same turn. Once 3 wounds and/or mortal wounds have been allocated to this unit in the same turn, not counting any wounds that were negated, any further wounds and mortal wounds that would be allocated to this unit are ignored and have no effect.

        Wounds and mortal wounds allocated to this unit at the start of the battle round count towards the number of wounds allocated to this unit in the first turn of that battle round. Wounds and mortal wounds allocated to this unit at the end of the battle round count towards the number of wounds allocated to this unit in the second turn of that battle round.

        If the effect of an ability or spell would cause this unit to be destroyed without any wounds being allocated, 3 wounds are allocated to this unit instead. These wounds can only be negated if 3 wounds and/or mortal wounds have been already allocated to this unit in the same turn.

        Wounds allocated to this unit cannot be healed.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2022],
      },
    ],
  },
}

const Units = {
  'Morathi-Khaine': {
    ...Morathi['Morathi-Khaine'],
    mandatory: {
      ...Morathi['Morathi-Khaine'].mandatory,
      units: [keyPicker(Morathi, ['The Shadow Queen'])],
    },
  },
  'The Shadow Queen': {
    ...Morathi['The Shadow Queen'],
    mandatory: {
      units: [keyPicker(Morathi, ['Morathi-Khaine'])],
    },
  },
  'Hag Queen': {
    ...baseHagQueen,
  },
  'Hag Queen on Cauldron of Blood': {
    mandatory: {
      prayers: [...baseHagQueen.mandatory.prayers],
    },
    effects: [...baseHagQueen.effects, AltarOfKhaineEffect, BladedImpactEffect, BloodshieldEffect],
  },
  'High Gladiatrix': {
    effects: [
      DanceOfDeathEffect,
      {
        name: `Killing Stroke`,
        desc: `At the end of the combat phase, you can pick 1 enemy HERO within 1" of this unit and roll a D3. Add the number of wounds allocated to that enemy HERO to the roll. If the roll is equal to or greater than that enemy HERO's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Paragon of Slaughter`,
        desc: `Barbed Whips and Sacrificial Knives used by friendly Witch Aelves and Sisters of Slaughter units that are wholly within 12" of any friendly units with this ability have a To Wound characteristic of 3+ instead of 4+ and a Rend characteristic of -1 instead of '-'.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Slaughter Queen': {
    mandatory: {
      command_abilities: [...baseSlaughterQueen.mandatory.command_abilities],
      prayers: [...baseSlaughterQueen.mandatory.prayers],
    },
    effects: [],
  },
  'Avatar of Khaine': {
    effects: [
      AltarOfKhaineEffect,
      {
        name: `Animus of Sorcery and Sacrifice`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
        shared: true,
      },
      {
        name: `Wrath of Khaine`,
        desc: `This unit counts as a MONSTER for the purposes of the Monstrous Rampage rules (core rules, 21.1), but you can only carry out a Stomp or Smash To Rubble monstrous rampage with it. It cannot be picked to be the target of a monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
        shared: true,
      },
    ],
  },
  'Witch Aelves': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hag. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      ...StandardBearerAndMusicianEffects,
      ...BladedBucklersEffects,
      {
        name: `Frenzied Fervour`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by this unit while it is wholly within 12" of any friendly Daughters of Khaine Totems.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sisters of Slaughter': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Handmaiden. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      ...StandardBearerAndMusicianEffects,
      ...BladedBucklersEffects,
      DanceOfDeathEffect,
    ],
  },
  'Slaughter Queen on Cauldron of Blood': {
    mandatory: {
      prayers: [...baseSlaughterQueen.mandatory.prayers],
      command_abilities: [...baseSlaughterQueen.mandatory.command_abilities],
    },
    effects: [
      AltarOfKhaineEffect,
      BladedImpactEffect,
      BloodshieldEffect,
      {
        name: `Pact of Blood`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a Wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bloodwrack Shrine': {
    mandatory: {
      spells: [...baseBloodwrack.mandatory.spells],
    },
    effects: [
      ...baseBloodwrack.effects,
      BladedImpactEffect,
      {
        name: `Aura of Agony`,
        desc: `At the start of your hero phase, you can roll one dice for each enemy unit within 7" of this unit. If the roll is equal to or greater than the Aura of Agony value shown on this unit's damage table, that enemy unit suffers D3 mortal wounds. The same unit cannot be affected by this ability more than once per turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blood Sisters': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Gorgai. Add 1 to the Attacks characteristic of that model's Heartshard Glaive.`,
        when: [COMBAT_PHASE],
      },
      TurnedToCrystalEffect,
    ],
  },
  'Blood Stalkers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Krone. That model is armed with a Blood Wyrm in addition to its other weapons.`,
        when: [COMBAT_PHASE],
      },
      HeartseekersEffect,
    ],
  },
  'Bloodwrack Medusa': {
    ...baseBloodwrack,
  },
  'Doomfire Warlocks': {
    mandatory: { spells: [keyPicker(Spells, ['Doomfire'])] },
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Master of Warlocks. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Doomfire Coven`,
        desc: `Add 1 to casting and unbinding rolls for this unit while it has 5 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Khinerai Heartrenders': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Shryke. Add 1 to the Attacks characteristic of that model's weapons.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      ...DescendToBattleEffects,
      FightAndFlightEffect,
    ],
  },
  'Khinerai Lifetakers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Harridynn. Add 1 to the Attacks characteristic of that model's weapons.`,
        when: [COMBAT_PHASE],
      },
      ...DescendToBattleEffects,
      FightAndFlightEffect,
    ],
  },
  'Morgwaeth the Bloodied': {
    effects: [...baseHagQueen.effects],
  },
  'The Blade-coven': {
    effects: [
      {
        name: `Champion`,
        desc: `Kyrae is the unit champion. That model has a Wounds characteristic of 3.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      HeartseekersEffect,
      {
        name: `Zealots of the First Temple`,
        desc: `Before you allocate a wound or mortal wound to a friendly Morgwaeth the Bloodied within 3" of this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly Morgwaeth the Bloodied within 3" of this unit, you can roll a dice. On a 2+, that wound or mortal wound is allocated to this unit instead of Morgwaeth the Bloodied and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Khainite Shadowstalkers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Shroud Queen. That model is armed with Cursed Missiles and Umbral Blades instead of Cursed Missiles and Assassin's Blades. In addition, a Shroud Queen has a Wounds characteristic of 3.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Shadow Leap`,
        desc: `In your movement phase, instead of picking this unit to make a normal move or retreat, you can say that it will shadow leap. If you do so, remove this unit from the battlefield and set it up again on the battlefield more than 9" from all enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Melusai Ironscale': {
    mandatory: { command_abilities: [keyPicker(CommandAbilities, ['Wrath of the Scathborn'])] },
    effects: [
      {
        name: `Blood of the Oracle`,
        desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 5+, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gory Offering`,
        desc: `If any enemy models are slain by wounds caused by this unit's attacks in the combat phase, add 1 to the Attacks characteristic of friendly Melusai units wholly within 12" of this unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
      TurnedToCrystalEffect,
    ],
  },
  'Slythael Shadestalker': {
    effects: [
      ShadowLeapEffect,
      {
        name: `Impenetrable Darkness`,
        desc: `While this unit is more than 9" from all enemy units, this unit and friendly THE SHADEBORN units wholly within 9" of this unit have a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Mask of Shadowed Mirrors`,
        desc: `At the end of the charge phase, you can pick 1 enemy unit within 3" of this unit and roll 2D6. If the score exceeds that enemy unit's Bravery characteristic, that enemy unit cannot issue or receive commands until the end of the turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'The Shadeborn': {
    effects: [ShadowLeapEffect],
  },
  "Gryselle's Arenai": {
    effects: [
      {
        name: `Champion`,
        desc: `Gryselle, the Slaughterer, is the unit champion and has a Wounds characteristic of 3. That model can issue commands to their own unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      DanceOfDeathEffect,
      {
        name: `Acrobatic Bloodshed`,
        desc: `If the unmodified hit rolls of 3 or more attacks made by this unit that target the same enemy unit in the same phase are 6, the strike-last effect applies to that enemy unit until the end of the turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Krethusa The Croneseer': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Murder of Crows'])],
    },
    effects: [
      {
        name: `Burnt Offerings`,
        desc: `Once per turn, in the hero phase, if this unit is wholly within 6" of a friendly Cauldron of Blood, you can say that it will commune with Morai-Heg.

        If you do so, pick 1 friendly Daughters of Khaine unit wholly within 9" of this unit that does not have the Scthborn, Medusae, Melusai, The Shadow Queen or Morathi-Khaine keyword and roll a dice. On a 2+, you can pick 1 of the following prophecies to apply to that unit. A unit cannot be affected by the same prophecy more than once per turn.

        Prophecy of Silence: Until the end of the turn, enemy units within 3" of this unit cannot receive commands.

        Prophecy of Dark Wings: This unit can immediately make a normal move if it has not already made a normal move, retreated or been set up on the battlefield in this phase.
        
        Prophecy of Reclamation: Until the end of the turn, while this unit is contesting an objective, enemy units can only contest that objective if they have the Hero or Monster keyword.`,
        when: [HERO_PHASE],
      },
      {
        name: `Foresight of Morai-Heg`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
