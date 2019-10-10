import { TTraits } from 'types/army'
import { COMBAT_PHASE, DURING_GAME } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Acadamae Prodigy (Hammerhal)`,
    effects: [
      {
        name: `Acadamae Prodigy`,
        desc: `+1 Attacks for this general's melee weapons. In addition, at the start of the battle, you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Blood of the Twelve (Hammerhal)`,
    effects: [
      {
        name: `Blood of the Twelve`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by friendly HAMMERHAL units wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aggressive General (Hammerhal)`,
    effects: [
      {
        name: `Aggressive General`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly HAMMERHAL units that are wholly within 12" of this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
