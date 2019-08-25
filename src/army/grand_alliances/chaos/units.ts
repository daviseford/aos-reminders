import { uniqBy } from 'lodash'
import { KhorneUnits } from 'army/khorne/units'
import { NurgleUnits } from 'army/nurgle/units'
import { SlaaneshUnits } from 'army/slaanesh/units'
import { TzeentchUnits } from 'army/tzeentch/units'
import BeastsOfChaos from 'army/beasts_of_chaos'
import Everchosen from 'army/everchosen'
import LegionsOfAzgorh from 'army/legions_of_azgorh'
import Skaven from 'army/skaven'
import SlavesToDarkness from 'army/slaves_to_darkness'
import TamurkhansHorde from 'army/tamurkhans_horde'
import { TUnits } from 'types/army'
import { HERO_PHASE } from 'types/phases'

export const MonstersOfChaos: TUnits = [
  // TODO: Add more Monsters of Chaos
  // {
  //   name: ``,
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
  {
    name: `Mutalith Vortex Beast`,
    effects: [
      {
        name: `Aura of Mutation`,
        desc: `In your hero phase, you can pick a unit within 15". Roll a D6 and consult the chart below:

        1. Hideous Disfigurements: Reduce the Bravery of each model in the target unit by 1 for the rest of the battle.

        2. Trollbrains: For the rest of the battle, the controlling player must roll a dice at the start of each of their hero phases. On the roll of a 1, the target unit can't be selected to cast spells, move or attack until their next hero phase.

        3. Gift of Mutations: Reduce the Move of each model in the target unit by 1 for the rest of the battle.

        4. Tide of Transmogrification: The target unit sufers D3 mortal wounds.
        
        5. Maelstrom of Change: The target unit suffers D6 mortal wounds.

        6. Spawnchange: The target unit suffers D6 mortal wounds. For each model that is slain as a result, set up a Chaos Spawn within 3" of the target unit. All Chaos Spawn created as a result of Spawnchange are added to your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mutant Regeneration`,
        desc: `Heal D3 wounds in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Unit Names
export const Units: TUnits = uniqBy(
  [
    ...BeastsOfChaos.Units,
    ...Everchosen.Units,
    ...KhorneUnits,
    ...LegionsOfAzgorh.Units,
    ...MonstersOfChaos,
    ...NurgleUnits,
    ...Skaven.Units,
    ...SlaaneshUnits,
    ...SlavesToDarkness.Units,
    ...TamurkhansHorde.Units,
    ...TzeentchUnits,
  ],
  'name'
)
