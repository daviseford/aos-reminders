import GenericAbilities from 'army/generic/abilities'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Mercenary Companies`,
    effects: [GenericAbilities.DisruptivePresence],
  },
]

export default Abilities
