import { FLESH_EATER_COURTS } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import MountTraits from './mount_traits'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'
import monstrous_rampages from './monstrous_rampages'
import prayers from './prayers'
import grand_strategies from './grand_strategies'
import battle_tactics from './battle_tactics'
import LoNUnits from '../nighthaunt/units'

const subFactions = {
  [FLESH_EATER_COURTS]: {
    effects: pickEffects(BattleTraits, [FLESH_EATER_COURTS]),
    available: {
      artifacts: [Artifacts],
      battle_tactics: [battle_tactics],
      command_traits: [CommandTraits],
      endless_spells: [EndlessSpells],
      grand_strategies: [grand_strategies],
      mount_traits: [MountTraits],
      monstrous_rampages: [monstrous_rampages],
      prayers: [prayers],
      flavors: [Flavors],
      scenery: [Scenery],
      spells: [Spells],
      units: [Units, keyPicker(LoNUnits, ['Nagash, Supreme Lord of the Undead'])],
    },
  },
} satisfies TItemDescriptions

export default subFactions
