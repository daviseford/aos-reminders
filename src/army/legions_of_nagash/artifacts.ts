import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Deathforged Chain`,
    effects: [
      {
        name: `Deathforged Chain`,
        desc: `The bearer heals 1 wound at start of hero phase`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Balefire Lantern`,
    effects: [
      {
        name: `Balefire Lantern`,
        desc: `-1 to wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for enemy WIZARDS within 6" of the bearer`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grave-sand Timeglass`,
    effects: [
      {
        name: `Grave-sand Timeglass`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

export default Artifacts
