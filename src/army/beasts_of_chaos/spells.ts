import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  {
    name: `Viletide (Brayherd Wizard)`,
    effects: [
      {
        name: `Viletide (Brayherd Wizard)`,
        desc: `Viletide has a casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If the unit is within 6" of the caster, it suffers D6 mortal wounds instead.`,
        when: [],
      },
    ],
  },
  {
    name: `Vicious Stranglethorns (Brayherd Wizard)`,
    effects: [
      {
        name: `Vicious Stranglethorns (Brayherd Wizard)`,
        desc: `Vicious Stranglethorns has a casting value of 7. If successfully cast, pick a terrain feature wholly within 24" of the caster that is visible to them. Each enemy unit within 3" of that terrain feature suffers D3 mortal wounds.`,
        when: [],
      },
    ],
  },
  {
    name: `Savage Dominion (Brayherd Wizard)`,
    effects: [
      {
        name: `Savage Dominion (Brayherd Wizard)`,
        desc: `Savage Dominion has a casting value of 5. If successfully cast, pick an enemy MONSTER unit that is a single model within 18" of the caster and visible to them, and roll 2D6. If the roll is equal to or greater than that model’s Bravery characteristic, it immediately moves 3" towards the closest model. You can then pick a unit within 1" of that MONSTER and roll a number of dice equal to the MONSTER’s Wounds characteristic. For each 4+, that unit suffers 1 mortal wound.`,
        when: [],
      },
    ],
  },
  {
    name: `Tendrils of Atrophy (Brayherd Wizard)`,
    effects: [
      {
        name: `Tendrils of Atrophy (Brayherd Wizard)`,
        desc: `Tendrils of Atrophy has a casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. Until your next hero phase, subtract 1 from save rolls for attacks that target that unit.`,
        when: [],
      },
    ],
  },
  {
    name: `Wild Rampage (Brayherd Wizard)`,
    effects: [
      {
        name: `Wild Rampage (Brayherd Wizard)`,
        desc: `Wild Rampage has a casting value of 6. If successfully cast, pick a friendly unit within 12" of the caster that is visible to them. Until your next hero phase, you can re-roll failed wound rolls for attacks with melee weapons made by this unit. However, subtract 1 from save rolls for attacks that target this unit.`,
        when: [],
      },
    ],
  },
  {
    name: `Titanic Fury (Brayherd Wizard)`,
    effects: [
      {
        name: `Titanic Fury (Brayherd Wizard)`,
        desc: `Titanic Fury has a casting value of 7. If successfully cast, pick a friendly BEASTS OF CHAOS MONSTER within 12" of the caster that is visible to them. Until your next hero phase, add 1 to the Attacks characteristic of that MONSTER’s melee weapons.`,
        when: [],
      },
    ],
  },
  {
    name: `Thunderwave (Thunderscorn Wizard)`,
    effects: [
      {
        name: `Thunderwave (Thunderscorn Wizard)`,
        desc: `Thunderwave has a casting value of 7. If successfully cast, each unit within 3" of the caster suffers D3 mortal wounds. THUNDERSCORN units are not affected by this spell.`,
        when: [],
      },
    ],
  },
  {
    name: `Hailstorm (Thunderscorn Wizard)`,
    effects: [
      {
        name: `Hailstorm (Thunderscorn Wizard)`,
        desc: `Hailstorm has a casting value of 6. If successfully cast, pick an enemy unit within 21" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic of, and run and charge rolls for, that unit.`,
        when: [],
      },
    ],
  },
  {
    name: `Sundering Blades (Thunderscorn Wizard)`,
    effects: [
      {
        name: `Sundering Blades (Thunderscorn Wizard)`,
        desc: `Sundering Blades has a casting value of 7. If successfully cast, pick a friendly unit wholly within 18" of the caster that is visible to them. Until your next hero phase, improve the Rend characteristic of that unit’s melee weapons by 1.`,
        when: [],
      },
    ],
  },
]

export default Spells
