import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, DURING_GAME } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Fourfold Blade`,
    effects: [
      {
        name: `Fourfold Blade`,
        desc: `If the unmodified hit roll for an attack made with this weapon is a 5+, that attack inflicts D3 mortal wounds on the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of the Pact`,
    effects: [
      {
        name: `Armour of the Pact`,
        desc: `You can re-roll save rolls for attacks made with melee weapons that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Saintskin Banner`,
    effects: [
      {
        name: `Saintskin Banner`,
        desc: `Subtract 1 from the bravery characteristic of enemy units while they are within 9" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
