import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

const Prayers = {
  "Raven Priest - Morrda's Resurrection": {
    effects: [
      {
        name: `Morrda's Resurrection`,
        desc: `Prayer is answered on a 3+. If successful, pick a friendly Lethisian Defender unit wholly within 18" of the priest. You may return up to D3 wounds (rounded down) worth of slain models to the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Raven Priest - Morrda's Eye": {
    effects: [
      {
        name: `Morrda's Eye`,
        desc: `Prayer is answered on a 3+. If successful, pick an enemy unit within 18" of the priest. Subtract 1 from the hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Morrda's Eye`,
        desc: `If active, subtract 1 from the hit rolls for attacks made by the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  "Raven Priest - Morrda's Embrace": {
    effects: [
      {
        name: `Morrda's Embrace`,
        desc: `Prayer is answered on a 3+. If successful, reroll save rolls of 1 for friendly units wholly within 12" of the priest until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Morrda's Embrace`,
        desc: `If active, reroll save rolls of 1 for friendly units wholly within 12" of the priest.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Light of Sigmar': {
    effects: [
      {
        name: `Light of Sigmar`,
        desc: `Prayer is answered on a 3+. If successful, pick one unit within 10" of the priest. Selected friendly unit heal 1 wound (Order units heal D3 instead). Selected enemy unit suffers 1 mortal wound (Chaos units suffer D3 instead).`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
