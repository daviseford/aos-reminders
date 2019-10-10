import { TTraits } from 'types/army'
import {
  HERO_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_HERO_PHASE,
  SHOOTING_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

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
  {
    name: `Seat on the Council (Greywater Fastness)`,
    effects: [
      {
        name: `Seat on the Council (Greywater Fastness)`,
        desc: `At the start of your hero phase, if this general is on the battlefield,roll a dice. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Drillmaster (Greywater Fastness)`,
    effects: [
      {
        name: `Drillmaster (Greywater Fastness)`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by friendly GREYWATER FASTNESS units that are wholly within 12" of this general while this general is more than 3" away from any enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ghoul Mere Ranger (Greywater Fastness)`,
    effects: [
      {
        name: `Ghoul Mere Ranger (Greywater Fastness)`,
        desc: `Friendly units wholly within 12" of this general can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]

export default CommandTraits
