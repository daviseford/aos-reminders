import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const baseSorcerer = {
  mandatory: {
    spells: [keyPicker(Spells, ['Stream of Corruption'])],
  },
  effects: [
    {
      name: `Blessed with Vitality`,
      desc: `Roll a D6 each time this model successfully casts a spell and it is not unbound. On a 4+ you can heal 1 wound allocated to this model.`,
      when: [HERO_PHASE],
    },
  ],
}
const BlubberAndBileEffect = {
  name: `Blubber and Bile`,
  desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated. In addition, on a 6, if the attacking unit is within 3" of this model, it suffers 1 mortal wound.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const CorpulentMassEffect = {
  name: `Corpulent Mass`,
  desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
  when: [HERO_PHASE],
}
const DisgustinglyResilientEffect = {
  name: `Disgustingly Resilient`,
  desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const MountainOfLoathsomeFleshEffect = {
  name: `Mountain of Loathsome Flesh`,
  desc: `Roll a D6 for each enemy unit within 1" of this model after it completes a charge move. On a 4+ the enemy unit suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
}
const BlightedWeaponsEffect = {
  name: `Blighted Weapons`,
  desc: `If the unmodified hit roll for an attack made with this unit's Blighted Weapons is 6, that attack scores D6 hits on the target instead of 1. Make a wound and save roll for each hit.`,
  when: [COMBAT_PHASE],
}
const VirulentDischargeEffect = {
  name: `Virulent Discharge`,
  desc: `Roll a D6 for each unit (friend or foe) within 3" of any friendly units with this ability. On a 6+ that unit suffers D3 mortal wounds. If the unit has the NURGLE keyword, heal D3 wounds allocated instead.`,
  when: [HERO_PHASE],
}
const BloatedFleshEffect = {
  name: `Bloated Flesh`,
  desc: `Roll a D6 each time you allocate a mortal wound to a model in this unit. On a 4+, that mortal wound is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
}

const Units = {
  Rotigus: {
    mandatory: {
      spells: [keyPicker(Spells, ['Deluge of Nurgle'])],
    },
    effects: [
      BlubberAndBileEffect,
      CorpulentMassEffect,
      MountainOfLoathsomeFleshEffect,
      {
        name: `Streams of Brackish Filth`,
        desc: `In your hero phase roll a D6 for each enemy unit that is within 6" of Rotigus. On a 4+ the enemy unit suffers D3 mortal wounds. Enemy units that can fly suffer D3 mortal wounds on a 6+ instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Rotigus is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Deluge of Nurgle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Great Unclean One': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["Grandfather's Joy"])],
      spells: [keyPicker(Spells, ['Plague Wind'])],
    },
    effects: [
      BlubberAndBileEffect,
      CorpulentMassEffect,
      MountainOfLoathsomeFleshEffect,
      {
        name: `Putrid Offering`,
        desc: `If this model has a Bileblade and attempts to cast or unbind a spell, this model can suffer 1 mortal wound (cannot be negated) to add 1 to the cast or unbind.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reverberating Summons`,
        desc: `If a Nurgle unit begins its movement phase within 7" of any models with a Doomsday Bell, add 3 to its move characteristic until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Plague Wind.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Poxbringer, Herald of Nurgle': {
    mandatory: {
      spells: [keyPicker(Spells, ['Eruptive Infestation'])],
    },
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `In Death There is Life`,
        desc: `At the start of your hero phase, if any models (friend or foe) were slain in the last turn, you can heal 1 wound allocated to a friendly Nurgle Daemon unit within 7" of this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell in the enemy hero phase. Knows Arcane Bolt, Mystic Shield, and Eruptive Infestation.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Epidemius, Tallyman of Nurgle': {
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `Nurgle's Tallyman`,
        desc: `Keep a tally of the number of enemy models that have been slain by friendly Nurgle units during the battle. At the start of your hero phase, consult the table to check benefits to Nurgle units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Spoilpox Scrivener, Herald of Nurgle': {
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `Keep Counting, I'm Watching You`,
        desc: `Reroll dice rolls of 1 when making charge rolls for friendly Plaguebearers units while they are within 7" of this model. In addition, reroll hit rolls of 1 for friendly Plaguebearers units while they are within 7" of this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Keep Counting, I'm Watching You`,
        desc: `Reroll hit rolls of 1 for friendly Plaguebearers units while they are within 7" of this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sloppity Bilepiper, Herald of Nurgle': {
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `Disease of Mirth`,
        desc: `Add 1 to the bravery characteristic of friendly Nurgle Daemon units while they are within 7" of any Sloppity Bilepipers. In addition, subract 1 from the bravery characteristic of enemy units while they are within 7" of any Sloppity Bilepipers.`,
        when: [DURING_GAME],
      },
      {
        name: `Jolly Gutpiper`,
        desc: `Reroll failed charge rolls for friendly Nurglings and Great Unclean One units while they are within 7" of any Sloppity Bilepipers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Jolly Gutpiper`,
        desc: `Reroll failed hit rolls of 1 for friendly Nurglings and Great Unclean One units while they are within 7" of any Sloppity Bilepipers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Horticulous Slimux': {
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `Acidic Slime Trail`,
        desc: `Roll a D6 for each enemy unit within 3" of this model immediately before this model makes a retreat move. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Beast Handler`,
        desc: `Reroll failed charge rolls for friendly Beasts of Nurgle units while they are within 7" of this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Beast Handler`,
        desc: `Reroll failed hit rolls of 1 for friendly Beasts of Nurgle units while they are within 7" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `In Death There is Life`,
        desc: `If any models (friend or foe) were slain in the last turn, you can heal 1 wound allocated to a friendly Nurgle Daemon unit within 7" of this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Cultivating the Garden of Nurgle`,
        desc: `Once during the battle, you can set up a Feculent Gnarlmaw within 3" of Horticulous Slimux, more that 3" from any other terrain feature, and more that 1" from any objectives.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Plaguebearers: {
    effects: [
      {
        name: `Plagueridden`,
        desc: `The leader of this unit is a Plagueridden, add 1 to the attacks characteristic of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearer`,
        desc: `Models in this unit can be Icon Bearers. If an unmodified roll of 1 is made for a battleshock test, no models flee. Instead D6 models are added to the unit (up to a total equal to the starting size of the unit).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Pipers`,
        desc: `Models in this unit can be Pipers. Reroll battleshock tests of 1 for enemy units while they are within 6" of any Pipers.`,
        when: [BATTLESHOCK_PHASE],
      },
      DisgustinglyResilientEffect,
      {
        name: `Cloud of Flies`,
        desc: `Subtract 1 from hit rolls targeting this unit in the shooting phase. If the unit contains 20 or more models subtract 2 from hit rolls in the shooting phase and 1 from hit rolls in the combat phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Locus of Fecundity`,
        desc: `Reroll save rolls of 1 for this unit while it is within 7" of a Nurgle Daemon hero.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Plague Drones': {
    effects: [
      {
        name: `Plaguebringer`,
        desc: `The leader of this unit is a Plaguebringer. Add 1 to the attacks characteristic of a Plaguebringer's Plaguesword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearer`,
        desc: `Models in this unit can be Icon Bearers. If an unmodified roll of 1 is made for a battleshock test, no models flee. Instead 1 model is added to the unit (up to a total equal to the starting size of the unit).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bell Tollers`,
        desc: `Models in this unit can be Bell Tollers. Reroll battleshock tests of 1 for enemy units while they are within 6" of any Bell Tollers.`,
        when: [BATTLESHOCK_PHASE],
      },
      DisgustinglyResilientEffect,
      {
        name: `Locus of Contagion`,
        desc: `Add 1 to the attacks characteristic of this unit's weapons while it is within 7" of a friendly Nurgle Daemon hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Beasts of Nurgle': {
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `Acidic Slime Trail`,
        desc: `Roll a D6 for each enemy unit within 3" of this model immediately before this model makes a retreat move. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Attention Seekers`,
        desc: `This unit can charge in the same turn in which it ran or retreated.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Locus of Virulencce`,
        desc: `Add 1 to the damage characteristics of this units weapons while within 7" of a friendly Nurgle Daemon hero.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Nurglings: {
    effects: [
      {
        name: `Disease Ridden Demise`,
        desc: `Roll a D6 for each enemy unit that was allocated any wounds caused by a unit of Nurglings in that combat phase. On a 2+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Endless Swarm`,
        desc: `Heal any wounds allocated to this unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Hidden Infestations`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is setup as a hidden infestation.`,
        when: [DURING_SETUP],
      },
      {
        name: `Hidden Infestations`,
        desc: `Set up any Nurglings using Hidden Infestations.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'The Glottkin': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lord of Nurgle'])],
      spells: [keyPicker(Spells, ['Fleshy Abundance'])],
    },
    effects: [
      MountainOfLoathsomeFleshEffect,
      {
        name: `Blessings of Nurgle`,
        desc: `You can heal D3 wounds that have been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Horrific Opponent`,
        desc: `Roll 2D6 for each enemy unit within 7" of this model. If the roll is greater than the unit's bravery characteristic, subtract 1 from hit rolls for that unit in the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells in your hero phase and attempt to unbind 1 spells. Knows Arcane Bolt, Mystic Shield, and Fleshy Abundance.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Orghotts Daemonspew': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Fester and Rot'])],
    },
    effects: [
      {
        name: `Acid Ichor`,
        desc: `Roll a D6 for each time you allocate a wound to this model in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fury of the Halfblood`,
        desc: `Add D3 to the attacks characteristic of Orghotts Daemonspew's Rotaxes if he made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Rotaxes`,
        desc: `At the end of the combat phase, roll a D6 for each enemy model that was allocated any wounds caused by the Rotaxes. On a 4+ that model suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bloab Rotspawned': {
    mandatory: {
      spells: [keyPicker(Spells, ['Miasma of Pestilence'])],
    },
    effects: [
      {
        name: `Daemon-flies`,
        desc: `Roll a D6 for each enemy unit within 7" of Bloab Rotspawned. On a 4+ subract 1 from the hit rolls for the unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Windspeaker Bells`,
        desc: `Subtract 1 from the casting rolls of enemy wizards while they are within 14" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Miasma of Pestilence.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Morbidex Twiceborn': {
    effects: [
      {
        name: `Lord of Nurglings`,
        desc: `You can pick 1 friendly Nurglings unit within 7" of this model and add 1 model to it (up to a total equal to the starting size of the unit).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Malicious Mites`,
        desc: `Add 1 to the wound rolls for friendly Nurglings units while they are within 7" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Nurgle's Rot`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of any units with this ability. On a roll of a 6, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Repugnant Regrowth`,
        desc: `Roll a D6, on a 4+ heal 1 wound allocated to this model. Heal D3 on rolls of 6+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lord of Afflictions': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Spearhead of Contagion'])],
    },
    effects: [
      DisgustinglyResilientEffect,
      {
        name: `Rotten Regeneration`,
        desc: `You can heal 1 wound that has been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Plague Vector`,
        desc: `Reroll hit rolls of 1 for friendly Rotbringer units while within 7" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Incubatch`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of this model. On a 2+ that unit suffers 1 mortal wound. Nurgle units instead suffer 1 mortal wound on a 6+.`,
        when: [HERO_PHASE],
      },
      VirulentDischargeEffect,
    ],
  },
  'Festus the Leechlord': {
    mandatory: {
      spells: [keyPicker(Spells, ['Curse of the Leper'])],
    },
    effects: [
      {
        name: `Healing Elixirs`,
        desc: `You can heal 1 wound that has been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Delightful Brews, Splendid Restoratives`,
        desc: `You can pick a unit (friend or foe) within 1" of this model. Pick a friendly or enemy unit and roll a D6. On a friendly unit, on a 2+ heal D3 wounds that have been allocated to that unit. On an enemy unit, on a 2+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Curse of the Leper.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Harbinger of Decay': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Morbid Vigour'])],
    },
    effects: [
      {
        name: `Soulbound Shield`,
        desc: `Roll a D6 each time you allocate a wound to this model as a result of a spell. On a 4+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Rotsword`,
        desc: `Once per battle, pick an enemy hero within 1" of this model and roll a D6. On a 2+ that hero suffers D3 mortal wounds. On a 4+ that hero suffers D3 mortal wounds and each other enemy unit within 7" of that hero suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Sorcerer: {
    mandatory: {
      ...baseSorcerer.mandatory,
    },
    effects: [...baseSorcerer.effects],
  },
  'Lord of Blights': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Plague of Flies'])],
    },
    effects: [
      {
        name: `Munificent Bounty`,
        desc: `You can pick 1 friendly unit of Putrid Blightkings that is within 3" of this model. That unit can shoot in the shooting phase using the Munificent Bounty Death's Head missile weapon.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Vermid Shield`,
        desc: `Reroll save rolls of 1 for this model.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Gutrot Spume': {
    effects: [
      {
        name: `Clutching Pseudopods`,
        desc: `You can pick an enemy model within 1" of this model. Choose a weapon carried by the target and roll a D6. On a 4+ that weapon cannot be used in the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Towering Arrogance`,
        desc: `Reroll hit rolls of 1 for this model is the target is a hero. In addition, if this model is within 3" of an enemy hero in the combat phase, he cannot target units that are not heros.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Master of the Slime Fleet`,
        desc: `Instead of placing this model on the battlefield you can set it and unit of Putrid Blightkings up aboard his flagship. This counts as a single set up.`,
        when: [DURING_SETUP],
      },
      {
        name: `Master of the Slime Fleet`,
        desc: `Set up this model and the unit of Putrid Blightkings within 6" of each other, wholly within 6" of the edge of the battlefield and more than 9" from any enemy models.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Lord of Plagues': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["Grandfather's Gift"])],
    },
    effects: [
      {
        name: `Wanton Slaughter`,
        desc: `Reroll hit rolls of 1 for friendly Putrid Blightking units while they are within 7" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Rotten Corpse Mulch`,
        desc: `Roll a D6 after this model makes its attacks. Add the number of wounds inflicted by this model (and which were not saved or negated) to the dice roll. If the total is a 7+ you immediately receive 1 contagion point.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plague-ridden Great Weapons`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this model is 6, that attack scores D6 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Putrid Blightkings': {
    effects: [
      {
        name: `Blightlord`,
        desc: `The leader of this unit is a Blightlord. Add one to the wound characteristic the Blightlord model.`,
        when: [DURING_GAME],
      },
      {
        name: `Icon Bearers`,
        desc: `Add 1 to this units bravery characteristic while it includes any Icon Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Sonorous Tocsin`,
        desc: `Add 1 to this unit's run and charge rolls while it includes any models carrying a Sonorous Tocsin.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      VirulentDischargeEffect,
      BlightedWeaponsEffect,
    ],
  },
  'Pusgoyle Blightlords': {
    effects: [DisgustinglyResilientEffect, VirulentDischargeEffect, BlightedWeaponsEffect],
  },
  'Exalted Greater Daemon Of Nurgle': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["Grandfather's Exalted Joy"])],
      spells: [keyPicker(Spells, ['Plague Wind'])],
    },
    effects: [
      {
        name: `Magic`,
        desc: `An Exalted Greater Daemon of Nurgle is a Wizard. It can attempt to cast two spells in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Plague Wind spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fecula Flyblown': {
    mandatory: {
      ...baseSorcerer.mandatory,
    },
    effects: [
      ...baseSorcerer.effects,
      {
        name: `Retchling`,
        desc: `Once per battle, in your hero phase, you can choose for this model to channel the power of its familiar. If you do so, this model can attempt to cast 1 additional spell that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Wurmspat': {
    effects: [
      VirulentDischargeEffect,
      BlightedWeaponsEffect,
      {
        name: `Festering Bodyguards`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to a friendly Fecula Flyblown while she is within 3" of this unit. On a 4+, that wound or mortal wound is allocated to this unit instead of Fecula Flyblown.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Tamurkhan's Horde Units
  'Tamurkhan the Maggot Lord': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Roar of Command'])],
    },
    effects: [
      {
        name: `Feast of the Maggot Lord`,
        desc: `If this model is slain, before this model is removed from play, you can pick 1 enemy HERO within 3" of this model. That Hero suffers D3 mortal wounds. If that HERO is slain by these mortal wounds, this model is not slain, D6 wounds allocated to this model are healed, and any that remain to be allocated to it are negated. If that HERO is not slain by these mortal wounds, this model is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Killer of Kings`,
        desc: `You can reroll hit rolls for attacks made with this model's Black Cleaver that target a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Nurgle's Favoured Son`,
        desc: `You can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Kazyk the Befouled': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Breath of the Plague Pit'])],
    },
    effects: [
      {
        name: `Corrupted Flesh`,
        desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 4+, that mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Noxious Blades`,
        desc: `If the unmodified hit roll for an attack with this model's Noxious Blades is 6, that attack has a Damage characteristic of 3 instead of D3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Daemon Plague Toads of Nurgle': {
    effects: [
      BloatedFleshEffect,
      {
        name: `Rot-eaters`,
        desc: `If the unmodified hit roll for an attack made with this unit's Yawning Maw is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Daemon Pox Riders of Nurgle': {
    effects: [
      BloatedFleshEffect,
      {
        name: `Cloud of Flies`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Locus of Fecundity`,
        desc: `You can reroll save rolls of 1 for attacks that target this unit while this unit is wholly within 14" of a friendly Nurgle Hero.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Rot-eaters`,
        desc: `If the unmodified hit roll for an attack made with this unit's Yawning Maw is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Plague Ogors': {
    effects: [
      {
        name: `Damned Flesh`,
        desc: `If a model from this unit is slain after a wound or mortal wound is allocated to it, roll a D6 before the slain model is removed from play. On a 5+, that wound or mortal wound is negated and the model is not slain.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Insatiably Famished`,
        desc: `You can reroll hit rolls of 1 for attacks made by this unit if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Plague Contagion`,
        desc: `You can roll 1 dice for each enemy unit within 3" of this unit. On a 5+, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bile Troggoths': {
    effects: [
      {
        name: `Infected Vomit`,
        desc: `If the unmodified hit roll for an attack made with this unit's Infected Vomit is 6, that attacks inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Fecund Regeneration`,
        desc: `You can heal up to D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs({ ...Units }, 'unit')
