import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const Prayers = {
  'Divine Light': {
    effects: [
      {
        name: `Divine Light`,
        desc: `Answer value of 3 and range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 enemy unit within range and visible to the chanter. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Translocation: {
    effects: [
      {
        name: `Translocation`,
        desc: `Answer value of 3 and range of 9" if the chanter is a KNIGHT or 12" if the chanter is a LORD, If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. You can remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units. That unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_STORMCAST_ETERNALS, rule_sources.ERRATA_OCTOBER_2021],
      },
    ],
  },
  'Bless Weapons': {
    effects: [
      {
        name: `Bless Weapons`,
        desc: `Answer value of 3 and range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Unit prayers
  'Lightning Storm': {
    effects: [
      {
        name: `Lightning Storm`,
        desc: `Answer value of 4 and range of 12". If answered, pick 1 enemy unit within range and visible to the chanter. That unit suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Healing Storm': {
    effects: [
      {
        name: `Healing Storm`,
        desc: `Answer value of 4 and range of 12". If answered, pick 1 friendly Stormcast Eternals unit wholly within range and visible to the chanter. Heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Sanction: {
    effects: [
      {
        name: `Sanction`,
        desc: `Answer value of 4 and range of 12". If answered, pick 1 enemy unit within range and visible to the chanter. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lightning Tempest': {
    effects: [
      {
        name: `Lightning Tempest`,
        desc: `Answer value of 3 and a range of 18". If answered, pick 1 enemy unit within range. That unit is struck by lightning and suffers D3 mortal wounds. Then, roll a dice. On a 1-2, the tempest clears and the sequence ends. On a 3+, pick 1 other enemy unit within 3" of the last unit that was struck by lightning. "Ihat unit is struck by lightning and suffers D3 mortal wounds. Keep rolling dice in this way until the tempest clears or there are no other enemy units within 3" of the last unit to be struck by lightning. A unit cannot be affected by this prayer more than once per hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  // Draconith skywing
  "Sigmar's Grace": {
    effects: [
      {
        name: `Sigmar's Grace`,
        desc: `Answer value of 3 and a range of 12". If answered, pick 1 friendly unit wholly within range and visible to the chanter. You can heal up to 3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  Sanctification: {
    effects: [
      {
        name: `Sanctification`,
        desc: `Answer value of 4. If answered, until the start of your next hero phase, subtract 1 from casting rolls for enemy WIZARDS and subtract 1 from chanting rolls for enemy PRIESTS.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  Sovereignty: {
    effects: [
      {
        name: `Sovereignty`,
        desc: `Answer value of 4 and a range of 12". If answered, pick 1 enemy unit within range. Until the start of your next hero phase, that unit counts as a maximum of 5 models for the purposes of contesting objectives.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
