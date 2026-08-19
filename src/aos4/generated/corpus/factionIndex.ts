import type { CanonicalId, RulesContextId } from '../../domain'
import factionIndexJson from './faction-index.json'

export interface Aos4FactionIndexRow {
  id: CanonicalId<'faction'>
  name: string
  rulesContextIds: RulesContextId[]
  /**
   * Whether a player can field the faction as an army, mirroring `armyFactions` (see
   * `src/aos4/domain/armies.ts`). The rule needs the relationship graph, so it is decided at
   * generation time and carried here as a flag. Non-playable rows stay in the index because a
   * stored document may still name one, and it has to be able to name itself.
   */
  playable: boolean
  /**
   * Whether the faction offers any Army of Renown under the default rules context. The header
   * reserves the Army of Renown select on this flag so the row is not inserted — shifting the
   * page — when the catalog lands.
   */
  hasArmiesOfRenown: boolean
}

export interface Aos4FactionIndex {
  schemaVersion: 1
  factions: Aos4FactionIndexRow[]
}

/**
 * Deliberately not re-exported from `./index`, which reaches the whole corpus through `./catalog`.
 * The catalog-free shell deep-imports this module to name the factions before the corpus loads, so
 * a barrel edge here would defeat the point by pulling megabytes of rules data with it.
 */
export const AOS4_FACTION_INDEX = factionIndexJson as unknown as Aos4FactionIndex
