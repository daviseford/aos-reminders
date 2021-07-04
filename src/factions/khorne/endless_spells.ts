import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, HERO_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

// Endless prayers.
const EndlessSpells = {
  'Hexgorger Skulls': {
    effects: [
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 3 and a range of 8". If answered, set up the parts of the invocation wholly within range and visible to the chanter, within 6" of each other and more than 1" from all models, other invocations and endless spells. Only KHORNE PRIESTS can attempt to summon this invocation.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Compelled by Hate`,
        desc: `After this invocation is set up and at the start of each of their hero phases, the commanding player can move the parts of this invocation as if they were models with a Move characteristic of 8" and that can fly. After the parts have been moved, they must be within 6" of each other.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Hexgorgers`,
        desc: `Subtract 2 from casting rolls for WIZARDS that are within 12" of any Hexgorger Skulls. In addition, if a WIZARD within 8" of this invocation attempts to cast a spell and the unmodified casting roll is 8, then that casting attempt is not successful, that WIZARD no longer knows that spell, each WIZARD within 12" of this invocation suffers D6 mortal wounds, and then this invocation is removed from play.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
    ],
  },
  'Bleeding Icon': {
    effects: [
      {
        name: `Drifting Menace`,
        desc: `After this invocation is set up and at the start of each of their hero phases, the commanding player can move this invocation as if it were a model with a Move characteristic of 8" and that can fly.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 3 and a range of 8". If answered, set up this invocation wholly within range and visible to the chanter, and more than 1" from all models, other invocations and endless spells. Only KHORNE PRIESTS can attempt to summon this invocation.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Sigil of Doom`,
        desc: `Subtract 1 from the Bravery characteristic of units that are wholly within 12" of any Bleeding Icons. In addition, if a unit fails a battleshock test within 3" of any Bleeding Icons, roll a dice. On a 1-5, add D3 to the number of models that flee. On a 6, add D6 to the number of models that flee, and then this invocation is removed from play. This ability has no effect on KHORNE units.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
    ],
  },
  'Wrath-Axe': {
    effects: [
      {
        name: `Flung With Fury`,
        desc: `After this invocation is set up and at the start of each of their hero phases, the commanding player can move this invocation as if it were a model with a Move characteristic of 8" and that can fly.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 4 and a range of 8". If answered, set up this invocation wholly within range and visible to the chanter, and more than 1" from all models, other invocations and endless spells. Only KHORNE PRIESTS can attempt to summon this invocation.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Hatred's Edge`,
        desc: `After this invocation has moved, roll a dice for each unit that has any models it passed across. On a 2+, that unit suffers D3 mortal wounds. Then, the commanding player can pick 1 unit within 3" of this invocation and roll a dice. On a 1, nothing happens. On a 2-5, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds, and then this invocation is removed from play.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
