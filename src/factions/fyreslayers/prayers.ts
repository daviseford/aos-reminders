import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Prayers = {
  'Searing Heat': {
    effects: [
      {
        name: `Searing Heat`,
        desc: `Answer value of 3 and range of 18". If answered, pick 1 enemy unit within range and visible to the chanter. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Searing Heat`,
        desc: `If active, subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Prayer of Ash': {
    effects: [
      {
        name: `Prayer of Ash`,
        desc: `Answer value of 4 and range of 18". If answered, pick 1 friendly FYRESLAYERS unit wholly within range and visible to the chanter. Add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Prayer of Ash`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Ember Storm': {
    effects: [
      {
        name: `Ember Storm`,
        desc: `Answer value of 3 and range of 18". If answered, pick 1 friendly VULKITE BERZERKERS or HEARTHGUARD BERZERKERS unit wholly within range and visible to the chanter. That unit can run and still charge later in that turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ember Storm`,
        desc: `If active, can run and still charge later in that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  "Prayer of Grimnir's Fury": {
    effects: [
      {
        name: `Prayer of Grimnir's Fury`,
        desc: `Answer value of 3 and range of 12". If answered, pick 1 friendly FYRESLAYERS HERO that does not have a mount, is within range and visible to the chanter, and is within 3" of an enemy unit. That HERO can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gilded Claws': {
    effects: [
      {
        name: `Gilded Claws`,
        desc: `Answer value of 3 and range of 12". If answered, pick 1 friendly Magmadroth unit within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit with its Claws and Horns until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gilded Claws`,
        desc: `If active, add 1 to wound rolls for attacks made by that unit with its Claws and Horns until the start of your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Unit prayers
  "Volcano's Call": {
    effects: [
      {
        name: `Volcano's Call`,
        desc: `Answer value of 3 and range of 18". If answered, pick 1 terrain feature wholly within range and visible to the chanter. Roll a dice for each model within 1" of that terrain feature. For each 6, that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Runic Empowerment': {
    effects: [
      {
        name: `Runic Empowerment`,
        desc: `Answer value of 3 and range of 12". If the chanter carries a Forge Key, this prayer has a range of 18" instead. If answered, pick 1 friendly FYRESLAYERS unit wholly within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
