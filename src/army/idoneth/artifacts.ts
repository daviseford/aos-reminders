import { TArtifacts } from 'types/army'
import {
  START_OF_SHOOTING_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'
import RealmArtifacts from 'army/malign_sorcery/realm_artifacts'

let Artifacts: TArtifacts = [
  /*
  {
    name: '',
    effects: [
      {
        name: '',
        desc: '',
        when: ,
      },
    ],
  },
*/
]

Artifacts = Artifacts.concat(RealmArtifacts)

export default Artifacts
