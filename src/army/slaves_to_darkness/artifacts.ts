import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Hellfire Sword`,
    effects: [
      {
        name: `Hellfire Sword`,
        desc: `Once per battle, pick 1 enemy unit within 8" of the bearer. The unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Idolatrous Plackart`,
    effects: [
      {
        name: `Idolatrous Plackart`,
        desc: `Roll a D6 each time a mortal wound is allocated to the bearer. On a 5+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Helm of the Oppressor`,
    effects: [
      {
        name: `Helm of the Oppressor`,
        desc: `Subtract 1 from the bravery characteristic of enemy units while they are within 6" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Banner of the Demagogue`,
    effects: [
      {
        name: `Banner of the Demagogue`,
        desc: `Add 1 to the bravery characteristic of friendly Slaves to Darkness units while they are wholly within 12" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mark of the All-favoured`,
    effects: [
      {
        name: `Mark of the All-favoured`,
        desc: `The bearer receives the benefits of all five of the Aura of Chaos battle traits (including the No Mark trait) but cannot be given a Mark of Chaos.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Desecrator Gauntlets`,
    effects: [
      {
        name: `Desecrator Gauntlets`,
        desc: `Subtract 2 from casting rolls for enemy wizards while they are within 3" of the bearer.`,
        when: [HERO_PHASE],
      },
      {
        name: `Desecrator Gauntlets`,
        desc: `Add 1 to wound rolls for attacks made by the bearer that target a wizard or priest.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
]

export default Artifacts
