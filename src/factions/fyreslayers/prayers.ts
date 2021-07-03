import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  'Searing Heat': {
    effects: [
      {
        name: `Searing Heat`,
        desc: `Searing Heat is a prayer that has an answer value of 3 and a range of 18". If answered, pick 1 enemy unit within range and visible to the chanter. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
      {
        name: `Searing Heat`,
        desc: `If active, subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
  'Prayer of Ash': {
    effects: [
      {
        name: `Prayer of Ash`,
        desc: `Prayer of Ash is a prayer that has an answer value of 4 and a range of 18". If answered, pick 1 friendly FYRESLAYERS unit wholly within range and visible to the chanter. Add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
      {
        name: `Prayer of Ash`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
  'Ember Storm': {
    effects: [
      {
        name: `Ember Storm`,
        desc: `Ember Storm is a prayer that has an answer value of 3 and a range of 18". If answered, pick 1 friendly VULKITE BERZERKERS or HEARTHGUARD BERZERKERS unit wholly within range and visible to the chanter. That unit can run and still charge later in that turn.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
      {
        name: `Ember Storm`,
        desc: `If active, can run and still charge later in that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
  "Prayer of Grimnir's Fury": {
    effects: [
      {
        name: `Prayer of Grimnir's Fury`,
        desc: `Prayer of Grimnir's Fury is a prayer that has an answer value of 3 and a range of 12". If answered, pick 1 friendly FYRESLAYERS HERO that does not have a mount, is within range and visible to the chanter, and is within 3" of an enemy unit. That HERO can fight.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
  'Gilded Claws': {
    effects: [
      {
        name: `Gilded Claws`,
        desc: `Gilded Claws is a prayer that has an answer value of 3 and a range of 12". If answered, pick 1 friendly Magmadroth unit within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit with its Claws and Horns until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
      {
        name: `Gilded Claws`,
        desc: `If active, add 1 to wound rolls for attacks made by that unit with its Claws and Horns until the start of your next hero phase.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
  // Unit prayers
  "Volcano's Call": {
    effects: [
      {
        name: `Volcano's Call`,
        desc: `Volcano's Call is a prayer that has an answer value of 3 and a range of 18". If answered, pick 1 terrain feature wholly within range and visible to the chanter. Roll a dice for each model within 1" of that terrain feature. For each 6, that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
  'Runic Empowerment': {
    effects: [
      {
        name: `Runic Empowerment`,
        desc: `Runic Empowerment is a prayer that has an answer value of 3 and a range of 12". If the chanter carries a Forge Key, this prayer has a range of 18" instead. If answered, pick 1 friendly FYRESLAYERS unit wholly within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
