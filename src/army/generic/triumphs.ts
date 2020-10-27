import { TTriumphs } from 'types/army'
import { COMBAT_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

// General triumphs available from GHB 2020
const GenericTriumphs: TTriumphs = [
  {
    name: `Inspired`,
    effects: [
      {
        name: `Inspired`,
        desc: `Once per battle, when selecting a friendly unit to shoot/fight, you may reroll hit rolls for attacks made by the target until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodthirsty`,
    effects: [
      {
        name: `Bloodthirsty`,
        desc: `Once per battle, when selecting a friendly unit to shoot/fight, you may reroll wound rolls for attacks made by the target until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Indomitable`,
    effects: [
      {
        name: `Indomitable`,
        desc: `Once per battle, before making a save roll for a selected friendly unit, you may reroll save rolls for attacks made against the target.`,
        when: [SAVES_PHASE],
      },
    ],
  },
]

export default GenericTriumphs
