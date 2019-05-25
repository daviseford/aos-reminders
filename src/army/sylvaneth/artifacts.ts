import { TArtifacts } from 'types/army'
import RealmArtifacts from 'army/malign_sorcery/realm_artifacts'
import { HERO_PHASE } from 'types/phases';

let Artifacts: TArtifacts = [
  {
    name: '',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
]

Artifacts = Artifacts.concat(RealmArtifacts)

export default Artifacts
