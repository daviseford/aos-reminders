import { TAbilities } from 'types/army'
import { DURING_SETUP } from 'types/phases'

const Abilities: TAbilities = [
  {
    name: `Stick to the Code`,
    desc: `When you are not in a defined skyport, choose an ARTYCLE, AMENDMENT, and FOOTNOTE. (Located in the Traits drop down)`,
    when: [DURING_SETUP],
  },
]

export default Abilities
