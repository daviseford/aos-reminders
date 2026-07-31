import { AOS4_CATALOG } from '../../aos4/generated'
import { createDefaultAos4ArmyDocument, setAos4OverlayFlag } from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument } from '../../aos4/state'
import { describe, expect, it } from 'vitest'

const base = createDefaultAos4ArmyDocument()

const overlayOnlyIds = (flag: 'allowsLegends' | 'allowsHistorical') => {
  for (const faction of AOS4_CATALOG.entities.filter(entity => entity.id.startsWith('faction:'))) {
    const strict = resolveSelection(AOS4_CATALOG, {
      explicitIds: [faction.id],
      rulesContextId: base.rulesContextId,
    })
    const relaxed = resolveSelection(AOS4_CATALOG, {
      explicitIds: [faction.id],
      rulesContextId: base.rulesContextId,
      [flag]: true,
    })
    const strictAvailable = new Set(strict.availableIds)
    const overlayOnly = relaxed.availableIds.filter(id => !strictAvailable.has(id))
    if (overlayOnly.length > 0) return { factionId: faction.id, overlayOnly }
  }
  throw new Error(`The catalog has no ${flag}-gated content to exercise`)
}

describe('AoS 4 overlay flags', () => {
  it('enabling an overlay keeps the document and exposes gated content', () => {
    const { factionId, overlayOnly } = overlayOnlyIds('allowsLegends')
    const document = createAos4ArmyDocument({
      ...base,
      explicitSelectionIds: [factionId],
    })

    const enabled = setAos4OverlayFlag(AOS4_CATALOG, document, 'allowsLegends', true)
    expect(enabled.allowsLegends).toBe(true)
    expect(enabled.explicitSelectionIds).toEqual([factionId])

    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [...enabled.explicitSelectionIds, overlayOnly[0]],
      rulesContextId: enabled.rulesContextId,
      allowsLegends: true,
    })
    expect(selection.diagnostics.filter(d => d.severity === 'error')).toEqual([])
  })

  it('disabling an overlay prunes selections that only resolved under it', () => {
    const { factionId, overlayOnly } = overlayOnlyIds('allowsLegends')
    const document = createAos4ArmyDocument({
      ...base,
      allowsLegends: true,
      explicitSelectionIds: [factionId, overlayOnly[0]],
    })

    const disabled = setAos4OverlayFlag(AOS4_CATALOG, document, 'allowsLegends', false)
    expect(disabled.allowsLegends).toBeUndefined()
    expect(disabled.explicitSelectionIds).toEqual([factionId])

    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: disabled.explicitSelectionIds,
      rulesContextId: disabled.rulesContextId,
    })
    expect(selection.diagnostics.filter(d => d.severity === 'error')).toEqual([])
  })

  it('disabling an overlay with no gated selections only clears the flag', () => {
    const document = createAos4ArmyDocument({ ...base, allowsLegends: true })
    const disabled = setAos4OverlayFlag(AOS4_CATALOG, document, 'allowsLegends', false)
    expect(disabled.allowsLegends).toBeUndefined()
    expect(disabled.explicitSelectionIds).toEqual(base.explicitSelectionIds)
  })

  it('the historical overlay exposes Scourge of Ghyran content groups (issue #1812)', () => {
    const ogorFaction = AOS4_CATALOG.entities.find(
      entity => entity.id.startsWith('faction:') && /ogor mawtribes/i.test((entity as { name?: string }).name ?? '')
    )
    expect(ogorFaction).toBeDefined()

    const strict = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ogorFaction!.id],
      rulesContextId: base.rulesContextId,
    })
    const historical = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ogorFaction!.id],
      rulesContextId: base.rulesContextId,
      allowsHistorical: true,
    })
    const strictAvailable = new Set(strict.availableIds)
    const addedNames = historical.availableIds
      .filter(id => !strictAvailable.has(id))
      .map(id => (AOS4_CATALOG.entities.find(entity => entity.id === id) as { name?: string })?.name)

    expect(addedNames).toEqual(expect.arrayContaining(['Mawpath Menaces', 'Greedy Eaters']))
  })
})
