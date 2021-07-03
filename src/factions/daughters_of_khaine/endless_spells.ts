import { tagAs } from 'factions/metatagger'
import { END_OF_HERO_PHASE, HERO_PHASE, SAVES_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

// Endless spells.
const EndlessSpells = {
  Bladewind: {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 12" and can fly.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 9". If successfully cast, set up 1 Bladewind wholly within range of the caster. Only DAUGHTERS OF KHAINE WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
      {
        name: `Unnatural Edge`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across, and each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers 1 mortal wound.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
      {
        name: `Unnatural Edge`,
        desc: `Do not apply the cover modifier to save rolls for attacks that target units that are within 12" of this endless spell.`,
        when: [SAVES_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
    ],
  },
  'Bloodwrack Viper': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 9" and can fly.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 9". If successfully cast, set up 1 Bloodwrack Viper wholly within range of the caster. Only DAUGHTERS OF KHAINE WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
      {
        name: `Fanged Strike`,
        desc: `After this endless spell has moved, the commanding player must pick 1 unit within 1" of it and roll 3 dice. For each roll that is equal to or greater than that unit's Wounds characteristic, 1 model from that unit is slain.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
    ],
  },
  'Heart of Fury': {
    effects: [
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 3 and a range of 12". If answered, set up this invocation wholly within range and visible to the chanter. Only DAUGHTERS OF KHAINE PRIESTS can attempt to summon this invocation.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
      {
        name: `Locus of the Murder God`,
        desc: `At the start of the combat phase, if this invocation is on the battlefield, its commanding player must roll a dice. On a 1-5, until the end of that phase, subtract 1 from the damage inflicted (to a minimum of 1) by each successful attack that targets a DAUGHTERS OF KHAINE unit wholly within 12" of this invocation. On a 6, until the end of that phase, subtract 1 from the damage inflicted (to a minimum of 1) by each successful attack that targets a DAUGHTERS OF KHAINE unit wholly within 12" of this invocation and add 1 to the Attacks characteristic of melee weapons used by friendly DAUGHTERS OF KHAINE units wholly within 12" of this invocation; then, this invocation is removed from play at the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DAUGHTERS_OF_KHAINE_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
