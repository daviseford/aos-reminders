import type { CanonicalId, RulesContextId } from '../../domain'
import factionIndexJson from './faction-index.json'

export interface Aos4FactionIndexRow {
  id: CanonicalId<'faction'>
  name: string
  /** Which rules contexts the faction is applicable in, as indexes into `rulesContextIds`. */
  rulesContextIndexes: number[]
  /**
   * Whether a player can field the faction as an army, mirroring `armyFactions` (see
   * `src/aos4/domain/armies.ts`). The rule needs the relationship graph, so it is decided at
   * generation time and carried here as a flag. Non-playable rows stay in the index because a
   * stored document may still name one, and it has to be able to name itself.
   */
  playable: boolean
  /**
   * The rules contexts — as indexes into `rulesContextIds` — in which the faction offers at least
   * one Army of Renown. The header reserves the Army of Renown select when the document's own
   * context is in here, so the row is not inserted, shifting the page, when the catalog lands.
   *
   * Per context rather than a single flag because the answer really does differ: most battletome
   * factions offer several in matched play and none at all in Spearhead or Legends. A flag taken
   * from the default context reserved a row on those documents that the catalog then removed,
   * which shifts the page in the direction the reservation exists to prevent.
   */
  armiesOfRenownContextIndexes: number[]
}

export interface Aos4FactionIndex {
  schemaVersion: 1
  /**
   * Every rules context in the corpus, sorted by id, and the addressing space for both index
   * arrays on a row. Written once here rather than repeated per row: each id is 47 bytes and most
   * factions name most contexts, so spelling them out inline would dominate the artifact.
   */
  rulesContextIds: RulesContextId[]
  factions: Aos4FactionIndexRow[]
}

/**
 * Deliberately not re-exported from `./index`, which reaches the whole corpus through `./catalog`.
 * The catalog-free shell deep-imports this module to name the factions before the corpus loads, so
 * a barrel edge here would defeat the point by pulling megabytes of rules data with it.
 */
export const AOS4_FACTION_INDEX = factionIndexJson as unknown as Aos4FactionIndex
