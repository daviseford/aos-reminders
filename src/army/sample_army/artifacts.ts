import { sortBy } from 'lodash'
import { TArtifacts } from 'types/army'

import { HERO_PHASE } from 'types/phases'
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
]

Artifacts = sortBy(Artifacts, 'name')
  .concat(DestructionArtifacts)
  .concat(RealmArtifacts)

export default Artifacts
