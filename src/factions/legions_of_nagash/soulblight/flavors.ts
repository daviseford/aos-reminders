import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

const Flavors = {
  'The Bloodlines: Dragon Warriors': {
    effects: [
      {
        name: `The Bloodlines: Dragon Warriors`,
        desc: `You can reroll hit rolls of 1 for models that have the Dragon Warriors bloodline if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Bloodlines: Lords of Night': {
    effects: [
      {
        name: `The Bloodlines: Lords of Night`,
        desc: `Models with the Lords of Night bloodline receive the benefit of the Deathless Thralls battle trait even if they are not within 6" of the general or another friendly SOULBLIGHT HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Bloodlines: Necromantic': {
    effects: [
      {
        name: `The Bloodlines: Necromantic`,
        desc: `Add 1 to casting and unbinding rolls for WIZARDS with the Necromantic bloodline. In addition, subtract 1 from the Bravery characteristic of enemy units that are within 6" of one or more models with the Necromantic bloodline.`,
        when: [HERO_PHASE, DURING_GAME],
      },
    ],
  },
  'The Bloodlines: Swift Death': {
    effects: [
      {
        name: `The Bloodlines: Swift Death`,
        desc: `Add 2" to the Move characteristic of all models that have the Swift Death bloodline. In addition, Swift Death models can always move as if they can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
