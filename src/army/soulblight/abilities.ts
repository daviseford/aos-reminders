import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Locus of Shyish`,
    desc: `When you cast any spell from any lore and the unmodified casting roll is 9+, then resolve the spell effect twice.`,
    when: [HERO_PHASE],
  },
  {
    name: `Deathless Thralls`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly SOULBLIGHT unit within 6" of your general or another SOULBLIGHT HERO from your army. On a 6+ the wound is negated.`,
    when: [COMBAT_PHASE],
  },
]

export default Abilities
