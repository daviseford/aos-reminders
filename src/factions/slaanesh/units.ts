import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_ANY_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import Spells from './spells'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const BannerBearerEffect = {
  name: `Banner Bearer`,
  desc: `Add 1 to run rolls and charge rolls for this unit if it includes any Banner Bearers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const IconBearerEffect = {
  name: `Icon Bearer`,
  desc: `If this unit receives the Rally command while it includes any Icon Bearers, when you roll a dice for a slain model from this unit, you can return 1 slain model to this unit on a 5+ instead of a 6.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
}
const WarmasterEffect = {
  name: `Warmaster`,
  desc: `If this unit is included in a Hedonites of Slaanesh army, it is treated as a general even if it is not the model picked to be the army's general.`,
  when: [DURING_GAME],
  shared: true,
}
const SoulscentEffect = {
  name: `Soulscent`,
  desc: `At the start of the combat phase, roll a dice for each enemy unit within 1" of this unit. On a 4+, that unit suffers D3 mortal wounds. In addition, for each 4+, add 1 to the Attacks characteristic of this unit's melee weapons until the end of that phase. If that enemy unit has 10 or more models, both of the effects of this ability trigger on a 3+ instead.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const DarkTemptationsEffect = {
  name: `Dark Temptations`,
  desc: `Once per turn, at the start of the combat phase, if any friendly units with this ability are on the battlefield, you can pick 1 enemy unit within 3" of a friendly unit with this ability. If you do so, your opponent must choose whether that unit resists or gives in to temptation. If it resists, that unit suffers D3 mortal wounds. If it gives in, you gain D3 depravity points.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const DelicatePrecisionEffect = {
  name: `Delicate Precision`,
  desc: `If the unmodified wound roll for an attack made by this unit is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const SinistrousHandEffect = {
  name: `Sinistrous Hand`,
  desc: `If this unit is armed with a Sinistrous Hand, at the end of the combat phase, if any enemy models were slain by wounds caused by this unit's attacks in that phase, you can heal up to 3 wounds allocated to this unit. If any enemy Heroes were slain by wounds caused by this unit's attacks in that phase, you can heal up to 6 wounds allocated to this unit instead.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}
const LivingWhipEffect = {
  name: `Living Whip`,
  desc: `If this unit is armed with a Living Whip, at the start of the combat phase, you can pick 1 enemy unit within 6" of this unit and roll a dice. On a 2+, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until the end of that phase. The same unit cannot be affected by this ability more than once per phase.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const ShiningAegisEffect = {
  name: `Shining Aegis`,
  desc: `If this unit is armed with a Shining Aegis, it has a ward of 5+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const LitheAndSwiftEffect = {
  name: `Lithe and Swift`,
  desc: `This unit can run and still charge later in the same turn.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const HornBlowerEffect = {
  name: `Musician`,
  desc: `You can reroll failed battleshock tests for this unit if it includes any Hornblowers.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const HighTempterEffect = {
  name: `High Tempter`,
  desc: `1 model in this unit can be a High Tempter. Add 1 to the Attacks characteristic of that model's Blissbarb Bow.`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const MesmerisingLepidopteraEffect = {
  name: `Mesmerising Lepidoptera`,
  desc: `Subtract 1 from hit rolls for attacks that target this unit.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
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
  desc: `After this unit finishes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the charge roll for that charge move. For each roll that is greater than that enemy unit's Save characteristic, that unit suffers 1 mortal wound.`,
  when: [CHARGE_PHASE],
  shared: true,
}

// Unit Names
const Units = {
  'Keeper of Secrets': {
    mandatory: {
      spells: [keyPicker(Spells, ['Cacophonic Choir'])],
    },
    effects: [
      DarkTemptationsEffect,
      DelicatePrecisionEffect,
      LivingWhipEffect,
      ShiningAegisEffect,
      SinistrousHandEffect,
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Ritual Knife`,
        desc: `If this unit is armed with a Ritual Knife, at the end of the combat phase, you can pick 1 enemy model within 1 " of this unit that has any wounds allocated to it and roll a dice. On a 2+, that model's unit suffers a number of mortal wounds equal to the roll.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Excess of Violence`,
        desc: `Once per battle, in the combat phase, if any friendly units with this ability are on the battlefield, you can pick 1 different friendly Hedonites of Slaanesh unit that is wholly within 12" of a friendly unit with this ability and that has fought for the first time in that phase. That unit can fight for a second time in that phase. The strike-last effect applies to that unit when it fights for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Syll'Esske, the Vengeful Allegiance": {
    mandatory: {
      spells: [keyPicker(Spells, ['Subvert'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      WarmasterEffect,
      {
        name: `Deadly Symbiosis`,
        desc: `If the number of friendly Hedonites of Slaanesh Mortal units wholly within 1 8" of this unit is equal to the number of other friendly Hedonites of Slaanesh Daemon units wholly within 18" of this unit, add 1 to hit rolls and wound rolls for attacks made with melee weapons by friendly Hedonites of Slaanesh units wholly within 18" of this unit.`,
        when: [COMBAT_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `The Vengeful Allegiance`,
        desc: `If the unmodified save roll for an attack made with a melee weapon that targets this unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Shalaxi Helbane': {
    mandatory: {
      spells: [keyPicker(Spells, ['Refine Senses'])],
    },
    effects: [
      {
        name: `Cloak of Constriction`,
        desc: `Subtract 1 from hit rolls and wound rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
      DelicatePrecisionEffect,
      {
        name: `Irresistible Challenge`,
        desc: `At the start of the enemy charge phase, you can pick 1 enemy HERO within 12" of this unit and more than 3" from any other friendly units. If you do so, your opponent must choose whether that HERO accepts or refuses Shalaxi's challenge. If they refuse, that HERO suffers D3 mortal wounds. If they accept, that HERO must attempt a charge and must finish the charge move within 1/2" of this unit. If they cannot finish the charge move within 1/2" of this unit, that HERO suffers D3 mortal wounds instead.`,
        when: [START_OF_CHARGE_PHASE],
      },
      LivingWhipEffect,
      ShiningAegisEffect,
      {
        name: `The Killing Stroke`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this unit. If you do so, all attacks made by this unit in that phase must target that HERO, but the Damage characteristic of this unit's Soulpiercer is 6 instead of D3+3 until the end of that phase.`,
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
        desc: `This unit has a ward of 2+ against mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Horrible Fascination`,
        desc: `Enemy units within 3" of any friendly units with this ability cannot issue or receive commands.`,
        when: [DURING_GAME],
      },
      {
        name: `Horrible Fascination`,
        desc: `Enemy units within 3" of any friendly units with this ability cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Infernal Enrapturess, Herald of Slaanesh': {
    effects: [
      {
        name: `Discordant Disruption`,
        desc: `If a casting roll for an enemy Wizard within 24" of any friendly units with this ability is successful, that casting roll must be rerolled. If the rerolled casting roll is a double or if 1 of the dice in the rerolled casting roll is a 6, that Wizard suffers D3 mortal wounds after the effect of the spell (if any) has been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Versatile Instrument`,
        desc: `Each time this unit shoots, choose either the Cacophonous Melody or Euphonic Blast weapon characteristics for all the attacks it makes with its Heartstring Lyre.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'The Masque': {
    effects: [
      {
        name: `Staff of Masks`,
        desc: `At the start of your hero phase, you can either add 3 to the Attacks characteristic of this unit's melee weapons until your next hero phase or heal up to 3 wounds allocated to this unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Endless Dance`,
        desc: `After deployment but before the first battle round begins, you can remove this unit from the battlefield. If you do so, set this unit up again anywhere within your opponent's territory more than 3" from all enemy units.`,
        when: [END_OF_SETUP],
      },
      LitheAndSwiftEffect,
      {
        name: `Inhuman Reflexes`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Viceleader, Herald of Slaanesh': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Lightning Reflexes`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `Lust for Violence`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly Daemonette Host unit wholly within 12" of this unit that has not yet fought in that phase. This unit and that Daemonette Host unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bladebringer, Herald on Hellflayer': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      SoulscentEffect,
      {
        name: `Slavering for Sensation`,
        desc: `While friendly Hellflayer units are wholly within 12" of any friendly units with this ability, their Soulscent ability causes D3 mortal wounds on a 3+ instead of 4+.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_APRIL_2023],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Bladebringer, Herald on Seeker Chariot': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      ImpossiblySwiftEffect,
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Mutilating Blades`,
        desc: `After this unit finishes a charge move, roll a dice for each enemy unit within 1" of this unit. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Thrillseeker`,
        desc: `While friendly Seeker Chariot units are wholly within 12" of any friendly units with this ability, add 1 to the number of mortal wounds caused by their Mutilating Blades ability.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Hellflayer: {
    effects: [SoulscentEffect],
  },
  'Seeker Chariots': {
    effects: [
      ImpossiblySwiftEffect,
      {
        name: `Mutilating Blades`,
        desc: `After this unit finishes a charge move, roll a dice for each enemy unit within 1" of this unit. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bladebringer, Herald on Exalted Chariot': {
    mandatory: {
      spells: [keyPicker(Spells, ['Acquiescence'])],
    },
    effects: [
      ExcessOfBladesEffect,
      {
        name: `Soulgorgers`,
        desc: `This unit can issue the same command up to 2 times in the same phase. If it does so, each command must be received by a friendly Exalted Chariot unit. No command point is spent the second time this unit issues that command in that phase.`,
        when: [DURING_GAME],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Exalted Chariot': {
    effects: [
      ExcessOfBladesEffect,
      {
        name: `Bitter Frenzy`,
        desc: `Roll a dice each time this unit receives a command from a friendly Bladebringer Exalted Chariot unit. On a 4+, add 1 to the Damage characteristic of this unit's Flensing Whips until the end of that turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  Fiends: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Blissbringer. Add 1 to the Attacks characteristic of that model's Deadly Pincers.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Venom`,
        desc: `If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 1, that weapon has a Damage characteristic of 1 for that attack.

        If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 2-3, that weapon has a Damage characteristic of D3 for that attack.

        If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 4 or more, that weapon has a Damage characteristic of D6 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Disruptive Song`,
        desc: `Subtract 1 from casting, unbinding and dispelling rolls for enemy Wizards while they are within 12" of any friendly units with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soporific Musk`,
        desc: `Subtract 1 from hit rolls and wound rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Daemonettes: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Allurer. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      IconBearerEffect,
      HornBlowerEffect,
      LitheAndSwiftEffect,
    ],
  },
  Seekers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Heartseeker. Add 1 to the Attacks characteristic of that model's Piercing Claws.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      IconBearerEffect,
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Hornblower. You can reroll failed battleshock tests for this unit if it includes any Hornblowers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Quicksilver Speed`,
        desc: `You can roll 2D6 instead of D6 when you make a run roll for this unit. In addition, this unit can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Soul Hunters`,
        desc: `At the end of the combat phase, if any enemy models with a Wounds characteristic of 2 or less were slain by wounds caused by this unit's attacks in that phase, add 1 to the Attacks characteristic of this unit's Piercing Claws for the rest of the battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Hellstriders with Hellscourges': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hellreaver. Add 1 to the Attacks characteristic of that model's Hellscourge. Standard Bearer.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      IconBearerEffect,
      HornBlowerEffect,
      {
        name: `Hooked Tendrils`,
        desc: `Enemy models with a Wounds characteristic of 1 or 2 cannot contest objectives while they are within 3" of any friendly units with this ability.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Hellstriders with Claw-spears': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hellreaver. Add 1 to the Attacks characteristic of that model's Claw-spear.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      IconBearerEffect,
      HornBlowerEffect,
      {
        name: `Jagged Weapon-limbs`,
        desc: `If this unit is within 3" of any enemy units at the start of the charge phase, add 1 to the Attacks and Damage characteristics of this unit's Claw-spears in the following combat phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Lord of Pain': {
    effects: [
      {
        name: `Share the Pain`,
        desc: `This unit has a ward of 4+. In addition, each time a wound or mortal wound caused by an attack made with a melee weapon is negated by this ability, the attacking unit suffers 1 mortal wound.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Paragon of Pain`,
        desc: `Add 1 to hit rolls and wound rolls for friendly Hedonites of Slaanesh Mortal units wholly within 12" of this unit while this unit is contesting an objective.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Lord of Hubris': {
    effects: [
      {
        name: `Only the Best Will Suffice`,
        desc: `At the start of the combat phase, you can pick 1 friendly Myrmidesh Painbringers or Symbaresh Twinsouls unit wholly within 12" of any friendly units with this ability. If you do so, until the end of that phase, each time a model in that unit is slain, it can fight immediately, then it is removed from play.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `'You First, I Insist...'`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `'You First, I Insist...'`,
        desc: `At the end of the charge phase, you can pick 1 enemy unit within 1" of this unit and say that the Lord of Hubris will give them the chance to strike first. If you do so, the strike-first effect applies to that enemy unit in the following combat phase, but if this unit is within 3" of that enemy unit when it is picked to fight, all of that unit's attacks must target this unit.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_APRIL_2023],
      },
    ],
  },
  'The Dread Pageant': {
    effects: [
      {
        name: `Art of the Myrmidesh`,
        desc: `Vasillac the Gifted has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Deadliest Procession`,
        desc: `Once per battle, at the end of the charge phase, you can say that this unit will draw on their combined experience. If you do so, the strike-first effect applies to this unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Glutos Orscollion, Lord of Gluttony': {
    mandatory: {
      spells: [keyPicker(Spells, ['Crippling Famishment'])],
    },
    effects: [
      {
        name: `The Grand Gourmand`,
        desc: `This unit gains an ability each battle round. These abilities are cumulative.`,
        when: [DURING_GAME],
      },
      {
        name: `The Grand Gourmand: Aperitif (Battle Round 1)`,
        desc: `Add 1 to the Bravery characteristic of friendly Hedonites of Slaanesh Mortal units while they are wholly within 12" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Grand Gourmand: Starter (Battle Round 2)`,
        desc: `This unit can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `The Grand Gourmand: Main Course (Battle Round 3)`,
        desc: `Do not take battleshock tests for friendly Hedonites of Slaanesh Mortal units while they are wholly within 12" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Grand Gourmand: Dessert (Battle Round 4)`,
        desc: `This unit can attempt to cast 1 extra spell in your hero phase and attempt to unbind 1 extra spell in the enemy hero phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `The Grand Gourmand: Digestif (Battle Round 5)`,
        desc: `You can reroll casting, dispelling and unbinding rolls for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fog of Temptation`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units within 12" of this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Gorge on Excess`,
        desc: `At the start of your hero phase, you can pick 1 friendly Hedonites of Slaanesh Mortal unit wholly within 12" of this unit. If you do so, until your next hero phase, each time that unit fights, after all of its attacks have been resolved, you can heal up to a number of wounds allocated to that unit equal to the number of wounds and mortal wounds caused by those attacks that were allocated to enemy units (up to a maximum of 6).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Blessings of the Dark Prince`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,

      // Companion abilities
      // {
      //   name: `Painbringer Kyazu`,
      //   desc: `If the unmodified wound roll for an attack made with this model's Wailing Greatblade is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a save roll).`,
      //   when: [COMBAT_PHASE],
      // },
      // {
      //   name: `Lashmaster Vhyssk`,
      //   desc: `You can reroll charge rolls for this model.`,
      //   when: [CHARGE_PHASE],
      // },
      // {
      //   name: `Priestess Dolece`,
      //   desc: `In your hero phase, you can say that Dolece will call to Slaanesh to protect her master. If you do so, roll a dice. On a 1, nothing happens. On a 2+, until your next hero phase, you can roll a dice each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
      //   when: [HERO_PHASE],
      // },
    ],
  },
  'Sigvald, Prince of Slaanesh': {
    effects: [
      {
        name: `Glorious Reborn`,
        desc: `The strike-first effect applies to this unit if it made a charge move in the same turn.`,
        when: [START_OF_COMBAT_PHASE, CHARGE_PHASE],
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
        desc: `Ward rolls cannot be made for wounds and mortal wounds caused by attacks made by this unit.`,
        when: [WARDS_PHASE],
      },
      {
        name: `The Mirror Shield`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Shardspeaker of Slaanesh': {
    mandatory: {
      spells: [keyPicker(Spells, ['Reflection Eternal'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Mist Lurkers`,
        desc: `If this unit successfully casts a spell that is not unbound, until your next hero phase, it gains the Shadow-cloaked Claws weapon profile above and can attack with that melee weapon. In addition, this unit has a ward of 4+ until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Twisted Mirror`,
        desc: `Once per turn in your shooting phase, you can pick 1 enemy unit within 9" of this unit and roll a dice. On a 4+, subtract 1 from save rolls for attacks that target that unit until your next hero phase. The same unit cannot be affected by this ability more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
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
        desc: `This unit can run and still shoot later in the turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Blissbarb Seekers': {
    effects: [
      HighTempterEffect,
      {
        name: `Vectors of Agony`,
        desc: `If any wounds caused by attacks made with missile weapons by this unit are allocated to an enemy unit, subtract 1 from save rolls for attacks that target that unit until the end of that turn. The same unit cannot be affected by this ability more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Flawless Accuracy`,
        desc: `This unit can run and still shoot later in the turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Slickblade Seekers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hunter-Seeker. Add 1 to the Attacks characteristic of that model's Slickblade Glaive.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unrivalled Velocity`,
        desc: `This unit can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Decapitating Strikes`,
        desc: `Add 1 to the Attacks characteristic of this unit's Slickblade Glaives if the target unit has a Wounds characteristic of 3 or less.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Myrmidesh Painbringers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Painmaster. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Painbringer Shields`,
        desc: `Add 1 to save rolls for attacks that target this unit while it is wholly within enemy territory or wholly within 12" of an objective that you do not control.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Symbaresh Twinsouls': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Egopomp. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ego-driven Excess`,
        desc: `Subtract 1 from the Attacks characteristic of melee weapons used by enemy units (to a minimum of 1) while they are within 3" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fiendish Reflexes`,
        desc: `This unit has a ward of 5+ while it is within 3" of any enemy units.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Slaangor Fiendbloods': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Slake-horn. That model is armed with a Razor-sharp Claw and Gilded Weapon instead of Razor-sharp Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Slaughter At Any Cost`,
        desc: `At the end of any phase, if any wounds or mortal wounds were allocated to this unit in that phase, and this unit is more than 9" from all enemy units, this unit can move up to D6".`,
        when: [END_OF_ANY_PHASE],
      },
      {
        name: `Obsessive Violence`,
        desc: `Once per battle, in the combat phase, after this unit has fought for the first time in that phase, you can say that it will continue its obsessive onslaught. If you do so, this unit can fight for a second time in that phase. The strike-last effect applies to this unit when it fights for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Dexcessa: {
    effects: [
      {
        name: `Fleeting Dance of Death`,
        desc: `This unit can run or retreat and still charge later in the turn.`,
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
        desc: `Do not take battleshock tests for friendly Hedonites of Slaanesh Daemon units wholly within 12" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Sceptre of Slaanesh`,
        desc: `Once per turn, this unit can issue a command to a friendly Hedonites of Slaanesh Daemon unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Synessa, The Voice of Slaanesh': {
    mandatory: {
      spells: [keyPicker(Spells, ['Whispers of Doubt'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      WarmasterEffect,
      MesmerisingLepidopteraEffect,
      {
        name: `Staff of Slaanesh`,
        desc: `Do not use the attack sequence for an attack made with this unit's Staff of Slaanesh. Instead, pick 1 enemy unit within range and visible to this unit. Your opponent must roll a dice for that unit. If the roll is less than that unit's Save characteristic, that unit suffers 6 mortal wounds. If the roll is equal to or greater than that unit's Save characteristic, that unit suffers 3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `The Voice of Slaanesh`,
        desc: `Once per turn, this unit can issue a command to a friendly Hedonites of Slaanesh unit on the battlefield without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
