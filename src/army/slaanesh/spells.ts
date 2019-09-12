import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spell Lores of Slaanesh
const Spells: TSpells = [
  // Lore of Slaanesh
  {
    name: `Lash of Slaanesh (Daemon)`,
    effects: [
      {
        name: `Lash of Slaanesh`,
        desc: `Casting value of 5. If successfully cast, pick 1 point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line (1 mm wide). This line goes between that point and the closest part of the casters base. Roll a D6 for each enemy model passed across by this line. On a 4+ that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pavane of Slaanesh (Daemon)`,
    effects: [
      {
        name: `Pavane of Slaanesh`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy hero within 6" of the caster that is visible. Roll a number of dice equal to that heros move characteristic. For each 5+ that hero suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hysterical Frenzy (Daemon)`,
    effects: [
      {
        name: `Hysterical Frenzy`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit wholly within 18" of the caster and visible. Roll 1 dice for each model in that unit. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Soulslice Shards (Daemon)`,
    effects: [
      {
        name: `Soulslice Shards`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit within 18" of the cast and visible. Roll 2D6 and if the roll is higher than the units bravery characteristic that, unit suffers a number of mortal wounds equal to the difference.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Phantasmagoria (Daemon)`,
    effects: [
      {
        name: `Phantasmagoria`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible. Roll 6 dice and for each 5+ until your next hero phase subtract 1 from that unit's bravery characteristic (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Born of Damnation (Daemon)`,
    effects: [
      {
        name: `Born of Damnation`,
        desc: `Casting value of 5. If successfully cast, pick 1 friendly Hedonite hero within 6" of the caster that is visible. You can heal 1 wound allocated to that hero. If the casting roll was a 10+ you can heal D3 wound allocated instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Forbidden Sorceries of Slaanesh
  {
    name: `Song of Secrets (Greater Daemon)`,
    effects: [
      {
        name: `Song of Secrets`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit wholly within 18" of the caster that is visible to them. Roll 1 dice for each model in that unit. For each 6 your receive 1 depravity point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Progeny of Damnation (Greater Daemon)`,
    effects: [
      {
        name: `Progeny of Damnation`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly Daemon Hedonite hero within 6" of the caster that is visible to them. You can heal D3 wounds allocated to that hero. If the casting roll was 10+ you can heal D6 wounds allocated instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Slothful Stupor (Greater Daemon)`,
    effects: [
      {
        name: `Slothful Stupor`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy hero within 12" of the caster that is visble. Until your next hero phase, that hero cannot use command abilities and cannot run or attempt to charge.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of Pain and Pleasure
  {
    name: `Battle Rapture (Mortal)`,
    effects: [
      {
        name: `Battle Rapture`,
        desc: `Casting value of 5. If successfully cast, pick 1 friendly mortal Slaanesh unit wholly within 18" of the caster and visible. Do not take battleshock tests for that unit until your next hero phase. If the casting roll is a 10+, you can pick 3 units instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dark Delusions (Mortal)`,
    effects: [
      {
        name: `Dark Delusions`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit wholly within 18" of the caster and visible. Roll 2D6 and if the roll is equal to or greater than that units bravery characteristic, add 1 to the hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hellshriek (Mortal)`,
    effects: [
      {
        name: `Hellshriek`,
        desc: `Casting value of 5. If successfully cast, roll a D6 for each enemy unit within 6" of the caster. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
