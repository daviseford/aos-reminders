import type { Aos4Catalog, Faction } from './content'
import type { CanonicalId } from './identity'

/**
 * The factions a player can field as an army, as opposed to every faction row the sources decode.
 *
 * Wahapedia's `Factions.csv` uses faction rows as containers as well as armies. `Endless Spells`
 * is a row so that manifestations — a category of units and spells any army may take — have
 * somewhere to hang, and generation turns it into a `faction` entity like every other row. Offering
 * it in the army selector hands the player an army with no units (#1796).
 *
 * The relationship graph separates the two without pinning a name or an ID: a container offers no
 * warscrolls at all, while the smallest real army offers eleven. Restoring the manifestation
 * warscrolls (#1791) is expected to settle where that content belongs and retire the container row
 * at generation time, at which point this has nothing left to exclude.
 */
export const armyFactions = (catalog: Aos4Catalog): Faction[] => {
  const warscrollIds = new Set<CanonicalId>(
    catalog.entities.flatMap(entity => (entity.kind === 'warscroll' ? [entity.id] : []))
  )
  const offersWarscrolls = new Set<CanonicalId>(
    catalog.relationships.flatMap(relationship =>
      warscrollIds.has(relationship.to) ? [relationship.from] : []
    )
  )

  return catalog.entities.filter(
    (entity): entity is Faction => entity.kind === 'faction' && offersWarscrolls.has(entity.id)
  )
}
