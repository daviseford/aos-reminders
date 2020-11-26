import { TAbilities } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  SAVES_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Shield of Civilisation`,
    desc: `Add 1 to the bravery characteristic of friendly Stormcast Eternal units wholly within 12" of any friendly Liberators units.`,
    when: [DURING_GAME, BATTLESHOCK_PHASE],
  },
  {
    name: `Shield of Civilisation`,
    desc: `You can pick any friendly Liberators units that did not move and were not set up this phase. Selected units can add 1 to hit and save rolls until your next movement phase.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Shield of Civilisation`,
    desc: `If active, you can add 1 to hit rolls for affected Liberators units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Shield of Civilisation`,
    desc: `If active, you can add 1 to save rolls for affected Liberators units.`,
    when: [SAVES_PHASE],
  },
  {
    name: `Mortal Auxiliaries`,
    desc: `Add 1 to the bravery characteristic of Cities of Sigmar units wholly within 12" of a friendly Liberators unit.`,
    when: [DURING_GAME, BATTLESHOCK_PHASE],
  },
  {
    name: `Mortal Auxiliaries`,
    desc: `Cities of Sigmar units can be treated as Stormcast Eternals when benefiting from a command ability.`,
    when: [DURING_GAME],
  },
]

export default Abilities
