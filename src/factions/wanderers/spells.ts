import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Blessing of Life': {
    effects: [
      {
        name: `Blessing of Life`,
        desc: `Casting value of 5. Select a Wanderers unit within 16". You can return D3 slain models to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shield of Thorns': {
    effects: [
      {
        name: `Shield of Thorns`,
        desc: `Casting value of 6. Pick a unit within 18". You can reroll failed save rolls for that unit until your next hero phase. In addition, each time you make a successful save roll of a 6 or more for that unit in the combat phase, the attacking unit suffers a mortal wound after all its attacks have been made.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
