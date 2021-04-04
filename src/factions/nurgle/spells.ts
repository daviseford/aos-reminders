import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
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
  'Foul Regenesis': {
    effects: [
      {
        name: `Foul Regenesis`,
        desc: `Casting value of 7. Pick a result from the Stage of Corruption - the Cycle of Corruption is immediately reset to the stage you picked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blades of Putrefaction': {
    effects: [
      {
        name: `Blades of Putrefaction`,
        desc: `Casting value of 7. Pick a friendly unit within 14" of the caster that is visible. Until your next hero phase, hit rolls of 6 inflict 1 mortal wound in addition to any other damage.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blades of Putrefaction`,
        desc: `If active, the buffed unit's hit rolls of 6 inflict 1 mortal wound in addition to any other damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Rancid Visitations': {
    effects: [
      {
        name: `Rancid Visitations`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 3" of the caster. That unit suffers 1 mortal wound for each model from the unit that is within 3" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gift of Contagion': {
    effects: [
      {
        name: `Gift of Contagion`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible. Roll a D6 and look up the result applying the penalty to all models in the unit until the start of your next hero phase.

        1-2 - Flyblown Palsy: Subtract 1 from the unit's hit rolls in the combat phase.

        3-4 - Muscular Atrophy: Subtract 1 from the unit's wound rolls in the combat phase.

        5-6 - Liquefying Ague: Subtract 1 from the unit's save rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gift of Contagion: Flyblown Palsy`,
        desc: `If active, subtract 1 from the unit's hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gift of Contagion: Muscular Atrophy`,
        desc: `If active, subtract 1 from the unit's wound rolls.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gift of Contagion: Liquefying Ague`,
        desc: `If active, subtract 1 from the unit's save rolls.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Favoured Poxes': {
    effects: [
      {
        name: `Favoured Poxes`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 14" and visible to caster. Subtract 1 from hit, wound, and save rolls for that unit until the caster moves, attempts to cast a spell, or is slain.`,
        when: [HERO_PHASE],
      },
      {
        name: `Favoured Poxes`,
        desc: `If active, subtract 1 from hit, wound, and save rolls for the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE, SAVES_PHASE],
      },
    ],
  },
  'Glorious Afflictions': {
    effects: [
      {
        name: `Glorious Afflictions`,
        desc: `Casting value of 5. Pick an enemy unit within 21" and visible to the caster. The move characteristic and any run or charge rolls made for them are halved (rounding up) until your next hero phase. In addition units that can normally fly cannot do so until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Glorious Afflictions`,
        desc: `If active, the debuffed unit's move characteristic and any run or charge rolls made for them are halved (rounding up) and cannot fly.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Sumptuous Pestilence': {
    effects: [
      {
        name: `Sumptuous Pestilence`,
        desc: `Casting value of 6. Each enemy unit within 7" of the caster suffers 1 mortal wound. Units with 5 or more models suffer D3 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Magnificent Buboes': {
    effects: [
      {
        name: `Magnificent Buboes`,
        desc: `Casting value of 7. Pick an enemy hero within 21" of the caster that is visible. The hero suffers D3 mortal wounds. In addition subtract 1 from their hit rolls, casting rolls, and unbinding rolls until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magnificent Buboes`,
        desc: `If active, subtract 1 from the debuffed unit's casting rolls and unbinding rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magnificent Buboes`,
        desc: `If active, subtract 1 from the debuffed unit's hit rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Plague Squall': {
    effects: [
      {
        name: `Plague Squall`,
        desc: `Casting value of 6. Roll 7 dice. For each roll of 6, you can pick an enemy unit that is visible to the caster. That unit suffers D3 mortal wounds. If you roll more than one 6, you must select a different enemy unit to suffer each set of mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cloying Quagmire': {
    effects: [
      {
        name: `Cloying Quagmire`,
        desc: `Casting value of 5. Pick an enemy unit within 14" of the caster that is visible. Then roll a D6 and compare the enemy unit's save characteristic. If the roll is equal to or higher that the save characteristic, the unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
