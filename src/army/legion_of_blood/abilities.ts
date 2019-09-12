import { COMBAT_PHASE, DURING_GAME, DURING_SETUP } from 'types/phases'
import { TAbilities } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'

// Importing from LoN
const getLegionsOfNagashAbilities = () => LegionsOfNagash.Abilities

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
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
