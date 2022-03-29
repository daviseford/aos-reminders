import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  // 'Searing Heat': {
  //   effects: [
  //     {
  //       name: `Searing Heat`,
  //       desc: `Answer value of 3 and range of 18". If answered, pick 1 enemy unit within range and visible to the chanter. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Searing Heat`,
  //       desc: `If active, subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
  //       when: [SHOOTING_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Prayer of Ash': {
    effects: [
      {
        name: `Prayer of Ash`,
        desc: `Answer value of 4 and a range of 18". If answered, pick 1 friendly FYRESLAYERS unit wholly within range and visible to the chanter. Subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ember Storm': {
    effects: [
      {
        name: `Ember Storm`,
        desc: `Answer value of 3 and a range of 18". If answered, pick 1 friendly HEARTHGUARD BERZERKERS or VULKITE BERZERKERS unit wholly within range and visible to the chanter. That unit can run and still charge later in this turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Prayer of Grimnir's Fury": {
    effects: [
      {
        name: `Prayer of Grimnir's Fury`,
        desc: `Answer value of 3 and a range of 12". If answered, pick 1 friendly FYRESLAYERS HERO that does not have a mount that is within range, within 3" of an enemy unit and visible to the chanter. That HERO can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wrath of Vulcatrix': {
    effects: [
      {
        name: `Wrath of Vulcatrix`,
        desc: `Answer value of 3 and a range of 12". If answered, pick 1 friendly MAGMADROTH unit within range and visible to the chanter. Until the start of your next hero phase, use the top row on that unit's damage table, regardless of how many wounds it has suffered.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Gilded Claws': {
  //   effects: [
  //     {
  //       name: `Gilded Claws`,
  //       desc: `Answer value of 3 and range of 12". If answered, pick 1 friendly Magmadroth unit within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit with its Claws and Horns until the start of your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Gilded Claws`,
  //       desc: `If active, add 1 to wound rolls for attacks made by that unit with its Claws and Horns until the start of your next hero phase.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Unit prayers
  // "Volcano's Call": {
  //   effects: [
  //     {
  //       name: `Volcano's Call`,
  //       desc: `Answer value of 3 and range of 18". If answered, pick 1 terrain feature wholly within range and visible to the chanter. Roll a dice for each model within 1" of that terrain feature. For each 6, that model's unit suffers 1 mortal wound.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Runic Empowerment': {
  //   effects: [
  //     {
  //       name: `Runic Empowerment`,
  //       desc: `Answer value of 3 and range of 12". If the chanter carries a Forge Key, this prayer has a range of 18" instead. If answered, pick 1 friendly FYRESLAYERS unit wholly within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit until the start of your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Prayers, 'prayer')
