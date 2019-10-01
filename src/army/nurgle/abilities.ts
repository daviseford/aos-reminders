import {
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
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
    name: `The Lores of Nurgle`,
    desc: `All wizards in a Nurgle army know the Foul Regenesis spell in addition to any other spells that they know.
            
           In addition, each wizard know a selected spell from one of the Lores of Nurgle depending on the keyword type of the wizard.`,
    when: [HERO_PHASE],
  },
]

export default Abilities
