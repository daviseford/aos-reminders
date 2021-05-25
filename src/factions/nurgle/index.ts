import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { CHAOS } from 'meta/alliances'
import { NURGLE } from 'meta/factions'
import battle_traits from './battle_traits'
import SubFactions from './subfactions'

export const NurgleFaction = new Faction(
  NURGLE,
  CHAOS,
  SubFactions,
  'Plague Legions',
  undefined,
  pickEffects(battle_traits, ['Nurgle'])
)
