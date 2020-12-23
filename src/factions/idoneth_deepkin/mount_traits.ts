import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

const MountTraits = {
  'Swift-finned Impaler': {
    effects: [
      {
        name: `Swift-finned Impaler`,
        desc: `If this model's Deepmare Horn roll is a 6, the nearest enemy unit suffers D6 mortal wounds instead of D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Savage Ferocity': {
    effects: [
      {
        name: `Savage Ferocity`,
        desc: `Add 1 to the attacks characteristic of this models Deepmare's Fanged Jaws and Talons and Deepmare's Lashing Tails attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Voidchill Darkness': {
    effects: [
      {
        name: `Voidchill Darkness`,
        desc: `Subtract 1 from hit rolls made against this model by enemies within 3".`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Ancient: {
    effects: [
      {
        name: `Ancient`,
        desc: `Attacks against this model with a rend of -1 have a rend of '-' instead.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Denizen of the Darkest Depths': {
    effects: [
      {
        name: `Denizen of the Darkest Depths`,
        desc: `Add 1 to the number of mortal wounds inflicted by this model's Crushing Charge. A roll of 1 will inflict 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Reverberating Carapace': {
    effects: [
      {
        name: `Reverberating Carapace`,
        desc: `This model's Void Drum ability increases to 15".`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')
