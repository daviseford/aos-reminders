import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, START_OF_CHARGE_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const Prayers = {
  "Get 'Em Beat": {
    effects: [
      {
        name: `Get 'Em Beat`,
        desc: `Roll a D6, on a 4+ pick 1 friendly Ironjawz unit wholly within 12" of this Warchanter. You can attempt a charge for 18" out and roll 3D6 instead of 2D6 for your charge roll.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  "Fixin' Beat": {
    effects: [
      {
        name: `Fixin' Beat`,
        desc: `Roll a D6, on a 4+ pick 1 friendly Ironjawz model within 12" and heal D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Killa Beat': {
    effects: [
      {
        name: `Killa Beat`,
        desc: `Roll a D6, on a 4+ pick 1 enemy unit within 12". Attacks directed at that unit add 1 to the hit rolls.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
