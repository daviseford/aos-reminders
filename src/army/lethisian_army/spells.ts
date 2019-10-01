import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Prayers
const Spells: TSpells = [
  {
    name: `Raven Priest - Morrda's Resurrection`,
    effects: [
      {
        name: `Morrda's Resurrection`,
        desc: `Prayer is answered on a 3+. If successful, pick a friendly Lethisian Defender unit wholly within 18" of the priest. You may return up to D3 wounds (rounded down) worth of slain models to the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Raven Priest - Morrda's Eye`,
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
  {
    name: `Raven Priest - Morrda's Embrace`,
    effects: [
      {
        name: `Morrda's Embrace`,
        desc: `Prayer is answered on a 3+. If successful, re-roll save rolls of 1 for friendly units wholly within 12" of the priest until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Morrda's Embrace`,
        desc: `If active, re-roll save rolls of 1 for friendly units wholly within 12" of the priest.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Spells
