import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const Prayers = {
  Forgefire: {
    effects: [
      {
        name: `Forgefire`,
        desc: `Answer value of 4 and a range of 18". If answered, pick 1 friendly CITIES OF SIGMAR DUARDIN unit wholly within range and visible to the chanter. Until the start of your next hero phase, improve the Rend characteristic of that unit's melee weapons by 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Unfaltering Aim': {
    effects: [
      {
        name: `Rune of Unfaltering Aim`,
        desc: `Rune of Unfaltering Aim is a prayer with an answer value of 3 and a range of 12". If answered, pick 1 friendly CITIES OF SIGMAR DUARDIN unit wholly within range and visible to the chanter. Add 1 to hit rolls for attacks made with missile weapons by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Oath and Steel': {
    effects: [
      {
        name: `Rune of Oath and Steel`,
        desc: `Rune of Oath and Steel is a prayer with an answer value of 3 and a range of 12". If answered, pick 1 friendly CITIES OF SIGMAR DUARDIN unit wholly within range and visible to the chanter. Subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Wrath and Ruin': {
    effects: [
      {
        name: `Rune of Wrath and Ruin`,
        desc: `Rune of Wrath and Ruin is a prayer with an answer value of 3 and a range of 18". If answered, pick 1 enemy unit within range and visible to the chanter. Roll 6 dice. For each roll of 5+, that enemy unit suffers 1 mortal wound. In addition, if a unit suffers 3 or more mortal wounds when this prayer is answered, that unit is ruined until the start of your next hero phase. While a unit is ruined, ignore positive modifiers to save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vessel of Sigmar': {
    effects: [
      {
        name: `Vessel of Sigmar`,
        desc: `Vessel of Sigmar is a prayer with an answer value of 3. If answered, and this unit is within your territory, pick 1 of the effects below to apply until the start of your next hero phase. If answered and this unit is not within your territory, pick 2 of the effects below to apply until the start ofyour next hero phase instead of 1:

        Hallowed Ground: Friendly CITIES OF SIGMAR HUMAN units have a ward of 5+ while they are wholly within 18" of this unit.
        
        The Great Wheel Turns: Add 2" to the Move characteristic of friendly CITIES OF SIGMAR HUMAN units on the battlefield.
        
        Cast Out Evil: Roll a dice for each enemy WIZARD and PRIEST on the battlefield. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hammer of Sigmar': {
    effects: [
      {
        name: `Hammer of Sigmar`,
        desc: `Answer value of 4 and a range of 12". If answered, until the start of your next hero phase, add 1 to wound rolls for attacks made with melee weapons by friendly CITIES OF SIGMAR HUMAN units while they are wholly within range of the chanter.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Morrda's Embrace": {
    effects: [
      {
        name: `Morrda's Embrace`,
        desc: `Morrda's Embrace is a prayer with an answer value of 4 and a range of 12". If answered, pick 1 enemy unit within range and visible to the chanter. Ward saves cannot be made for that enemy unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Prayers, 'prayer')
