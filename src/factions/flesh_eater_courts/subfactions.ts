import { TItemDescriptions } from 'factions/factionTypes'
import { FLESH_EATER_COURTS } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [FLESH_EATER_COURTS]: {
    effects: pickEffects(BattleTraits, [FLESH_EATER_COURTS]),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units],
    },
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Feeding Frenzy'])],
    },
  },
}

export default subFactions
