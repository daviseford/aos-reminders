import { TItemDescription } from 'factions/factionTypes'
import { keyOmitter, pickEffects } from 'factions/metatagger'
import CitiesOfSigmarUnits from '../cities_of_sigmar/units'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const baseSubFaction: TItemDescription = {
  available: {
    allied_units: [],
    artifacts: [Artifacts],
    battalions: [Battalions],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    endless_spells: [EndlessSpells],
    flavors: [Flavors],
    mount_traits: [MountTraits],
    prayers: [Prayers],
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
      battalions: [
        keyOmitter(Battalions, [
          // Ignore Stormkeep battalions
          'Wardens of the Stormkeep',
          'Stormtower Garrison',
          'Stormkeep Patrol',
          'Stormkeep Brotherhood',
        ]),
      ],
    },
  },
  'Celestial Sentinels': {
    effects: pickEffects(BattleTraits, ['Celestial Sentinels']),
    available: {
      ...baseSubFaction.available,
      allied_units: [CitiesOfSigmarUnits],
    },
  },
}

export default subFactions
