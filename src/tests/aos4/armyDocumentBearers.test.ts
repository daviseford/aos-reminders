import {
  REPRESENTATIVE_CATALOG as AOS4_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS as AOS4_DEFAULT_SELECTION_IDS,
} from '../../aos4/generated'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  serializeAos4ArmyDocument,
  type Aos4ArmyDocument,
} from '../../aos4/state'
import { describe, expect, it } from 'vitest'

const DEAD_SELECTION_ID = 'warscroll:ffffffff-ffff-4fff-8fff-ffffffffffff'

/*
 * The bearer map remembers which unit carries each imported enhancement (#1989). It is
 * presentation metadata over the selection set, so the contract is: entries live and die with the
 * selections they name, and a document without bearers serializes byte-identically to schema 1
 * output written before the field existed.
 */
describe('army document enhancement bearers (#1989)', () => {
  const [firstId, secondId] = AOS4_DEFAULT_SELECTION_IDS

  const createDocument = (bearers?: Record<string, string>) =>
    createAos4ArmyDocument({
      id: 'army:bearers',
      name: 'Bearer Test',
      rulesContextId: REPRESENTATIVE_CONTEXT_ID,
      explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
      ...(bearers ? { enhancementBearers: bearers as Aos4ArmyDocument['enhancementBearers'] } : {}),
      reminderPreferences: {},
    })

  it('keeps an entry only while both sides are explicit selections', () => {
    const document = createDocument({
      [firstId]: secondId,
      // The enhancement is not a selection of this army — a dangling attribution.
      [DEAD_SELECTION_ID]: secondId,
      // The bearer is not a selection of this army.
      [secondId]: DEAD_SELECTION_ID,
    })

    expect(document.enhancementBearers).toEqual({ [firstId]: secondId })
  })

  it('drops a self-mapping and omits the field entirely when nothing survives', () => {
    expect(createDocument({ [firstId]: firstId }).enhancementBearers).toBeUndefined()
    expect(createDocument({}).enhancementBearers).toBeUndefined()
    expect(createDocument()).not.toHaveProperty('enhancementBearers')
  })

  it('serializes without the field when empty, so older documents round-trip byte-identically', () => {
    expect(serializeAos4ArmyDocument(createDocument())).not.toContain('enhancementBearers')
  })

  it('round-trips entries through serialization and both deserializers', () => {
    const serialized = serializeAos4ArmyDocument(createDocument({ [firstId]: secondId }))

    const catalogBound = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(catalogBound.diagnostics).toEqual([])
    expect(catalogBound.document?.enhancementBearers).toEqual({ [firstId]: secondId })

    const structural = deserializeAos4ArmyDocumentStructure(serialized)
    expect(structural.document?.enhancementBearers).toEqual({ [firstId]: secondId })
  })

  it('loses only the attribution when a catalog update retires the bearer', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument({ [firstId]: secondId })))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)
    value.enhancementBearers[secondId] = DEAD_SELECTION_ID

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document?.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(restored.document?.enhancementBearers).toEqual({ [firstId]: secondId })
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'missing-selection', severity: 'warning' }),
    ])
  })

  it('rejects a malformed bearer map as an invalid document', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    value.enhancementBearers = { [firstId]: 7 }

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document).toBeUndefined()
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'invalid-document', severity: 'error' }),
    ])
  })
})
