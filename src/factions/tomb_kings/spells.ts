import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Righteous Smiting': {
    effects: [
      {
        name: `Righteous Smiting`,
        desc: `Casting value of 5. Pick a Desert Legions or Reanimant unit within 18". Until your next hero phase, all models in the unit are imbued with magical power; each time you roll a hit roll of 6+ for a model in this unit, make one additional hit roll for the same weapon at the same target.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
