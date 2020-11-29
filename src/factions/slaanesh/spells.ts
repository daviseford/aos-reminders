import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

// Spell Lores of Slaanesh (Daemons Only)
export const Spells = {
  // Lore of Slaanesh
  'Lore of Slaanesh': {
    effects: [
      {
        name: `Lash of Slaanesh`,
        desc: `Casting value of 5. Pick 1 point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line (1 mm wide). This line goes between that point and the closest part of the casters base. Roll a D6 for each enemy model passed across by this line. On a 4+ that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Pavane of Slaanesh`,
        desc: `Casting value of 7. Pick 1 enemy hero within 6" of the caster that is visible. Roll a number of dice equal to that heros move characteristic. For each 5+ that hero suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Hysterical Frenzy`,
        desc: `Casting value of 7. Pick 1 enemy unit wholly within 18" of the caster and visible. Roll 1 dice for each model in that unit. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Soulslice Shards`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the cast and visible. Roll 2D6 and if the roll is higher than the units bravery characteristic that, unit suffers a number of mortal wounds equal to the difference.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Phantasmagoria`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible. Roll 6 dice and for each 5+ until your next hero phase subtract 1 from that unit's bravery characteristic (to a minimum of 1).`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Phantasmagoria`,
        desc: `If active, subtract 1 from that unit's bravery characteristic (to a minimum of 1).`,
        when: [DURING_GAME],
      },
      {
        name: `Born of Damnation`,
        desc: `Casting value of 5. Pick 1 friendly Hedonite hero within 6" of the caster that is visible. You can heal 1 wound allocated to that hero. If the casting roll was a 10+ you can heal D3 wound allocated instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  // Forbidden Sorceries of Slaanesh (Greater Daemons Only)
  'Forbidden Sorceries of Slaanesh': {
    effects: [
      {
        name: `Song of Secrets`,
        desc: `Casting value of 7. Pick 1 enemy unit wholly within 18" of the caster that is visible to them. Roll 1 dice for each model in that unit. For each 6 your receive 1 depravity point.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Progeny of Damnation`,
        desc: `Casting value of 7. Pick 1 friendly Daemon Hedonite hero within 6" of the caster that is visible to them. You can heal D3 wounds allocated to that hero. If the casting roll was 10+ you can heal D6 wounds allocated instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Slothful Stupor`,
        desc: `Casting value of 8. Pick 1 enemy hero within 12" of the caster that is visble. Until your next hero phase, that hero cannot use command abilities and cannot run or attempt to charge.`,
        when: [HERO_PHASE],
        spell: true,
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
  // Lore of Pain and Pleasure (Mortals Only)
  'Lore of Pain and Pleasure': {
    effects: [
      {
        name: `Battle Rapture`,
        desc: `Casting value of 5. Pick 1 friendly mortal Slaanesh unit wholly within 18" of the caster and visible. Do not take battleshock tests for that unit until your next hero phase. If the casting roll is a 10+, you can pick 3 units instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Battle Rapture`,
        desc: `If active, do not take battleshock tests for the buffed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Dark Delusions`,
        desc: `Casting value of 5. Pick 1 enemy unit wholly within 18" of the caster and visible. Roll 2D6 and if the roll is equal to or greater than that unit's bravery characteristic, add 1 to the hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Dark Delusions`,
        desc: `If active, add 1 to the hit rolls for attacks against the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Hellshriek`,
        desc: `Casting value of 5. Roll a D6 for each enemy unit within 6" of the caster. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
}
