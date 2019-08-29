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
import { HERO_PHASE, DURING_SETUP, COMBAT_PHASE, CHARGE_PHASE } from 'types/phases'

export const MonstersOfChaos: TUnits = [
  {
    name: `Mutalith Vortex Beast`,
    effects: [
      {
        name: `Aura of Mutation`,
        desc: `In your hero phase, you can pick a unit within 15". Roll a D6 and consult the chart below:

        1: Hideous Disfigurements - Reduce the Bravery of each model in the target unit by 1 for the rest of the battle.

        2: Trollbrains - For the rest of the battle, the controlling player must roll a D6 at the start of each of their hero phases. On the roll of a 1, the target unit can't be selected to cast spells, move or attack until their next hero phase.

        3: Gift of Mutations - Reduce the Move of each model in the target unit by 1 for the rest of the battle.

        4: Tide of Transmogrification - The target unit sufers D3 mortal wounds.
        
        5: Maelstrom of Change - The target unit suffers D6 mortal wounds.

        6: Spawnchange - The target unit suffers D6 mortal wounds. For each model that is slain as a result, set up a Chaos Spawn within 3" of the target unit. All Chaos Spawn created as a result of Spawnchange are added to your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mutant Regeneration`,
        desc: `Heal D3 wounds in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Slaughterbrute`,
    effects: [
      {
        name: `Runes of Binding`,
        desc: `When you set up a Slaughterbrute, you can pick a Slaves to Darkness Hero in your army to be its master (a model cannot be the master of more than one Slaughterbrute). As long as the Slaughterbrute's master is on the battlefield, the Slaughterbrute's melee weapons hit on rolls of 3+ rather than 4+.`,
        when: [DURING_SETUP, COMBAT_PHASE],
      },
      {
        name: `Beast Unbound`,
        desc: `If a Slaughterbrute does not have a master on the battlefield in the charge phase, roll a dice. If the result is 3 or less it lashes out at the nearest model, friend or foe, within 3". That model's unit immediately suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
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
