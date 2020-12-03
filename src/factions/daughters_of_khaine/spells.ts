import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

export const Spells = {
  'Lore of Shadows': {
    effects: [
      {
        name: `Steed of Shadows`,
        desc: `Casting value of 5. Until the start of your next hero phase, the caster can fly and has a move characteristic of 16".`,
        when: [HERO_PHASE],
      },
      {
        name: `Steed of Shadows`,
        desc: `If in effect, the caster can fly and has a move characteristic of 16".`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Pit of Shades`,
        desc: `Casting value of 7. Pick and enemy unit within 18" and visible to the caster. Roll two dice and add the scores together. The enemy unit suffers 1 mortal wound for each point by which the total exceeds their move characteristic.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mirror Dance`,
        desc: `Casting value of 4. Pick two friendly Daughters of Khaine heroes within 24" of the caster. So long as neither hero is within 6" of any other unit, the two models can swap positions on the battlefield (neither can be set up within 3" of any enemy units).`,
        when: [HERO_PHASE],
      },
      {
        name: `The Withering`,
        desc: `Casting value of 7. Pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, add 1 to wound rolls for attacks against the target.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Withering`,
        desc: `If in effect, add 1 to wound rolls for attacks against the target.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Mindrazor`,
        desc: `Casting value of 7. Pick a friendly Daughters of Khaine unit within 18" of the caster. Until the start of your next hero phase, the rend characteristic of that unit's melee weapons is improved by 1.

        In addition the damage characteristic of the unit's melee weapons is increased by 1 while attacking a target that has a lower bravery characteristic than they do.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mindrazor`,
        desc: `If in effect, the rend characteristic of the unit's melee weapons is improved by 1. In addition, the damage characteristic is improved by 1 if unit's bravery characteristic is greater than the target's bravery characteristic.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shroud of Despair`,
        desc: `Casting value of 4. Pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, subtract 1 from the bravery characteristic of that unit. If the spell was successfully cast with an 8 or more, subtract D3 instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shroud of Despair`,
        desc: `If in effect, 1 (or D3 on 8+ cast) was subtracted from the target units bravery.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
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
        desc: `Casting value of 6. Pick an enemy model within 18" and visible to any model in the casting unit. The target suffers D3 mortal wounds if the casting unit has fewer than 5 models. D6 mortal wounds if it has 5 to 9 models. 6 mortal wounds if it has 10 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
