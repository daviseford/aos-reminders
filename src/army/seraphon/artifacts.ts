import { TArtifacts } from 'types/army'
import {
  DURING_GAME,
  START_OF_GAME,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Zoetic Dial`,
    effects: [
      {
        name: `Zoetic Dial`,
        desc: `Roll a D6 after set-up is complete, but before the battle begins. In the battle round corresponding to the number you roll, you can re-roll failed save rolls for the bearer. If you roll a 6, you can decide to use this ability at the start of any one battle round, rather than having to use it in the 6th battle round.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Incandescent Rectrices`,
    effects: [
      {
        name: `Incandescent Rectrices`,
        desc: `Roll a D6 the first time a wound is allocated to the bearer that would slay them. On a 1-2 the bearer is slain. On a 3+ heal D6 wounds allocated to the bearer instead.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Blade of Realities`,
    effects: [
      {
        name: `Blade of Realities`,
        desc: `Pick one of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Light of Dracothion`,
    effects: [
      {
        name: `Light of Dracothion`,
        desc: `Once per battle, you can automatically unbind one spell cast by an enemy WIZARD within 15" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Coronal Shield`,
    effects: [
      {
        name: `Coronal Shield`,
        desc: `At the start of each combat phase, roll a D6 for each enemy unit within 3" of the bearer. On a 4+ subtract 1 from hit rolls for that unit in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Prism of Amyntok`,
    effects: [
      {
        name: `Prism of Amyntok`,
        desc: `Once per the battle, at the start of your movement phase, pick an enemy unit within 12" of the bearer and roll a D6. On a 1 that unit suffers 1 mortal wound. On a 2-5 that unit suffers D3 mortal wounds. On a 6 that unit suffers D6 mortal wounds.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
]

export default Artifacts
