import { IItemDescription } from 'factions/factionTypes'
import { keyPicker, pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const baseSubFaction: IItemDescription = {
  mandatory: {
    spells: [keyPicker(Spells, ['Verdant Blessing'])],
  },
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
  },
  effects: [],
}

const subFactions = {
  'The Burgeoning': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Burgeoning']),
  },
  'The Reaping': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Reaping']),
  },
  'The Dwindling': {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['The Dwindling']),
  },
  Everdusk: {
    ...baseSubFaction,
    effects: pickEffects(BattleTraits, ['Everdusk']),
  },
}

export default subFactions
