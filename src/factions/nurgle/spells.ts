import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  // Unit Spells
  'Stream of Corruption': {
    effects: [
      {
        name: `Stream of Corruption`,
        desc: `Stream of Corruption is a spell that has a casting value of 6 and a range of 7". If successfully cast, pick 1 enemy unit within range and visible to the caster. Roll 1 dice for each model in that unit that is within range of the caster. For each 5+, that unit suffers 1 mortal wound.

        Before attempting to cast this spell, you can say that the caster will project the stream across a greater distance. If you do so, the spell has a range of 14" but only inflicts 1 mortal wound for each roll of 6 instead of each roll of 5+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Deluge of Nurgle': {
  //   effects: [
  //     {
  //       name: `Deluge of Nurgle`,
  //       desc: `Casting value of 7. If successful roll 7 dice. For each roll that equals or beats the value from the damage table, pick a visible enemy unit and deal D3 mortal wounds to it. 'If more than one roll causes mortal wounds, you must pick a different enemy unit to suffer each set of mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Plague Wind': {
  //   effects: [
  //     {
  //       name: `Plague Wind`,
  //       desc: `Casting value of 7. If successful pick a point 14" from the caster and draw an imaginary straight line between the point and the closest part of the caster's base. Each unit (friend or foe) crossed by the center of the line suffers D3 mortal wounds. Nurgle units instead heal D3 wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Eruptive Infestation': {
  //   effects: [
  //     {
  //       name: `Eruptive Infestation`,
  //       desc: `Casting value of 6. Pick an enemy unit that is within 7" of a friendly Plaguebearers unit and visible to the caster. That unit suffers D3 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Fleshy Abundance': {
    effects: [
      {
        name: `Fleshy Abundance`,
        desc: `Fleshy Abundance is a spell that has a casting value of 7 and a range of 14". If successfully cast, pick 1 friendly MAGGOTKIN OF NURGLE DAEMON unit within range and visible to the caster. Add 1 to the Wounds characteristic of that unit until your next hero phase.

        Designer's Note: This can result in a model that is affected by this spell being slain if the wounds allocated to that model equal or exceed its Wounds characteristic once the effect of the spell ends.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Miasma of Pestilence': {
  //   effects: [
  //     {
  //       name: `Miasma of Pestilence`,
  //       desc: `Casting value of 6. Pick an enemy unit within 14" of the caster that is visible. Until your next hero phase, roll a D6 at the end of each phase in which any wounds or mortal wounds were allocated to that unit and not negated. On a 2+ that unit suffers D3 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Miasma of Pestilence`,
  //       desc: `If active, roll a D6 at the end of each phase in which any wounds or mortal wounds were allocated to the debuffed unit and not negated. On a 2+ that unit suffers D3 mortal wounds.`,
  //       when: [
  //         END_OF_HERO_PHASE,
  //         END_OF_MOVEMENT_PHASE,
  //         END_OF_CHARGE_PHASE,
  //         END_OF_COMBAT_PHASE,
  //         END_OF_BATTLESHOCK_PHASE,
  //       ],
  //     },
  //   ],
  // },
  // 'Curse of the Leper': {
  //   effects: [
  //     {
  //       name: `Curse of the Leper`,
  //       desc: `Casting value of 7. Select a unit within 14" that is visible. Subtract 1 from the save rolls for that unit for the rest of the battle. This spell cannot be cast on the same enemy unit more that once per battle.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Curse of the Leper`,
  //       desc: `If active, subtract 1 from the save rolls for the debuffed unit for the rest of the battle.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  // 'Foul Regenesis': {
  //   effects: [
  //     {
  //       name: `Foul Regenesis`,
  //       desc: `Casting value of 7. Pick a result from the Stage of Corruption - the Cycle of Corruption is immediately reset to the stage you picked.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Blades of Putrefaction': {
    effects: [
      {
        name: `Blades of Putrefaction`,
        desc: `Casting value of 7 and a range of 14". If successfully cast, pick 1 friendly MAGGOTKIN OF NURGLE unit within range and visible to the caster. Until your next hero phase, each attack made with a missile weapon or melee weapon by that unit inflicts 1 disease point on the target unit on an unmodified hit roll of 5 or 6.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gift of Disease': {
    effects: [
      {
        name: `Gift of Disease`,
        desc: `Casting value of 6 and a range of 21". If successfully cast, pick 1 enemy unit within range and visible to the caster. Give that unit and each other enemy unit within 7" of that unit 1 disease point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rancid Visitations': {
    effects: [
      {
        name: `Rancid Visitations`,
        desc: `Casting value of 6 and a range of 7". If successfully cast, pick 1 enemy unit within range and visible to the caster and roll 1 dice for each model in that unit that is within range. For each 2+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Gift of Contagion': {
  //   effects: [
  //     {
  //       name: `Gift of Contagion`,
  //       desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible. Roll a D6 and look up the result applying the penalty to all models in the unit until the start of your next hero phase.

  //       1-2 - Flyblown Palsy: Subtract 1 from the unit's hit rolls in the combat phase.

  //       3-4 - Muscular Atrophy: Subtract 1 from the unit's wound rolls in the combat phase.

  //       5-6 - Liquefying Ague: Subtract 1 from the unit's save rolls.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Gift of Contagion: Flyblown Palsy`,
  //       desc: `If active, subtract 1 from the unit's hit.`,
  //       when: [COMBAT_PHASE],
  //     },
  //     {
  //       name: `Gift of Contagion: Muscular Atrophy`,
  //       desc: `If active, subtract 1 from the unit's wound rolls.`,
  //       when: [COMBAT_PHASE],
  //     },
  //     {
  //       name: `Gift of Contagion: Liquefying Ague`,
  //       desc: `If active, subtract 1 from the unit's save rolls.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  'Favoured Poxes': {
    effects: [
      {
        name: `Favoured Poxes`,
        desc: `Casting value of 7 and a range of 14". If successfully cast, pick 1 enemy unit within range and visible to the caster. Until the caster moves, attacks, makes a casting, unbinding or dispelling attempt, or is slain, subtract 1 from hit and wound rolls for attacks made by that unit and subtract 1 from save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Glorious Afflictions': {
  //   effects: [
  //     {
  //       name: `Glorious Afflictions`,
  //       desc: `Casting value of 5. Pick an enemy unit within 21" and visible to the caster. The move characteristic and any run or charge rolls made for them are halved (rounding up) until your next hero phase. In addition units that can normally fly cannot do so until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Glorious Afflictions`,
  //       desc: `If active, the debuffed unit's move characteristic and any run or charge rolls made for them are halved (rounding up) and cannot fly.`,
  //       when: [MOVEMENT_PHASE, CHARGE_PHASE],
  //     },
  //   ],
  // },
  // 'Sumptuous Pestilence': {
  //   effects: [
  //     {
  //       name: `Sumptuous Pestilence`,
  //       desc: `Casting value of 6. Each enemy unit within 7" of the caster suffers 1 mortal wound. Units with 5 or more models suffer D3 mortal wounds instead.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Magnificent Buboes': {
    effects: [
      {
        name: `Magnificent Buboes`,
        desc: `Casting value of 7 and a range of 21". Pick 1 enemy hero within range and visible to the caster. Until your next hero phase, subtract 1 from hitrolls for attacks made by that HERO and subtract 1 from chanting, casting, dispelling and unbinding rolls for that HERO.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Plague Squall': {
    effects: [
      {
        name: `Plague Squall`,
        desc: `Casting value of 6. If successfully cast, roll 7 dice. For each 6, you can pick 1 different encnoy unit that is visible to the caster and give that unit 1 disease point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cloying Quagmire': {
    effects: [
      {
        name: `Cloying Quagmire`,
        desc: `Casting value of 5 and a range of 14". If successfully cast, pick 1 enemy unit within range and visible to the caster. Roll a dice. If the roll is equal to or higher than that unit's Save characteristic, until your next hero phase, halve that unit's Move characteristic and subtract 2 from run rolls and charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
