import { TItemDescriptions } from 'factions/factionTypes'
import { OGOR_MAWTRIBES } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [OGOR_MAWTRIBES]: {
    effects: pickEffects(BattleTraits, [
      'Everwinter Prayers',
      'Grasp of the Everwinter',
      'Might Makes Right',
      'Ravenous Brutes',
      'Trampling Charge',
    ]),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      prayers: [Prayers],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
