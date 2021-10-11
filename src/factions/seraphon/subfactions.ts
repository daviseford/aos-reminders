import { IItemDescription } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubFaction: IItemDescription = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
}

const subFactions = {
  Coalesced: {
    effects: pickEffects(BattleTraits, ['COALESCED', 'Battle Tactics']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
      grand_strategies: [keyPicker(GrandStrategies, ['Continuous Expansion'])],
      mount_traits: [keyPicker(MountTraits, ['Beastmaster'])],
    },
  },

  Starborne: {
    effects: pickEffects(BattleTraits, ['STARBORNE', 'Battle Tactics']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ["Dracothion's Tail", 'Fangs of Sotek'])],
      grand_strategies: [keyPicker(GrandStrategies, ['Astromatrix'])],
      mount_traits: [keyPicker(MountTraits, ['Celestial Destruction'])],
    },
  },
}

export default subFactions
