import { COMBAT_PHASE, DURING_SETUP, HERO_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'

// Importing from LoN
const getLegionsOfNagashAbilities = () => LegionsOfNagash.Abilities

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  ...getLegionsOfNagashAbilities(),
  {
    name: `Chosen Guardians`,
    desc: `Add 1 to the Attacks characteristic of all melee weapons used by GRAND HOST OF NAGASH MORGHAST units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Legions Innumerable`,
    desc: `In your hero phase, you may roll a D6 for each friendly GRAND HOST OF NAGASH SUMMONABLE unit on the battlefield. On a 5+ you can heal up to D3 wounds that have been allocated to it. For units with a Wounds characteristic of 1, return 1 slain model to the unit for each wound that would have been healed.`,
    when: [HERO_PHASE],
  },
  {
    name: `Grand Host of Nagash`,
    desc: `This is Nagash's Legion/new overall Death force and it can include any units in the battletome. If it includes Nagash he must be the general.`,
    when: [DURING_SETUP],
  },
]

export default Abilities
