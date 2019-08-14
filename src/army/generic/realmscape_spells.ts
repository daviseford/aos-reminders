import { DURING_GAME, HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE } from 'types/phases'
import { TSpells } from 'types/army'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, STYGXX, ULGU } from 'types/realmscapes'

// Realmscape Spells - Active when battle takes place in selected realm.
const Spells: TSpells = [
  {
    name: `Fireball (${AQSHY})`,
    effects: [
      {
        name: `Fireball (${AQSHY})`,
        desc: `Casting value of 5. If successfully cast, pick an enemy unit within 18" and visible to the caster.  If the enemy unit has 1 model, it suffers 1 mortal wound.  2-9 models, it suffers D3 mortal wounds.  10+ models, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Transmutation of Lead (${CHAMON})`,
    effects: [
      {
        name: `Transmutation of Lead (${CHAMON})`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" and visible to the caster.  Until your next hero phase, halve the move characteristic of the target rounding up and, if the unit has a save characterstic of 2+, 3+, or 4+, re-roll hit rolls of 1 against the targeted unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Transmutation of Lead (${CHAMON})`,
        desc: `If active, halve the move characteristic of the debuffed unit rounding up and, if the unit has a save characterstic of 2+, 3+, or 4+, re-roll hit rolls of 1 against the debuffed unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Wildform (${GHUR})`,
    effects: [
      {
        name: `Wildform (${GHUR})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 12" and visible to the caster.  Add 2 to the charge and run rolls made for the targeted unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wildform (${GHUR})`,
        desc: `If active, add 2 to the run rolls made for the buffed unit.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Wildform (${GHUR})`,
        desc: `If active, add 2 to the charge rolls made for the buffed unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Shield of Thorns (${GHYRAN})`,
    effects: [
      {
        name: `Shield of Thorns (${GHYRAN})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 18" and visible to the caster.  Until your next hero phase, any enemy unit that finishes a charge move within 3" of the target suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shield of Thorns (${GHYRAN})`,
        desc: `If active, any enemy unit that finishes a charge move within 3" of the buffed unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Pha's Protection (${HYSH})`,
    effects: [
      {
        name: `Pha's Protection (${HYSH})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 18" and visible to the caster.  Subtract 1 from hit rolls made against the target until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pha's Protection (${HYSH})`,
        desc: `If active, subtract 1 from hit rolls made against the buffed unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mystifying Miasma (${ULGU})`,
    effects: [
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `Casting value of 4. If successfully cast, pick an enemy unit within 18" and visible to the caster.  The unit cannot run and subtracts 2 from its charge rolls until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `If active, the debuffed unit cannot run.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `If active, the debuffed unit subtracts 2 from its charge rolls.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
    effects: [
      {
        name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" and visible to the caster.  Subtract 2 from the bravery characteristic of the target until the end of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
        desc: `If active, subtract 2 from the bravery characteristic of the affected unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Communion with the Ancient Dead (Priest) (${STYGXX})`,
    effects: [
      {
        name: `Communion with the Ancient Dead (Priest) (${STYGXX})`,
        desc: `Select a priest to roll a dice.  On a 1, the priest suffers a mortal wound.  On a 2-5, nothing happens.  On a 6, receive 1 command point.  Can only be attempted once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
