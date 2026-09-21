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
} from '../../aos4/state'
import { describe, expect, it } from 'vitest'

/*
 * #1991: a stale client that understands only today's known fields must not delete a top-level
 * field a newer client added under the unchanged schemaVersion 1 (the same pattern `allowsLegends`,
 * `allowsHistorical`, and `enhancementBearers` shipped under). Both deserializers must carry
 * unrecognized top-level fields through to re-serialization, bounded so hostile or oversized data
 * cannot accumulate, without disturbing the byte-identical round trip for documents that carry none.
 */
describe('army document unknown-field preservation (#1991)', () => {
  const knownDocument = () =>
    createAos4ArmyDocument({
      id: 'army:unknown-fields',
      name: 'Unknown Field Test',
      rulesContextId: REPRESENTATIVE_CONTEXT_ID,
      explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
      reminderPreferences: {},
    })

  const withRawField = (fieldName: string, fieldValue: unknown) => {
    const value = JSON.parse(serializeAos4ArmyDocument(knownDocument()))
    value[fieldName] = fieldValue
    return JSON.stringify(value)
  }

  it('carries an ordinary future field through the catalog-bound deserializer and back to the wire', () => {
    const serialized = withRawField('futureFlag', true)

    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.diagnostics).toEqual([])
    expect(restored.document).toBeDefined()

    const reserialized = serializeAos4ArmyDocument(restored.document!)
    expect(JSON.parse(reserialized).futureFlag).toBe(true)
  })

  it('carries an ordinary future field through the catalog-free structural deserializer', () => {
    const serialized = withRawField('futureNote', { carriedBy: 'warscroll:example', priority: 3 })

    const restored = deserializeAos4ArmyDocumentStructure(serialized)
    expect(restored.document).toBeDefined()

    const reserialized = serializeAos4ArmyDocument(restored.document!)
    expect(JSON.parse(reserialized).futureNote).toEqual({ carriedBy: 'warscroll:example', priority: 3 })
  })

  it('survives the exact stale-client round trip: load without a catalog, save straight back', () => {
    // This is the #1989-style failure mode: a stale shell reads structurally and auto-saves without
    // any user edit (Home.tsx), which must not silently delete a field it doesn't recognize.
    const serialized = withRawField('carriedByBearer', 'warscroll:carrier')

    const staleClientRead = deserializeAos4ArmyDocumentStructure(serialized)
    const staleClientResave = serializeAos4ArmyDocument(staleClientRead.document!)

    expect(JSON.parse(staleClientResave).carriedByBearer).toBe('warscroll:carrier')
  })

  it('keeps documents without unknown fields byte-identical to the pre-existing serialization', () => {
    const document = knownDocument()
    const serialized = serializeAos4ArmyDocument(document)

    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serialized)
    expect(serialized).not.toContain('unknownFields')
  })

  it('does not let an unknown field shadow or corrupt a known field on round trip', () => {
    const serialized = withRawField('reminderPreferencesLegacy', { hello: 'world' })
    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.document?.reminderPreferences).toEqual({})
    expect(JSON.parse(serializeAos4ArmyDocument(restored.document!)).reminderPreferencesLegacy).toEqual({
      hello: 'world',
    })
  })

  it('drops dangerous keys such as __proto__, constructor, and prototype without failing the document', () => {
    /*
     * `value.__proto__ = ...` invokes Object.prototype's legacy accessor setter and reassigns
     * `value`'s prototype — it never creates an own key named "__proto__", so a document built that
     * way never exercised the key this test claims to cover; the JSON text below never reaches
     * `readAos4ArmyDocumentShape`'s `Object.entries` scan as a "__proto__" entry at all. A JSON
     * document with a literal `"__proto__"` property is different: `JSON.parse` creates it through
     * ordinary own-property creation, which bypasses the accessor, so splicing the key into raw JSON
     * text and parsing it is the only way to reproduce what a hostile document on the wire actually
     * looks like.
     */
    const known = serializeAos4ArmyDocument(knownDocument())
    const serialized = known.replace(
      '{\n',
      '{\n  "__proto__": {"polluted": true},\n  "constructor": {"polluted": true},\n  "prototype": {"polluted": true},\n'
    )
    const parsed = JSON.parse(serialized)
    expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(true)
    expect(Object.getPrototypeOf(parsed)).toBe(Object.prototype)

    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.document).toBeDefined()
    expect(Object.getPrototypeOf({})).not.toHaveProperty('polluted')

    const reserialized = JSON.parse(serializeAos4ArmyDocument(restored.document!))
    expect(Object.prototype.hasOwnProperty.call(reserialized, '__proto__')).toBe(false)
    expect(reserialized.constructor).not.toEqual({ polluted: true })
    expect(reserialized.prototype).toBeUndefined()
  })

  it('drops an unknown field whose value nests past the safe depth bound', () => {
    let deep: unknown = 'bottom'
    for (let i = 0; i < 20; i += 1) deep = { nested: deep }
    const serialized = withRawField('tooDeep', deep)

    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.document).toBeDefined()
    expect(JSON.parse(serializeAos4ArmyDocument(restored.document!))).not.toHaveProperty('tooDeep')
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'unsupported-unknown-field', severity: 'warning' }),
    ])
  })

  it('drops an unknown field whose value is oversized', () => {
    const serialized = withRawField('tooBig', 'x'.repeat(100_000))

    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.document).toBeDefined()
    expect(JSON.parse(serializeAos4ArmyDocument(restored.document!))).not.toHaveProperty('tooBig')
  })

  it('caps the number of unknown top-level fields it will carry', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(knownDocument()))
    for (let i = 0; i < 200; i += 1) value[`extra${i}`] = i
    const serialized = JSON.stringify(value)

    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    expect(restored.document).toBeDefined()
    const reserialized = JSON.parse(serializeAos4ArmyDocument(restored.document!))
    const carriedExtraKeys = Object.keys(reserialized).filter(key => key.startsWith('extra'))
    expect(carriedExtraKeys.length).toBeGreaterThan(0)
    expect(carriedExtraKeys.length).toBeLessThan(200)
  })

  it('still rejects an incompatible schema version even when unknown fields are present', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(knownDocument()))
    value.schemaVersion = 2
    value.futureFlag = true

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)
    expect(restored.document).toBeUndefined()
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'incompatible-schema', severity: 'error' }),
    ])
  })

  it('still resets on missing required fields even when unknown fields are present', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(knownDocument()))
    delete value.rulesContextId
    value.futureFlag = true

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)
    expect(restored.document).toBeUndefined()
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'invalid-document', severity: 'error' }),
    ])
  })

  it('does not report a cloud dirty-state change for a document with no unknown fields', () => {
    const document = knownDocument()
    expect(serializeAos4ArmyDocument(document)).toBe(serializeAos4ArmyDocument(knownDocument()))
  })

  it('reports the same signature for two documents carrying the same unknown field', () => {
    const serialized = withRawField('futureFlag', true)
    const restoredA = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG).document!
    const restoredB = deserializeAos4ArmyDocumentStructure(serialized).document!
    expect(serializeAos4ArmyDocument(restoredA)).toBe(serializeAos4ArmyDocument(restoredB))
  })
})
