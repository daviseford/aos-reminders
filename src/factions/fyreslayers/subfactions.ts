import { keyPicker, pickEffects } from 'factions/metatagger'
import { FYRESLAYERS } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Units from './units'
import { IItemDescription } from 'factions/factionTypes'

const baseSubfaction: IItemDescription = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    mount_traits: [MountTraits],
    prayers: [Prayers],
    scenery: [Scenery],
    units: [Units],
  },
  mandatory: {
    command_abilities: [keyPicker(CommandAbilities, ['Fierce Counter-Attack'])],
  },
}

const subFactions = {
  Fyreslayers: {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [FYRESLAYERS, 'Battle Tactics', 'Ur-Gold Runes']),
  },
  'Lofnir Drothkeepers': {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, ['Lofnir Drothkeepers', 'Lofnir Drothkeepers Battle Tactics']),
  },
}

export default subFactions
