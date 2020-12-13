import { TItemDescriptions } from 'factions/factionTypes'
import { NIGHTHAUNT } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [NIGHTHAUNT]: {
    effects: pickEffects(BattleTraits, [NIGHTHAUNT]),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
