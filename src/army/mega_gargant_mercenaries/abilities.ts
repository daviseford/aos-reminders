import GenericAbilities from 'army/generic/abilities'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Mega Gargant Mercs`,
    effects: [GenericAbilities.DisruptivePresence],
  },
]

export default Abilities
