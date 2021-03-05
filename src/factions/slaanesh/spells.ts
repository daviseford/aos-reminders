import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
const Spells = {
  // Lore of Slaanesh - Daemons Only
  'Lash of Slaanesh': {
    effects: [
      {
        name: `Lash of Slaanesh`,
        desc: `Casting value of 5. Pick 1 point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line (1 mm wide). This line goes between that point and the closest part of the casters base. Roll a D6 for each enemy model passed across by this line. On a 4+ that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pavane of Slaanesh': {
    effects: [
      {
        name: `Pavane of Slaanesh`,
        desc: `Casting value of 7. Pick 1 enemy hero within 6" of the caster that is visible. Roll a number of dice equal to that heros move characteristic. For each 5+ that hero suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hysterical Frenzy': {
    effects: [
      {
        name: `Hysterical Frenzy`,
        desc: `Casting value of 7. Pick 1 enemy unit wholly within 18" of the caster and visible. Roll 1 dice for each model in that unit. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soulslice Shards': {
    effects: [
      {
        name: `Soulslice Shards`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the cast and visible. Roll 2D6 and if the roll is higher than the units bravery characteristic that, unit suffers a number of mortal wounds equal to the difference.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Phantasmagoria: {
    effects: [
      {
        name: `Phantasmagoria`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible. Roll 6 dice and for each 5+ until your next hero phase subtract 1 from that unit's bravery characteristic (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Phantasmagoria`,
        desc: `If active, subtract 1 from that unit's bravery characteristic (to a minimum of 1).`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Born of Damnation': {
    effects: [
      {
        name: `Born of Damnation`,
        desc: `Casting value of 4. Pick 1 friendly Hedonite hero within 6" of the caster that is visible. You can heal D3 wounds allocated to that hero.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Forbidden Sorceries of Slaanesh - Greater Daemons Only
  'Paths of the Dark Prince': {
    effects: [
      {
        name: `Paths of the Dark Prince`,
        desc: `Casting value of 7. Until your next hero phase the caster can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Paths of the Dark Prince`,
        desc: `If active, the buffed unit can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Progeny of Damnation': {
    effects: [
      {
        name: `Progeny of Damnation`,
        desc: `Casting value of 5. Pick 1 friendly Daemon Hedonite hero within 6" of the caster that is visible to them. You can heal D3 wounds allocated to that hero. If the casting roll was 10+ you can heal D6 wounds allocated instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Slothful Stupor': {
    effects: [
      {
        name: `Slothful Stupor`,
        desc: `Casting value of 7. Pick 1 enemy hero within 12" of the caster that is visble. Until your next hero phase, that hero cannot use command abilities and cannot run or attempt to charge.`,
        when: [HERO_PHASE],
      },
      {
        name: `Slothful Stupor`,
        desc: `If active, the debuffed hero cannot use command abilities.`,
        when: [DURING_GAME],
      },
      {
        name: `Slothful Stupor`,
        desc: `If active, the debuffed hero cannot run or attempt to charge.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  // Lore of Pain and Pleasure - Mortals Only
  'Battle Rapture': {
    effects: [
      {
        name: `Battle Rapture`,
        desc: `Casting value of 5. Pick 1 friendly mortal Slaanesh unit wholly within 18" of the caster and visible. Do not take battleshock tests for that unit until your next hero phase. If the casting roll is a 10+, you can pick 3 visible units instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Battle Rapture`,
        desc: `If active, do not take battleshock tests for the buffed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Judgement of Excess': {
    effects: [
      {
        name: `Judgement of Excess`,
        desc: `Casting value of 5. Pick 1 enemy unit within 12" of the caster and visible. The target suffers 1 mortal wound for every 5 models in the unit (minimum 1 wound inflicted).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dark Delusions': {
    effects: [
      {
        name: `Dark Delusions`,
        desc: `Casting value of 4. Pick 1 enemy unit wholly within 18" of the caster and visible. Roll 2D6 and if the roll is equal to or greater than that unit's bravery characteristic, add 1 to the hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dark Delusions`,
        desc: `If active, add 1 to the hit rolls for attacks against the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Cacophonic Choir': {
    effects: [
      {
        name: `Cacophonic Choir`,
        desc: `Casting value of 6. Roll 2D6. Each enemy unit within 6" of the caster that has a bravery characteristic of less than the roll suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Acquiescence: {
    effects: [
      {
        name: `Acquiescence`,
        desc: `Casting value of 5. You can pick 1 enemy unit within 18" of the caster that is visible to them. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Acquiescence`,
        desc: `If active, you can reroll hit rolls of 1 for attacks that target the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Subvert: {
    effects: [
      {
        name: `Subvert`,
        desc: `Casting value of 7. You can pick 1 enemy hero within 18" of the caster that is visible to them. That hero cannot use any command abilities until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Subvert`,
        desc: `If active, the debuffed hero cannot use any command abilities.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Refine Senses': {
    effects: [
      {
        name: `Refine Senses`,
        desc: `Casting value of 4. Until your next hero phase, you can reroll hit rolls for attacks made by the caster that target a HERO, and you can reroll save rolls for attacks made by Heroes that target the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Refine Senses`,
        desc: `If active, you can reroll hit rolls for attacks made by the buffed unit that target a hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Refine Senses`,
        desc: `If active, you can reroll save rolls for attacks made by heroes that target the buffed unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Overwhelming Acquiescence': {
    effects: [
      {
        name: `Overwhelming Acquiescence`,
        desc: `Casting value of 7. You can pick up to D3 enemy units within 24" of the caster that are visible to them. You can reroll hit rolls of 1 for attacks that target those units until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Overwhelming Acquiescence`,
        desc: `If active, you can reroll hit rolls of 1 for attacks that target the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Crippling Famishment': {
    effects: [
      {
        name: `Crippling Famishment`,
        desc: `Casting value of 7. You can pick up to 1 enemy unit within 18" of the caster that are visible to them. Until your next hero phase, halve the moves, runs, and charges for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crippling Famishment`,
        desc: `If active, halve the moves, runs, and charges for the debuffed unit.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Reflection Eternal': {
    effects: [
      {
        name: `Reflection Eternal`,
        desc: `Casting value of 6. You can pick up to 1 enemy unit within 12" of the caster that are visible to them. Subtract 1 from the target's wound rolls in the following combat phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reflection Eternal`,
        desc: `If active, subtract 1 from the debuffed unit's wound rolls in this phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
