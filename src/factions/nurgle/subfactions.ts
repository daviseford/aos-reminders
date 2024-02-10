import { NURGLE } from 'meta/factions'
import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTactics from './battle_tactics'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import MonstrousRampages from './monstrous_rampages'
import GrandStrategies from './grand_strategies'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
import SkavenUnits from '../skaven/units'
import { IItemDescription, TItemDescriptions } from 'factions/factionTypes'

const baseSubfaction = {
  effects: [],
  available: {
    artifacts: [Artifacts],
    battalions: [Battalions],
    battle_tactics: [BattleTactics],
    command_abilities: [CommandAbilities],
    command_traits: [CommandTraits],
    flavors: [Flavors],
    grand_strategies: [GrandStrategies],
    monstrous_rampages: [MonstrousRampages],
    scenery: [Scenery],
    spells: [Spells],
    units: [
      Units,
      keyPicker(SkavenUnits, [
        'Plague Priest on Plague Furnace',
        'Verminlord Corruptor',
        'Plague Priest',
        'Plague Censer Bearers',
        'Plague Monks',
        'Plagueclaw',
        'Skabbik Plagueseeker',
        "Skabbik's Plaguepack",
      ]),
    ],
  },
} satisfies IItemDescription

const subFactions = {
  Nurgle: {
    ...baseSubfaction,
    effects: pickEffects(BattleTraits, [NURGLE]),
  },
} satisfies TItemDescriptions

export default subFactions
