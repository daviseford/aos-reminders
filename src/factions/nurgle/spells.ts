import { tagAs } from 'factions/metatagger'
import {
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Spells = {
  // Unit Spells
  'Stream of Corruption': {
    effects: [
      {
        name: `Stream of Corruption`,
        desc: `Casting value of 6. Pick an enemy unit within 7" and visible. That unit suffers 3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Deluge of Nurgle': {
    effects: [
      {
        name: `Deluge of Nurgle`,
        desc: `Casting value of 7. If successful roll 7 dice. For each roll that equals or beats the value from the damage table, pick a visible enemy unit and deal D3 mortal wounds to it. If more than one roll inflicts mortal wounds, you must pick a different enemy unit to suffer each set of mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Plague Wind': {
    effects: [
      {
        name: `Plague Wind`,
        desc: `Casting value of 7. If successful pick a point 14" from the caster and draw an imaginary straight line between the point and the closest part of the caster's base. Each unit (friend or foe) crossed by the center of the line suffers D3 mortal wounds. Nurgle units instead heal D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Eruptive Infestation': {
    effects: [
      {
        name: `Eruptive Infestation`,
        desc: `Casting value of 6. Pick an enemy unit that is within 7" of a friendly Plaguebearers unit and visible to the caster. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fleshy Abundance': {
    effects: [
      {
        name: `Fleshy Abundance`,
        desc: `Casting value of 7. Pick a friendly unit within 14" that is visible to the caster. Add 1 to the wounds characteristic of all models in that unit until your next hero phase. Note this spell expiring can kill models with exisitng allocated wounds equal to or exceeding normal wounds characteristic.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fleshy Abundance`,
        desc: `If active, add 1 to the wounds characteristic of all models in the buffed unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Miasma of Pestilence': {
    effects: [
      {
        name: `Miasma of Pestilence`,
        desc: `Casting value of 6. Pick an enemy unit within 14" of the caster that is visible. Until your next hero phase, roll a D6 at the end of each phase in which any wounds or mortal wounds were allocated to that unit and not negated. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Miasma of Pestilence`,
        desc: `If active, roll a D6 at the end of each phase in which any wounds or mortal wounds were allocated to the debuffed unit and not negated. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [
          END_OF_HERO_PHASE,
          END_OF_MOVEMENT_PHASE,
          END_OF_CHARGE_PHASE,
          END_OF_COMBAT_PHASE,
          END_OF_BATTLESHOCK_PHASE,
        ],
      },
    ],
  },
  'Curse of the Leper': {
    effects: [
      {
        name: `Curse of the Leper`,
        desc: `Casting value of 7. Select a unit within 14" that is visible. Subtract 1 from the save rolls for that unit for the rest of the battle. This spell cannot be cast on the same enemy unit more that once per battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Curse of the Leper`,
        desc: `If active, subtract 1 from the save rolls for the debuffed unit for the rest of the battle.`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
