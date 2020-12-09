import { pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubFaction = {
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
  effects: [],
}

const subFactions = {
  'Living Tempest': {
    effects: pickEffects(BattleTraits, ['Legends of the Living Tempest']),
    available: {
      ...baseSubFaction.available,
    },
  },
  'Celestial Senitels': {
    effects: pickEffects(BattleTraits, ['Celestial Sentinels']),
    available: {
      ...baseSubFaction.available,
    },
  },
}

export default subFactions
