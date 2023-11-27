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
  'Armour of Thorns': {
    effects: [
      {
        name: `Armour of Thorns`,
        desc: `7+ casting value. Pick 1 friendly WANDERERS unit wholly within 18" of the caster that is visible to them. Until that unit moves, that unit is treated as being in cover. In addition, until that unit moves, if the unmodified save roll for an attack made with a melee weapon that targets that unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
