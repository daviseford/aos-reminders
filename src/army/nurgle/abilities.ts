import { IEffects } from 'types/data'
import {CHARGE_PHASE,
        END_OF_MOVEMENT_PHASE,
        START_OF_HERO_PHASE,
        START_OF_ROUND,        
        START_OF_SETUP,
        TURN_ONE_START_OF_ROUND
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Cycle of Corruption`,
    desc: `Roll a dice at the start of the first battle round to determine the starting stage of corruption.`,
    when: [TURN_ONE_START_OF_ROUND],
  },
  {
    name: `Cycle of Corruption`,
    desc: `The Cycle of Corruption moves clockwise one step at the start of each battle round.`,
    when: [START_OF_ROUND],
  },
  {
    name: `The Garden of Nurgle`,
    desc: `After all terrain features have been setup, but before you choose a territory or set up your army, you can set up one Feculent Gnarlmaw anywhere on the battlefield that is more than 3" away from other terrain features and 1" away from any objectives.  If both players can set up a terrain feature before territory selection, they must roll off with the winner placing first.`,
    when: [START_OF_SETUP],
  },
  {
    name: `Feculent Gnarlmaw`,
    desc: `In their charge phase, Nurgle units that are within 7" of any Feculent Gnarlmaws can attempt to charge even if they ran in the same turn.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Feculent Gnarlmaw`,
    desc: `At the start of the hero phase, roll a dice for each unit within 3" of any Feculent Gnarlmaws. On a 4+ the unit suffers 1 mortal wound. Units with the Nurgle keyword are are unaffected by this ability.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Summon Daemons of Nurgle`,
    desc: `At the start of each hero phase you receive 3 contagion points if there are any friendly Nurgle models in your own territory.  
           
           You receive 3 additional contagion points if there are any friendly Nurgle models in your opponents territory.  
           
           You receive 1 extra contagion point if no enemy models are in a territory occupied by friendly Nurgle units.  
           
           In addition you receive D3 contagion points for each Feculent Gnarlmaw that has no enemy models within 3" of it.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Summon Daemons of Nurgle`,
    desc: `If you have 7 or more contagion points at the end of your movement phase, you can summon one or more units onto the battlefield.
           
           Summoned units must be set up wholly within 12" of a Feculent Gnarlmaw or a friendly Nurgle hero and more than 9" away from enemy models.
           
           If the summoned unit is a Feculent Gnarlmaw it must also be setup more than 3" from any other terrain feature and more the 1" from any objectives.
           
           The cost of any units summoned in this manner is subtracted from the current total available contagion points.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
]

export default Abilities
