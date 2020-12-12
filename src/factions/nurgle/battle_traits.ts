import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const LocusOfCorrosionEffect = {
  name: `Locus of Corrosion`,
  desc: `While an enemy unit is within 3" of any friendly Munificent Wanderers/Droning Guard daemon units, worsen the rend characteristic of that unit's melee weapons by 1 (to a minimum of '-'). Nurgle units are unaffected by this ability.`,
  when: [COMBAT_PHASE],
}

const NurglesEmbraceEffect = {
  name: `Nurgle's Embrace`,
  desc: `Roll a D6 each time a friendly Blessed Sons/Drowned Men Rotbringer model is slain in this phase. On a 2+ the attacking unit suffers 1 mortal wound. If the attacking unit has the Nurgle keyword, heal 1 wound allocated to the unit instead.`,
  when: [COMBAT_PHASE],
}

const BattleTraits = {
  Nurgle: {
    effects: [
      {
        name: `Cycle of Corruption`,
        desc: `Roll a D6 to determine the starting stage of corruption.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Cycle of Corruption`,
        desc: `The Cycle of Corruption moves clockwise one step.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon Daemons of Nurgle`,
        desc: `You receive 3 contagion points if there are any friendly Nurgle models in your own territory.
    
               You receive 3 additional contagion points if there are any friendly Nurgle models in your opponents territory.
    
               You receive 1 extra contagion point if no enemy models are in a territory occupied by friendly Nurgle units.
    
               In addition you receive D3 contagion points for each Feculent Gnarlmaw that has no enemy models within 3" of it.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Summon Daemons of Nurgle`,
        desc: `If you have 7 or more contagion points, you can summon one or more units onto the battlefield.
    
               Summoned units must be set up wholly within 12" of a Feculent Gnarlmaw or a friendly Nurgle hero and more than 9" away from enemy models.
    
               If the summoned unit is a Feculent Gnarlmaw it must also be setup more than 3" from any other terrain feature and more the 1" from any objectives.
    
               The cost of any units summoned in this manner is subtracted from the current total available contagion points.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Summon Daemons of Nurgle`,
        desc: `Summoning Costs:
               1 Exalted Greater Daemon of Nurgle - 35 CP       
               1 Great Unclean One -                28 CP
               1 Horticulous Slimux -               21 CP
               3 Plague Drones -                    21 CP
               20 Plaguebearers -                   21 CP
               1 Poxbringer -                       14 CP
               1 Sloppity Bilepiper -               14 CP
               1 Spoilpox Scrivener -               14 CP
               10 Plaguebearers -                   14 CP
               1 Beast of Nurgle -                  14 CP
               3 Nurgling Bases -                   14 CP
               5 Plaguebearers -                    7 CP
               1 Nurgling Base -                    7 CP
               1 Feculent Gnarlmaw -                7 CP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `The Lores of Nurgle`,
        desc: `All wizards in a Nurgle army know the Foul Regenesis spell in addition to any other spells that they know.
    
               In addition, each wizard know a selected spell from one of the Lores of Nurgle depending on the keyword type of the wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Munificent Wanderers/Dronig Guard Battle Traits
  'Locus of Corrosion': {
    effects: [LocusOfCorrosionEffect],
  },
  // Blessed Sons/Drowned Men Battle Traits
  'Nurgle`s Embrace': {
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
        when: [DURING_GAME],
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

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
