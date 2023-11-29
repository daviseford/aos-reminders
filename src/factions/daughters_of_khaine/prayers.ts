import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Prayers = {
  'Catechism of Murder': {
    effects: [
      {
        name: `Catechism of Murder`,
        desc: `Answer value of 3 and a range of 14". If this prayer is answered, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the chanter. Until your next hero phase, if the unmodified hit roll for an attack made with a melee weapon by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Catechism of Murder`,
        desc: `If active, if the unmodified hit roll for an attack made with a melee weapon by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessing of Khaine': {
    effects: [
      {
        name: `Blessing of Khaine`,
        desc: `Answer value of 3 and a range of 14". If this prayer is answered, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the chanter. Until your next hero phase, you can reroll Fanatical Faith rolls (pg 66) for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blessing of Khaine`,
        desc: `If active, you can reroll Fanatical Faith rolls (pg 66) for that unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  "Martyr's Sacrifice": {
    effects: [
      {
        name: `Martyr's Sacrifice`,
        desc: `Answer value of 3 and a range of 14". If this prayer is answered, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the chanter. Until your next hero phase, each time a model from that unit is slain by an attack made with a melee weapon, before the slain model is removed from play, pick 1 enemy unit within 3" of the slain model and roll a dice. On a 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Martyr's Sacrifice`,
        desc: `If active, each time a model from that unit is slain by an attack made with a melee weapon, before the slain model is removed from play, pick 1 enemy unit within 3" of the slain model and roll a dice. On a 5+, that unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Crimson Rejuvenation': {
    effects: [
      {
        name: `Crimson Rejuvenation`,
        desc: `Answer value of 3 and a range of 14". If this prayer is answered, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the chanter. Heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Covenant of the Iron Heart': {
    effects: [
      {
        name: `Covenant of the Iron Heart`,
        desc: `Answer value of 3 and a range of 14". If this prayer is answered, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the chanter. Until your next hero phase, do not take battleshock tests for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Covenant of the Iron Heart`,
        desc: `If active, do not take battleshock tests for that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Sacrament of Blood': {
    effects: [
      {
        name: `Sacrament of Blood`,
        desc: `Answer value of 3 and a range of 14". If this prayer is answered, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the chanter. Until your next hero phase, add 1 to the number of the current battle round when determining the abilities gained by that unit from the Blood Rites battle trait (pg 66). This ability and other similar abilities are cumulative.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Unit prayers
  'Touch of Death': {
    effects: [
      {
        name: `Touch of Death`,
        desc: `Answer value of 3 and a range of 3". If answered, pick 1 enemy unit within range and visible to the chanter. That enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dance of Doom': {
    effects: [
      {
        name: `Dance of Doom`,
        desc: `Answer value of 3. If answered, the strike-first effect applies to this unit in the following combat phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dance of Doom`,
        desc: `If active, the strike-first effect applies to this unit in the following combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Prayers, 'prayer')
