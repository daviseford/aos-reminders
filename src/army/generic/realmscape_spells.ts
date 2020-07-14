import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'
import { TSpells } from 'types/army'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, STYGXX, ULGU } from 'types/realmscapes'

// Realm Spells
const Spells: TSpells = [
  {
    name: `Fireball (${AQSHY})`,
    effects: [
      {
        name: `Fireball (${AQSHY})`,
        desc: `Casting value of 5. Pick an enemy unit within 18" and visible to the caster. If the enemy unit has 1 model, it suffers 1 mortal wound. 2-9 models, it suffers D3 mortal wounds. 10+ models, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Metamorphic Warding (${CHAMON})`,
    effects: [
      {
        name: `Metamorphic Warding (${CHAMON})`,
        desc: `Casting value of 7. Pick 1 friendly unit wholly within 12" of the caster and visible to them. Add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Metamorphic Warding (${CHAMON})`,
        desc: `If active, add 1 to save rolls for attacks that target the buffed unit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wildform (${GHUR})`,
    effects: [
      {
        name: `Wildform (${GHUR})`,
        desc: `Casting value of 5. Pick a friendly unit within 12" and visible to the caster. Add 2 to the charge and run rolls made for the targeted unit until your next hero phase.`,
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
        desc: `Casting value of 5. Pick a friendly unit within 18" and visible to the caster. Until your next hero phase, any enemy unit that finishes a charge move within 3" of the target suffers D3 mortal wounds. The same friendly unit cannot be picked as the target of this spell more than once per turn.`,
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
    name: `Purity of Defence (${HYSH})`,
    effects: [
      {
        name: `Purity of Defence (${HYSH})`,
        desc: `Casting value of 5. Pick 1 friendly unit wholly within 12" of the caster and visible to them. You can re-roll save rolls of 1 for attacks that target that unit until the start of you next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Purity of Defence (${HYSH})`,
        desc: `If active, you can re-roll save rolls of 1 for attacks that target the buffed unit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
    effects: [
      {
        name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
        desc: `Casting value of 6. Pick an enemy unit within 18" and visible to the caster. Subtract 2 from the bravery characteristic of the target until the end of your next hero phase.`,
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
        desc: `Select a priest to roll a D6. On a 1, the priest suffers a mortal wound. On a 2-5, nothing happens. On a 6, receive 1 command point. Can only be attempted once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Word of Ending (${SHYISH})`,
    effects: [
      {
        name: `Word of Ending (${SHYISH})`,
        desc: `Casting value of 6. Pick an enemy HERO within 12" of the caster that is visible to them and roll a D6. If the result is more than the number of wounds allocated to that model, it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Night's Touch (${SHYISH})`,
    effects: [
      {
        name: `Night's Touch (${SHYISH})`,
        desc: `Casting value of 8. Pick a friendly unit within 6" of the caster that is visible to them. Ignore modifiers (positive and negative) when making save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Soulshroud (${SHYISH})`,
    effects: [
      {
        name: `Soulshroud (${SHYISH})`,
        desc: `Casting value of 6. Pick a friendly unit within 12" of the caster that is visible to them. That unit is not affected by other spells until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Unnatural Darkness (${SHYISH})`,
    effects: [
      {
        name: `Unnatural Darkness (${SHYISH})`,
        desc: `Casting value of 6. Pick a friendly unit within 12" of the caster that is visible to them. Subtract 1 from hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Soulflay (${SHYISH})`,
    effects: [
      {
        name: `Soulflay (${SHYISH})`,
        desc: `Casting value of 7. Pick an enemy HERO within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soulflay (${SHYISH})`,
        desc: `If the unit suffers 3 mortal wounds from this spell, subtract 2 from its Bravery characteristic until your next hero phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Ethereal Guide (${SHYISH})`,
    effects: [
      {
        name: `Ethereal Guide (${SHYISH})`,
        desc: `Casting value of 6. Add 1 to hit rolls for attacks made by the caster until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Mystifying Miasma (${ULGU})`,
    effects: [
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `Casting value of 4. Pick an enemy unit within 18" and visible to the caster. The unit cannot run and subtracts 2 from its charge rolls until your next hero phase.`,
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
    name: `Labyrinth of Sorrows (${ULGU})`,
    effects: [
      {
        name: `Labyrinth of Sorrows (${ULGU})`,
        desc: `Casting value of 5. Pick an enemy unit within 12" of the caster that is visible to them. Halve the Move characteristic of that unit until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Crown of Asphyxiation (${ULGU})`,
    effects: [
      {
        name: `Crown of Asphyxiation (${ULGU})`,
        desc: `Casting value of 6. Roll a D6 for each enemy unit within 3" of the caster. On a 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Enfeebling (${ULGU})`,
    effects: [
      {
        name: `The Enfeebling (${ULGU})`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster. Re-roll failed wound rolls for attacks that target this unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Phantasmal Guardian (${ULGU})`,
    effects: [
      {
        name: `Phantasmal Guardian (${ULGU})`,
        desc: `Casting value of 6. Roll a D6 each time you allocate a wound or mortal wound to the caster until your next hero phase. On a 5+ the wound is negated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Phantasmal Guardian (${ULGU})`,
        desc: `If active, roll a D6 each time you allocate a wound or mortal wound. On a 5+ the wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Bridge of Shadows (${ULGU})`,
    effects: [
      {
        name: `Bridge of Shadows (${ULGU})`,
        desc: `Casting value of 6. Pick a friendly unit wholly within 12" of the caster and remove it from the battlefield. Set it up anywhere on the battlefield that is wholly within 24" of the caster and more than 9" from any enemy models. It may not move in the subsequent movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aetheric Tendrils (${ULGU})`,
    effects: [
      {
        name: `Aetheric Tendrils (${ULGU})`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If that unit is a HERO or MONSTER, you can make a normal move with that unit as if it had a Move characteristic of 4".`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
