import { IEffects } from 'types/data'
{
  /*

import { TSpells } from 'types/army'
import { TEndless } from 'types/army'
import { HERO_PHASE } from 'types/phases'

// Spell Lores of Slaanesh
const Spells: IEntry[] = [
  // Lore of Slaanesh
  {
    name: `Lash of Slaanesh (Daemon)`,
    desc: `Casting value of 5.  If successfully cast, pick 1 point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line (1 mm wide).  This line goes between that point and the closest part of the casters base.  Roll a dice for each enemy model passed across by this line.  On a 4+ that model's unit suffers 1 mortal wound.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Pavane of Slaanesh (Daemon)`,
    desc: `Casting value of 7.  If successfully cast, pick 1 enemy hero within 6" of the caster that is visible.  Roll a number of dice equal to that heros move characteristic.  For each 5+ that hero suffers 1 mortal wound.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Hysterical Frenzy (Daemon)`,
    desc: `Casting value of 7.  If successfully cast, pick 1 enemy unit wholly within 18" of the caster and visible.  Roll 1 dice for each model in that unit.  For each 6, that unit suffers D3 mortal wounds.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Soulslice Shards (Daemon)`,
    desc: `Casting value of 5.  If successfully cast, pick 1 enemy unit within 18" of the cast and visible.  Roll 2D6 and if the roll is higher than the units bravery characteristic that, unit suffers a number of mortal wounds equal to the difference.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Phantasmagoria (Daemon)`,
    desc: `Casting value of 7.  If successfully cast, pick 1 enemy unit within 18" of the caster that is visible.  Roll 6 dice and for each 5+ until your next hero phase subtract 1 from that unit's bravery characteristic (to a minimum of 1).`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Born of Damnation (Daemon)`,
    desc: `Casting value of 5.  If successfully cast, pick 1 friendly Hedonite hero within 6" of the caster that is visible.  You can heal 1 wound allocated to that hero.  If the casting roll was a 10+ you can heal D3 wound allocated instead.`,
    when: [HERO_PHASE],
    spell: true,
  },
  // Forbidden Sorceries of Slaanesh
  {
    name: `Song of Secrets (Greater Daemon)`,
    desc: `Casting value of 7.  If successfully cast, pick 1 enemy unit wholly within 18" of the caster that is visible to them.  Roll 1 dice for each model in that unit.  For each 6 your receive 1 depravity point.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Progeny of Damnation (Greater Daemon)`,
    desc: `Casting value of 7.  If successfully cast, pick 1 friendly Daemon Hedonite hero within 6" of the caster that is visible to them.  You can heal D3 wounds allocated to that hero.  If the casting roll was 10+ you can heal D3 wounds allocated instead.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Slothful stupor (Greater Daemon)`,
    desc: `Casting value of 8.  If successfully cast, pick 1 enemy hero within 12" of the caster that is visble.  Until your next hero phase, that hero cannot use command abilities and cannot run or attempt to charge.`,
    when: [HERO_PHASE],
    spell: true,
  },  
  // Lore of Pain and Pleasure
  {
    name: `Battle Rapture (Mortal)`,
    desc: `Casting value of 5.  If successfully cast, pick  1 friendly mortal Slaanesh unit wholly within 18" of the caster and visible.  Do not take battleshock tests for that unit until your next hero phase.  If the casting roll is a 10+, you can pick 3 units instead.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Dark Delusions (Mortal)`,
    desc: `Casting value of 5.  If successfully cast, pick 1 enemy unit wholly within 18" of the caster and visible.  Roll 2D6 and if the roll is equal to or greater than that units bravery characteristic, add 1 to the hit rolls for attacks that target that unit until your next hero phase.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Hellshriek (Mortal)`,
    desc: `Casting value of 5.  If successfully cast, roll a dice for each enemy unit within 6" of the caster.  On a 5+ that enemy unit suffers 1 mortal wound.`,
    when: [HERO_PHASE],
    spell: true,
  },
]

// Endless spells.
export const Endless: TEndless = [
  {
    name: `Wheels of Excruciation`,
    effects: [
      {
        name: `Predatory`,
        desc: `Wheels of Excruciation is a predatory endless spell. It can move up to 12" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 5.  Only Chaos Slaanesh wizards can attempt to cast this spell.  If successfully cast, set up 1 of these models wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Death`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Exquisite Agony`,
        desc: `After this model has moved, roll 6 dice for each unit that has any models that this model passed across. That unit suffers 1 mortal wound for each roll that is less than that unit's unmodified Save characteristic.`,
        when: [START_OF_ROUND, HERO_PHASE],
      },
    ],
  },
  {
    name: `Mesmerising Mirror`,
    effects: [
      {
        name: `Predatory`,
        desc: `Wheels of Excruciation is a predatory endless spell. It can move up to 6" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 6.  Only Chaos Slaanesh wizards can attempt to cast this spell.  If successfully cast, set up 1 of these models wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Irresistible Lure`,
        desc: `If a unit starts a move within 12" of this model, it suffers D3 mortal wounds unless it finishes the move closer to this model than it was before the move was made. This ability has no effect on Chaos Slaanesh units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Gaze Not into its Depths`,
        desc: `After this model is set up, and after this model has moved, roll 6 dice for each Hero within 6" of this model (roll separately for each Hero). For each 6, that Hero suffers a number of mortal wounds equal to the number of 6s that were rolled for that Hero. This ability has no effect on Chaos Slaanesh Heroes. 

               For example, if you rolled one 6 for a Hero, that Hero would suffer 1 x 1 = 1 mortal wound. If you rolled two 6s, that Hero would suffer 2 x 2 = 4 mortal wounds, if you rolled three 6s, that Hero would suffer 3 x 3 = 9 mortal wounds, and so on.`,
        when: [START_OF_ROUND, HERO_PHASE],
      },
    ],
  },
  {
    name: `Dreadful Visage`,
    effects: [
      {
        name: `Predatory`,
        desc: `Wheels of Excruciation is a predatory endless spell. It can move up to 8" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 7.  Only Chaos Slaanesh wizards can attempt to cast this spell.  If successfully cast, set up 1 of these models wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swooping Horror`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flensing Tongues`,
        desc: `After this model has moved, roll 6 dice for the closest other unit within 6". If more than 1 other unit is equally close, the player that moved this model can choose which unit to roll the 6 dice for. That unit suffers 1 mortal wound for each roll of 4+.`,        
        when: [START_OF_ROUND, HERO_PHASE],
      },
      {
        name: `Terrifying Entity`,
        desc: `Subtract 1 from the Bravery characteristic of units while they are within 12" of this model. Add 1 to the Bravery characteristic of Chaos Slaanesh units while they are within 12" of this model instead of subtracting 1.`,        
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },  
]

export default Abilities
*/
}
