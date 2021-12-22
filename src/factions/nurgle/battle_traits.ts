import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const LocusOfCorrosionEffect = {
  name: `Locus of Corrosion`,
  desc: `While an enemy unit is within 3" of any friendly Munificent Wanderers/Droning Guard daemon units, worsen the rend characteristic of that unit's melee weapons by 1 (to a minimum of '-'). Nurgle units are unaffected by this ability.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const NurglesEmbraceEffect = {
  name: `Nurgle's Embrace`,
  desc: `Roll a D6 each time a friendly Blessed Sons/Drowned Men Rotbringer model is slain in this phase. On a 2+ the attacking unit suffers 1 mortal wound. If the attacking unit has the Nurgle keyword, heal 1 wound allocated to the unit instead.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const BattleTraits = {
  Nurgle: {
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
        desc: `At the end of the battleshock phase, reduce the number of disease each enemy unit has to l.`,
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
  // Munificent Wanderers/Droning Guard Battle Traits
  'Locus of Corrosion': {
    effects: [LocusOfCorrosionEffect],
  },
  // Blessed Sons/Drowned Men Battle Traits
  "Nurgle's Embrace": {
    effects: [NurglesEmbraceEffect],
  },
  // Tamurkhan's Horde Battle Traits
  "Tamurkhan's Horde": {
    effects: [
      {
        name: `Tamurkhan's Horde Army`,
        desc: `After you have chosen the Maggotkin of Nurgle allegiance for your army, you can give it the Tamurkhan's Horde keyword. All Maggotkin of Nurgle units in your army gain that keyword (with the exception of named characters that do not already have the Tamurkhan's Horde keyword on their warscroll). All units with that keyword benefit from the allegiance abilities listed below, in addition to the allegiance abilities in Battletome: Maggotkin of Nurgle.`,
        when: [START_OF_GAME],
      },
      {
        name: `Winds of Corruption`,
        desc: `Subtract 1 from run and charge rolls for enemy units.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Command Trait`,
        desc: `A Tamurkhan's Horde general must have the Unrelenting Conqueror command trait instead of one from the Maggotkin of Nurgle allegiance abilities.`,
        when: [START_OF_GAME],
      },
      {
        name: `Artifact of Power`,
        desc: `The first Tamurkhan's Horde Hero to receive an artifact of power must be given the Daemon Flask.`,
        when: [START_OF_GAME],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
