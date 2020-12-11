import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  'Rune Lore: Ancestral Shield': {
    effects: [
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `2+ for this prayer to succeed. Pick 1 friendly DISPOSSESSED unit wholly within 12" of this model. Until the start of your next hero phase, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6, that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune Lore: Forge Fire': {
    effects: [
      {
        name: `Rune Lore: Forge Fire`,
        desc: `2+ for this prayer to succeed. Pick 1 friendly DISPOSSESSED unit wholly within 12" of this model. Until the start of your next hero phase, improve the Rend characteristic of that unit's weapons by 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
