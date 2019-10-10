import { TArtifacts } from 'types/army'
import { DURING_GAME, HERO_PHASE, COMBAT_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Armour of Mallus (Hammerhal)`,
    effects: [
      {
        name: `Armour of Mallus`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Saint's Blade (Hammerhal)`,
    effects: [
      {
        name: `Saint's Blade`,
        desc: `Pick 1 melee weapon. Improve the Rend of that weapon by 1. In addition, while the bearer is within 6" of an objective marker, add 1 to the damage inflicted by attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Twinstone (Hammerhal)`,
    effects: [
      {
        name: `Choose aspect`,
        desc: `Pick Aqshy or Ghyran Aspect in each of your hero phases.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aqshy Aspect`,
        desc: `If you choose this aspect, add 1 to hit rolls for attacks made with melee weapons by friendly HAMMERHAL units wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghyran Aspect`,
        desc: `If you choose this aspect, roll 1 dice for each friendly HAMMERHAL unit wholly within 12" of the bearer. On a 4+, you can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
