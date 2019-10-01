import { TSpells } from 'types/army'
import { HERO_PHASE } from 'types/phases'

// Spell Lores of Tzeentch
const Spells: TSpells = [
  // Lord of Fate
  {
    name: `Bolt of Tzeentch (Mortal)`,
    effects: [
      {
        name: `Bolt of Tzeentch`,
        desc: `Casting value of 8. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcane Suggestion (Mortal)`,
    effects: [
      {
        name: `Arcane Suggestion`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit (not a hero or monster) within 18" of the caster. Roll a D6 and follow the D3 result:
               1 -  The unit immediately suffers D3 mortal wounds.
               2 -  Until the end of this turn, subtract 1 from hit and wound rolls for the unit.
               3 -  Until the end of this turn, subtract 1 from the save rolls for the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glimpse the Future (Mortal)`,
    effects: [
      {
        name: `Glimpse the Future`,
        desc: `Casting value of 7. If successfully cast, roll a D6 and add it to your Destiny Dice pool.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shield of Fate (Mortal)`,
    effects: [
      {
        name: `Shield of Fate`,
        desc: `Casting value of 5. If successfully cast, pick a friendly Tzeentch unit within 18" of the caster. Until the start of your next hero phase, the selected unit can:
               Re-roll saves of 1   if you have 1-3 Destiny Dice.
               Re-roll saves of 1-2 if you have 4-6 Destiny Dice.
               Re-roll saves of 1-3 if you have 7-9 Destiny Dice.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Infusion Arcanum (Mortal)`,
    effects: [
      {
        name: `Infusion Arcanum`,
        desc: `Casting value of 5. If successfully cast, until your next hero phase you can add 1 to all hit and wound rolls for the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Treacherous Bond (Mortal)`,
    effects: [
      {
        name: `Treacherous Bond`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 18" of the caster. Until your next hero phase, as long as the target is within 9" of the caster, roll a D6 whenever the caster suffers an unsaved wound or mortal wound. On a 2+ the chosen unit suffers the wound or mortal wound instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of Change.
  {
    name: `Bolt of Tzeentch (Daemon)`,
    effects: [
      {
        name: `Bolt of Tzeentch`,
        desc: `Casting value of 8. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Treason of Tzeentch (Daemon)`,
    effects: [
      {
        name: `Treason of Tzeentch`,
        desc: `Casting value of 5. If successfully cast, pick an enemy unit with 2 or more models within 18" of the caster that is visible to them. Roll a D6 for each model in the unit you picked. It suffers 1 mortal wound for each dice roll of 6 or more. If, after any of the mortal wounds caused by this spell are allocated, only one model remains in the unit, any remaining mortal wounds caused by this spell are negated and have no effect.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcane Transformation (Daemon)`,
    effects: [
      {
        name: `Arcane Transformation`,
        desc: `Casting value of 7. If successfully cast, pick a friendly hero within 18" of the caster and visible to them. You can permanently increase that model's move, bravery, or attacks charateristic of one weapon by 1. However, each hero can only be chosen as the target of this spell once per battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Unchecked Mutation (Daemon)`,
    effects: [
      {
        name: `Unchecked Mutation`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" of the caster. The unit selected suffers D3 mortal wounds and then you roll a D6. That unit suffers D3 mortal wounds. After the mortal wounds have been allocated, roll a D6. On a roll of 5 or more, the unit suffers 1 more mortal wound. If the unit suffers 1 more mortal wound, roll a D6 after the mortal wound has been allocated; on a roll of 5 or more the unit suffers 1 more mortal wound, and so on until you fail to roll a 5 or more.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Fold Reality (Daemon)`,
    effects: [
      {
        name: `Fold Reality`,
        desc: `Casting value of 7. If successfully cast, pick a friendly unit of Tzeentch Daemons within 18" of the caster and visible to them. Roll a D6 and on a 2+ you can return that many slain models to the unit. On a 1, the entire unit is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tzeentch's Inferno. (Daemon)`,
    effects: [
      {
        name: `Tzeentch's Inferno.`,
        desc: `Casting value of 9. If successfully cast, pick an enemy unit within 18" of the caster and visible to them. Roll 9 dice - for each 6 the unit targeted suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
