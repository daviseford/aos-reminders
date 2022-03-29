import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import rule_sources from './rule_sources'
import Spells from './spells'

const MountainOfLoathsomeFleshEffect = {
  name: `Mountain of Loathsome Flesh`,
  desc: `You can carry out this monstrous rampage with this unit instead of any other monstrous rampage you can carry out with this unit. If you do so, pick 1 enemy unit within 3" of this unit and roll a dice. On a 2+, that enemy unit suffers a number of mortal wounds equal to the Mountain of Loathsome Flesh value on this unit's damage table.`,
  when: [END_OF_CHARGE_PHASE],
  shared: true,
}

const TaintedEndlessSpellEffect = {
  name: `Tainted Endless Spell`,
  desc: `If this unit summons an endless spell, then for the purposes of the Diseased battle trait, that endless spell is treated as a unit with the Maggotkin of Nurgle keyword that is in the same army as this unit.`,
  when: [HERO_PHASE],
  shared: true,
}
const WarmasterEffect = {
  name: `Warmaster`,
  desc: `If this unit is included in a Maggotkin of Nurgle army, it is treated as a general even if it is not the model picked to be the army's general.`,
  when: [DURING_GAME],
  shared: true,
}
const BloatedWithCorruptionEffect = {
  name: `Bloated with Corruption`,
  desc: `If an unmodified ward roll for this unit is 6, you can pick 1 enemy unit within 3" of this unit. That enemy unit suffers 1 disease point.`,
  when: [SAVES_PHASE],
  shared: true,
}
const RelentlessAttackersEffect = {
  name: `Relentless Attackers`,
  desc: `At the end of the combat phase, pick 1 enemy unit with a Wounds characteristic of 3 or less that is within 3" of this unit. Roll 1 dice for each model in this unit that is within 3" of that enemy unit. For each roll that exceeds that enemy unit's Wounds characteristic, that enemy unit suffers 1 mortal wound.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}
const LordOfTheBlightkingsEffect = {
  name: `Lord of the Blightkings`,
  desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly Putrid Blightkings unit wholly within 12" of this unit and that has not yet fought in that phase. This unit and that Putrid Blightkings unit can fight one after the other in the order of your choice.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const Units = {
  Rotigus: {
    mandatory: {
      spells: [keyPicker(Spells, ['Deluge of Nurgle'])],
    },
    effects: [
      WarmasterEffect,
      GenericEffects.WizardTwoSpellsEffect,
      BloatedWithCorruptionEffect,
      {
        name: `The Rainfather`,
        desc: `You can reroll the casting roll when this unit attempts to cast the Deluge of Nurgle spell.`,
        when: [HERO_PHASE],
      },
      MountainOfLoathsomeFleshEffect,
    ],
  },
  'Great Unclean One': {
    mandatory: {
      spells: [keyPicker(Spells, ['Plague Wind'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      BloatedWithCorruptionEffect,
      MountainOfLoathsomeFleshEffect,
      {
        name: `Putrid Offering`,
        desc: `In your hero phase, if this unit is armed with a Bileblade, you can say that it is making an offering to Nurgle. If you do so, this unit suffers 1 mortal wound that cannot be negated, but it can attempt to cast 1 extra spell in that hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reverberating Summons`,
        desc: `If this unit is armed with a Doomsday Bell, at the start of your hero phase, if this unit is on the battlefield, you can roll a dice. On a 1, nothing happens. On a 2-5, you receive 1 extra contagion point. On a 6, you receive D3 extra contagion points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Poxbringer, Herald of Nurgle': {
    mandatory: {
      spells: [keyPicker(Spells, ['Eruptive Infestation'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Captain of the Tallybands`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly Plaguebearer Host wholly within 12" of this unit and that has not yet fought in that phase. This unit and that Plaguebearer Host can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Epidemius, Tallyman of Nurgle': {
    effects: [
      {
        name: `Tallyman of Nurgle`,
        desc: `At the start of your hero phase, if this unit is on the battlefield, roll the following number of dice for each of the following units and terrain features that are visible to this unit:

        - 3 dice for each friendly Great Unclean One.

        - 2 dice for each friendly Plaguebearer Host that has 10 or more models and each Feculent Gnarlmaw in your army.

        1 dice for each other friendly Maggotkin of Nurgle unit.

        For each roll of 5+, add 1 to the tally of new diseases kept by Epidemius, to a maximum tally of 7. Each new disease that is recorded allows you to reroll 1 ward roll, casting roll, dispelling roll or unbinding roll that you make for a friendly Maggotkin of Nurgle unit.

        Designer's Note: You can keep track of the tally of diseases and the number of rerolls you have used on a piece of paper or with a separate pool of dice. Note that each new disease only allows you to make a single reroll during the battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Spoilpox Scrivener, Herald of Nurgle': {
    effects: [
      {
        name: `Keep Counting, I'm Watching You`,
        desc: `At the start of the combat phase, you can say that this unit will call for a count. If you do so, pick 1 friendly Plaguebearer Host wholly within 14" of this unit and pick 1 of the following counts for that unit to carry out. The effect of that count lasts until the end of that phase. A unit cannot carry out more than 1 count per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Tally of Blows (Count)`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by a unit carrying out this count.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Studied Lacerations (Count)`,
        desc: `Improve the Rend characteristic of melee weapons used by a unit carrying out this count by 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Recorded Stamina (Count)`,
        desc: `Add 1 to save rolls for attacks that target a unit carrying out this count.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Sloppity Bilepiper, Herald of Nurgle': {
    effects: [
      {
        name: `Jolly Gutpipes`,
        desc: `At the start of the combat phase, you can say that this unit will play a revolting tune. If you do so, pick 1 of the following tunes. The effect of that tune lasts until the end of that phase. A unit cannot benefit from a tune more than once per phase. If a unit is affected by 2 or more different tunes, none of those tunes have an effect on that unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `A Stabbing We Will Go! (Tune)`,
        desc: `Add 1 to wound rolls for attacks made by friendly Nurgle Daemon units wholly within 14" of any friendly Sloppity Bilepipers playing this tune.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Early One Evening My Pustule Was Seeping (Tune)`,
        desc: `If the unmodified wound roll for an attack made by a friendly Nurgle Daemon unit wholly within 14" of any friendly Sloppity Bilepipers playing this tune is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `My Love Is Like a Ripe, Ripe Fart (Tune)`,
        desc: `Enemy models within 3" of a friendly Nurgle Daemon unit that is wholly within 14" of any friendly Sloppity Bilepipers playing this tune cannot finish pile-in moves closer to a model in that unit than they were at the start of the move.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Horticulous Slimux': {
    effects: [
      {
        name: `Beast Handler`,
        desc: `You can reroll charge rolls for friendly Beasts of Nurgle units that are wholly within 14" of this unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Beast Handler`,
        desc: `You can add 1 to hit rolls for attacks made by friendly Beasts of Nurgle units that are wholly within 14" of this unit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Cultivating the Garden of Nurgle`,
        desc: `Once per battle, at the start of your hero phase, you can set up 1 Feculent Gnarlmaw within 7" of this unit, more than 7" from all other Feculent Gnarlmaws and more than 3" from all other models, objectives, other terrain features, endless spells and invocations and add it to your army.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NURGLE, rule_sources.ERRATA_JANUARY_2022],
      },
      {
        name: `Acidic Slime Trail`,
        desc: `Before this unit retreats, roll a dice for each enemy unit that is within 3" of this unit. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Plaguebearers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Plagueridden. Add 1 to the Attacks characteristic of that model's Plaguesword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be an Icon Bearer. If the unmodified battleshock roll for a unit that includes any Icon Bearers is 1, you can return 1 slain model to that unit and no models in that unit flee in that battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Piper. Reroll battleshock rolls of 1 for enemy units that are within 6" of any friendly Pipers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Cloud of Flies`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this unit while it has 5 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Plague Drones': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Plaguebringer. Add 1 to the Attacks characteristic of that model's Plaguesword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 3 models in this unit can be an Icon Bearer. If the unmodified battleshock roll for a unit that includes any Icon Bearers is 1, you can return 1 slain model to that unit and no models in that unit flee in that battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 3 models in this unit can be a Bell Toller. Reroll battleshock rolls of 1 for enemy units that are within 6" of any friendly Bell Tollers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Putrid Explosions`,
        desc: `The Attacks characteristic of a Death's Head is equal to the number of models in the target unit, to a maximum of 7.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Beasts of Nurgle': {
    effects: [
      {
        name: `Attention Seekers`,
        desc: `This unit can run or retreat and still charge later in the same turn. In addition, when this unit retreats, it can pass across other models in the same manner as a model that can fly.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Diseased Slime Trails`,
        desc: `Before this unit retreats, roll a dice for each enemy unit within 3" of this unit. On a 4+, that unit suffers 1 disease point.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Pestilent Battering Rams`,
        desc: `After a model in this unit finishes a charge move, roll a dice for each enemy unit within 1" of that model. On a 2+, that enemy unit suffers D3 mortal wounds. If this unit has more than 1 model, roll to determine if mortal wounds are caused after each model finishes its charge move, but do not allocate the mortal wounds until all of the models in the unit have finished their charge moves.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Nurglings: {
    effects: [
      {
        name: `Endless Swarm`,
        desc: `At the end of the battleshock phase, heal all wounds that have been allocated to this unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Hidden Infestations`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in a hidden infestation as a reserve unit. If you do so, at the end of your first movement phase, you must set up this unit on the battlefield, wholly outside of your territory, within 3" of a terrain feature and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Hidden Infestations`,
        desc: `If you previously declared this unit as a reserve unit, at the end of your first movement phase, you must set up this unit on the battlefield, wholly outside of your territory, within 3" of a terrain feature and more than 9" from all enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'The Glottkin': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Blightkrieg'])],
      spells: [keyPicker(Spells, ['Abundance of Flesh'])],
    },
    effects: [
      WarmasterEffect,
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Horrific Opponent`,
        desc: `At the start of the enemy movement phase, you must roll 2D6 for each enemy unit that is within 3" of this unit. If the roll is equal to or greater than that unit's Bravery characteristic, that unit must retreat in that phase or it suffers D6 mortal wounds.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      MountainOfLoathsomeFleshEffect,
    ],
  },
  'Orghotts Daemonspew': {
    effects: [
      WarmasterEffect,
      {
        name: `Acid Ichor`,
        desc: `If an unmodified ward roll for this unit is 6, you can pick 1 enemy unit within 3" of this unit. That enemy unit suffers 1 mortal wound.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Lord of Nurgle`,
        desc: `Once per turn, this unit can issue a command to a friendly Mortal Maggotkin of Nurgle unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bloab Rotspawned': {
    mandatory: {
      spells: [keyPicker(Spells, ['Miasma of Pestilence'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Daemon-flies`,
        desc: `At the start of the combat phase and the enemy shooting phase, roll a dice for each enemy unit within 7" of this unit. On a 4+, that enemy unit suffers 1 mortal wound and subtract 1 from hit rolls for attacks made by that enemy unit in that phase.`,
        when: [START_OF_COMBAT_PHASE, START_OF_SHOOTING_PHASE],
      },
      {
        name: `Windspeaker Bells`,
        desc: `Add 1 to casting rolls for this unit. In addition, subtract 1 from casting rolls for enemy Wizards that are within 14" of this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Morbidex Twiceborn': {
    effects: [
      {
        name: `Gigantic Nurgling-kin`,
        desc: `At the end of the battleshock phase, heal half of the wounds that have been allocated to this unit (rounding up).`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Lord of Nurglings`,
        desc: `At the start of your hero phase, you can return 1 slain model to 1 friendly Nurgling Swarm within 7" of this model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lord of Afflictions': {
    effects: [
      {
        name: `Incubatch`,
        desc: `If this unit has an Incubatch, in your hero phase, roll a dice for each unit within 3" of this unit. On a 2+, that unit suffers 1 mortal wound. If that unit has the Nurgle keyword, it suffers 1 mortal wound on a 6+ instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrack and Ruin`,
        desc: `After this unit finishes a charge move, roll a dice for each enemy unit within 1" of this unit. Add 2 to the roll if this unit is armed with a Dolorous Tocsin. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `The Swarm Descends`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up hovering in the skies as a reserve unit. If you do so, when you would set up a friendly Pusgoyle Blightlords or Plague Drones unit during deployment, that unit can join this unit hovering in the skies as a reserve unit. Up to 2 Pusgoyle Blightlords or Plague Drones units in any combination can join this unit. At the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units. If you do so, set up all of the units that joined this unit on the battlefield, wholly within 12" of this unit and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Swarm Descends`,
        desc: `At the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units. If you do so, set up all of the units that joined this unit on the battlefield, wholly within 12" of this unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Festus the Leechlord': {
    mandatory: {
      spells: [keyPicker(Spells, ["The Leechlord's Curse"])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Delightful Brews, Splendid Restoratives`,
        desc: `At the start of your hero phase, you can pick 1 unit within 1" of this unit. If you pick a friendly unit, roll a dice. On a 2+, you can heal up to D3 wounds allocated to that unit. If you pick an enemy unit, roll a dice. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Harbinger of Decay': {
    effects: [
      {
        name: `Augur of Entropy`,
        desc: `If any friendly units with this ability are within 7" of your general at the start of the first battle round, you receive D3 extra command points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Shudderblight`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, that unit cannot issue or receive commands in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Rotbringer Sorcerer': {
    mandatory: {
      spells: [keyPicker(Spells, ['Stream of Corruption'])],
    },
    effects: [GenericEffects.WizardOneSpellEffect, TaintedEndlessSpellEffect],
  },
  'Lord of Blights': {
    effects: [
      {
        name: `Munificent Bounty`,
        desc: `At the start of your shooting phase, you can pick 1 friendly Putrid Blightkings model that is within 7" of this unit. That model can shoot in that shooting phase using the Thriceripened Death's Head missile weapon profile above.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Putrid Explosions`,
        desc: `The Attacks characteristic of a Thriceripened Death's Head is equal to the number of models in the target unit, to a maximum of 7.`,
        when: [SHOOTING_PHASE],
      },
      LordOfTheBlightkingsEffect,
    ],
  },
  'Gutrot Spume': {
    effects: [
      {
        name: `Towering Arrogance`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target a HERO. In addition, if this unit is within 1" of an enemy HERO, all of the attacks this unit makes must target a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Master of the Slime Fleet`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up aboard the Slime Fleet as a reserve unit. If you do so, when you would set up another friendly Mortal Maggotkin of Nurgle unit during deployment, you can say that it is joining this unit aboard the Slime Fleet as a reserve unit. Up to 3 Mortal Maggotkin of Nurgle units can join this unit. Units that have been reinforced count as 2 units. At the end of your movement phase, you can set up this unit on the battlefield, more than 9" from all enemy units and wholly within 6" of the edge of the battlefield. If you do so, set up all of the units that joined this unit on the battlefield, wholly within 12" of this unit, more than 9" from all enemy units and wholly within 6" of the edge of the battlefield.`,
        when: [DURING_SETUP],
      },
      {
        name: `Master of the Slime Fleet`,
        desc: `At the end of your movement phase, you can set up this unit on the battlefield, more than 9" from all enemy units and wholly within 6" of the edge of the battlefield. If you do so, set up all of the units that joined this unit on the battlefield, wholly within 12" of this unit, more than 9" from all enemy units and wholly within 6" of the edge of the battlefield.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Lord of Plagues': {
    effects: [
      {
        name: `Rotten Corpse-mulch`,
        desc: `You receive 1 contagion point for each enemy unit that is destroyed by an attack made by this unit. Sevenfold Slaughter.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Sevenfold Slaughter`,
        desc: `At the start of the combat phase, you can pick 1 friendly Putrid Blightkings unit that is wholly within 12" of this unit and that has not yet fought in that phase. Add 1 to the Attacks characteristic of melee weapons used by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      LordOfTheBlightkingsEffect,
    ],
  },
  'Putrid Blightkings': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Blightlord. That model has a Wounds characteristic of 5.`,
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be an Icon Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Sonorous Tocsin Bearer. Reroll battleshock rolls of 1 for enemy units that are within 6" of any friendly Sonorous Tocsin Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      RelentlessAttackersEffect,
    ],
  },
  'Pusgoyle Blightlords': {
    effects: [
      {
        name: `Wrack and Ruin`,
        desc: `After a model in this unit finishes a charge move, roll a dice for each enemy unit within 1" of that model. Add 2 to the roll if the model is armed with a Dolorous Tocsin. On a 4+, that enemy unit suffers D3 mortal wounds. If this unit has more than 1 model, roll to determine if mortal wounds are inflicted after each model finishes its charge move, but do not allocate the mortal wounds until all of the models in the unit have finished their charge moves.`,
        when: [CHARGE_PHASE],
      },
      RelentlessAttackersEffect,
    ],
  },
  'Fecula Flyblown': {
    mandatory: {
      spells: [keyPicker(Spells, ['Stream of Corruption'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Retchling`,
        desc: `Once per battle, in your hero phase, you can choose for this unit to channel the power of its familiar. If you do so, this unit can attempt to cast 1 additional spell that phase.`,
        when: [HERO_PHASE],
      },
      TaintedEndlessSpellEffect,
    ],
  },
  'The Wurmspat': {
    effects: [
      {
        name: `Festering Bodyguards`,
        desc: `If a friendly Fecula Flyblown is within 3" of this unit, before you allocate a wound or mortal wound to her, or instead of making a ward roll for her, you can roll a dice. On a 4+, that wound is allocated to this unit instead and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE, SAVES_PHASE],
      },
      RelentlessAttackersEffect,
    ],
  },
  'Rot Coven': {
    mandatory: {
      spells: [keyPicker(Spells, ['Stream of Corruption'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `Each model in this unit can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      TaintedEndlessSpellEffect,
    ],
  },
}

export default tagAs(Units, 'unit')
