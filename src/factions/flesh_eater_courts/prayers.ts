import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  'Bless This Meal': {
    effects: [
      {
        name: `Bless This Meal`,
        desc: `Answer value of 3 and a range of 18". If answered, pick 1 enemy unit within range that is visible to the chanter. Each time a model from that enemy unit is slain, you can heal 1 wound allocated to 1 friendly FLESH-EATER COURTS unit within 6" of that enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "The Summerking's Favour": {
    effects: [
      {
        name: `The Summerking's Favour`,
        desc: `Answer value of 3 and a range of 18". If answered, pick 1 friendly FLESH-EATER COURTS HERO wholly within range and visible to the chanter. Until your next hero phase, that Hero gains 1 additional noble deeds point each time they slay an enemy model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Charnel Conviction': {
    effects: [
      {
        name: `Charnel Conviction`,
        desc: `Answer value of 3 and a range of 18". If answered, pick 1 friendly FLESH-EATER COURTS unit wholly within range and visible to the chanter. That unit has a ward of 5+ until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Speak in Tongues': {
    effects: [
      {
        name: `Speak in Tongues`,
        desc: `Answer value of 3 and a range of 18". If answered, pick 1 enemy unit within range and visible to the chanter. Until your next hero phase, roll a dice each time that enemy unit receives a command. On a 4+, that command has no effect.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Prayers, 'prayer')
