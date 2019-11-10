import { TEffects } from 'types/data'
import { WOUND_ALLOCATION } from 'types/phases'

// This file is useful when storing effects for units that we'd like to re-use
// E.G. all Gargants share the "Timber!" effect, so we'll store it here.

const GenericEffects: { [key: string]: TEffects[] } = {
  Gargant: [
    {
      name: `Timber!`,
      desc: `If this model is slain, before removing the model from the battlefield the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds. This model is then removed from the battlefield.`,
      when: [WOUND_ALLOCATION],
    },
  ],
}

export default GenericEffects
