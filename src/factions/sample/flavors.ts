import { TItemDescriptions } from 'factions/factionTypes'

/**
 * Flavors (coined by exonian) is the term that we now use at AoS Reminders to describe these "Specific Allegiances".
 * Think Kharadron Overlords Skyports, Flesh Eater Court Grand Courts, Seraphon Constellations, Stormcast Stormhosts, etc.
 * These Flavors generally apply their own artifact, command trait, and command abilities, as well as a simple rule or two.
 *
 * - A Flavor may belong to one or many Sub-Factions.
 * - A Flavor can dictate:
 *  - What units/battalions/spells/etc are `available` (or `mandatory`).
 */
const Flavors = {
  // '': {
  // mandatory: {},
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default Flavors
