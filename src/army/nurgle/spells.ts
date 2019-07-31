import { IEffects } from 'types/data'
import { HERO_PHASE } from 'types/phases'

// Spell Lores of Nurgle
const Spells: IEffects[] = [
  {
    name: `Blades of Putrefaction (Rotbringer)`,
    desc: `Casting value of 7.  If successfully cast, pick a friendly unit within 14" of the caster that is visible.  Until your next hero phase, hit rolls of 6 inflict 1 mortal wound in addition to any other damage.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Rancid Visitations (Rotbringer)`,
    desc: `Casting value of 6.  If successfully cast, pick an enemy unit within 3" of the caster.  That unit suffers 1 mortal wound for each model from the unit that is within 3" of the caster.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Gift of Contagion (Rotbringer)`,
    desc: `Casting value of 6.  If successfully cast, pick an enemy unit within 18" of the caster that is visible.  Roll a dice and look up the result applying the penalty to all models in the unit until the start of your next hero phase.
    
           1-2 -> Flyblown Palsy:  Subtract 1 from the unit's hit rolls in the combat phase.
           
           3-4 -> Muscular Atrophy:  Subtract 1 from the unit's wound rolls in the combat phase.
           
           5-6 -> Liquefying Ague:  Subtract 1 from the unit's save rolls.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Favoured Poxes (Daemon)`,
    desc: `Casting value of 7.  If successfully cast, pick an enemy unit within 14" and visible to caster.  Subtract 1 from hit, wound, and save rolls for that unit until the caster moves, attempts to cast a spell, or is slain.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Glorious Afflictions (Daemon)`,
    desc: `Casting value of 5.  If successfully cast, pick an enemy unit within 21" and visible to the caster.  The move characteristic and any run or charge rolls made for them are halved (rounding up) until your next hero phase.  In addtion units that can normally fly cannot do so until your next hero phase.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Sumptuous Pestilence (Daemon)`,
    desc: `Casting value of 6.  If successfully cast, each enemy unit within 7" of the caster suffers 1 mortal wound.  Units with 5 or more models suffer D3 mortal wounds instead.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Magnificent Buboes (Mortal)`,
    desc: `Casting value of 7.  If successfully cast, pick an enemy hero within 21" of the caster that is visible.  The hero suffers D3 mortal wounds.  In addition subtract 1 from their hit rolls, casting rolls, and unbinding rolls until your next hero phase.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Plague Squall (Mortal)`,
    desc: `Casting value of 6.  If successfully cast, roll 7 dice.  For each roll of 6, you can pick an enemy unit that is visible to the caster.  That unit suffers D3 mortal wounds.  If you roll more than one 6, you must select a different enemy unit to suffer each set of mortal wounds.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Cloying Quagmire (Mortal)`,
    desc: `Casting value of 5.  If successfully cast, pick an enemy unit within 14" of the caster that is visible.  Then roll a dice and compare the enemy unit's save characteristic.  If the roll is equal to or higher that the save characteristic, the unit suffers D6 mortal wounds.`,
    when: [HERO_PHASE],
    spell: true,
  },
]

export default Spells
