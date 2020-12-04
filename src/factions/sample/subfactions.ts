import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

// TODO: Explain what a subfaction is (vs faction, vs flavor)

// This is a common pattern that we use when we don't want to re-type all of the available stuff
const baseSubFaction: TItemDescription = {
  effects: pickEffects(BattleTraits, ['Sample Army Default Battle Traits']),
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
}

const subFactions: TItemDescriptions = {
  'First SubFaction': {
    effects: pickEffects(BattleTraits, ['Sample Army Default Battle Traits']),

    available: {
      ...baseSubFaction.available,
      battalions: [
        // Make Regular Battalion 2 unavailable to this subfaction using keyOmitter
        keyOmitter(Battalions, ['Regular Battalion 2']),
      ],
    },
  },

  'Second SubFaction': {
    ...baseSubFaction,

    effects: pickEffects(BattleTraits, ['SubFaction 2 Battle Traits']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ['Chocolate', 'Strawberry'])],

      endless_spells: [], // No endless spells for this subfaction
    },

    // These are required entries
    mandatory: {
      scenery: [keyPicker(Scenery, ['A Faction-Specific Scenery Piece'])],
    },
  },
}

export default subFactions
