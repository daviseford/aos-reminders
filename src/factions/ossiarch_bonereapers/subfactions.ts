import { keyPicker, pickEffects } from 'factions/metatagger'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import LegionsOfNagashUnits from '../legions_of_nagash/units'
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

const subFactions = {
  [OSSIARCH_BONEREAPERS]: {
    effects: pickEffects(BattleTraits, ['The Ossiarch Empire']),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      flavors: [Flavors],
      scenery: [Scenery],
      spells: [Spells],
      units: [
        Units,
        keyPicker(LegionsOfNagashUnits, [
          'Arkhan the Black, Mortarch of Sacrament',
          'Nagash, Supreme Lord of the Undead',
        ]),
      ],
    },
  },
}

export default subFactions
