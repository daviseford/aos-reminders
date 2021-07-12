import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

// Endless spells.
const EndlessSpells = {
  'Ravening Direflock': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 12". If successfully cast, set up the parts of the endless spell within 3" of each other, wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only BEASTS OF CHAOS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      {
        name: `Harbingers of Dark Omens`,
        desc: `Models cannot issue the Inspiring Presence or Rally command while they are within 12" of this endless spell. This ability has no effect on BEASTS OF CHAOS models.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      {
        name: `Black-souled Cowardice`,
        desc: `If a unit finishes a move within 1" of this endless spell, remove this endless spell from the battlefield. At the end of that phase, the player whose turn is taking place must set up the parts of the endless spell anywhere on the battlefield, within 3" of each other and more than 1" from all models, other endless spells and invocations.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
    ],
  },
  'Doomblast Dirgehorn': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only BEASTS OF CHAOS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      {
        name: `Booming Cacophony`,
        desc: `After this endless spell is set up, its range is 3". At the start of each subsequent battle round, its range is increased by 3".

        Subtract 1 from hit rolls for attacks made by units within range of any endless spells with this ability. This ability has no effect on hit rolls for attacks made by BEASTS OF CHAOS units.

        Designer's Note: If this endless spell is removed from play, the next time it is set up, its range resets to 3".`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
    ],
  },
  'Wildfire Taurus': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only BEASTS OF CHAOS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      GenericEffects.Predatory.Twelve_Inches,
      {
        name: `Whirlwind of Destruction`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across and each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds. In addition, the strike-last effect applies to units that are within 3" of this endless spell.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      {
        name: `Whirlwind of Destruction`,
        desc: `The strike-last effect applies to units that are within 3" of this endless spell.`,
        when: [COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
