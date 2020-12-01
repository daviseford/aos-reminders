// Zharrgrim Blessings
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_ROUND,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Spells: TEntry[] = [
  {
    name: `Molten Infusion`,
    effects: [
      {
        name: `Molten Infusion`,
        desc: `One friendly model that knows this prayer can chant it. On a 3+, the prayer is answered. Pick a Magmic Invocation within 12" of this PRIEST. At the end of the battle round, do not make a temperamental nature roll for that magmic invocation.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Molten Infusion`,
        desc: `If active, at the end of the battle round, do not make a temperamental nature roll for that magmic invocation.`,
        when: [END_OF_ROUND],
      },
    ],
    prayer: true,
  },
  {
    name: `Searing Heat`,
    effects: [
      {
        name: `Searing Heat`,
        desc: `One friendly model that knows this prayer can chant it. On a 3+, the prayer is answered. Pick an enemy unit within 18" of this PRIEST. Subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Searing Heat`,
        desc: `If active, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Prayer of Ash`,
    effects: [
      {
        name: `Prayer of Ash`,
        desc: `One friendly model that knows this prayer can chant it. On a 4+, the prayer is answered. Pick a friendly unit wholly within 18" of this PRIEST. Add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Prayer of Ash`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Ember Storm`,
    effects: [
      {
        name: `Ember Storm`,
        desc: `One friendly model that knows this prayer can chant it. On a 3+, the prayer is answered. Pick a friendly unit of VULKITE BERZERKERS or HEARTHGUARD BERZERKERS wholly within 18" of this PRIEST. This unit can run and charge that turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ember Storm`,
        desc: `If active, this unit can run and charge that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Prayer of Grimnir's Fury`,
    effects: [
      {
        name: `Prayer of Grimnir's Fury`,
        desc: `One friendly model that knows this prayer can chant it. On a 3+, the prayer is answered. Pick a friendly HERO that is not mounted on a MAGMADROTH and is within 3" of an enemy unit and within 12" of this PRIEST. Make a pile-in move with that HERO then attack with all the melee weapons of that HERO.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Gilded Claws`,
    effects: [
      {
        name: `Gilded Claws`,
        desc: `One friendly model that knows this prayer can chant it. On a 3+, the prayer is answered. Pick a friendly MAGMADROTH wholly within 12" of this PRIEST. You can reroll wound rolls for attacks made by that unit's Claws and Horns until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Gilded Claws`,
        desc: `If active, you can reroll wound rolls for attacks made by that unit's Claws and Horns until the start of your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
    prayer: true,
  },
]

export default Spells
