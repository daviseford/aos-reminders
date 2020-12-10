import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { WANDERERS } from 'meta/factions'
import SubFactions from './subfactions'

export const WanderersFaction = new Faction(WANDERERS, ORDER, SubFactions)
