import { tagAs } from 'factions/metatagger'
import { NURGLE } from 'meta/factions'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  [NURGLE]: {
    effects: [
      {
        name: `Diseased`,
        desc: `At the end of the movement phase and at the end of the combat phase, give 1 disease point to each enemy unit that is within 3" of any friendly MAGGOTKIN OF NURGLE units. A unit can have a maximum of 7 disease points at any one time (it cannot be given any more until the number of disease points it has is reduced to less than 7).
        
        Designer's Note: Once a unit is 'infected', it will carry over 1 disease point into the next turn unless all disease points it has are healed. `,
        when: [END_OF_MOVEMENT_PHASE, END_OF_COMBAT_PHASE],
      },
      {
        name: `Diseased`,
        desc: `At the start of the battleshock phase, for each disease point that an enemy unit has, you must make 1 roll (called a disease roll). For each 4+, that unit suffers 1 mortal wound.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Diseased`,
        desc: `At the end of the battleshock phase, reduce the number of disease each enemy unit has to 1.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },

      {
        name: `Diseased Weapons`,
        desc: `If the unmodified hit roll for an attack made with a missile weapon or melee weapon by a friendly MAGGOTKIN OF NURGLE model is 6, that attack inflicts 1 disease point on the target unit in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },

      {
        name: `Healing Disease Points`,
        desc: `When a player uses an ability that allows them to heal any wounds that have been allocated to a unit, for each wound that they are allowed to heal, they can instead remove 1 disease point from the unit.`,
        when: [DURING_GAME],
      },

      {
        name: `Disgustingly Resilient`,
        desc: `Friendly MAGGOTKIN OF NURGLE models have a ward of 5+.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Disgustingly Resilient`,
        desc: `At the start of your hero phase, you can heal 1 wound allocated to each friendly MAGGOTKIN OF NURGLE model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Locus of Fecundity`,
        desc: `The following friendly units are each a Locus of Fecundity: GREAT UNCLEAN ONE, HORTICULOUS SLIMUX, THE GLOTTKIN, FESTUS THE LEECHLORD. The Disgustingly Resilient battle trait heals D3 wounds allocated to a model instead of 1 if that model's unit is within 14" of any Loci of Fecundity.`,
        when: [START_OF_HERO_PHASE],
      },

      {
        name: `Summon Daemons of Nurgle`,
        desc: `You can summon NURGLE DAEMON units and Feculent Gnarlmaws to the battlefield if you have enough contagion points (referred to as 'CPs' in the following rules). At the start of your hero phase, you receive 3 CPs if there are any friendly MAGGOTKIN OF NURGLE units wholly within your territory, and 3 CPs if there are any friendly MAGGOTKIN OF NURGLE units wholly within your opponent's territory. If you receive CPs for a territory and there are no enemy models in that territory, you receive 1 extra CP.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Summon Daemons of Nurgle`,
        desc: `If you have any CPs at the end of the movement phase, you can summon 1 unit or terrain feature from the list below to the battlefield and add it to your army. Each unit or terrain feature you summon costs the number of CPs shown on the list, and you can only summon it if you have enough CPs to do so. Units must be set more than 9" from all enemy units and wholly within 7" of a friendly MAGGOTKIN OF NURGLE HERO or wholly within 7" of a Feculent Gnarlmaw in your army. Feculent Gnarlmaws must be set up more than 7" from all other Feculent Gnarlmaws and more than 3" from all models, objectives, other terrain features, endless spells and invocations.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Summon Daemons of Nurgle`,
        desc: `Summoning Costs:

        Great Unclean One -                     30 CP
        Plague Drones unit with 3 models -      18 CP
        PLAGUEBEARER HOST with 10 models -      14 CP
        Poxbringer, Herald of Nurgle -          12 CP
        Beasts of Nurgle unit with 1 model -    10 CP
        Feculent Gnarlmaw -                     9 CP
        NURGLING SWARM with 3 models -          8 CP
        Sloppity Bilepiper, Herald of Nurgle -  7 CP
        Spoilpox Scrivener, Herald of Nurgle -  7 CP`,
        when: [END_OF_MOVEMENT_PHASE],
      },

      {
        name: `Cycle of Corruption`,
        desc: `At the start of the first battle round, before determining who has the first turn, 1 player who can use this battle trait rolls a dice. The effect for the stage on the Cycle of Corruption chart below that corresponds to the roll applies in that battle round. At the start of each subsequent battle round, the Cycle of Corruption advances to the next stage and the effect for that stage applies in that battle round. If more than 1 player can use this battle trait, the current stage of the Cycle of Corruption applies to each of those players.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Cycle of Corruption`,
        desc: `
        1. Unnatural Vitality: All MAGGOTKIN OF NURGLE HEROES have a ward of 4+.

        2. Fecund Vigour: All units are treated as being within 14" of a Locus of Fecundity.

        3. Burgeoning: At the start of your hero phase, roll a number of dice equal to the number of the current battle round. For each 4+, you receive 1 extra CP.

        4. Plague of Misery: HEROES that do not have the NURGLE keyword cannot carry out heroic actions or issue the Rally or Inspiring Presence commands.

        5. Nauseous Revulsion: Subtract 1 from charge rolls for enemy units that do not have the NURGLE keyword. Enemy units that do not have the NURGLE keyword cannot finish a pile-in move closer to a friendly NURGLE unit than they were at the start of the move.

        6. Rampant Disease: Add 1 to disease rolls that you make.

        Corrupted Regrowth: At the start of your hero phase, you receive 1 extra CP for each Feculent Gnarlmaw in your army that is on the battlefield.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  // Munificent Wanderers
  'Infested With Wonders': {
    effects: [
      {
        name: `Infested With Wonders`,
        desc: `If an enemy unit is within 3" of a friendly MUNIFICENT WANDERERS PLAGUEBEARER HOST that has 10 or more models at the end of the movement phase or combat phase, it receives 2 disease points instead of 1 for being within 3" of any friendly MAGGOTKIN OF NURGLE units.`,
        when: [END_OF_MOVEMENT_PHASE, END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Befouling Host
  'Festerbark Pox': {
    effects: [
      {
        name: `Festerbark Pox`,
        desc: `A Befouling Host army that has a DAEMON general can include 2 Feculent Gnarlmaws instead of 1. Set up the second Feculent Gnarlmaw wholly within your territory, more than 7" from all other Feculent Gnarlmaws and more than 3" from all objectives and other terrain features.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  // Droning Guard
  'Cloying Stench': {
    effects: [
      {
        name: `Cloying Stench`,
        desc: `Subtract 1 from hit rolls for attacks that target friendly PLAGUE DRONES units in the first battle round and in the battle round in which they were set up.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  // Blessed Sons
  "Nurgle's Embrace": {
    effects: [
      {
        name: `Nurgle's Embrace`,
        desc: `If a friendly BLESSED SONS MORTAL model is slain within 1" of an enemy unit, before removing that model from play, pick 1 enemy unit within 1" of that model and roll a number of dice equal to the Wounds characteristic of that model. For each 6, give that enemy unit 1 disease point.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Drowned Men
  'Lords of Sea and Sky': {
    effects: [
      {
        name: `Lords of Sea and Sky`,
        desc: `After deployment but before the first battle round begins, you can move each friendly DROWNED MEN LORD OF AFFLICTIONS and PUSGOYLE BLIGHTLORDS unit up to 8". If both players can move units before the first battle round begins, they must roll off and the winner chooses who moves their units first.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  // Filthbringers
  'Rot Covens': {
    effects: [
      {
        name: `Rot Covens`,
        desc: `You can include Rot Covens in your army (pg 104). At the start of hero phase, you can pick 1 WIZARD from each Rot Coven in your army. Add 1 to casting, unbinding, and dispelling rolls for that WIZARD in that phase. Add 2 instead of 1 if that WIZARD is within 3" of 1 other WIZARD from the same Rot Coven. Add 3 instead of 1 if that WIZARD is within 3" of 2 other WIZARDS from the same Rot Coven.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Feed the Maggots`,
        desc: `You complete this tactic if at least 7 enemy models are slain by disease rolls during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Nurture the Gnarlmaw`,
        desc: `Pick 1 Feculent Gnarlmaw in your army that is within 12" of any enemy units. You complete this tactic if that Feculent Gnarlmaw is more than 12" from all enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Gifts of Nurgle`,
        desc: `You complete this tactic if 3 or more friendly MAGGOTKIN OF NURGLE units are within 3" of the same enemy unit at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NURGLE, rule_sources.ERRATA_JANUARY_2022],
      },
      {
        name: `Glory to the Grandfather!`,
        desc: `You complete this tactic at the end of this turn if more enemy units than friendly units are destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Droning`,
        desc: `You complete this tactic if there is a different friendly unit with a Rot Fly mount in each quarter of the battlefield at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Sudden Domination`,
        desc: `You complete this tactic if you summon a GREAT UNCLEAN ONE to the battlefield during this turn and it is within 3" of an objective that you control in your opponent's territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
