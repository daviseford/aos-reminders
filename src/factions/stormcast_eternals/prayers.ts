import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  'Divine Light': {
    effects: [
      {
        name: `Divine Light`,
        desc: `Divine Light is a prayer that has an answer value of 3 and a range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 enemy unit within range and visible to the chanter. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Divine Light`,
        desc: `If active, you can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
    ],
  },
  'Bless Weapons': {
    effects: [
      {
        name: `Bless Weapons`,
        desc: `Bless Weapons is a prayer that has an answer value of 3 and a range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Bless Weapons`,
        desc: `If active, until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
    ],
  },
  Translocation: {
    effects: [
      {
        name: `Translocation`,
        desc: `Translocation is a prayer that has an answer value of 3 and a range of 9". If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. You can remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
