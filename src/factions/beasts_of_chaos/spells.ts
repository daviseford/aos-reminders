import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const Spells = {
  // Twisted Wilds
  'Viletide (Brayherd Wizard)': {
    effects: [
      {
        name: `Viletide (Brayherd Wizard)`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds and cannot receive commands until the end of that turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vicious Stranglethorns (Brayherd Wizard)': {
    effects: [
      {
        name: `Vicious Stranglethorns (Brayherd Wizard)`,
        desc: `Casting value of 5. pick 1 enemy unit within 18" and visible to the caster. That enemy unit cannot make pile-in moves until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Primal Dominance (Brayherd Wizard)': {
    effects: [
      {
        name: `Primal Dominance (Brayherd Wizard)`,
        desc: `Casting value of 5. Pick 1 enemy MONSTER within 18" and visible to the caster. Until your next hero phase, that MONSTER counts as 1 model for the purposes of contesting objectives and cannot carry out monstrous rampages.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tendrils of Atrophy (Brayherd Wizard)': {
    effects: [
      {
        name: `Tendrils of Atrophy (Brayherd Wizard)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" and visible to the caster. Add 1 to the damage inflicted by each successful attack made with a melee weapon that targets that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wild Rampage (Brayherd Wizard)': {
    effects: [
      {
        name: `Wild Rampage (Brayherd Wizard)`,
        desc: `Casting value of 7. Pick 1 friendly BEASTS OF CHAOS unit wholly within 12" and visible to the caster. Until your next hero phase, if the unmodified hit roll for an attack made with a melee weapon by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wild Rampage (Brayherd Wizard)`,
        desc: `If active, 6s to hit score 2 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Titanic Fury (Brayherd Wizard)': {
    effects: [
      {
        name: `Titanic Fury (Brayherd Wizard)`,
        desc: `Casting value of 6. Pick 1 friendly BEASTS OF CHAOS MONSTER wholly within 12" and visible to the caster. Until your next hero phase, add 1 to the Attacks characteristic of that MONSTER'S melee weapons.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Dark Storms
  'Hailstorm (Thunderscorn Wizard)': {
    effects: [
      {
        name: `Hailstorm (Thunderscorn Wizard)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 21" and visible to the caster. Until your next hero phase, halve the Move characteristic of that unit, and halve run rolls and charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hailstorm (Thunderscorn Wizard)`,
        desc: `If active, halve the movement, run, and charge rolls for the picked unit.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Fulgurous Blades (Thunderscorn Wizard)': {
    effects: [
      {
        name: `Fulgurous Blades (Thunderscorn Wizard)`,
        desc: `Casting value of 6. Pick 1 friendly BEASTS OF CHAOS unit wholly within 18" and visible to the caster. Until your next hero phase, subtract 1 from the Attacks characteristic of melee weapons that target that unit (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
    'Thunderwave (Thunderscorn Wizard)': {
      effects: [
        {
          name: `Thunderwave (Thunderscorn Wizard)`,
          desc: `Casting value of 5. Each unit within 3" of the caster suffers D3 mortal wounds. THUNDERSCORN units are not affected by this spell.`,
          when: [HERO_PHASE],
        },
      ],
    },
    'Furious Gale (Thunderscorn Wizard)': {
      effects: [
        {
          name: `Furious Gale (Thunderscorn Wizard)`,
          desc: `Casting value of 6. Until your next hero phase, subtract 1 from the Attacks characteristic of missile weapons used by enemy units while they are within 18" of the caster (to a minimum of 1).`,
          when: [HERO_PHASE],
        },
        {
          name: `Furious Gale (Thunderscorn Wizard)`,
          desc: `If active, subtract 1 from the Attacks characteristic of missile weapons used by enemy units while they are within 18" of the caster (to a minimum of 1).`,
          when: [SHOOTING_PHASE],
        },
      ],
    },
    'Raging Storm (Thunderscorn Wizard)': {
      effects: [
        {
          name: `Raging Storm (Thunderscorn Wizard)`,
          desc: `Casting value of 8. Heal 1 wound allocated to each friendly THUNDERSCORN unit on the battlefield. In addition, each enemy unit on the battlefield suffers 1 mortal wound.`,
          when: [HERO_PHASE],
        },
      ],
    },
  },
  // Unit Spells
  Devolve: {
    effects: [
      {
        name: `Devolve`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" and visible to the caster. Until your next hero phase, roll 3D6 before that unit makes a normal move, runs, retreats or makes a charge move. If the roll is greater than that unit's Bravery characteristic, the maximum distance of that move is halved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Devolve`,
        desc: `If active, roll 3D6 before the picked unit makes a normal move, runs, retreats or makes a charge move. If the roll is greater than that unit's Bravery characteristic, the maximum distance of that move is halved.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Summon Lightning': {
    effects: [
      {
        name: `Summon Lightning`,
        desc: `Casting value of 7. Pick up to D3 friendly THUNDERSCORN unit within 24" of the caster and visible to them. You can heal D3 wounds allocated to those units (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Boon of Mutation': {
    effects: [
      {
        name: `Boon of Mutation`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. For each model that is slain by a mortal wound caused by this spell, you can add 1 Tzaangor model that is not a Tzaangor Champion or Tzaangor Mutant to a friendly Tzaangor Host within 12" of the caster. Set up models that are added to a unit one at a time within 1" of the unit they are being added to. Models that are added to a unit can only be set up within 3" of an enemy unit if a model from their unit is already within 3" of that enemy unit. The models added to a unit can take it above its maximum size.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Savage Bolt': {
    effects: [
      {
        name: `Savage Bolt`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. Units that attack the target unit in the next combat phase get +1 to their hit rolls.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
