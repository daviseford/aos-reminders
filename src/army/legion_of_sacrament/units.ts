import LegionsOfNagash from 'army/legions_of_nagash'
// Battalions
import { TEntry } from 'types/data'
import { HERO_PHASE, SAVES_PHASE } from 'types/phases'
import { filterBattalions } from 'utils/filterUtils'

// Importing from LoN
const getLegionsOfNagashUnits = () => LegionsOfNagash.Units
const getLegionsOfNagashBattalions = () =>
  filterBattalions(LegionsOfNagash.Battalions, [`Deathmarch`, `Castellans of the Crimson Keep`])

export const Units: TEntry[] = [...getLegionsOfNagashUnits()]

export const Battalions: TEntry[] = [
  ...getLegionsOfNagashBattalions(),
  {
    name: `Lords of Sacrament`,
    effects: [
      {
        name: `Unearthly Focus`,
        desc: `In your hero phase, each WIZARD from the Lords of Sacrament may cast an additional spell whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Spirits`,
        desc: `In the shooting phase, add 1 to save rolls for units from the Lords of Sacrament whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [SAVES_PHASE],
      },
    ],
  },
]
