// Spell Lores of Nurgle
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Spells: TEntry[] = [
  {
    name: `Foul Regenesis`,
    effects: [
      {
        name: `Foul Regenesis`,
        desc: `Casting value of 7. Pick a result from the Stage of Corruption - the Cycle of Corruption is immediately reset to the stage you picked.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Blades of Putrefaction (Rotbringer)`,
    effects: [
      {
        name: `Blades of Putrefaction`,
        desc: `Casting value of 7. Pick a friendly unit within 14" of the caster that is visible. Until your next hero phase, hit rolls of 6 inflict 1 mortal wound in addition to any other damage.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Blades of Putrefaction`,
        desc: `If active, the buffed unit's hit rolls of 6 inflict 1 mortal wound in addition to any other damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rancid Visitations (Rotbringer)`,
    effects: [
      {
        name: `Rancid Visitations`,
        desc: `Casting value of 6. Pick an enemy unit within 3" of the caster. That unit suffers 1 mortal wound for each model from the unit that is within 3" of the caster.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Gift of Contagion (Rotbringer)`,
    effects: [
      {
        name: `Gift of Contagion`,
        desc: `Casting value of 6. Pick an enemy unit within 18" of the caster that is visible. Roll a D6 and look up the result applying the penalty to all models in the unit until the start of your next hero phase.

        1-2 - Flyblown Palsy: Subtract 1 from the unit's hit rolls in the combat phase.

        3-4 - Muscular Atrophy: Subtract 1 from the unit's wound rolls in the combat phase.

        5-6 - Liquefying Ague: Subtract 1 from the unit's save rolls.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Gift of Contagion`,
        desc: ` Effect table:
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
  {
    name: `Favoured Poxes (Daemon)`,
    effects: [
      {
        name: `Favoured Poxes`,
        desc: `Casting value of 7. Pick an enemy unit within 14" and visible to caster. Subtract 1 from hit, wound, and save rolls for that unit until the caster moves, attempts to cast a spell, or is slain.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Favoured Poxes`,
        desc: `If active, subtract 1 from hit, wound, and save rolls for the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE, SAVES_PHASE],
      },
    ],
  },
  {
    name: `Glorious Afflictions (Daemon)`,
    effects: [
      {
        name: `Glorious Afflictions`,
        desc: `Casting value of 5. Pick an enemy unit within 21" and visible to the caster. The move characteristic and any run or charge rolls made for them are halved (rounding up) until your next hero phase. In addition units that can normally fly cannot do so until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Glorious Afflictions`,
        desc: `If active, the debuffed unit's move characteristic and any run or charge rolls made for them are halved (rounding up) and cannot fly.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Sumptuous Pestilence (Daemon)`,
    effects: [
      {
        name: `Sumptuous Pestilence`,
        desc: `Casting value of 6. Each enemy unit within 7" of the caster suffers 1 mortal wound. Units with 5 or more models suffer D3 mortal wounds instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Magnificent Buboes (Mortal)`,
    effects: [
      {
        name: `Magnificent Buboes`,
        desc: `Casting value of 7. Pick an enemy hero within 21" of the caster that is visible. The hero suffers D3 mortal wounds. In addition subtract 1 from their hit rolls, casting rolls, and unbinding rolls until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
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
  {
    name: `Plague Squall (Mortal)`,
    effects: [
      {
        name: `Plague Squall`,
        desc: `Casting value of 6. Roll 7 dice. For each roll of 6, you can pick an enemy unit that is visible to the caster. That unit suffers D3 mortal wounds. If you roll more than one 6, you must select a different enemy unit to suffer each set of mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Cloying Quagmire (Mortal)`,
    effects: [
      {
        name: `Cloying Quagmire`,
        desc: `Casting value of 5. Pick an enemy unit within 14" of the caster that is visible. Then roll a D6 and compare the enemy unit's save characteristic. If the roll is equal to or higher that the save characteristic, the unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
]

export default Spells
