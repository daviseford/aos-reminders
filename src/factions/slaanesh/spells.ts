import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Lash of Slaanesh': {
    effects: [
      {
        name: `Lash of Slaanesh`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster, and roll number of dice equal to the number of models in that unit. For each 5+, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pavane of Slaanesh': {
    effects: [
      {
        name: `Pavane of Slaanesh`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster, and roll a number of dice equal to that unit's Move characteristic. For each 5+, subtract 1" from that unit's Move characteristic (to a minimum of 1") for the rest of the battle. Ihe same unit cannot be affected by this ability more than once per battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hysterical Frenzy': {
    effects: [
      {
        name: `Hysterical Frenzy`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster, and roll a number of dice equal to that unit's Bravery characteristic. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soulslice Shards': {
    effects: [
      {
        name: `Soulslice Shards`,
        desc: `Casting value of 5 and a range of 12. Pick 1 enemy unit within range and visible to the caster, and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit cannot issue or receive commands until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Phantasmagoria: {
    effects: [
      {
        name: `Phantasmagoria`,
        desc: `Casting value of 5 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, each time that unit is picked to fight, you can pick 1 friendly HEDONITES OF SLAANESH unit within 3" of that unit. That friendly unit can retreat.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Born of Damnation': {
    effects: [
      {
        name: `Born of Damnation`,
        desc: `Casting value of 6. If successfully cast, roll 6 dice. For each 4+, you receive 1 depravity point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Paths of the Dark Prince': {
    effects: [
      {
        name: `Paths of the Dark Prince`,
        desc: `Casting value of 5. If successfully cast, roll 3D6 instead of 2D6 when making a charge roll for the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Progeny of Damnation': {
    effects: [
      {
        name: `Progeny of Damnation`,
        desc: `Casting value of 5 and a range of 12". Pick 1 friendly HEDONITES OF SLAANESH unit wholly within range and visible to the caster. Until your next hero phase, if that unit finishes a normal move, run or retreat within 9" of any enemy units, those units cannot receive the Redeploy command.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Slothful Stupor': {
    effects: [
      {
        name: `Slothful Stupor`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, the Move characteristic of that unit is 3" and all run rolls and charge rolls for that unit are treated as being 3.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Battle Rapture': {
  //   effects: [
  //     {
  //       name: `Battle Rapture`,
  //       desc: `Casting value of 5. Pick 1 friendly MORTAL SLAANESH unit wholly within 18" of the caster that is visible to them. Do not take battleshock tests for that unit until your next hero phase. If the casting roll is 10+, you can pick up to 3 friendly SLAANESH MORTAL units wholly within 18" of the caster that is visible to them instead of 1.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Judgement of Excess': {
  //   effects: [
  //     {
  //       name: `Judgement of Excess`,
  //       desc: `Casting value of 5. Pick 1 enemy unit within 12" of the caster that is visible to them. That unit suffers 1 mortal wound for every 5 models in that unit. If that unit has fewer than 5 models, it suffers 1 mortal wound instead.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Dark Delusions': {
  //   effects: [
  //     {
  //       name: `Dark Delusions`,
  //       desc: `Casting value of 4. Pick 1 enemy unit wholly within 18" of the caster that is visible to them and roll 2D6. If the roll is equal to or greater than that unit's Bravery characteristic, add 1 to hit rolls for attacks that target that unit until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },

  // 'Cacophonic Choir': {
  //   effects: [
  //     {
  //       name: `Cacophonic Choir`,
  //       desc: `Casting value of 6. If successfully cast, roll 2D6. Each enemy unit within 6" of the caster that has a Bravery characteristic of less than the roll suffers D3 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Acquiescence: {
  //   effects: [
  //     {
  //       name: `Acquiescence`,
  //       desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster that is visible to them. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Subvert: {
  //   effects: [
  //     {
  //       name: `Subvert`,
  //       desc: `Casting value of 7. If successfully cast, you can pick 1 enemy HERO within 18" of the caster that is visible to them. Until your next hero phase, that HERO cannot issue or receive commands.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Refine Senses': {
  //   effects: [
  //     {
  //       name: `Refine Senses`,
  //       desc: `Casting value of 4. If successfully cast, until your next hero phase, you can add 1 to hit rolls for attacks made by the caster that target a HERO, and you can add 1 to save rolls for attacks made by HEROES that target the caster.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Overwhelming Acquiescence': {
  //   effects: [
  //     {
  //       name: `Overwhelming Acquiescence`,
  //       desc: `Casting value of 7. Pick up to D3 enemy units within 24" of the caster that are visible to them. You can reroll hit rolls of 1 for attacks that target those units until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Crippling Famishment': {
  //   effects: [
  //     {
  //       name: `Crippling Famishment`,
  //       desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic of that unit, halve run rolls for that unit, and halve charge rolls for that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Reflection Eternal': {
  //   effects: [
  //     {
  //       name: `Reflection Eternal`,
  //       desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. Subtract 1 from wound rolls for attacks made by that unit in the following combat phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Whispers of Doubt': {
  //   effects: [
  //     {
  //       name: `Whispers of Doubt`,
  //       desc: `Casting value of 6. Pick 1 enemy HERO within 3" of the caster and visible to them, and roll 3D6. If the roll is equal to or greater than that HERO's Bravery characteristic, add 1 to hit rolls for attacks that target that HERO until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Spells, 'spell')
