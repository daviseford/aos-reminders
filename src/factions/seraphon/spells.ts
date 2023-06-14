import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  // 'Celestial Apotheosis': {
  //   effects: [
  //     {
  //       name: `Celestial Apotheosis`,
  //       desc: `Casting value of 5. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Heal 1 wound allocated to that unit. In addition, until your next hero phase, subtract 1 from the Bravery characteristic of enemy units while they are within 3" of that unit. If the casting roll was 10+, heal up to D3 wounds instead of 1.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Walk Between Realms': {
  //   effects: [
  //     {
  //       name: `Walk Between Realms`,
  //       desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Until your next hero phase, that unit can fly.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Tide of Serpents': {
    effects: [
      {
        name: `Tide of Serpents`,
        desc: `Casting value of 7 and a range of 15". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mystical Unforging': {
    effects: [
      {
        name: `Mystical Unforging`,
        desc: `Casting value of 8 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until the start of your next hero phase, the Rend characteristic of that unit's weapons is treated as '-'.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Stellar Tempest': {
    effects: [
      {
        name: `Stellar Tempest`,
        desc: `Casting value of 8 and a range of 24". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cosmic Crush': {
    effects: [
      {
        name: `Cosmic Crush`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each roll that equals or exceeds that unit's Save characteristic, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Fiery Convocation': {
  //   effects: [
  //     {
  //       name: `Fiery Convocation`,
  //       desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase, at the end of each phase of a turn, roll a D6 for that unit. On a 6, that unit suffers D3 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Bind Endless Spell': {
  //   effects: [
  //     {
  //       name: `Bind Endless Spell`,
  //       desc: `Casting value of 7 and range of 18". A WIZARD that is bonded to an endless spell cannot attempt to cast this spell. Pick 1 endless spell within range and visible to the caster, and that is not bonded or linked to another model. That endless spell is bonded to the caster.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Extend Astromatrix': {
  //   effects: [
  //     {
  //       name: `Extend Astromatrix`,
  //       desc: `Casting value of 6. Pick 1 terrain feature wholly within 18" of the caster and visible to them. Any Damned, Arcane, Inspiring and Mystical scenery rules for that terrain feature only apply to SERAPHON units, while any Deadly and Sinister scenery rules for that terrain feature do not apply to SERAPHON units.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Hand of Glory': {
  //   effects: [
  //     {
  //       name: `Hand of Glory`,
  //       desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Until your next hero phase, you can reroll hit rolls of 1 for attacks made by that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Celestial Harmony': {
    effects: [
      {
        name: `Celestial Harmony`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly SERAPHON unit wholly within range and visible to the caster. If the casting roll was 10+, pick all friendly SERAPHON units wholly within range and visible to the caster instead of 1. Until your next hero phase, the units picked have a Bravery characteristic of 10.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Speed of Huanchi': {
    effects: [
      {
        name: `Speed of Huanchi`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly KROXIGOR or SKINK unit that is not a MONSTER and that is wholly within range and visible to the caster. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Celestial Equilibrium': {
  //   effects: [
  //     {
  //       name: `Celestial Equilibrium`,
  //       desc: `Casting value of 7. Until your next hero phase, add 1 to casting, dispelling and unbinding rolls for friendly WIZARDS other than the caster.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Drain Magic': {
    effects: [
      {
        name: `Drain Magic`,
        desc: `Casting value of 6. If successfully cast, until the end of the phase, add 1 to dispelling rolls made by friendly units and subtract 1 from unbinding rolls made by enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Comet's Call": {
    effects: [
      {
        name: `Comet's Call`,
        desc: `Casting value of 7. Pick up to D3 different enemy units on the battlefield. If the casting roll was 10+, pick up to D6 different enemy units instead of up to D3. Each of those units suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Tepok's Beneficence": {
    effects: [
      {
        name: `Tepok's Beneficence`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly SKINK unit wholly within range and visible to the caster. Until the start of your next hero phase, subtract 1 from wound rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Deliverance': {
    effects: [
      {
        name: `Celestial Deliverance`,
        desc: `The caster can attempt to cast this spell up to 3 times in the same hero phase.

    Casting value of 7 the first time it is attempted in a phase, a casting value of 8 the second time it is attempted in a phase, and a casting value of 9 the third time it is attempted in a phase.

    Each time this spell is successfully cast, pick up to 3 different enemy units within 10" of the caster and visible to them, and roll 1 dice for each unit you pick. On a 2+, that unit suffers D3 mortal wounds. If that unit is a CHAOS DAEMON unit, on a 2+ it suffers 3 mortal wounds instead of D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // 'Control Fate': {
  //   effects: [
  //     {
  //       name: `Control Fate`,
  //       desc: `Casting value of 7. Pick 1 unit within 18" of the caster and visible to them. If that unit is an enemy unit, until your next hero phase, subtract 1 from save rolls for attacks that target that unit. If that unit is a friendly SERAPHON unit, until your next hero phase, add 1 to save rolls for attacks that target that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },

  // 'Blazing Starlight': {
  //   effects: [
  //     {
  //       name: `Blazing Starlight`,
  //       desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'The Earth Trembles': {
    effects: [
      {
        name: `The Earth Trembles`,
        desc: `Casting value of 8. Pick 1 of the corners of the battlefield and draw a straight line between that corner and the closest part of the caster's base. Roll a dice for each enemy unit passed across by that line. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Empowered Celestite': {
    effects: [
      {
        name: `Empowered Celestite`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly SAURUS unit wholly within range and visible to the caster. Until the start of the next hero phase, improve the Rend characteristic of that unit's Celestite weapons by 1. A Celestite weapon is any weapon that has 'Celestite' in the name.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Itzl's Invigoration": {
    effects: [
      {
        name: `Itzl's Invigoration`,
        desc: `Casting value of 6 and a range of 12". Pick 1 friendly MONSTER wholly within range and visible to the caster. Until the start of your next hero phase, use the top row of that unit's damage table, regardless of how many wounds it has suffered.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Telepathic Summons': {
    effects: [
      {
        name: `Telepathic Summons`,
        desc: `Casting value of 6 and a range of 9". Pick 1 friendly SAURUS unit that is not a MONSTER and that is visible to the caster. Remove that unit from the battlefield and set it up again on the battlefield wholly within range of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Light of Chotec': {
    effects: [
      {
        name: `Light of Chotec`,
        desc: `Casting value of 7 and a range of 12". Pick 1 friendly SERAPHON model wholly within range and visible to the caster. Roll a number of dice equal to the number of wounds allocated to it. For each 5+, heal 1 wound allocated to that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Heavenly Frenzy': {
    effects: [
      {
        name: `Heavenly Frenzy`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly SERAPHON unit wholly within range and visible to the caster. Until the end of the turn, that unit can run and still charge later in the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
