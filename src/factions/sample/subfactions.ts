import Artifacts from './artifacts'
import Battalions from './battalions'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

/**
 * - A SubFaction belongs to a Faction.
 * - A SubFaction can dictate:
 *  - What Flavors it may contain.
 *  - What units/battalions/spells/etc are `available` (or `mandatory`).
 */
const subFactions = {
  SAMPLE: {
    effects: [],
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      mount_traits: [MountTraits],
      prayers: [Prayers],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
