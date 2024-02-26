import { COMBAT_PHASE, END_OF_TURN, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const Flavors = {
  Morgaunt: {
    effects: [
      {
        name: `Morgaunt Kingdoms`,
        desc: `Give 1 noble deeds point to each friendly MORGAUNT FLESH-EATER COURTS HERO at the end of the turn if that HERO is contesting an objective.`,
        when: [END_OF_TURN],
      },
    ],
  },
  Hollowmourne: {
    effects: [
      {
        name: `Grisly Cavaliers`,
        desc: `Add 1 to the Damage characteristic of melee weapons used by friendly HOLLOWMOURNE KNIGHTS units that have made a charge move in the same turn. This ability has no effect on attacks made by mounts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Blisterskin: {
    effects: [
      {
        name: `Pious Nobility`,
        desc: `Friendly ABHORRANTS gain the PRIEST keyword but they cannot cast spells and chant prayers in the same hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Gristlegore: {
    effects: [
      {
        name: `Savage Strike`,
        desc: `At the start of your combat phase, you can pick 1 friendly GRISTLEGORE MONSTER on the battlefield. The strike-first effect applies to that MONSTER until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default Flavors
