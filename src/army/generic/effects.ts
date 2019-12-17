import { WOUND_ALLOCATION, SHOOTING_PHASE, COMBAT_PHASE } from 'types/phases'

// This file is useful when storing effects for units that we'd like to re-use
// E.G. all Gargants share the "Timber!" effect, so we'll store it here.

const GenericEffects = {
  Gargant: [
    {
      name: `Timber!`,
      desc: `If this model is slain, before removing the model from the battlefield the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds. This model is then removed from the battlefield.`,
      when: [WOUND_ALLOCATION],
    },
  ],
  Terrorgheist: [
    {
      name: `Death Shriek`,
      desc: `Do not use the attack sequence for an attack made with this model's Death Shriek. Instead roll a dice and add the Death Shriek value shown on this model's damage table. If the total is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the total.`,
      when: [SHOOTING_PHASE],
    },
    {
      name: `Gaping Maw`,
      desc: `If the unmodified hit roll for an attack made with this model's Fanged Maw is 6, that attack inflicts 6 mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll)`,
      when: [COMBAT_PHASE],
    },
    {
      name: `Infested`,
      desc: `If this model is slain, before this model is removed from play each unit within 3" of this model suffers D3 mortal wounds.`,
      when: [WOUND_ALLOCATION],
    },
  ],
  ZombieDragon: [
    {
      name: `Pestilential Breath`,
      desc: `When you attack with this model's Pestilential Breath, roll a dice before making the hit roll for the attack. If the roll is less than or equal to the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
      when: [SHOOTING_PHASE],
    },
  ],
}

export default GenericEffects
