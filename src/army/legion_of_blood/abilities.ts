import LegionsOfNagash from 'army/legions_of_nagash'
// General Allegiance Abilities (always active regardless of army composition)
import { TEffects } from 'types/data'
import { COMBAT_PHASE, DURING_GAME, DURING_SETUP } from 'types/phases'

// Importing from LoN
const getLegionsOfNagashAbilities = () => LegionsOfNagash.Abilities

const Abilities: TEffects[] = [
  ...getLegionsOfNagashAbilities(),
  {
    name: `Favored Retainers`,
    desc: `Legion of Blood Vampire Lords and Blood Knights gain +1 attack.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Immortal Majesty`,
    desc: `Subtract 1 from bravery for any enemy unit within 6" of any Legion of Blood units.`,
    when: [DURING_GAME],
  },
  {
    name: `Legion of Blood`,
    desc: `This is Neferata's legion, if she is included in this army, she MUST be the army general and if you include any Mortarch units she has to be one of them.`,
    when: [DURING_SETUP],
  },
]

export default Abilities
