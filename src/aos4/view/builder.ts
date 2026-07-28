import type { Aos4Catalog, BattleProfile, CanonicalId, ContentEntity, Warscroll } from '../domain'
import { resolveSelection } from '../select'
import type { Aos4ArmyDocument } from '../state'

export interface Aos4BuilderOption {
  id: CanonicalId
  name: string
  kind: ContentEntity['kind']
  groupType?: string
  selected: boolean
  available: boolean
}

export interface Aos4BuilderWarscroll {
  id: CanonicalId<'warscroll'>
  name: string
  characteristics: Warscroll['characteristics']
  profile?: {
    unitSize: number
    points?: number
    baseSizes: string[]
  }
}

export const createAos4BuilderViewModel = (catalog: Aos4Catalog, document: Aos4ArmyDocument) => {
  const selection = resolveSelection(catalog, {
    explicitIds: document.explicitSelectionIds,
    rulesContextId: document.rulesContextId,
  })
  const selected = new Set(selection.selectedIds)
  const available = new Set(selection.availableIds)
  const entityById = new Map(catalog.entities.map(entity => [entity.id, entity]))

  const options: Aos4BuilderOption[] = Array.from(
    new Set([...document.explicitSelectionIds, ...selection.availableIds])
  )
    .flatMap(id => {
      const entity = entityById.get(id)
      if (!entity) return []
      return [
        {
          id,
          name: entity.name,
          kind: entity.kind,
          ...(entity.kind === 'content-group' ? { groupType: entity.groupType } : {}),
          selected: selected.has(id),
          available: available.has(id),
        },
      ]
    })
    .sort(
      (left, right) =>
        (left.groupType ?? left.kind).localeCompare(right.groupType ?? right.kind) ||
        left.name.localeCompare(right.name)
    )

  const profileByWarscroll = new Map(
    catalog.entities
      .filter(
        (entity): entity is BattleProfile => entity.kind === 'battle-profile' && selected.has(entity.id)
      )
      .map(profile => [profile.warscrollId, profile])
  )
  const warscrolls: Aos4BuilderWarscroll[] = catalog.entities
    .filter((entity): entity is Warscroll => entity.kind === 'warscroll' && selected.has(entity.id))
    .map(entity => {
      const profile = profileByWarscroll.get(entity.id)
      return {
        id: entity.id,
        name: entity.name,
        characteristics: entity.characteristics,
        ...(profile
          ? {
              profile: {
                unitSize: profile.unitSize,
                points: profile.points,
                baseSizes: [...profile.baseSizes],
              },
            }
          : {}),
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))

  return {
    armyId: document.id,
    armyName: document.name,
    rulesContextId: document.rulesContextId,
    options,
    warscrolls,
    selection,
  }
}
