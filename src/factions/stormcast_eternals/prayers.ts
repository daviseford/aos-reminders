import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  'Divine Light': {
    effects: [
      {
        name: `Divine Light`,
        desc: `Answer value of 3 and a range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 enemy unit within range and visible to the chanter. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Translocation: {
    effects: [
      {
        name: `Translocation`,
        desc: `Answer value of 3 and a range of 9" if the chanter is a KNIGHT or 12" if the chanter is a LORD, If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. You can remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units. That unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_STORMCAST_ETERNALS, rule_sources.ERRATA_OCTOBER_2021],
      },
    ],
  },
  'Bless Weapons': {
    effects: [
      {
        name: `Bless Weapons`,
        desc: `Answer value of 3 and a range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Unit prayers
  'Lightning Storm': {
    effects: [
      {
        name: `Lightning Storm`,
        desc: `Answer value of 4 and a range of 12". If answered, pick 1 enemy unit within range and visible to the chanter. That unit suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Healing Storm': {
    effects: [
      {
        name: `Healing Storm`,
        desc: `Answer value of 4 and a range of 12". If answered, pick 1 friendly Stormcast Eternals unit wholly within range and visible to the chanter. Heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Sanction: {
    effects: [
      {
        name: `Sanction`,
        desc: `Answer value of 4 and a range of 12". If answered, pick 1 enemy unit within range and visible to the chanter. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
