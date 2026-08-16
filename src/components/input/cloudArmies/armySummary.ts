import { AOS4_CATALOG } from '../../../aos4/generated'
import type { Aos4ArmyDocument } from '../../../aos4/state'

/*
 * What an army the player did not build on screen looks like when it is described back to them —
 * a row in `My Armies`, or the header of an incoming shared link.
 *
 * Both used to read off `explicitSelectionIds.length` ("15 selections") — the internal field name,
 * and a number that counts the faction and battle formation alongside the units, so it matched
 * nothing the player could count. A player recognises the faction they brought and roughly how many
 * units are in it, so that is what they get. Both are read off the canonical ID prefix (`faction:`,
 * `warscroll:`) rather than by resolving the selection, because this renders once per army in a
 * list and resolution is the builder's much heavier job.
 */
const entityNames = new Map(AOS4_CATALOG.entities.map(entity => [entity.id as string, entity.name]))

export interface CloudArmySummary {
  /** Absent when the stored faction is no longer in the catalog, or the army never picked one. */
  factionName?: string
  unitCount: number
}

export const summarizeCloudArmy = (document: Aos4ArmyDocument): CloudArmySummary => {
  const factionSelectionId = document.explicitSelectionIds.find(id => id.startsWith('faction:'))
  const factionName = factionSelectionId ? entityNames.get(factionSelectionId) : undefined

  return {
    ...(factionName ? { factionName } : {}),
    unitCount: document.explicitSelectionIds.filter(id => id.startsWith('warscroll:')).length,
  }
}

/*
 * "Aug 16, 2026, 2:45 PM". The list previously showed a date only, so two armies saved on the same
 * day — the normal case when a roster is re-imported between rounds — were indistinguishable.
 */
export const formatSavedAt = (updatedAt: number): string =>
  new Date(updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export const describeCloudArmy = (document: Aos4ArmyDocument, updatedAt: number): string => {
  const { factionName, unitCount } = summarizeCloudArmy(document)
  const units = `${unitCount} ${unitCount === 1 ? 'unit' : 'units'}`
  return [factionName, units, `saved ${formatSavedAt(updatedAt)}`].filter(Boolean).join(' · ')
}
