import { TArtifacts } from 'types/army'
import { HERO_PHASE, COMBAT_PHASE, START_OF_MOVEMENT_PHASE, DURING_GAME } from 'types/phases'

// These Are The General Allegiance Artifacts From Destruction
const Artifacts: TArtifacts = [
  {
    name: `Hammerblade`,
    effects: [
      {
        name: `Hammerblade`,
        desc: `Pick a melee weapon. Instead of attacking with it, roll a dice for each model within 3" of the bearer (apart from the bearer). On a 5+ 1 mortal wound is inflicted on that model's unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Battered Talisman`,
    effects: [
      {
        name: `Battered Talisman`,
        desc: `5+ to ignore mortal wounds allocated to bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Rockeye`,
    effects: [
      {
        name: `Rockeye`,
        desc: `Pick an enemy unit within 12". Until your next hero phase, add 1 to hit rolls made for the bearer when they target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bellowing Blade`,
    effects: [
      {
        name: `Bellowing Blade`,
        desc: `When the bearer is picked to fight, you can re-roll one wound roll for the bearer's attacks in that fight for each enemy HERO within 12" of the bearer when they were picked.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Collar of Domination`,
    effects: [
      {
        name: `Collar of Domination`,
        desc: `At the start of your opponent's movement phase, pick an enemy MONSTER within 3" of the bearer and roll 2D6. If the roll is equal to or greater than their bravery it must retreat in that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Battle Brew`,
    effects: [
      {
        name: `Battle Brew`,
        desc: `Once per battle, take either 1 or 2 swigs. 1 swig = +1 to hit and wound until your next hero phase. 2 swigs = +2 to hit and wound rolls until your next hero phase AND you take D6 mortal wounds at the end of the turn they drank.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
