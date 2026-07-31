import { AOS4_CATALOG } from '../../aos4/generated'
import { createDefaultAos4ArmyDocument, deriveAos4OverlayFlags } from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel } from '../../aos4/view'
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

describe('AoS 4 overlay flags follow the selections', () => {
  it('selecting Legends content derives allowsLegends on the document', () => {
    const { factionId, overlayOnly } = overlayOnlyIds('allowsLegends')
    const document = createAos4ArmyDocument({
      ...base,
      explicitSelectionIds: [factionId, overlayOnly[0]],
    })

    const derived = deriveAos4OverlayFlags(AOS4_CATALOG, document)
    expect(derived.allowsLegends).toBe(true)
    expect(derived.allowsHistorical).toBeUndefined()
    expect(derived.explicitSelectionIds).toEqual(document.explicitSelectionIds)
  })

  it('selecting historical content derives allowsHistorical on the document', () => {
    const { factionId, overlayOnly } = overlayOnlyIds('allowsHistorical')
    const document = createAos4ArmyDocument({
      ...base,
      explicitSelectionIds: [factionId, overlayOnly[0]],
    })

    const derived = deriveAos4OverlayFlags(AOS4_CATALOG, document)
    expect(derived.allowsHistorical).toBe(true)
  })

  it('removing overlay content clears stale flags', () => {
    const { factionId } = overlayOnlyIds('allowsLegends')
    const document = createAos4ArmyDocument({
      ...base,
      allowsLegends: true,
      allowsHistorical: true,
      explicitSelectionIds: [factionId],
    })

    const derived = deriveAos4OverlayFlags(AOS4_CATALOG, document)
    expect(derived.allowsLegends).toBeUndefined()
    expect(derived.allowsHistorical).toBeUndefined()
  })

  it('a derived document round-trips the army API validation', () => {
    const { factionId, overlayOnly } = overlayOnlyIds('allowsLegends')
    const derived = deriveAos4OverlayFlags(
      AOS4_CATALOG,
      createAos4ArmyDocument({ ...base, explicitSelectionIds: [factionId, overlayOnly[0]] })
    )
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: derived.explicitSelectionIds,
      rulesContextId: derived.rulesContextId,
      ...(derived.allowsLegends ? { allowsLegends: true } : {}),
      ...(derived.allowsHistorical ? { allowsHistorical: true } : {}),
    })
    expect(selection.diagnostics.filter(d => d.severity === 'error')).toEqual([])
  })
})

describe('AoS 4 builder offers overlay content by default', () => {
  const ogorFaction = AOS4_CATALOG.entities.find(
    entity => entity.id.startsWith('faction:') && /ogor mawtribes/i.test((entity as { name?: string }).name ?? '')
  )

  it('offers Scourge of Ghyran formations without any document flag (issue #1812)', () => {
    const builder = createAos4BuilderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({ ...base, explicitSelectionIds: [ogorFaction!.id] })
    )
    const byName = new Map(builder.options.map(option => [option.name, option]))
    for (const name of ['Mawpath Menaces', 'Greedy Eaters']) {
      const option = byName.get(name)
      expect(option, name).toBeDefined()
      expect(option!.available, name).toBe(true)
      expect(option!.overlay, name).toBe('historical')
    }
  })

  it('marks Legends options with the legends overlay', () => {
    const builder = createAos4BuilderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({ ...base, explicitSelectionIds: [ogorFaction!.id] })
    )
    const legends = builder.options.filter(option => option.overlay === 'legends')
    expect(legends.map(option => option.name)).toEqual(
      expect.arrayContaining(['Gorlok Blackpowder', 'Hrothgorn Mantrapper'])
    )
  })

  it('leaves current-standard options unmarked', () => {
    const builder = createAos4BuilderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({ ...base, explicitSelectionIds: [ogorFaction!.id] })
    )
    const butcher = builder.options.find(option => option.name === 'Butcher')
    expect(butcher).toBeDefined()
    expect(butcher!.overlay).toBeUndefined()
  })
})
