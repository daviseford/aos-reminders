import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  // Prayers of the Khainite Cult
  'Catechism of Murder': {
    effects: [
      {
        name: `Catechism of Murder`,
        desc: `Answer value of 3+. Pick 1 friendly Daughters of Khaine unit wholly within 14" of this model. Until your next hero phase, each time you make an unmodified melee hit roll of 6, the attack inflicts 2 hits instead of 1.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Catechism of Murder`,
        desc: `If active, each unmodified melee hit of 6 by the buffed unit counts as 2 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessing of Khaine': {
    effects: [
      {
        name: `Blessing of Khaine`,
        desc: `Answer value of 3+. Pick 1 friendly Daughters of Khaine unit wholly within 14" of this model. Until your next hero phase, reroll failed Fanatical Faith rolls for that unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Blessing of Khaine`,
        desc: `If active, reroll failed Fanatical Faith rolls for buffed unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "Martyr's Sacrifice": {
    effects: [
      {
        name: `Martyr's Sacrifice`,
        desc: `Answer value of 3+. Pick a friendly Daughters of Khaine unit wholly within 14" of this model. Until your next hero phase, each time a model from that unit is slain by a melee attack, roll a D6. On a 5+, an enemy unit within 3" of the slain model suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Martyr's Sacrifice`,
        desc: `If active, each time a model from the buffed unit is slain roll a D6. On a 5+, an enemy unit within 3" of the slain model suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Crimson Rejuvenation': {
    effects: [
      {
        name: `Crimson Rejuvenation`,
        desc: `Answer value of 3+. Pick a friendly Daughters of Khaine unit wholly within 14" of this model. You can heal up to D3 wounds allocated to a model in that unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Covenant of the Iron Heart': {
    effects: [
      {
        name: `Covenant of the Iron Heart`,
        desc: `Answer value of 3+. Pick a friendly Daughters of Khaine unit wholly within 14" of this model. Until your next hero phase, you do not need to take battleshock tests for that unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Covenant of the Iron Heart`,
        desc: `If active, you do not need to take battleshock tests for the buffed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Sacrament of Blood': {
    effects: [
      {
        name: `Sacrament of Blood`,
        desc: `Answer value of 3+. Pick a friendly Daughters of Khaine unit wholly within 14" of this model. Until your next hero phase, add 1 to the current battle round when determining active Blood Rites. This effect is cumulative with other similar abilities.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  // Unit prayers
  'Wrath of Khaine': {
    effects: [
      {
        name: `Wrath of Khaine`,
        desc: `If your army includes any Avatars of Khaine, friendly Daughters of Khaine priests know the Wrath of Khaine prayer in addition to any other prayers they know.`,
        when: [HERO_PHASE],
      },
      {
        name: `Animated`,
        desc: `Answer value of 3.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Wrath of Khaine`,
        desc: `If active, pick a friendly Avatar of Khaine on the battlefield. Until your next hero phase it is now Animated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Khaine': {
    effects: [
      {
        name: `Rune of Khaine`,
        desc: `Answer value of 3. If answered, pick 1 of the chanter's melee weapons (it cannot be a weapon used by a mount). Until your next hero phase, that melee weapon has a Damage characteristic of D3 instead of the value shown in its profile.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Rune of Khaine`,
        desc: `If active, until your next hero phase, that melee weapon has a Damage characteristic of D3 instead of the value shown in its profile.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Touch of Death': {
    effects: [
      {
        name: `Touch of Death`,
        desc: `Answer value of 3 and a range of 3". If answered, pick 1 enemy unit within range and visible to the chanter. Then, take a dice and hide it in one of your hands. Your opponent must pick one of your hands. If they pick the one holding the dice, that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Dance of Doom': {
    effects: [
      {
        name: `Dance of Doom`,
        desc: `Answer value of 3. If answered, in the combat phase, after the chanter has fought in that phase for the first time, when it is your turn to pick a unit to fight, the chanter can be picked to fight for a second time if it is within 3" of any enemy units.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Dance of Doom`,
        desc: `If active, in the combat phase, after the chanter has fought in that phase for the first time, when it is your turn to pick a unit to fight, the chanter can be picked to fight for a second time if it is within 3" of any enemy units.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
