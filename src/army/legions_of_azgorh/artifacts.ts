import { TArtifacts } from 'types/army'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Black Hammer of Hashut`,
    effects: [
      {
        name: `Black Hammer of Hashut`,
        desc: `Pick 1 of the bearer's melee weapons. You can re-roll hit rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of Bazherak the Cruel`,
    effects: [
      {
        name: `Armour of Bazherak the Cruel`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+, that wound or mortal wound is negated.`,
        when: [HERO_PHASE, SHOOTING_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chalice of Blood and Darkness`,
    effects: [
      {
        name: `Chalice of Blood and Darkness`,
        desc: `Once per battle, at the start of the enemy hero phase, the bearer can use this artifact. If they do so, roll a D6 for each enemy Wizard within 30" of the bearer. On a 4+, reduce the number of spells that enemy Wizard can attempt to cast in that hero phase by 1.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
