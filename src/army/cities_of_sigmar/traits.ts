import { TTraits } from 'types/army'
import { HERO_PHASE, COMBAT_PHASE, DURING_GAME } from 'types/phases'

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
  {
    name: `Ironoak Artisan (Living City)`,
    effects: [
      {
        name: `Ironoak Artisan`,
        desc: `Add 1 to save rolls for attacks that target this general. In addition, add 1 to wound rolls for attacks made with melee weapons by this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Forest Strider (Living City)`,
    effects: [
      {
        name: `Forest Strider`,
        desc: `This general can run and still charge in the same turn. In addition, friendly units are not affected by the Deadly scenery rule if they start a move wholly within 12" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Druid of the Everspring (Living City)`,
    effects: [
      {
        name: `Druid of the Everspring`,
        desc: `If this general is a WIZARD, they know all spells from the Lore of Leaves instead of only 1. If this general is not a WIZARD, they know 1 spell from the Lore of Leaves.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
