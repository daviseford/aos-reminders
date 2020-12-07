import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from 'factions/metatagger'
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

// TODO: Explain what a subfaction is (vs faction, vs flavor)

// This is a common pattern that we use when we don't want to re-type all of the available stuff
const baseSubFaction: TItemDescription = {
  effects: pickEffects(BattleTraits, ['The Ossiarch Empire']),
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

const subFactions: TItemDescriptions = {
  'Mortis Praetorians': {
    effects: pickEffects(BattleTraits, ['The Ossiarch Empire', 'Mortis Praetorians']),
    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ['Mortis Praetorians'])],
      command_traits: [keyPicker(CommandTraits, ["Katakros' Chosen"])],
      artifacts: [keyPicker(Artifacts, ["Artificer's Blade"])],
    },
  },
}

export default subFactions
