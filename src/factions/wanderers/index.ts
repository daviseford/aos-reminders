import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { ORDER } from 'meta/alliances'
import { WANDERERS } from 'meta/factions'
import battle_traits from './battle_traits'
import SubFactions from './subfactions'

export const WanderersFaction = new Faction(
  WANDERERS,
  ORDER,
  SubFactions,
  undefined,
  undefined,
  pickEffects(battle_traits, ['Wanderers'])
)
