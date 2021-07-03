import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Prayers = {
  'Rune Lore: Ancestral Shield': {
    effects: [
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `This prayer has an answer value of 2 and a range of 12". If answered, pick 1 friendly DISPOSSESSED unit wholly within range of the chanter that is visible to them. That unit has a ward of 6+ until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          rule_sources.ERRATA_CITIES_OF_SIGMAR_JULY_2021,
        ],
      },
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `If active, that unit has a ward of 6+ until the start of your next hero phase.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          rule_sources.ERRATA_CITIES_OF_SIGMAR_JULY_2021,
        ],
      },
    ],
  },
  'Rune Lore: Forgefire': {
    effects: [
      {
        name: `Rune Lore: Forgefire`,
        desc: `This prayer has an answer value of 2 and a range of 12". If answered, pick 1 friendly DISPOSSESSED unit wholly within range of the chanter that is visible to them. Improve the Rend characteristic of that unit's weapons by 1 until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          rule_sources.ERRATA_CITIES_OF_SIGMAR_JULY_2021,
        ],
      },
      {
        name: `Rune Lore: Forgefire`,
        desc: `If active, improve the Rend characteristic of that unit's weapons by 1 until the start of your next hero phase.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          rule_sources.ERRATA_CITIES_OF_SIGMAR_JULY_2021,
        ],
      },
    ],
  },
  'Rune Lore': {
    effects: [
      {
        name: `Rune Lore`,
        desc: `GREYWATER FASTNESS RUNELORDS know the following prayer:

        Rune of Unfaltering Aim: This prayer has an answer value of 2 and a range of 3". If answered, pick 1 friendly IRONWELD ARSENAL WAR MACHINE within range of the chanter. Add 1 to hit rolls for attacks made with missile weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          rule_sources.ERRATA_CITIES_OF_SIGMAR_JULY_2021,
        ],
      },
      {
        name: `Rune of Unfaltering Aim`,
        desc: `If active, add 1 to hit rolls for attacks made with missile weapons by that unit until your next hero phase.`,
        when: [SHOOTING_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          rule_sources.ERRATA_CITIES_OF_SIGMAR_JULY_2021,
        ],
      },
    ],
  },
  'Celestial Prayers: Invigorating Touch': {
    effects: [
      {
        name: `Invigorating Touch`,
        desc: `4+ for this prayer to succeed. Pick 1 friendly model within 3". Heal up to D6 wounds allocated to that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Prayers: Cometary Blast': {
    effects: [
      {
        name: `Cometary Blast`,
        desc: `4+ for this prayer to succeed. Pick a point on the battlefield within 18" and visible to this model. Roll a D6 for each unit within 3" of point. 1-3: Nothing. 4-5: 1 mortal wound, 6: D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
