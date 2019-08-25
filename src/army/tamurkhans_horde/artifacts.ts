import { TArtifacts } from 'types/army'
import { START_OF_HERO_PHASE } from 'types/phases'

// Import all Nurgle artifacts as they are cross compatible with Tamurkan's Horde.
import NurgleArtifacts from 'army/nurgle/artifacts'

const Artifacts: TArtifacts = [
  {
    name: `Daemon Flask (Tamurkhan's Horde)`,
    effects: [
      {
        name: `Daemon Flask (Tamurkhan's Horde)`,
        desc: `Once per battle, the bearer can use this artifact. If they do so, roll a D6 for each enemy unit within 12" of the bearer. You can re-roll the dice for a unit that is a War Machine or is within 3" of a terrain feature. On a 4+ that unit suffers 1 mortal wound. On a 6, that unit suffers D3 mortal wounds instead of 1.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  ...NurgleArtifacts,
]

export default Artifacts
