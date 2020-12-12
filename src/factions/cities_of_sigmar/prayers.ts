import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Prayers = {
  'Rune Lore: Ancestral Shield': {
    effects: [
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `2+ for this prayer to succeed. Pick 1 friendly DISPOSSESSED unit wholly within 12" of this model. Until the start of your next hero phase, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6, that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `If active, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
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
  'Rune Lore': {
    effects: [
      {
        name: `Rune Lore`,
        desc: `In your hero phase, 1 friendly GREYWATER FASTNESS RUNELORD can chant the following prayer in addition to any prayer on their warscroll. If they do so, make a prayer roll by rolling a dice. On a 1, the prayer is not answered. On a 2+, the prayer is answered.

    Rune of Unfaltering Aim: If this prayer is answered, pick 1 friendly IRONWELD ARSENAL WAR MACHINE unit within 3" of this model. Until the start of your next hero phase, add 1 to hit rolls for attacks made with missile weapons by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
