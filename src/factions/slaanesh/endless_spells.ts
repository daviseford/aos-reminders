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
import { TItemDescriptions } from 'factions/factionTypes'

const EndlessSpells = {
  'Wheels of Excruciation': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Hedonites of Slaanesh Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Exquisite Agony`,
        desc: `After this endless spell has moved, roll 6 dice for each unit that has any models it passed across. For each roll that is less than that unit's unmodified Save characteristic, that unit suffers 1 mortal wound. This ability has no effect on Hedonites of Slaanesh units.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Mesmerising Mirror': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 18". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Hedonites of Slaanesh Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Irresistible Lure`,
        desc: `If a unit starts a normal move, run or retreat within 12" of this endless spell, that unit suffers D3 mortal wounds unless it finishes that move closer to this endless spell than it was at the start of the move. This ability has no effect on Hedonites of Slaanesh units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Gaze Not into its Depths`,
        desc: `At the end of the movement phase, roll 6 dice for each unit within 6" of this endless spell. For each 6, that unit's commanding player must choose whether that unit gazes into the mirror or resists temptation. If it resists temptation, that unit suffers D3 mortal wounds. If it gazes into the mirror, the player who summoned this endless spell gains D3 depravity points. This ability has no effect on friendly units.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_APRIL_2023],
      },
    ],
  },
  'Dreadful Visage': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Hedonites of Slaanesh Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flensing Tongues`,
        desc: `After this endless spell has moved, roll 6 dice for the closest unit within 6" of it. If more than 1 unit is equally close, the commanding player can choose which unit to roll for. For each 4+, that unit suffers 1 mortal wound. In addition, if any mortal wounds caused by this ability are allocated to that unit, the strike-last effect applies to that unit until the end of the following combat phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Terrifying Entity`,
        desc: `Subtract 1 from the Bravery characteristic of units while they are within 12" of this endless spell. Add 1 to the Bravery characteristic of Hedonites of Slaanesh units while they are within 12" of this endless spell instead.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(EndlessSpells, 'endless_spell')
