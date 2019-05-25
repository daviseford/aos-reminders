import { TArtifacts } from 'types/army'
import RealmArtifacts from 'army/malign_sorcery/realm_artifacts'
import { HERO_PHASE, COMBAT_PHASE } from 'types/phases'

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
  {
    name: 'Ironbark Talisman (Ironbark)',
    effects: [
      {
        name: 'Ironbark Talisman (Ironbark)',
        desc: 'You can add 1 to all wound rolls made for the bearer’s melee weapons.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Tear of Grace (Harvestboon)',
    effects: [
      {
        name: 'Tear of Grace (Harvestboon)',
        desc:
          'The bearer of the Tear of Grace knows an extra spell, which is always generated from the Deepwood spell lore. In addition, the bearer can add 3" to the range of all of their spells.',
        when: HERO_PHASE,
      },
    ],
  },
]

Artifacts = Artifacts.concat(RealmArtifacts)

export default Artifacts
