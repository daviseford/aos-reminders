import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'

// Lore of Shadows
const Spells: TSpells = [
  {
    name: `Steed of Shadows (Wizard)`,
    effects: [
      {
        name: `Steed of Shadows`,
        desc: `Casting value of 5. If successfully cast, until the start of your next hero phase, the caster can fly and has a move characteristic of 16".`,
        when: [HERO_PHASE],
      },
      {
        name: `Steed of Shadows`,
        desc: `If in effect, the caster can fly and has a move characteristic of 16".`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pit of Shades (Wizard)`,
    effects: [
      {
        name: `Pit of Shades`,
        desc: `Casting value of 7. If successfully cast, pick and enemy unit within 18" and visible to the caster. Roll two dice and add the scores together. The enemy unit suffers 1 mortal wound for each point by which the total exceeds their move characteristic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mirror Dance (Wizard)`,
    effects: [
      {
        name: `Mirror Dance`,
        desc: `Casting value of 4. If successfully cast, pick two friendly Daughters of Khaine heroes within 24" of the caster. So long as neither hero is within 6" of any other unit, the two models can swap positions on the battlefield (neither can be set up within 3" of any enemy units).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Withering (Wizard)`,
    effects: [
      {
        name: `The Withering`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, add 1 to wound rolls for attacks against the target.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Withering`,
        desc: `If in effect, add 1 to wound rolls for attacks against the target.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mindrazor (Wizard)`,
    effects: [
      {
        name: `Mindrazor`,
        desc: `Casting value of 7. If successfully cast, pick a friendly Daughters of Khaine unit within 18" of the caster. Until the start of your next hero phase, the rend characteristic of that unit's melee weapons is improved by 1.

        In addition the damage characteristic of the unit's melee weapons is increased by 1 while attacking a target that has a lower bravery characteristic than they do.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mindrazor`,
        desc: `If in effect, the rend characteristic of the unit's melee weapons is improved by 1. In addition, the damage characteristic is improved by 1 if unit's bravery characteristic is greater than the target's bravery characteristic.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shroud of Despair (Wizard)`,
    effects: [
      {
        name: `Shroud of Despair`,
        desc: `Casting value of 4. If successfully cast, pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, subtract 1 from the bravery characteristic of that unit. If the spell was successfully cast with an 8 or more, subtract D3 instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shroud of Despair`,
        desc: `If in effect, 1 (or D3 on 8+ cast) was subtracted from the target units bravery.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  // Prayers of the Khainite Cult
  {
    name: `Catechism of Murder (Priest)`,
    effects: [
      {
        name: `Catechism of Murder`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, each time you make an unmodified hit roll of 6 for the unit in the combat phase, the attack inflicts 2 hits instead of 1.`,
        when: [HERO_PHASE],
      },
      {
        name: `Catechism of Murder`,
        desc: `If in effect, each hit roll of an unmodified 6 by the buffed unit counts as 2 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blessing of Khaine (Priest)`,
    effects: [
      {
        name: `Blessing of Khaine`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, re-roll failed Fanatical Faith rolls for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blessing of Khaine`,
        desc: `If in effect, re-roll failed Fanatical Faith rolls for buffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Martyr's Sacrifice (Priest)`,
    effects: [
      {
        name: `Martyr's Sacrifice`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, each time a model from that unit is slain in the combat phase, roll a D6. On a 5 or 6 the attacking unit suffers 1 mortal wound after it has finished making all of its attacks.`,
        when: [HERO_PHASE],
      },
      {
        name: `Martyr's Sacrifice`,
        desc: `If in effect, each time a model from buffed unit is slain, roll a D6. On a 5 or 6 the attacking unit suffers 1 mortal wound after it has finished making all of its attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crimson Rejuvenation (Priest)`,
    effects: [
      {
        name: `Crimson Rejuvenation`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest (you cannot pick Morathi in either form). You can heal up to D3 wounds allocated to a model in that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Covenant of the Iron Heart (Priest)`,
    effects: [
      {
        name: `Covenant of the Iron Heart`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, you do not need to take battleshock tests for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Covenant of the Iron Heart`,
        desc: `If in effect, you do not need to take battleshock tests for the buffed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  {
    name: `Sacrament of Blood (Priest)`,
    effects: [
      {
        name: `Sacrament of Blood`,
        desc: `Pick a friendly Daughters of Khaine unit within 14" of the priest. Until the start of your next hero phase, that unit counts the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
