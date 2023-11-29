import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  'Disease-disease!': {
    effects: [
      {
        name: `Disease-disease!`,
        desc: `Answer value of 3 and a range of 13". If answered, pick 1 enemy unit within range and visible to the chanter and roll a dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound. This prayer has no effect on NURGLE units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Filth-filth!': {
    effects: [
      {
        name: `Filth-filth!`,
        desc: `Answer value of 3 and a range of 13". If answered, pick 1 friendly CLANS PESTILENS unit within range and visible to the chanter. Add 1 to wound rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rabid-rabid!': {
    effects: [
      {
        name: `Rabid-rabid!`,
        desc: `Answer value of and a range of 13". If answered, pick 1 friendly CLANS PESTILENS unit within range and visible to the chanter. Add 1 to the Attacks characteristic of melee weapons used by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Unit prayers
  'Pestilence-pestilence!': {
    effects: [
      {
        name: `Pestilence-pestilence!`,
        desc: `Answer value of 3 and a range of 13". If answered, pick a point on the battlefield within range and visible to the chanter and roll a dice for each unit within 3" of that point. On a 4+, that unit suffers D3 mortal wounds. If that unit is a Clans Pestilens unit, heal D3 wounds allocated to that unit instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Prayers, 'prayer')
