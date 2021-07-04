import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_HERO_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const EndlessSpells = {
  'Celestian Vortex': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 8" and can fly.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Storm of Vengeance`,
        desc: `After this endless spell has moved, the commanding player picks 1 unit that has any models it passed across and rolls 12 dice. For each 6, that unit suffers 1 mortal wound.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Tornado of Magic`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons by units within 6" of this endless spell. This ability has no effect on STORMCAST ETERNALS units.`,
        when: [SHOOTING_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
    ],
  },
  'Dais Arcanum': {
    effects: [
      {
        name: `Summoning`,
        desc: `This endless spell is summoned with a spell that has a casting value of 5 and a range of 3". WIZARDS that have a Wounds characteristic of 8 or more, that are Unique, that are part of a unit that has 2 or more models, or that are already on a Dais Arcanum cannot attempt to cast this spell. If successfully cast, set up the endless spell within range and visible to the caster, more than 3" from all terrain features and enemy models, and more than 1" from all other models, endless spells and invocations. Then place the caster on top of the endless spell.
        
        For rules purposes, the caster and this endless spell are treated as a single model in the caster's army that uses the caster's warscroll as well as the endless spell rules (core rules, 19.3). A WIZARD on a Dais Arcanum has a Move characteristic of 12" and can fly.

        If the caster attempts to dispel this endless spell, it is automatically dispelled (do not make a dispelling roll). If the caster is slain, this endless spell is dispelled. If this endless spell is dispelled and the caster has not been slain, before removing the endless spell from play, set up the caster wholly within 6" of the endless spell and more than 3" from all enemy units.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Arcane Enhancement`,
        desc: `A WIZARD on a Dais Arcanum can attempt to unbind 1 extra spell in the enemy hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Winds of Azyr`,
        desc: `Subtract 1 from hit rolls for attacks that target a Wizard on a Dais Arcanum.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
    ],
  },
  'Everblaze Comet': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 36". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Burning Vengeance`,
        desc: `After this endless spell is set up, roll a dice for each unit within 10" of this endless spell. On a 1, that unit suffers 1 mortal wound. On a 2-5, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
      {
        name: `Arcane Disruption`,
        desc: `Subtract 1 from casting rolls for Wizards within 10" of this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          rule_sources.ERRATA_STORMCAST_ETERNALS_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
