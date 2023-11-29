import { DISPOSSESSED } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [DISPOSSESSED]: {
    effects: pickEffects(BattleTraits, ['Grudgebound', 'Stubborn to the End']),
    available: {
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
