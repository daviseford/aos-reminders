import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_ROUND,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Prayers = {
  'Molten Infusion': {
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
  },
  'Searing Heat': {
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
  },
  'Prayer of Ash': {
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
  },
  'Ember Storm': {
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
  },
  "Prayer of Grimnir's Fury": {
    effects: [
      {
        name: `Prayer of Grimnir's Fury`,
        desc: `One friendly model that knows this prayer can chant it. On a 3+, the prayer is answered. Pick a friendly HERO that is not mounted on a MAGMADROTH and is within 3" of an enemy unit and within 12" of this PRIEST. Make a pile-in move with that HERO then attack with all the melee weapons of that HERO.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Gilded Claws': {
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
  },
  // Unit prayers
  "Volcano's Call": {
    effects: [
      {
        name: `Volcano's Call`,
        desc: `Make a prayer roll by rolling a dice. On a 3+ the prayer is answered, pick a terrain feature within 18" of this model. Roll a D6 for each model within 1" of that terrain feature. For each roll of a 6, that model's unit suffers 1 mortal wound. In addition, until your next hero phase, that terrain feature has the 'Deadly' scenery rule in addition to any other scenery rules it may have.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Runic Empowerment': {
    effects: [
      {
        name: `Runic Empowerment`,
        desc: `Make a prayer roll by rolling a dice. On a 3+ the prayer is answered, pick a friendly FYRESLAYERS unit wholly within 12" of this model, or wholly within 18" of this model if this model is armed with a Forge Key. You can reroll wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
