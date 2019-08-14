import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Viletide (Brayherd Wizard)`,
    effects: [
      {
        name: `Viletide (Brayherd Wizard)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If the unit is within 6" of the caster, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vicious Stranglethorns (Brayherd Wizard)`,
    effects: [
      {
        name: `Vicious Stranglethorns (Brayherd Wizard)`,
        desc: `Casting value of 7. If successfully cast, pick a terrain feature wholly within 24" of the caster that is visible to them. Each enemy unit within 3" of that terrain feature suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Savage Dominion (Brayherd Wizard)`,
    effects: [
      {
        name: `Savage Dominion (Brayherd Wizard)`,
        desc: `Casting value of 5. If successfully cast, pick an enemy Monster unit that is a single model within 18" of the caster and visible to them, and roll 2D6. If the roll is equal to or greater than that model's Bravery characteristic, you can move it 3" towards the closest other model. You can then pick 1 other unit within 1" of that Monster and roll a number of dice equal to the Monster's Wounds characteristic. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tendrils of Atrophy (Brayherd Wizard)`,
    effects: [
      {
        name: `Tendrils of Atrophy (Brayherd Wizard)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. Until your next hero phase, subtract 1 from save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wild Rampage (Brayherd Wizard)`,
    effects: [
      {
        name: `Wild Rampage (Brayherd Wizard)`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 12" of the caster that is visible to them. Until your next hero phase, you can re-roll failed wound rolls for attacks with melee weapons made by this unit. However, subtract 1 from save rolls for attacks that target this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Titanic Fury (Brayherd Wizard)`,
    effects: [
      {
        name: `Titanic Fury (Brayherd Wizard)`,
        desc: `Casting value of 7. If successfully cast, pick a friendly BEASTS OF CHAOS MONSTER within 12" of the caster that is visible to them. Until your next hero phase, add 1 to the Attacks characteristic of that MONSTER's melee weapons.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Thunderwave (Thunderscorn Wizard)`,
    effects: [
      {
        name: `Thunderwave (Thunderscorn Wizard)`,
        desc: `Casting value of 7. If successfully cast, each unit within 3" of the caster suffers D3 mortal wounds. THUNDERSCORN units are not affected by this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hailstorm (Thunderscorn Wizard)`,
    effects: [
      {
        name: `Hailstorm (Thunderscorn Wizard)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 21" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic of, and run and charge rolls for, that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sundering Blades (Thunderscorn Wizard)`,
    effects: [
      {
        name: `Sundering Blades (Thunderscorn Wizard)`,
        desc: `Casting value of 7. If successfully cast, pick a friendly unit wholly within 18" of the caster that is visible to them. Until your next hero phase, improve the Rend characteristic of that unit's melee weapons by 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
