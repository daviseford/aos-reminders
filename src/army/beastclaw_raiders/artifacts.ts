import { sortBy } from 'lodash'
import { TArtifacts } from 'types/army'

import { HERO_PHASE, DURING_GAME } from 'types/phases'
import RealmArtifacts from 'army/malign_sorcery/realm_artifacts'
import DestructionArtifacts from 'army/destruction/destruction_artifacts'

let Artifacts: TArtifacts = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Helwinter Vambrace (Svard Alfrostun)`,
    effects: [
      {
        name: `Helwinter Vambrace (Svard Alfrostun)`,
        desc: `Roll a dice each time the bearer suffers a mortal wound; on a 5 or more that wound is ignored.`,
        when: [DURING_GAME],
      },
    ],
  },
]

Artifacts = sortBy(Artifacts, 'name')
  .concat(DestructionArtifacts)
  .concat(RealmArtifacts)

export default Artifacts
