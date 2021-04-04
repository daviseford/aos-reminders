import { IItemDescription } from 'factions/factionTypes'
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

const baseSubFaction: IItemDescription = {
  effects: pickEffects(BattleTraits, ['SERAPHON']),
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

const subFactions = {
  Coalesced: {
    effects: pickEffects(BattleTraits, ['COALESCED', 'SERAPHON']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
      battalions: [
        keyPicker(Battalions, [
          'Eternal Temple-host',
          'Sunclaw Temple-host',
          'Firelance Temple-host',
          'Shadowstrike Temple-host',
          'Thunderquake Temple-host',
        ]),
      ],
    },
  },

  Starborne: {
    ...baseSubFaction,

    effects: pickEffects(BattleTraits, ['STARBORNE', 'SERAPHON']),

    available: {
      ...baseSubFaction.available,
      flavors: [keyPicker(Flavors, ["Dracothion's Tail", 'Fangs of Sotek'])],

      battalions: [
        keyPicker(Battalions, [
          'Eternal Starhost',
          'Sunclaw Starhost',
          'Firelance Starhost',
          'Shadowstrike Starhost',
          'Thunderquake Starhost',
          "Gul'Rok's Starhost",
          'Venomblade Starhost',
        ]),
      ],
    },
  },
}

export default subFactions
