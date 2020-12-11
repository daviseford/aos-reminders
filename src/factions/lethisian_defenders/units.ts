import { keyPicker, tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_SETUP, HERO_PHASE } from 'types/phases'
import prayers from './prayers'

const Units = {
  'Excelsior Warpriest': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Light of Sigmar'])],
    },
    effects: [
      {
        name: `Divine Power`,
        desc: `This model can attempt to unbind 1 spell as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Loyal Companion`,
        desc: `After setting up the Warpriest, you can set up 1 Gryph-hound within 3" of this model. The Gryph-hound is bound to that Warpriest.`,
        when: [DURING_SETUP],
      },
      {
        name: `Loyal Companion`,
        desc: `If the Gryph-hound is within 3" its bound Warpriest, it makes 4 attacks rather than 2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
