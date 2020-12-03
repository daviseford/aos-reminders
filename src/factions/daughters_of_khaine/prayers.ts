import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

export const Prayers = {
  'Prayers of the Khainite Cult': {
    effects: [
      {
        name: `Catechism of Murder`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, each time you make an unmodified hit roll of 6 for the unit in the combat phase, the attack inflicts 2 hits instead of 1.`,
        when: [HERO_PHASE],
      },
      {
        name: `Catechism of Murder`,
        desc: `If in effect, each hit roll of an unmodified 6 by the buffed unit counts as 2 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blessing of Khaine`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, reroll failed Fanatical Faith rolls for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blessing of Khaine`,
        desc: `If in effect, reroll failed Fanatical Faith rolls for buffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Martyr's Sacrifice`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, each time a model from that unit is slain in the combat phase, roll a D6. On a 5 or 6 the attacking unit suffers 1 mortal wound after it has finished making all of its attacks.`,
        when: [HERO_PHASE],
      },
      {
        name: `Martyr's Sacrifice`,
        desc: `If in effect, each time a model from buffed unit is slain, roll a D6. On a 5 or 6 the attacking unit suffers 1 mortal wound after it has finished making all of its attacks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crimson Rejuvenation`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest (you cannot pick Morathi in either form). You can heal up to D3 wounds allocated to a model in that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Covenant of the Iron Heart`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, you do not need to take battleshock tests for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Covenant of the Iron Heart`,
        desc: `If in effect, you do not need to take battleshock tests for the buffed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Sacrament of Blood`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, that unit counts the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
        when: [HERO_PHASE],
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
        desc: `If active, the Hag Queen's Blade of Khaine has a Damage characteristic of D3 instead of 1 until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Touch of Death': {
    effects: [
      {
        name: `Touch of Death`,
        desc: `If active, pick a unit within 3" of this model and then hide a dice in one of your hands. Your opponent must pick a hand; if that hand is holding the dice, the unit you picked suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dance of Doom': {
    effects: [
      {
        name: `Dance of Doom`,
        desc: `If active, until your next hero phase, this model can be chosen to pile in and attack twice in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
