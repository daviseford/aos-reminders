import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const PungentSoulscentEffect = {
  name: `Pungent Soulscent`,
  desc: `At the start of the combat phase, roll a dice for each enemy unit within 1" of this model. On a 2+, that unit suffers D3 mortal wounds. In addition, for each 2+, add 1 to the Attacks characteristic of this model's melee weapons until the end of that phase.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const SoulscentEffect = {
  name: `Soulscent`,
  desc: `At the start of the combat phase, roll a dice for each enemy unit within 1" of this model. On a 4+, that unit suffers D3 mortal wounds. In addition, for each 4+, add 1 to the Attacks characteristic of this model's melee weapons until the end of that phase.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const DarkTemptationsEffect = {
  name: `Dark Temptations`,
  desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this model. If you do so, your opponent must choose whether that HERO accepts or refuses temptation. If it refuses, that HERO suffers D3 mortal wounds. If it accepts, add 1 to hit rolls for attacks made by that HERO. Then, at the start of the next combat phase, roll a dice. On 1-3, that HERO no longer receives this modifier to its hit rolls. On 4-6, that HERO is slain.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const DelicatePrecisionEffect = {
  name: `Delicate Precision`,
  desc: `If the unmodified wound roll for an attack made with a missile or melee weapon by this model is 6, that attack inflicts a number of mortal wounds equal to the Damage characteristic of the weapon used for the attack and the attack sequence ends (do not make a save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const SinistrousHandEffect = {
  name: `Sinistrous Hand`,
  desc: `If this model is armed with a Sinistrous Hand, at the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that phase, you can heal up to D3 wounds allocated to this model. If any enemy HEROES were slain by wounds inflicted by this model's attacks in that phase, you can heal up to D6 wounds allocated to this model instead.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}
const LivingWhipEffect = {
  name: `Living Whip`,
  desc: `If this model is armed with a Living Whip, at the start of the combat phase, you can pick 1 enemy MONSTER model within 6" of this model and roll a dice. On a 3+, pick 1 melee weapon that model is armed with. Subtract 1 from hit rolls for attacks made with that weapon until the end of that phase.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const ShiningAegisEffect = {
  name: `Shining Aegis`,
  desc: `If this model is armed with a Shining Aegis, roll a dice each time you allocate a wound or mortal wound to this model. On a 6+, that wound or mortal wound is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const LitheAndSwiftEffect = {
  name: `Lithe and Swift`,
  desc: `This unit can run and still charge later in the same turn.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const HornBlowerEffect = {
  name: `Hornblower`,
  desc: `If the unmodified roll for a battleshock test for an enemy unit that is within 6" of this unit while this unit includes any Hornblowers is 1, that battleshock test must be rerolled.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const CrewAndSteedsEffect = {
  name: `Crew and Steeds`,
  desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const HighTempterEffect = {
  name: `High Tempter`,
  desc: `Add 1 to the Attacks characteristic of this model's Blissbarb Bow.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const baseKeeperOfSecrets = {
  mandatory: {
    spells: [keyPicker(Spells, ['Cacophonic Choir'])],
    command_abilities: [keyPicker(CommandAbilities, ['Excess of Violence'])],
  },
  effects: [DarkTemptationsEffect, DelicatePrecisionEffect, GenericEffects.WizardTwoSpellsEffect],
}
const MesmerisingLepidopteraEffect = {
  name: `Mesmerising Lepidoptera`,
  desc: `Subtract 1 from hit rolls for attacks that target this model.`,
  when: [DURING_GAME],
  shared: true,
}
const ImpossiblySwiftEffect = {
  name: `Impossibly Swift`,
  desc: `This model can retreat and still charge later in the same turn.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const ExcessOfBladesEffect = {
  name: `Excess of Blades`,
  desc: `Roll a D6 for each enemy unit within 1" of this model when it finishes a charge move. On a 1 nothing happens. On a 2-4 that unit suffers D3 mortal wounds. On a 5+ that unit suffers D6 mortal wounds.`,
  when: [CHARGE_PHASE],
  shared: true,
}

// Unit Names
const Units = {
  'Keeper of Secrets w/ Ritual Knife': {
    mandatory: { ...baseKeeperOfSecrets.mandatory },
    effects: [
      ...baseKeeperOfSecrets.effects,
      {
        name: `Ritual Knife`,
        desc: `If this model is armed with a Ritual Knife, at the end of the combat phase, you can pick 1 enemy model within 1" of this model that has any wounds allocated to it and roll a dice. On a 1, nothing happens. On a 2-5, that model suffers 1 mortal wound. On a 6, that model suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Keeper of Secrets w/ Living Whip': {
    mandatory: { ...baseKeeperOfSecrets.mandatory },
    effects: [...baseKeeperOfSecrets.effects, LivingWhipEffect],
  },
  'Keeper of Secrets w/ Shining Aegis': {
    mandatory: { ...baseKeeperOfSecrets.mandatory },
    effects: [...baseKeeperOfSecrets.effects, ShiningAegisEffect],
  },
  'Keeper of Secrets w/ Sinistrous Hand': {
    mandatory: { ...baseKeeperOfSecrets.mandatory },
    effects: [...baseKeeperOfSecrets.effects, SinistrousHandEffect],
  },
  "Syll'Esske, the Vengeful Allegiance": {
    mandatory: {
      spells: [keyPicker(Spells, ['Subvert'])],
      command_abilities: [keyPicker(CommandAbilities, ['Regal Authority'])],
    },
    effects: [
      {
        name: `Companion`,
        desc: `Esske attacks with the Axe of Dominion. For rules purposes, Esske is treated in the same manner as a mount.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Symbiosis`,
        desc: `You can reroll hit rolls of 1 for attacks made with melee weapons by friendly HEDONITE units wholly within 18" of this model if the number of friendly MORTAL HEDONITE units wholly within 18" of this model is equal to the number of other friendly DAEMON HEDONITE units wholly within 18" of this model.`,
        when: [COMBAT_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `The Vengeful Allegiance`,
        desc: `In the combat phase, if the unmodified hit roll for any attack made with a melee weapon that targets this model is 1, add 1 to hit and wound rolls for attacks made by this model that target the attacking unit in the same phase.`,
        when: [COMBAT_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Shalaxi Helbane': {
    mandatory: {
      spells: [keyPicker(Spells, ['Refine Senses'])],
    },
    effects: [
      {
        name: `Cloak of Constriction`,
        desc: `Add 1 to save rolls for attacks made with melee weapons by HEROES that target this model.`,
        when: [SAVES_PHASE],
      },
      DelicatePrecisionEffect,
      {
        name: `Irresistible Challenge`,
        desc: `At the start of the enemy charge phase, you can pick 1 enemy HERO within 12" of this model and more than 3" from any friendly models. If you do so, your opponent must choose whether that HERO accepts or refuses Shalaxi's challenge. If it refuses, that HERO suffers D3 mortal wounds. If it accepts, that HERO must attempt to charge, and must finish the charge move within 1/2" of this model if it is possible for it to do so. In addition, if it accepts the challenge, any attacks that HERO makes in the following combat phase must target this model.`,
        when: [START_OF_CHARGE_PHASE],
      },
      LivingWhipEffect,
      ShiningAegisEffect,
      {
        name: `The Killing Stroke`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this model. If you do so, all attacks made by this model in that phase must target that model, but the Damage characteristic of this model's Soulpiercer is 6 instead of D6 until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'The Contorted Epitome': {
    mandatory: {
      spells: [keyPicker(Spells, ['Overwhelming Acquiescence'])],
    },
    effects: [
      {
        name: `Gift of Power`,
        desc: `You can reroll casting rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swallow Energy`,
        desc: `Roll a dice each time you allocate a mortal wound to this model. On a 2+, that mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Horrible Fascination`,
        desc: `At the start of the combat phase, you can roll 1 dice for each enemy unit within 3" of this model. On a 4+, this model cannot be picked as the target of attacks made by that unit in that phase until this model makes any attacks in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Infernal Enrapturess, Herald of Slaanesh': {
    effects: [
      {
        name: `Discordant Disruption`,
        desc: `Reroll successful casting rolls for enemy WIZARDS that are within 24" of any friendly models with this ability. In addition, if the rerolled casting roll is a double, that WIZARD suffers D3 mortal wounds after the effects of the spell (if any) have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Discordant Disruption`,
        desc: `This model can attempt to dispel 1 endless spell at the start of your hero phase in the same manner as a WIZARD. If it does so, add 1 to the dispelling roll.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Versatile Instrument`,
        desc: `Before attacking with a heartstring lyre, choose either the Cacophonous Melody or Euphonic Blast missile weapon characteristics for that shooting attack.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'The Masque': {
    effects: [
      {
        name: `Staff of Masks`,
        desc: `At the start of your hero phase, you can either add D3 to the Attacks characteristic of this model's melee weapons until your next hero phase or heal up to D3 wounds allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Endless Dance`,
        desc: `This model is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and can fly and move an extra 3" when it piles in. In addition, you can reroll hit rolls for attacks made by this model that target an enemy unit with a Move characteristic of 10" or less, and you can reroll wound rolls for attacks made by this model that target an enemy unit with a Move characteristic of 5" or less.`,
        when: [COMBAT_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `Inhuman Reflexes`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Viceleader, Herald of Slaanesh': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      {
        name: `Lightning Reflexes`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      LitheAndSwiftEffect,
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Bladebringer, Herald on Hellflayer': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [CrewAndSteedsEffect, SoulscentEffect, GenericEffects.WizardOneSpellEffect],
  },
  'Bladebringer, Herald on Seeker Chariot': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      CrewAndSteedsEffect,
      ImpossiblySwiftEffect,
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Mutilating Blades`,
        desc: `After this model finishes a charge move, roll a dice for each enemy unit that is within 1" of it. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Hellflayer: {
    effects: [CrewAndSteedsEffect, SoulscentEffect],
  },
  'Seeker Chariots': {
    effects: [
      CrewAndSteedsEffect,
      ImpossiblySwiftEffect,
      {
        name: `Mutilating Blades`,
        desc: `After a model from this unit finishes a charge move, roll a dice for each enemy unit within 1" of that model. On a 2+, that unit suffers D3 mortal wounds. If this unit has more than 1 model, roll to determine if mortal wounds are inflicted after each model finishes its charge move, but do not allocate the mortal wounds until all of the models in the unit have finished their charge moves.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bladebringer, Herald on Exalted Chariot': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      CrewAndSteedsEffect,
      ExcessOfBladesEffect,
      PungentSoulscentEffect,
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Exalted Chariot': {
    effects: [CrewAndSteedsEffect, ExcessOfBladesEffect, PungentSoulscentEffect],
  },
  Fiends: {
    effects: [
      {
        name: `Blissbringer`,
        desc: `1 model in this unit can be a Blissbringer. Add 1 to the attacks characteristic of a Blissbringer's Deadly Pincers.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crushing Grip`,
        desc: `If the unmodified wound roll for an attack made with Deadly Pincers is 6, that weapon has a Damage characteristic of D3 instead of 1 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Venom`,
        desc: `If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 1, that weapon has a Damage characteristic of 1 for that attack. If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 2-3, that weapon has a Damage characteristic of D3 for that attack. If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 4 or more, that weapon has a Damage characteristic of D6 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Disruptive Song`,
        desc: `Subtract 1 from casting rolls for enemy WIZARDS while they are within 12" of any friendly models with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soporific Musk`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this unit. In addition, while this unit has 4 or more models, subtract 1 from wound rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Daemonettes: {
    effects: [
      {
        name: `Allurer`,
        desc: `1 model in this unit can be an Allurer. Add 1 to the Attacks characteristic of that model's Piercing Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Daemonette Banner Bearer`,
        desc: `You can reroll charge rolls for this unit while it includes any Daemonette Banner Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Daemonette Icon Bearer`,
        desc: `If an unmodified battleshock roll of 1 is made for this unit while it includes any Daemonette Icon Bearers, you can add D6 models to this unit and no models from this unit will flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      HornBlowerEffect,
      LitheAndSwiftEffect,
    ],
  },
  Seekers: {
    effects: [
      {
        name: `Heartseeker`,
        desc: `1 model in this unit can be a Heartseeker. Add 1 to the Attacks characteristic of that model's Piercing Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Seeker Banner Bearer`,
        desc: `You can reroll charge rolls for this unit while it includes any Seeker Banner Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Seeker Icon Bearer`,
        desc: `If an unmodified battleshock roll of 1 is made for this unit while it includes any Seeker Icon Bearers, you can add D3 models to this unit and no models from this unit will flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `1 in every 5 models in this unit can be a Seeker Hornblower. If the unmodified roll for a battleshock test for an enemy unit that is within 6" of this unit while this unit includes any Seeker Hornblowers is 1, that battleshock test must be rerolled.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Quicksilver Speed`,
        desc: `You can roll 2D6 instead of D6 when you make a run roll for this unit. In addition, this unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Soul Hunters`,
        desc: `If any enemy models were slain by wounds inflicted by this unit's attacks in the combat phase, add 1 to the Attacks characteristic of this unit's melee weapons in the following combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hellstriders with Hellscourges': {
    effects: [
      {
        name: `Hellreaver`,
        desc: `Add 1 to the attacks characteristic of a Hellreaver's Hellscourge.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hellstrider Banner Bearer`,
        desc: `You can reroll charge rolls for this unit while it includes any Hellstrider Banner Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Hellstrider Icon Bearer`,
        desc: `Add 2 to the Bravery characteristic of this unit while it includes any Hellstrider Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      HornBlowerEffect,
      {
        name: `Hooked Tendrils`,
        desc: `In the combat phase, if this unit made a charge move in the same turn, subtract 1 from hit rolls for attacks that target this unit made by enemy models within 3" of this unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hellstriders with Claw-spears': {
    effects: [
      {
        name: `Hellreaver`,
        desc: `Add 1 to the Attacks characteristic of a Hellreaver's Claw-spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hellstrider Banner Bearer`,
        desc: `You can reroll charge rolls for this unit while it includes any Hellstrider Banner Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Hellstrider Icon Bearer`,
        desc: `Add 2 to the Bravery characteristic of this unit while it includes any Hellstrider Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      HornBlowerEffect,
      {
        name: `Piercing Strike`,
        desc: `Add 1 to the Damage characteristic of this unit's Claw-spears if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Soulfeaster Keeper of Secrets': {
    mandatory: {
      spells: [keyPicker(Spells, ['Cacophonic Choir'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      DarkTemptationsEffect,
      DelicatePrecisionEffect,
      SinistrousHandEffect,
      {
        name: `Soulfeaster Tendrils`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this model and roll 3D6. If the roll is greater than that model's Bravery characteristic, you gain D3 depravity points and 1 is subtracted from hit rolls for attacks made by that HERO until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lord of Pain': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Paragon of Depravity'])],
    },
    effects: [
      {
        name: `Share the Pain`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated. In addition, each time a wound or mortal wound inflicted by a melee weapon is negated by this ability, the attacking unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'The Dread Pageant': {
    effects: [
      {
        name: `Vasillac/Slakeslash`,
        desc: `Add 2 to the wounds characteristic of these models.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Art of the Myrmidesh`,
        desc: `You can roll a dice each time you allocate a wound or mortal wound to Vasillac. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Deadliest Procession`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Glutos Orscollion, Lord of Gluttony': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Gorge on Excess'])],
      spells: [keyPicker(Spells, ['Crippling Famishment'])],
    },
    effects: [
      {
        name: `The Grand Gourmand: Aperitif (Round 1)`,
        desc: `Add 1 to Bravery characteristic of friendly MORTAL HEDONITE units within 6" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Grand Gourmand: Starter (Round 2)`,
        desc: `This model can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `The Grand Gourmand: Main Course (Round 3)`,
        desc: `Do not take battleshock tests for friendly MORTAL HEDONITE units while they are wholly within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Grand Gourmand: Dessert (Round 4)`,
        desc: `At the end of your hero phase, you can replace the spell this model knows from the Lore of Pain and Pleasure table with a new spell from that table. In addition, this model can attempt to cast 1 extra spell in your hero phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `The Grand Gourmand: Digestif (Round 5)`,
        desc: `You can reroll casting, dispelling and unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fog of Temptation`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units within 12" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `The Leerstave of Loth'shar`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,

      // Companion abilities
      {
        name: `Painbringer Kyazu`,
        desc: `If the unmodified wound roll for an attack made with this model's Wailing Greatblade is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lashmaster Vhyssk`,
        desc: `You can reroll charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Priestess Dolece`,
        desc: `In your hero phase, you can say that Dolece will call to Slaanesh to protect her master. If you do so, roll a dice. On a 1, nothing happens. On a 2+, until your next hero phase, you can roll a dice each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sigvald, Prince of Slaanesh': {
    effects: [
      {
        name: `Glorious Reborn`,
        desc: `This model fights at the start of the combat phase if it made a charge move in the same turn. It cannot fight again in that phase unless an ability or spell allows it to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Powered by Vainglory`,
        desc: `Add 3 to charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Powered by Vainglory`,
        desc: `The Attacks characteristic of Shardslash is either 5 or equal to the unmodified charge roll made for this model in the same turn, whichever is higher.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shardslash`,
        desc: `Wounds inflicted by an attack made with Shardslash cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Mirror Shield`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Shardspeaker of Slaanesh': {
    mandatory: {
      spells: [keyPicker(Spells, ['Reflection Eternal'])],
    },
    effects: [
      {
        name: `Mist Lurkers`,
        desc: `If this unit successfully casts a spell that is not unbound, until your next hero phase, you can add 1 to save rolls for attacks that target this unit and it can attack using the Shadow-cloaked Claws melee weapon when it fights.`,
        when: [HERO_PHASE],
      },
      {
        name: `Twisted Mirror`,
        desc: `Once per turn in your shooting phase, you can pick 1 enemy unit within 9" of this model and roll a dice. On a 3+, add 1 to wound rolls for attacks that target that unit in the following combat phase. The same unit cannot be affected by this ability more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Blissbarb Archers': {
    effects: [
      HighTempterEffect,
      {
        name: `Blissbarb Homonculus`,
        desc: `1 in every 11 models in this unit must be a Blissbrew Homonculus. A Blissbrew Homonculus is armed with a Sybarite Blade. Add 1 to wound rolls for attacks made with missile weapons by this unit while it includes any Blissbrew Homonculi.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Light-footed Killers`,
        desc: `This unit can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Blissbarb Seekers': {
    effects: [
      HighTempterEffect,
      {
        name: `Vectors of Agony`,
        desc: `If the unmodified wound roll for an attack made with a missile weapon by this unit is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Flawless Accuracy`,
        desc: `This unit can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Slickblade Seekers': {
    effects: [
      {
        name: `Hunter-Seeker`,
        desc: `1 model in this unit can be a Hunter-Seeker. Add 1 to the Attacks characteristic of that model's Slickblade Glaive.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unrivalled Velocity`,
        desc: `You can reroll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Decapitating Strikes`,
        desc: `If the unmodified wound roll for an attack made with a Slickblade Glaive is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Myrmidesh Painbringers': {
    effects: [
      {
        name: `Painmaster`,
        desc: `1 model in this unit can be a Painmaster. Add 1 to the Attacks characteristic of that model's Wicked Scimitar.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dance of the Wailing Blade`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this unit is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Painbringer Shields`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Symbaresh Twinsouls': {
    effects: [
      {
        name: `Egopomp`,
        desc: `1 model in this unit can be an Egopomp. Add 1 to the Attacks characteristic of that model's Merciless Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fractured Souls`,
        desc: `You must pick between Ego-driven Excess or Fiendish Reflexes to be active until your next hero phase. You must pick a different ability in each battle round.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ego-driven Excess`,
        desc: `If active, you can reroll hit rolls for attacks made with melee weapons by this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fiendish Reflexes`,
        desc: `If active, roll a dice each time you allocate a wound or mortal wound to this unit. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Slaangor Fiendbloods': {
    effects: [
      {
        name: `Slaughter At Any Cost`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Obsessive Violence`,
        desc: `At the end of the combat phase, pick 1 enemy unit within 3" of this unit and roll a dice for each model in this unit. For each 4+, that enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Dexcessa, The Talon of Slaanesh': {
    effects: [
      {
        name: `Fleeting Dance of Death`,
        desc: `This model can run or retreat and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Joyous Battle Fury`,
        desc: `After this model has fought for the first time, at the start of each battle round, add 1 to the Attacks characteristics of this model's weapons for the rest of the battle. This effect is cumulative.`,
        when: [START_OF_ROUND],
      },
      MesmerisingLepidopteraEffect,
      {
        name: `Sceptre of Slaanesh`,
        desc: `Do not take battleshock tests for friendly SLAANESH DAEMON units wholly within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Sceptre of Slaanesh`,
        desc: `Once per turn, this model can issue a command to a friendly SLAANESH DAEMON unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Synessa, The Voice of Slaanesh': {
    mandatory: {
      spells: [keyPicker(Spells, ['Whispers of Doubt'])],
    },
    effects: [
      MesmerisingLepidopteraEffect,
      {
        name: `Staff of Slaanesh`,
        desc: `Do not pick a target or use the attack sequence for an attack made with this model's Staff of Slaanesh. Instead, pick 1 enemy unit within range of this model's Staff of Slaanesh and visible to them. The opposing player must roll a dice for that unit. If the roll is less than that unit's Save characteristic but not a 6, that unit suffers D6 mortal wounds. If the roll is equal to or greater than that unit's Save characteristic but not a 6, that unit suffers D3 mortal wounds. On a 6, nothing happens.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `The Voice of Slaanesh`,
        desc: `If this model issues a command to 1 friendly unit, that friendly unit can be anywhere on the battlefield as long as it is visible to this model (the range of the command ability does not apply). If this model issues a command to more than 1 friendly unit, 1 of those friendly units can be anywhere on the battlefield as long as it is visible to this model (the range of the command ability still applies to the other units).`,
        when: [DURING_GAME],
      },
      {
        name: `The Voice of Slaanesh`,
        desc: `If this model successfully casts Whispers of Doubt (see below) or Pavane of Slaanesh (see Lore of Slaanesh), the HERO affected by the spell can be anywhere on the battlefield as long as that HERO is visible to this model (the range of the spell does not apply).`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
}
export default tagAs(Units, 'unit')
