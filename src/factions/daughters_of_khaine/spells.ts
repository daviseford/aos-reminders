import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Spells = {
  // Lore of Shadows
  'Steed of Shadows': {
    effects: [
      {
        name: `Steed of Shadows`,
        desc: `Casting value of 6. Until the your next hero phase, the caster can fly and has a move characteristic of 16".`,
        when: [HERO_PHASE],
      },
      {
        name: `Steed of Shadows`,
        desc: `If active, the caster can fly and has a move characteristic of 16".`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Pit of Shades': {
    effects: [
      {
        name: `Pit of Shades`,
        desc: `Casting value of 7. Pick and enemy unit within 18" and visible. Roll 2D6 and compare it to the target's move characteristic. The enemy unit suffers mortal wounds equal to the difference.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mirror Dance': {
    effects: [
      {
        name: `Mirror Dance`,
        desc: `Casting value of 6. Pick two friendly Daughters of Khaine heroes wholly within 18" of the caster and visible. Set these heroes up again anywhere on the battlefield more than 9" from enemy units. This counts as their movement this turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Withering': {
    effects: [
      {
        name: `The Withering`,
        desc: `Casting value of 7. Pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, add 1 to wound rolls for attacks against the target.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Withering`,
        desc: `If active, add 1 to wound rolls for attacks against the debuffed target.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Mindrazor: {
    effects: [
      {
        name: `Mindrazor`,
        desc: `Casting value of 8. Pick a friendly Daughters of Khaine unit wholly within 18". Until the start of your next hero phase, the rend characteristic of that unit's melee weapons is improved by 1.
               In addition, add 1 to the target's melee damage characteristics if it charges this turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mindrazor`,
        desc: `If active, add 1 to buffed unit's melee damage characteristics if it charges this turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Mindrazor`,
        desc: `If active, improve the rend of the buffed unit by 1. Also add 1 to its melee damage characteristics if it charged this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shroud of Despair': {
    effects: [
      {
        name: `Shroud of Despair`,
        desc: `Casting value of 4. Pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, subtract 1 from the bravery characteristic of that unit. If the spell was successfully cast with an 8+, subtract D3 instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shroud of Despair`,
        desc: `If active, 1 (or D3 on 8+ cast) is subtracted from the debuffed unit's bravery.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Unit spells
  'Enfeebling Foe': {
    effects: [
      {
        name: `Enfeebling Foe`,
        desc: `Casting value of 5. Pick a unit within 18" and visible to the caster. Until your next hero phase, subtract 1 from wound rolls for that unit in the combat phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeebling Foe`,
        desc: `If active, subtract 1 from wound rolls for debuffed unit in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Black Horror of Ulgu': {
    effects: [
      {
        name: `Black Horror of Ulgu`,
        desc: `Casting value of 7. Pick a unit within 36" and visible to the caster. Roll a D6. On a 1, target suffers 1 mortal wound. On a 2-3 target suffers D3 mortal wounds. On a 4+ target suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Doomfire: {
    effects: [
      {
        name: `Doomfire`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the casting unit. The target suffers D3 mortal wounds if the casting unit has fewer than 5 models. D6 mortal wounds if it has 5 to 9 models. 6 mortal wounds if it has 10 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
