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
    spells: [Spells],
    units: [Units],
  },
  effects: [],
}
const subFactions = {
  'The Burgeoning': {
    effects: pickEffects(BattleTraits, ['The Burgeoning', 'Battle Tactics']),
    available: {
      ...baseSubFaction.available,
    },
    mandatory: {
      ...baseSubFaction.mandatory,
    },
  },
  'The Reaping': {
    effects: pickEffects(BattleTraits, ['The Reaping', 'Battle Tactics']),
    available: {
      ...baseSubFaction.available,
    },
    mandatory: {
      ...baseSubFaction.mandatory,
    },
  },
  'The Dwindling': {
    effects: pickEffects(BattleTraits, ['The Dwindling', 'Battle Tactics']),
    available: {
      ...baseSubFaction.available,
    },
    mandatory: {
      ...baseSubFaction.mandatory,
    },
  },
  Everdusk: {
    effects: pickEffects(BattleTraits, ['Everdusk', 'Battle Tactics']),
    available: {
      ...baseSubFaction.available,
    },
    mandatory: {
      ...baseSubFaction.mandatory,
    },
  },
}
export default subFactions
