import { sortBy } from 'lodash'
import { TArtifacts } from 'types/army'

import { DURING_GAME, START_OF_GAME, HERO_PHASE, START_OF_COMBAT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'
import RealmArtifacts from 'army/malign_sorcery/realm_artifacts'
import DestructionArtifacts from 'army/destruction/destruction_artifacts'

let Artifacts: TArtifacts = [
  {
    name: '',
    effects: [
      {
        name: '',
        desc: ``,
        when: [DURING_GAME],
      },
    ],
  },
]

Artifacts = sortBy(Artifacts, 'name')
  .concat(DestructionArtifacts)
  .concat(RealmArtifacts)

export default Artifacts
