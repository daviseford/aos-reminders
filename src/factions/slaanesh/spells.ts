import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Lash of Slaanesh': {
    effects: [
      {
        name: `Lash of Slaanesh`,
        desc: `Casting value of 5. Pick 1 point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a dice for each enemy model passed across by this line. On a 4+, that model's unit suffers 1 mortal wound. SLAANESH units are unaffected by this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pavane of Slaanesh': {
    effects: [
      {
        name: `Pavane of Slaanesh`,
        desc: `Casting value of 7. Pick 1 enemy HERO within 6" of the caster that is visible to them and roll a number of dice equal to that HERO's Move characteristic. For each 5+, that HERO suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hysterical Frenzy': {
    effects: [
      {
        name: `Hysterical Frenzy`,
        desc: `Casting value of 7. Pick 1 enemy unit wholly within 18" of the caster that is visible to them and roll 1 dice for each model in that unit. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soulslice Shards': {
    effects: [
      {
        name: `Soulslice Shards`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster that is visible to them and roll 2D6. If the roll is higher than that unit's Bravery characteristic, that unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Phantasmagoria: {
    effects: [
      {
        name: `Phantasmagoria`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them and roll 6 dice. For each 5+, subtract 1 from that unit's Bravery characteristic (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Born of Damnation': {
    effects: [
      {
        name: `Born of Damnation`,
        desc: `Casting value of 4. Pick 1 friendly HEDONITE HERO within 6" of the caster that is visible to them. You can heal up to D3 wounds allocated to that HERO.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Paths of the Dark Prince': {
    effects: [
      {
        name: `Paths of the Dark Prince`,
        desc: `Casting value of 7. If successfully cast, the caster can fly until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Progeny of Damnation': {
    effects: [
      {
        name: `Progeny of Damnation`,
        desc: `Casting value of 5. Pick 1 friendly DAEMON HEDONITE HERO within 6" of the caster that is visible to them. You can heal up to D3 wounds allocated to that HERO. If the casting roll was 10+, you can heal up to D6 wounds allocated to that HERO instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Slothful Stupor': {
    effects: [
      {
        name: `Slothful Stupor`,
        desc: `Casting value of 7. Pick 1 enemy HERO within 12" of the caster that is visible to them. Until your next hero phase, that HERO cannot issue or receive commands and cannot run or attempt a charge.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Battle Rapture': {
    effects: [
      {
        name: `Battle Rapture`,
        desc: `Casting value of 5. Pick 1 friendly MORTAL SLAANESH unit wholly within 18" of the caster that is visible to them. Do not take battleshock tests for that unit until your next hero phase. If the casting roll is 10+, you can pick up to 3 friendly SLAANESH MORTAL units wholly within 18" of the caster that is visible to them instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Judgement of Excess': {
    effects: [
      {
        name: `Judgement of Excess`,
        desc: `Casting value of 5. Pick 1 enemy unit within 12" of the caster that is visible to them. That unit suffers 1 mortal wound for every 5 models in that unit. If that unit has fewer than 5 models, it suffers 1 mortal wound instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dark Delusions': {
    effects: [
      {
        name: `Dark Delusions`,
        desc: `Casting value of 4. Pick 1 enemy unit wholly within 18" of the caster that is visible to them and roll 2D6. If the roll is equal to or greater than that unit's Bravery characteristic, add 1 to hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Cacophonic Choir': {
    effects: [
      {
        name: `Cacophonic Choir`,
        desc: `Casting value of 6. If successfully cast, roll 2D6. Each enemy unit within 6" of the caster that has a Bravery characteristic of less than the roll suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Acquiescence: {
    effects: [
      {
        name: `Acquiescence`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster that is visible to them. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Subvert: {
    effects: [
      {
        name: `Subvert`,
        desc: `Casting value of 7. If successfully cast, you can pick 1 enemy HERO within 18" of the caster that is visible to them. Until your next hero phase, that HERO cannot issue or receive commands.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Refine Senses': {
    effects: [
      {
        name: `Refine Senses`,
        desc: `Casting value of 4. If successfully cast, until your next hero phase, you can add 1 to hit rolls for attacks made by the caster that target a HERO, and you can add 1 to save rolls for attacks made by HEROES that target the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Overwhelming Acquiescence': {
    effects: [
      {
        name: `Overwhelming Acquiescence`,
        desc: `Casting value of 7. Pick up to D3 enemy units within 24" of the caster that are visible to them. You can reroll hit rolls of 1 for attacks that target those units until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Crippling Famishment': {
    effects: [
      {
        name: `Crippling Famishment`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic of that unit, halve run rolls for that unit, and halve charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Reflection Eternal': {
    effects: [
      {
        name: `Reflection Eternal`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. Subtract 1 from wound rolls for attacks made by that unit in the following combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Whispers of Doubt': {
    effects: [
      {
        name: `Whispers of Doubt`,
        desc: `Casting value of 6. Pick 1 enemy HERO within 3" of the caster and visible to them, and roll 3D6. If the roll is equal to or greater than that HERO's Bravery characteristic, add 1 to hit rolls for attacks that target that HERO until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
