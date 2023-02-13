import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

// Endless spells.
const EndlessSpells = {
  'Ravening Direflock': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 5 and range of 12". If successfully cast, set up the parts of the endless spell within 3" of each other, wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only BEASTS OF CHAOS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Harbingers of Dark Omens`,
        desc: `Models cannot issue the Rally or Inspiring Presence commands while they are within 6" of this endless spell. This ability has no effect on BEASTS OF CHAOS units.`,
        when: [START_OF_HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Doomblast Dirgehorn': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only BEASTS OF CHAOS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Booming Cacophony`,
        desc: `After this endless spell is set up, its range is 6". At the start of each subsequent battle round, its range is increased by 6".

        Subtract 1 from wound rolls for attacks made by units within range of any endless spells with this ability. This ability has no effect on hit rolls for attacks made by BEASTS OF CHAOS units.

        Designer's Note: If this endless spell is removed from play, the next time it is set up, its range resets to 6".`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Wildfire Taurus': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only BEASTS OF CHAOS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Twelve_Inches,
      {
        name: `Whirlwind of Destruction`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across and each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds. In addition, the strike-last effect applies to units within 3" of this endless spell. This ability has no effect on BEASTS OF CHAOS units.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Whirlwind of Destruction`,
        desc: `The strike-last effect applies to units that within 3" of this endless spell. This ability has no effect on BEASTS OF CHAOS units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
