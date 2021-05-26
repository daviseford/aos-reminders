import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { DEATH } from 'meta/alliances'
import { TOMB_KINGS } from 'meta/factions'
import battle_traits from './battle_traits'
import SubFactions from './subfactions'

export const TombKingsFaction = new Faction(
  TOMB_KINGS,
  DEATH,
  SubFactions,
  undefined,
  undefined,
  pickEffects(battle_traits, ['Deathless Minions'])
)
