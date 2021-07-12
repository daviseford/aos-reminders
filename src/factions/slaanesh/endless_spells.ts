import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

// Endless spells.
const EndlessSpells = {
  'Wheels of Excruciation': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only HEDONITES OF SLAANESH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
      {
        name: `Exquisite Agony`,
        desc: `After this endless spell has moved, roll 6 dice for each unit that has any models it passed across. That unit suffers 1 mortal wound for each roll that is less than that unit's unmodified Save characteristic. This ability has no effect on SLAANESH units.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
    ],
  },
  'Mesmerising Mirror': {
    effects: [
      GenericEffects.Predatory.Six_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 18". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only HEDONITES OF SLAANESH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
      {
        name: `Irresistible Lure`,
        desc: `If a unit starts a normal move, run or retreat within 12" of this endless spell, it suffers D3 mortal wounds unless it finishes that move closer to this endless. This ability has no effect on SLAANESH units.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
      {
        name: `Gaze Not into its Depths`,
        desc: `At the end of the movement phase, roll 6 dice for each HERO within 6" of this endless spell (roll separately for each HERO). For each 6, that HERO suffers a number of mortal wounds equal to the number of 6s that were rolled for that HERO. This ability has no effect on SLAANESH HEROES.

        Designer's Note: If you rolled one 6 for a HERO, that HERO would suffer 1 x 1 = 1 mortal wound. If you rolled two 6s, that HERO would suffer 2 x 2 = 4 mortal wounds, if you rolled three 6s, that HERO would suffer 3 x 3 = 9 mortal wounds, and so on.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
    ],
  },
  'Dreadful Visage': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only HEDONITES OF SLAANESH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
      {
        name: `Flensing Tongues`,
        desc: `After this endless spell has moved, roll 6 dice for the closest unit within 6" of it. If more than 1 such unit is equally close, the commanding player can choose which unit to roll for. For each 4+, that unit suffers 1 mortal wound. If a unit suffers any mortal wounds from this ability that are not negated, the strike-last effect applies to that unit until the end of the following combat phase.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
      {
        name: `Terrifying Entity`,
        desc: `Subtract 1 from the Bravery characteristic of units while they are within 12" of this endless spell. Add 1 to the Bravery characteristic of SLAANESH units while they are within 12" of this endless spell instead of subtracting 1.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_SLAANESH_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
